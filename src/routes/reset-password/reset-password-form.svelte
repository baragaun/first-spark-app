<script lang="ts">
  import AuthCard from '@/components/auth-card.svelte';
  import {
    emailSchema,
    getOtpMessage,
    schemaFirstStep,
    schemaLastStep,
    schemaStepTwo,
    usernameSchema,
    type ResetPasswordFormSchema,
  } from './schema';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums.js';
  import { myUserContext } from '@/contexts/my-user-context.svelte.js';
  import translate from '@/helpers/language/translate.js';
  import {
    MultiStepActionEventType,
    SidMultiStepActionProgress,
    UserIdentType,
  } from '@baragaun/bg-node-client';
  import { onDestroy } from 'svelte';
  import passwordHelpers from '@/helpers/password-helpers.js';
  import { goto } from '$app/navigation';

  import EmailFormInput from '@/components/forms/form-ident-input.svelte';
  import OtpFormInput from '@/components/forms/form-otp-input.svelte';
  import UpdatePasswordFormInput from '@/components/forms/form-update-password-input.svelte';
  import FormButton from '@/components/forms/form-button.svelte';

  let { data }: { data: { form: SuperValidated<Infer<ResetPasswordFormSchema>> } } = $props();

  const steps = [zod(schemaFirstStep), zod(schemaStepTwo), zod(schemaLastStep)];
  let step = $state(1);
  let msaActionId = $state<string | undefined>(undefined);
  let loading = $state(false);
  let errorMessage = $state('');
  let identifier = $state('');
  let identType = $state(UserIdentType.email);
  let resendTimer = $state(30);
  let canResend = $state(false);
  let tokenStatus = $state(MsaTokenStatus.unset);
  let hasStepError = $state(true); // Treat an initial empty input as an error
  let isValidating = $state(false);

  const getCurrentValidator = () => steps[step - 1];

  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 350; // ms

  const form = superForm(data.form, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    async onChange() {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (msaActionId && !$formData.actionId) {
        $formData.actionId = msaActionId;
      }

      isValidating = true;

      debounceTimer = window.setTimeout(async () => {
        try {
          const result = await validateForm({ update: true });
          hasStepError = !result.valid;
        } catch (error) {
          console.error('Error validating form:', error);
        } finally {
          isValidating = false;
          debounceTimer = null;
        }
      }, DEBOUNCE_DELAY);
    },
    async onSubmit({ cancel }) {
      // Advoid the actual server-side validation form action
      cancel();

      const result = await validateForm({ update: true, focusOnError: true });
      if (!result.valid) return;

      if (step === 1) {
        await startPasswordReset();
      } else if (step === 2) {
        await verifyResetPasswordToken();
      } else if (step === 3) {
        await updatePassword();
      }

      return;
    },
  });

  const { form: formData, enhance, errors, delayed, validateForm, options } = form;

  const determineIdentifierType = (value: string): UserIdentType => {
    const emailValidationResult = emailSchema.safeParse(value);
    if (emailValidationResult.success) {
      return UserIdentType.email;
    }

    const usernameValidationResult = usernameSchema.safeParse(value);
    if (usernameValidationResult.success) {
      return UserIdentType.userHandle;
    }

    return UserIdentType.email;
  };

  let timerInterval: ReturnType<typeof setInterval>;

  const startResendTimer = () => {
    resendTimer = 30;
    canResend = false;

    clearInterval(timerInterval);
    console.log('starting resend timer');
    timerInterval = setInterval(() => {
      resendTimer -= 1;
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        canResend = true;
      }
    }, 1000);
  };

  const startPasswordReset = async () => {
    isValidating = true;
    errorMessage = '';

    try {
      identifier = $formData.ident || '';
      identType = determineIdentifierType(identifier);

      const response = await myUserContext.resetMyPassword($formData.ident);

      if (
        !response ||
        response?.error ||
        !response.object ||
        response.object.error ||
        !response?.object.actionProgress?.actionId ||
        !response?.object.run
      ) {
        errorMessage = 'Failed to send verification code. Please try again.';
        return;
      }

      msaActionId = response.object.actionProgress.actionId;

      // We advance instead of waiting for the poll to come back with a `sent` status
      step = 2;
      startResendTimer();

      response.object.run.addListener({
        id: 'ResetPassword',
        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            console.error(
              'ResetPasswordPage.multiStepActionListener: Notification failed.',
              action.notificationResult,
            );

            if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
              errorMessage = '';
              return;
            } else {
              errorMessage =
                'We could not send the verification token to your email. Please try again.';
            }

            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            console.log(
              'ResetPasswordPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.notificationSent;
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              'ResetPasswordPage.multiStepActionListener: incorrect token.',
              action.notificationResult,
            );
            errorMessage = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              'ResetPasswordPage.multiStepActionListener: timeout.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error(
              'ResetPasswordPage.multiStepActionListener: error.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.verificationFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);

            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            console.log(
              'ResetPasswordPage.multiStepActionListener: success.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.success;
          }
        },
      });
    } catch (err) {
      console.error('Error resetting password:', err);
      tokenStatus = MsaTokenStatus.verificationFailed;
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;
    ``;
    loading = true;
    try {
      const response = await myUserContext.sendMultiStepActionNotification($formData.ident);

      if (response !== true) {
        errorMessage =
          typeof response === 'string' ? response : 'Failed to resend verification code';
        return;
      }

      startResendTimer();
    } catch (error) {
      console.error('Error resending email:', error);
      errorMessage = 'Failed to resend verification code. Please try again.';
    } finally {
      loading = false;
    }
  };

  const { getPasswordError, validatePassword } = passwordHelpers;

  const verifyResetPasswordToken = async () => {
    if (!$formData.token) return;

    try {
      if (!msaActionId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        errorMessage = translate(AppUiMessage.systemError);
        return;
      }

      loading = true;
      errorMessage = '';

      const response = await myUserContext.verifyMultiStepActionToken(
        $formData.actionId,
        $formData.token,
      );

      if (response !== true) {
        console.error('ResetPasswordForm.verifyResetPasswordToken: invalid response:', {
          result: response,
        });
        errorMessage = translate(AppUiMessage.systemError);
        tokenStatus = MsaTokenStatus.unset;
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
      step = 3;
    } catch (error) {
      console.error('ResetPasswordForm.verifyResetPasswordToken: error:', { error });
      errorMessage = translate(AppUiMessage.systemError);
      tokenStatus = MsaTokenStatus.unset;
    } finally {
      loading = false;
    }
  };

  const updatePassword = async () => {
    loading = true;
    errorMessage = '';

    if (!$formData.newPassword) return;

    try {
      if (!validatePassword($formData.newPassword).isValid) {
        errorMessage = getPasswordError($formData.newPassword);
        return;
      }
      const result = await myUserContext.verifyMultiStepActionToken(
        $formData.actionId,
        $formData.token,
        $formData.newPassword,
      );

      if (result !== true) {
        errorMessage = typeof result === 'string' ? result : 'Failed to verify code';
        return;
      }

      const response = await myUserContext.signMeInWithPassword(
        $formData.ident,
        identType,
        $formData.newPassword,
      );

      if (response !== true) {
        errorMessage = response;
        return;
      }

      return await goto('/');
    } catch (err) {
      console.error('Error verifying reset code:', err);
      errorMessage =
        err instanceof Error ? err.message : 'Failed to verify code. Please try again.';
    } finally {
      loading = false;
    }
  };

  onDestroy(() => {
    clearInterval(timerInterval);
  });

  $effect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    if (!$formData) {
      isValidating = false;
      return;
    }

    options.validators = getCurrentValidator();
  });

  const getCurrentStepDescription = () => {
    switch (step) {
      case 1:
        return 'Provide your email address to receive a verification code and update your password.';
      case 2:
        // return `Enter the six digit code that was sent to ${$formData.ident}.`;
        return getOtpMessage($formData);
      case 3:
        return 'Now, update your password.';
    }
  };
</script>

<form method="POST" id="reset-password-form" use:enhance>
  <AuthCard title="Reset your password" description={getCurrentStepDescription()}>
    <div class="space-y-4">
      {#if step == 1}
        <EmailFormInput
          {form}
          fieldName="ident"
          placeholder="e.g. "student@example.com""
          label="Email address"
        />

        <FormButton
          disabled={$delayed || isValidating || hasStepError}
          loading={$delayed}
          buttonText="Send me an email"
          loadingText="Drafting email..."
        />
      {:else if step == 2}
        <OtpFormInput
          {form}
          fieldName="token"
          label="Verification code"
          length={6}
          showResend={true}
          {canResend}
          {resendTimer}
          onResendClick={handleResendEmail}
        />

        <FormButton
          disabled={$delayed || isValidating || hasStepError}
          loading={$delayed}
          buttonText="Verify my email"
          loadingText="Verifiying email..."
        />
      {:else if step == 3}
        <UpdatePasswordFormInput
          {form}
          fieldName="newPassword"
          label="New password"
          placeholder="Your password must be at least 8 characters"
        />

        <FormButton
          disabled={$delayed || isValidating || hasStepError}
          loading={$delayed}
          buttonText="Update my password"
          loadingText="Updating password..."
        />
      {/if}
    </div>
  </AuthCard>

  <div class="mt-4"><SuperDebug data={$formData} /></div>
  <div class="mt-4">
    <SuperDebug data={errors} />
    <!-- TODO: Need to connect token errors with the input -->
    {errorMessage}
  </div>
</form>
