<script lang="ts">
  import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { goto } from '$app/navigation';
  import { onDestroy } from 'svelte';
  import translate from '@/helpers/language/translate.js';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import AuthCard from '@/components/auth-card.svelte';
  import EmailFormInput from '@/components/forms/form-ident-input.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import OtpFormInput from '@/components/forms/form-otp-input.svelte';
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte.js';
  import passwordHelpers from '@/helpers/password-helpers.js';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums.js';
  import {
    determineIdentifierType,
    getOtpMessage,
    schemaFirstStep,
    schemaLastStep,
    schemaStepTwo,
    type ResetPasswordFormSchema,
  } from './schema';

  let { data }: { data: { form: SuperValidated<ResetPasswordFormSchema> } } = $props();

  const steps = [zod(schemaFirstStep), zod(schemaStepTwo), zod(schemaLastStep)];
  let step = $state(1);
  const getCurrentValidator = () => steps[step - 1];

  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
  let msaActionId = $state<string | undefined>(undefined);
  let msaActionStatus = $state(MsaTokenStatus.unset);
  let resendTimer = $state(30);
  let canResend = $state(false);

  let isLoading = $state(false);
  let errorMessage = $state('');
  let hasStepError = $state(true); // Treat an initial empty input as an error

  let identifier = $state('');
  let identType = $state(UserIdentType.email);

  let timerInterval: ReturnType<typeof setInterval>;
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 350; // ms
  const { getPasswordError, validatePassword } = passwordHelpers;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    validationMethod: 'submit-only',
    async onChange() {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (msaActionId && !$formData.actionId) {
        $formData.actionId = msaActionId;
      }

      debounceTimer = window.setTimeout(async () => {
        try {
          isLoading = true;
          const result = await validateForm({ update: true });
          hasStepError = !result.valid;
        } catch (error) {
          console.error('Error validating form:', error);
        } finally {
          isLoading = false;
          debounceTimer = null;
        }
      }, DEBOUNCE_DELAY);
    },
    async onSubmit({ cancel }) {
      cancel(); // Avoid the actual server-side validation form action

      const result = await validateForm({ update: true, focusOnError: true });
      if (!result.valid) return;

      if (step === 1) {
        await startPasswordReset();
      } else if (step === 2) {
        await verifyResetPasswordToken();
      } else if (step === 3) {
        await updateMyPassword();
      }

      return;
    },
  });

  const { form: formData, enhance, errors, delayed, validateForm, options } = form;

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

  const updateFormErrors = (field: keyof ResetPasswordFormSchema, message: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  const startPasswordReset = async () => {
    isLoading = true;

    try {
      identifier = $formData.ident || '';
      identType = determineIdentifierType(identifier);

      const existingUser = await isIdentRegistered();
      if (!existingUser) {
        // Feign success and proceed
        // Todo: add the `change email` button like the `sign in with token` button
        step = 2;
        startResendTimer();
        return;
      }

      const response = await myUserContext.resetMyPassword($formData.ident);

      if (
        !response ||
        response?.error ||
        !response.object ||
        response.object.error ||
        !response?.object.actionProgress?.actionId ||
        !response?.object.run
      ) {
        updateFormErrors('ident', 'Failed to send verification code. Please try again.');
        return;
      }

      const onNotificationSent = () => {
        step = 2;
        isLoading = false;
      };
      const onFailure = () => {
        isLoading = false;
      };
      const onSuccess = async () => {
        if (step === 2) {
          return;
        } else {
          step = 3;
        }
        isLoading = false;
      };

      msaActionId = response.object.actionProgress.actionId;
      otpHandler = new MsaListenerHandler(
        'ResetPassword',
        response,
        onNotificationSent,
        onFailure,
        onSuccess,
      );

      startResendTimer();
      return;
    } catch (err) {
      console.error('Error resetting password:', err);
      msaActionStatus = MsaTokenStatus.verificationFailed;
      updateFormErrors('ident', translate(AppUiMessage.systemError));
    } finally {
      // isLoading = false; // Leave the button in a processing state until sent event
    }
  };

  const handleResendToken = async () => {
    if (!canResend) return;
    msaActionStatus = MsaTokenStatus.unset;
    isLoading = true;

    if (!msaActionId) {
      console.error('ResetPasswordForm.handleResendToken: actionId missing.');
      errorMessage = translate(AppUiMessage.systemError);
      return;
    }

    try {
      errorMessage = '';

      const response = await myUserContext.sendMultiStepActionNotification($formData.ident);

      if (response !== true) {
        updateFormErrors(
          'token',
          typeof response === 'string' ? response : 'Failed to resend verification code',
        );
        return;
      }

      msaActionStatus = MsaTokenStatus.sending;
      startResendTimer();
    } catch (error) {
      console.error('Error resending email:', error);
      updateFormErrors('token', 'Failed to resend verification code. Please try again.');
    } finally {
      isLoading = false;
    }
  };

  const verifyResetPasswordToken = async () => {
    isLoading = true;

    if (!msaActionId) {
      console.error('SignInForm.handleVerifyOtp: actionId missing:');
      updateFormErrors('token', translate(AppUiMessage.systemError));
      return;
    }

    if (!$formData.token) return;
    try {
      // We need to wait for the success event before going to to the next step
      const response = await myUserContext.verifyMultiStepActionToken(
        $formData.actionId,
        $formData.token,
        undefined,
      );

      if (response !== true) {
        console.error('ResetPasswordForm.verifyResetPasswordToken: invalid response:', {
          result: response,
        });
        updateFormErrors('token', translate(AppUiMessage.systemError));
        msaActionStatus = MsaTokenStatus.unset;
        return;
      }
    } catch (error) {
      console.error('ResetPasswordForm.verifyResetPasswordToken: error:', { error });
      msaActionStatus = MsaTokenStatus.unset;
      updateFormErrors('token', translate(AppUiMessage.systemError));
    } finally {
      isLoading = false;
      hasStepError = true; // This response does not determine validity while we poll for success
    }
  };

  const updateMyPassword = async () => {
    isLoading = true;

    if (!$formData.newPassword) return;

    try {
      if (!validatePassword($formData.newPassword).isValid) {
        updateFormErrors('newPassword', getPasswordError($formData.newPassword));
        return;
      }

      const result = await myUserContext.verifyMultiStepActionToken(
        $formData.actionId,
        $formData.token,
        $formData.newPassword,
      );

      if (result !== true) {
        updateFormErrors('token', typeof result === 'string' ? result : 'Failed to verify code');
        return;
      }

      const response = await myUserContext.signMeInWithPassword(
        $formData.ident,
        identType,
        $formData.newPassword,
      );

      if (response !== true) {
        errorMessage = response;
        updateFormErrors('newPassword', response);
        return;
      }

      return await goto('/');
    } catch (err) {
      console.error('Error verifying reset code:', err);
      errorMessage =
        err instanceof Error ? err.message : 'Failed to verify code. Please try again.';
    } finally {
      isLoading = false;
    }
  };

  const getCurrentStepDescription = () => {
    switch (step) {
      case 1:
        return 'Provide your email address to receive a verification code and update your password.';
      case 2:
        return getOtpMessage($formData);
      case 3:
        return 'Now, update your password.';
    }
  };

  const isIdentRegistered = async (): Promise<boolean> => {
    isLoading = true;

    identifier = $formData.ident;
    if (!identifier) return false;
    identType = determineIdentifierType(identifier);

    try {
      const response = await myUserContext.isUserIdentAvailable(identifier, identType);

      if (response.error) {
        updateFormErrors('ident', response.error);
        return false;
      }

      if (response.isAvailable) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error checking identifier availability:', error);
      updateFormErrors('ident', translate(AppUiMessage.systemError));
      return false;
    } finally {
      isLoading = false;
    }
  };

  $effect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    if (!$formData) {
      isLoading = false;
      return;
    }

    if (otpHandler) {
      const currentErrorMessage = otpHandler.getErrorMessage();
      if (currentErrorMessage) {
        updateFormErrors('token', currentErrorMessage);
      }
    }

    options.validators = getCurrentValidator();
  });

  onDestroy(() => {
    clearInterval(timerInterval);
    if (otpHandler) otpHandler.removeListener();
  });
</script>

<form method="POST" id="reset-password-form" use:enhance>
  <AuthCard title="Reset your password" description={getCurrentStepDescription()}>
    <div class="space-y-4">
      {#if step == 1}
        <EmailFormInput
          {form}
          fieldName="ident"
          placeholder="Enter your username or email"
          label="Username or email"
        />
        <FormButton
          disabled={$delayed || isLoading || hasStepError}
          loading={$delayed || isLoading}
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
          onResendClick={handleResendToken}
        />
        <FormButton
          disabled={$delayed || isLoading || hasStepError}
          loading={$delayed || isLoading}
          buttonText="Verify my email"
          loadingText="Verifiying email..."
        />
      {:else if step == 3}
        <PasswordFormInput
          {form}
          fieldName="newPassword"
          label="New password"
          placeholder="Your password must be at least 8 characters"
        />
        <FormButton
          disabled={$delayed || isLoading || hasStepError}
          loading={$delayed || isLoading}
          buttonText="Update my password"
          loadingText="Updating password..."
        />
      {/if}
    </div>
  </AuthCard>

  <div class="mt-4"><SuperDebug data={$formData} /></div>
  <div class="mt-4">
    <SuperDebug data={errors} />
  </div>
</form>
