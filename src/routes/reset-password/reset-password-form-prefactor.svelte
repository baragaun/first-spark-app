<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import AuthCard from "@/components/auth-card.svelte";
  import { schemaFirstStep, schemaLastStep, schemaStepTwo, type ResetPasswordFormSchema } from "./schema.js";
  import SuperDebug, {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { LoaderCircle } from "lucide-svelte";
  import { AppUiMessage, MsaTokenStatus } from "@/types/enums.js";
  import { myUserContext } from "@/contexts/my-user-context.svelte.js";
  import translate from "@/helpers/language/translate.js";
  import { MultiStepActionEventType, SidMultiStepActionProgress, UserIdentType } from '@baragaun/bg-node-client';
  import { onDestroy } from "svelte";
  import * as InputOTP from '$lib/components/ui/input-otp';
  import { REGEXP_ONLY_DIGITS } from 'bits-ui';
  import passwordHelpers from "@/helpers/password-helpers.js";
  import { goto } from "$app/navigation";
 
  let { data }: { data: { form: SuperValidated<Infer<ResetPasswordFormSchema>> } } = $props();
       
  const steps = [zod(schemaFirstStep), zod(schemaStepTwo), zod(schemaLastStep)];
	let step = $state(1);

  const getCurrentValidator = () => steps[step - 1];

  let hasStepError = $state(true); // Treat an initial empty input as an error
  let isValidating = $state(false);
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 350; // ms

  const form = superForm(data.form, {
		dataType: 'json',  // No need for hidden fields with dataType: 'json'
    validators: getCurrentValidator(),
    resetForm: false,
    async onChange() {
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
			// If on last step, make a normal request
			// if (step == steps.length) return;
      // else cancel();

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
		},
    async onUpdate({ form, cancel }) {
      if (step !== steps.length) cancel()
			
      if (form.valid) {
        console.log('>>>>> Attempting to log in...')
        const response = await myUserContext.signMeInWithPassword(
          $formData.email,
          UserIdentType.email,
          $formData.newPassword
        );

        if (response !== true) {
          // is `response` already translated?
          errorMessage = response;
          return;
        }

        return await goto('/');
      };
		},
    // async onUpdated({ form }) {
		// 	if (form.data.newPassword && form.valid) {
    //     console.log('>>>>> Attempting to log in...')
    //     const response = await myUserContext.signMeInWithPassword(
    //       $formData.email,
    //       UserIdentType.email,
    //       $formData.newPassword
    //     );

    //     if (response !== true) {
    //       // is `response` already translated?
    //       errorMessage = response;
    //       return;
    //     }

    //     return await goto('/');
    //   };
		// },
	});

  const { form: formData, enhance, delayed, validateForm, options } = form;

  let actionId = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
  let resendTimer = $state(30);
  let canResend = $state(false);
  let tokenStatus = $state(MsaTokenStatus.unset);
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
            // The notification failed to go out.
            console.error(
              'ResetPasswordPage.multiStepActionListener: Notification failed.',
              action.notificationResult,
            );

            if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
              // We can ignore the failure to send the email in development.
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
            // The notification has been sent out.
            console.log(
              'ResetPasswordPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );

            step = 2
            startResendTimer();

            // Switching to the token input for
            tokenStatus = MsaTokenStatus.notificationSent;
            // message = translate(AppUiMessage.msaTokenSent);
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
            // The token was accepted. The user is now signed in.
            console.log(
              'ResetPasswordPage.multiStepActionListener: success.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.success;
            // todo: don't use `errorMessage` as it's rendered as an error (red color)
            // message = translate(AppUiMessage.msaTokenSuccess);
            // currentStep.set(2);
            step = 2
          }
        },
      });
    } catch (err) {
      console.error('Error resetting password:', err);
      errorMessage =
        err instanceof Error ? err.message : 'Unable to process your request. Please try again.';
    } finally {
      loading = false;
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    loading = true;
    try {
      // Use the sendMultiStepActionNotification method to resend the email
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
  <div class="mx-auto min-w-md">
    <AuthCard
      title="Reset your password"
      description={getCurrentStepDescription()}
    >
      <div class="space-y-4">
        {#if step == 1}
          <Form.Field {form} name="email">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Email address</Form.Label>
                <Input
                  {...props}
                  bind:value={$formData.email}
                  placeholder='e.g. "student@example.com"'
                />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Button
            class="w-full"
            disabled={$delayed || isValidating || hasStepError}
            >
            {#if $delayed}
              <LoaderCircle class="animate-spin" />
              Drafting email...
            {:else}
              Send me an email
            {/if}
          </Form.Button>
        {:else if step == 2}
          <Form.Field {form} name="emailOtp">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Verification code</Form.Label>
                <InputOTP.Root
                  {...props}
                  id="verification-code"
                  maxlength={6}
                  bind:value={$formData.emailOtp}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  {#snippet children({ cells })}
                    <InputOTP.Group class="w-full">
                      {#each cells as cell}
                        <InputOTP.Slot {cell} />
                      {/each}
                    </InputOTP.Group>
                  {/snippet}
                </InputOTP.Root>
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <div class="flex justify-between text-sm">
            <Form.Button variant="link" class="px-0" disabled={!canResend} onclick={handleResendEmail}>
              {canResend ? 'Resend code' : `Resend in ${formatTime(resendTimer)}`}
            </Form.Button>
          </div>
          <Form.Button
            class="w-full"
            disabled={$delayed || isValidating || hasStepError}
            >
            {#if $delayed}
              <LoaderCircle class="animate-spin" />
              Verifiying email...
            {:else}
              Verify my email
            {/if}
          </Form.Button>
        {:else if step == 3}
          <Form.Field {form} name="newPassword">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>New password</Form.Label>
                <Input {...props} bind:value={$formData.newPassword} />
                <!-- <Input
                  {...props}
                  bind:value={$formData.newPassword}
                  placeholder='Your password must be at least 8 characters'
                /> -->
              {/snippet}
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <!-- THIS BUTTON SHOULD SUBMIT THE WHOLE THING -->
          <Form.Button
            class="w-full"
            disabled={$delayed || isValidating || hasStepError}
            >
            {#if $delayed}
              <LoaderCircle class="animate-spin" />
              Updating password...
            {:else}
              Update my password
            {/if}
          </Form.Button>
        {/if}
      </div>
    </AuthCard>
    
    <div class="mt-4"><SuperDebug data={$formData} /></div>
  </div>
</form>

