<script lang="ts">
  import AuthCard from "@/components/auth-card.svelte";
  import { schemaFirstStep, schemaLastStep, schemaStepTwo, type ResetPasswordFormSchema } from "./schema";
  import SuperDebug, {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { AppUiMessage, MsaTokenStatus } from "@/types/enums.js";
  import { myUserContext } from "@/contexts/my-user-context.svelte.js";
  import translate from "@/helpers/language/translate.js";
  import { MultiStepActionEventType, SidMultiStepActionProgress, UserIdentType } from '@baragaun/bg-node-client';
  import { onDestroy } from "svelte";
  import passwordHelpers from "@/helpers/password-helpers.js";
  import { goto } from "$app/navigation";
  
  import EmailFormInput from '@/components/forms/form-ident-input.svelte';
  import OtpFormInput from '@/components/forms/form-otp-input.svelte';
  import UpdatePasswordFormInput from '@/components/forms/form-update-password-input.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
 
  let { data }: { data: { form: SuperValidated<Infer<ResetPasswordFormSchema>> } } = $props();
       
  const steps = [zod(schemaFirstStep), zod(schemaStepTwo), zod(schemaLastStep)];
  let step = $state(1);
  let actionId = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
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

      isValidating = true;

      debounceTimer = window.setTimeout(async () => {
        try {
          const result = await validateForm({ update: true });
          hasStepError = !result.valid
        } catch (error) {
          console.error('Error validating form:', error);
        } finally {
          isValidating = false;
          debounceTimer = null;
        }
      }, DEBOUNCE_DELAY);
    },
    async onSubmit({ cancel }) {
			if (step === steps.length) return;
			else cancel();

      const result = await validateForm({ update: true, focusOnError: true });
      if (!result.valid) return;

      if (step === 1) {
        await handleResetPassword();
        startResendTimer();
      } else if (step === 2) {
        await handleVerifyToken($formData.emailOtp);
      } else if (step === 3) {
        await handleVerifyToken($formData.emailOtp, $formData.newPassword);
      }

      if (result.valid) step = step + 1;
      return;
    },
    async onUpdate({ form, cancel }) {
      console.log('>>>>> On update...')
      if (step !== steps.length) cancel()
      
      if (form.valid) {
        console.log('>>>>> Attempting to log in...')
        const response = await myUserContext.signMeInWithPassword(
          $formData.email,
          UserIdentType.email,
          $formData.newPassword
        );
        console.log('>>>>> Response...', response)

        if (response !== true) {
          errorMessage = response;
          return;
        }

        return await goto('/');
      };
    },
  });

  const { form: formData, enhance, errors, delayed, validateForm, options } = form;

  let timerInterval: ReturnType<typeof setInterval>;

  const startResendTimer = () => {
    resendTimer = 30;
    canResend = false;

    clearInterval(timerInterval);
    console.log('starting resend timer')
    timerInterval = setInterval(() => {
      resendTimer -= 1;
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        canResend = true;
      }
    }, 1000);
  };

  const handleResetPassword = async () => {
    isValidating = true;
    errorMessage = '';

    try {
      const response = await myUserContext.resetMyPassword($formData.email);

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

      actionId = response.object.actionProgress.actionId;

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

            step = 2
            startResendTimer();
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
            console.error('ResetPasswordPage.multiStepActionListener: error.', action.notificationResult);
            tokenStatus = MsaTokenStatus.verificationFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            console.log('ResetPasswordPage.multiStepActionListener: success.', action.notificationResult);
            tokenStatus = MsaTokenStatus.success;
            step = 2;
          }
        },
      });
    } catch (err) {
      console.error('Error resetting password:', err);
      tokenStatus = MsaTokenStatus.verificationFailed;
      // errorMessage =
      //   err instanceof Error ? err.message : 'Unable to process your request. Please try again.';
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    loading = true;
    try {
      const response = await myUserContext.sendMultiStepActionNotification($formData.email);

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

  const handleVerifyToken = async (token: string, newPassword?: string) => {
    if (!token || (newPassword === undefined && step === 1)) {
      errorMessage = 'Verification code and new password are required';
      return;
    }

    loading = true;
    errorMessage = '';

    if (!newPassword) {
      try {
        const result = await myUserContext.verifyMultiStepActionToken(actionId, token, newPassword);

        if (result !== true) {
          errorMessage = typeof result === 'string' ? result : 'Failed to verify code';
          return;
        }

        step = 2;
      } catch (err) {
        console.error('Error verifying reset code:', err);
        errorMessage =
          err instanceof Error ? err.message : 'Failed to verify code. Please try again.';
      } finally {
        loading = false;
      }
    } else {
      try {
        if (!validatePassword(newPassword).isValid) {
          errorMessage = getPasswordError(newPassword)
        return;
      }
      const result = await myUserContext.verifyMultiStepActionToken(actionId, token, newPassword);

        if (result !== true) {
          errorMessage = typeof result === 'string' ? result : 'Failed to verify code';
          return;
        }
      } catch (err) {
        console.error('Error verifying reset code:', err);
        errorMessage =
          err instanceof Error ? err.message : 'Failed to verify code. Please try again.';
      } finally {
        loading = false;
      }
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
        return `Enter the six digit code that was sent to ${$formData.email}.`;
      case 3:
        return 'Now, update your password.';
    }
  }
</script>
 
<form method="POST" id="reset-password-form" use:enhance>
    <AuthCard
      title="Reset your password"
      description={getCurrentStepDescription()}
    >
      <div class="space-y-4">
        {#if step == 1}
          <EmailFormInput
            form={form}
            fieldName="email"
            placeholder='e.g. "student@example.com"'
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
            form={form}
            fieldName="emailOtp"
            label="Verification code"
            length={6}
            showResend={true}
            canResend={canResend}
            resendTimer={resendTimer}
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
            form={form}
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
    <div class="mt-4"><SuperDebug data={errors} />
      <!-- TODO: Need to connect token errors with the input -->
      {errorMessage}
    </div>
</form>