<script lang="ts">
  import AuthCard from '@/components/auth-card.svelte';
  import {
  determineIdentifierType,
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
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';

  let { data }: { data: { form: SuperValidated<Infer<ResetPasswordFormSchema>> } } = $props();

  const steps = [zod(schemaFirstStep), zod(schemaStepTwo), zod(schemaLastStep)];
  let step = $state(1);
  const getCurrentValidator = () => steps[step - 1];
  
  // let otpHandler: MsaListenerHandler | undefined = $state(undefined);
  let msaActionId = $state<string | undefined>(undefined);
  let msaActionStatus = $state(MsaTokenStatus.unset);
  let resendTimer = $state(30);
  let canResend = $state(false);
      
  let loading = $state(false);
  let errorMessage = $state('');
  let hasStepError = $state(true); // Treat an initial empty input as an error
  
  let identifier = $state('');
  let identType = $state(UserIdentType.email);

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

      loading = true;

      debounceTimer = window.setTimeout(async () => {
        try {
          const result = await validateForm({ update: true });
          hasStepError = !result.valid;
        } catch (error) {
          console.error('Error validating form:', error);
        } finally {
          loading = false;
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
        console.log('>>>>> calling verify token: ', errorMessage)
        await verifyResetPasswordToken();
      } else if (step === 3) {
        console.log('>>>>> callling update: ', errorMessage)
        await updatePassword();
      }

      return;
    },
  });

  const { form: formData, enhance, errors, delayed, validateForm, options } = form;

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
    loading = true;
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
        errors.update((errors) => ({
          ...errors,
          ident: [errorMessage],
        }));
        return;
      }

      msaActionId = response.object.actionProgress.actionId;
      response.object.run.addListener({
        id: 'ResetPassword',
        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            // The notification failed to go out.
            if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
              // We can ignore the failure to send the email in development.
              console.log('DEVELOPMENT')
              // If an error throws, the ident cannot be found
              errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError)
              errors.update((errors) => ({
                ...errors,
                token: [errorMessage],
              }));
              return;
            }
            console.error(
              `ResetPasswordForm.multiStepActionListener: Notification failed.`,
              action.notificationResult,
            );
            msaActionStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            errors.update((errors) => ({
              ...errors,
              token: [errorMessage],
            }));
            return;
          }

          if (eventType === MultiStepActionEventType.notificationSent) {
            // The notification has been sent out.
            console.log(
              `ResetPasswordForm.multiStepActionListener: Notification sent out.`,
              action.notificationResult,
            );

            msaActionStatus = MsaTokenStatus.notificationSent;
            errorMessage = translate(AppUiMessage.msaTokenSent);
            // todo this shows up as error
            errors.update((errors) => ({
                ...errors,
                token: [errorMessage],
              }));
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              `ResetPasswordForm.multiStepActionListener: incorrect token.`,
              action.notificationResult,
            );
            errorMessage = 'We could not verify the token you entered. Please try again.';
            errors.update((errors) => ({
                ...errors,
                token: [errorMessage],
              }));

              // We are advancing to step 3 before this comes back as failed, aka "accepting an invalid token"

            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              `ResetPasswordForm.multiStepActionListener: timeout.`,
              action.notificationResult,
            );
            msaActionStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            errors.update((errors) => ({
                ...errors,
                token: [errorMessage],
              }));
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error(`ResetPasswordForm.multiStepActionListener: error.`, action.notificationResult);
            msaActionStatus = MsaTokenStatus.verificationFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            errors.update((errors) => ({
                ...errors,
                token: [errorMessage],
              }));
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log(`ResetPasswordForm.multiStepActionListener: success.`, action.notificationResult);
            msaActionStatus = MsaTokenStatus.success;
            errorMessage = translate(AppUiMessage.msaTokenSuccess);
            // TODO: this shows up as an error
            errors.update((errors) => ({
                ...errors,
                token: [errorMessage],
            }));
          }
        },
      });

      // We advance instead of waiting for the poll to come back with a `sent` status
      step = 2;
      startResendTimer();
      return;
    } catch (err) {
      console.error('Error resetting password:', err);
      msaActionStatus = MsaTokenStatus.verificationFailed;
      errorMessage = translate(AppUiMessage.systemError);
      errors.update((errors) => ({
        ...errors,
        token: [errorMessage],
      }));
    } finally {
      loading = false;
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;
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

      console.log('>>>>> got a token verification response: ', response)

      if (response !== true) {
        console.error('ResetPasswordForm.verifyResetPasswordToken: invalid response:', {
          result: response,
        });
        errorMessage = translate(AppUiMessage.systemError);
        console.log('>>>>> but we have an error: ', errorMessage)
        msaActionStatus = MsaTokenStatus.unset;
        return;
      }

      msaActionStatus = MsaTokenStatus.sending;
      console.log('>>>>> heading to step 3')
      step = 3;
    } catch (error) {
      console.error('ResetPasswordForm.verifyResetPasswordToken: error:', { error });
      msaActionStatus = MsaTokenStatus.unset;
      errorMessage = translate(AppUiMessage.systemError);
      errors.update((errors) => ({
        ...errors,
        token: [errorMessage],
      }));
    } finally {
      loading = false;
    }
  };

  const updatePassword = async () => {
    loading = true;
    errorMessage = '';

    if (!$formData.newPassword) return;
    console.log('>>>>> we bailed for no pass: ', errorMessage)

    try {
      if (!validatePassword($formData.newPassword).isValid) {
        errorMessage = getPasswordError($formData.newPassword);
        console.log('>>>>> failed password validation check: ', errorMessage)
        return;
      }
      const result = await myUserContext.verifyMultiStepActionToken(
        $formData.actionId,
        $formData.token,
        $formData.newPassword,
      );

      console.log('>>>>> got update result: ', result)

      if (result !== true) {
        errorMessage = typeof result === 'string' ? result : 'Failed to verify code';
        console.log('>>>>> we got an error: ', errorMessage)
        return;
      }

      console.log('>>>>> we should be fine, so we sign in: ', errorMessage)

      const response = await myUserContext.signMeInWithPassword(
        $formData.ident,
        identType,
        $formData.newPassword,
      );

      console.log('>>>>> sign in response: ', response)

      if (response !== true) {
        errorMessage = response;
        console.log('>>>>> we got an error at the last second: ', errorMessage)
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
      loading = false;
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
          placeholder="e.g. 'student@example.com'"
          label="Email address"
        />
        <FormButton
          disabled={$delayed || loading || hasStepError}
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
          disabled={$delayed || loading || hasStepError}
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
          disabled={$delayed || loading || hasStepError}
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
