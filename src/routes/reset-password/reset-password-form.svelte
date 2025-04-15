<script lang="ts">
  import AuthCard from '@/components/auth-card.svelte';
  import {
    determineIdentifierType,
    getOtpMessage,
    schemaFirstStep,
    schemaLastStep,
    schemaStepTwo,
    type ResetPasswordFormSchema,
  } from './schema';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums.js';
  import { myUserContext } from '@/contexts/my-user-context.svelte.js';
  import translate from '@/helpers/language/translate.js';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { onDestroy } from 'svelte';
  import passwordHelpers from '@/helpers/password-helpers.js';
  import { goto } from '$app/navigation';

  import EmailFormInput from '@/components/forms/form-ident-input.svelte';
  import OtpFormInput from '@/components/forms/form-otp-input.svelte';
  import UpdatePasswordFormInput from '@/components/forms/form-password-input.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';

  let { data }: { data: { form: SuperValidated<ResetPasswordFormSchema> } } = $props();

  const steps = [zod(schemaFirstStep), zod(schemaStepTwo), zod(schemaLastStep)];
  let step = $state(1);
  const getCurrentValidator = () => steps[step - 1];

  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
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
    validationMethod: 'submit-only', // Only validate on submit, not on blur
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

          // Check if identifier is available for step 1
          if (step === 1 && $formData.ident) {
            const isIdentValid = await checkIdentAvailability();
            hasStepError = !result.valid || !isIdentValid;
          } else {
            hasStepError = !result.valid;
          }
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
        await verifyResetPasswordToken();
      } else if (step === 3) {
        await updateMyPassword();
      }

      return;
    },
  });

  const { form: formData, enhance, errors, delayed, validateForm, options } = form;
  const { getPasswordError, validatePassword } = passwordHelpers;

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

  function updateErrorMessage(message: string, field: keyof ResetPasswordFormSchema) {
    errorMessage = message;
    if (message) {
      errors.update((errors) => {
        const newErrors = {
          ...errors,
          [field]: [message],
        };
        return newErrors;
      });

      // Force the superForm to recognize these errors as "touched"
      // This prevents them from being cleared on blur
      // form.tainted.update((tainted) => {
      //   return {
      //     ...tainted,
      //     [field]: true,
      //   };
      // });
    } else if (field) {
      // Only clear if explicitly asked to
      errors.update((errors) => {
        const newErrors = { ...errors };
        delete newErrors[field];
        return newErrors;
      });
    }
  }



  const startPasswordReset = async () => {
    loading = true;
    updateErrorMessage('', 'ident');

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
        updateErrorMessage('Failed to send verification code. Please try again.', 'ident');
        return;
      }

      const onNotificationSent = () => {
        step = 2;
      };
      const onFailure = () => {
        console.log('Listener failure, advancing step');
        step = 3;
      };
      const onSuccess = async () => {
        if (step === 2) {
          return;
        } else {
          step = 3;
        }
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
      updateErrorMessage(translate(AppUiMessage.systemError), 'ident');
    } finally {
      loading = false;
    }
  };

  const handleResendToken = async () => {
    if (!canResend) return;
    msaActionStatus = MsaTokenStatus.unset;
    loading = true;

    if (!msaActionId) {
      console.error('ResetPasswordForm.handleResendToken: actionId missing.');
      errorMessage = translate(AppUiMessage.systemError);
      return;
    }

    try {
      loading = true;
      errorMessage = '';

      const response = await myUserContext.sendMultiStepActionNotification($formData.ident);

      if (response !== true) {
        updateErrorMessage(
          typeof response === 'string' ? response : 'Failed to resend verification code',
          'token',
        );
        return;
      }

      msaActionStatus = MsaTokenStatus.sending;
      startResendTimer();
    } catch (error) {
      console.error('Error resending email:', error);
      updateErrorMessage('Failed to resend verification code. Please try again.', 'token');
    } finally {
      loading = false;
    }
  };

  const verifyResetPasswordToken = async () => {
    if (!msaActionId) {
      console.error('SignInForm.handleVerifyOtp: actionId missing:');
      updateErrorMessage(translate(AppUiMessage.systemError), 'token');
      return;
    }

    if (!$formData.token) return;
    try {
      loading = true;
      updateErrorMessage('', 'token');

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
        updateErrorMessage(translate(AppUiMessage.systemError), 'token');
        msaActionStatus = MsaTokenStatus.unset;
        return;
      }
    } catch (error) {
      console.error('ResetPasswordForm.verifyResetPasswordToken: error:', { error });
      msaActionStatus = MsaTokenStatus.unset;
      updateErrorMessage(translate(AppUiMessage.systemError), 'token');
    } finally {
      loading = false;
      hasStepError = true; // This response does not determine validity while we poll for success
    }
  };

  const updateMyPassword = async () => {
    loading = true;
    updateErrorMessage('', 'newPassword');

    if (!$formData.newPassword) return;

    try {
      if (!validatePassword($formData.newPassword).isValid) {
        updateErrorMessage(getPasswordError($formData.newPassword), 'newPassword');
        return;
      }

      const result = await myUserContext.verifyMultiStepActionToken(
        $formData.actionId,
        $formData.token,
        $formData.newPassword,
      );

      if (result !== true) {
        updateErrorMessage(typeof result === 'string' ? result : 'Failed to verify code', 'token');
        return;
      }

      const response = await myUserContext.signMeInWithPassword(
        $formData.ident,
        identType,
        $formData.newPassword,
      );

      if (response !== true) {
        errorMessage = response;
        updateErrorMessage(response, 'newPassword');
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
    if (otpHandler) otpHandler.removeListener();
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

    if (otpHandler) {
      const currentErrorMessage = otpHandler.getErrorMessage();
      if (currentErrorMessage) {
        updateErrorMessage(currentErrorMessage, 'token');
      }
    }

    options.validators = getCurrentValidator();
  });

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

  async function checkIdentAvailability(): Promise<boolean> {
    loading = true;
    updateErrorMessage('', 'ident');

    identifier = $formData.ident;
    if (!identifier) return false;
    identType = determineIdentifierType(identifier);

    try {
      const response = await myUserContext.isUserIdentAvailable(identifier, identType);

      if (response.error) {
        updateErrorMessage(response.error, 'ident');
        return false;
      }

      // For password reset, we want the account to exist (NOT available)
      if (!response.isAvailable) {
        return true; // Account exists, which is what we want
      } else {
        // If identifier IS available, it means no account exists with this identifier
        updateErrorMessage('No account found with this identifier.', 'ident');
        return false;
      }
    } catch (error) {
      console.error('Error checking identifier availability:', error);
      updateErrorMessage(translate(AppUiMessage.systemError), 'ident');
      return false;
    } finally {
      loading = false;
    }
  }
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
          onResendClick={handleResendToken}
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
  </div>
</form>
