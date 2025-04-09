<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import {
    MultiStepActionEventType,
    SidMultiStepActionProgress,
    UserIdentType,
  } from '@baragaun/bg-node-client';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  import EmailInputComponent from '@/components/forms/email-form-input.svelte';
  import OTPInputComponent from '@/components/forms/otp-form-input.svelte';
  import PasswordInputComponent from '@/components/forms/update-password-form-input.svelte';
  import FormButtonComponent from '@/components/forms/form-button.svelte';
  import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { onDestroy } from 'svelte';
  import passwordHelpers from '@/helpers/password-helpers';
  import AuthCard from '@/components/auth-card.svelte';
  import { emailSchema, getOtpMessage, schemaFirstStep, schemaLastStep, usernameSchema, type SignInFormSchema } from './schema';

  let { data }: { data: { form: SuperValidated<SignInFormSchema> } } = $props();
       
  const steps = [zod(schemaFirstStep), zod(schemaLastStep)];
  let step = $state(1);

  let isOtpStepActive = $state(false);

  let actionId = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
  let resendTimer = $state(30);
  let canResend = $state(false);
  let tokenStatus = $state(MsaTokenStatus.unset);
  let hasStepError = $state(true);
  let isValidating = $state(false);

  let identifier = $state('');
  let identType = $state(UserIdentType.email);
  let mfaActionId = $state<string | undefined>(undefined);
  let message = $state('');
  let timerInterval: ReturnType<typeof setInterval>;

  const getCurrentValidator = () => steps[step - 1];

  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 350; // ms

  const form = superForm(data.form, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    async onChange() {
      console.log('onChanged.hasStepError: ', hasStepError)
      debounceTimer = window.setTimeout(async () => {
        // console.log('debouncing')
        try {
          const result = await validateForm({ update: true });
          console.log('result', result)
          hasStepError = !result.valid;
        } catch (error) {
          console.error('Error validating form:', error);
        } finally {
          isValidating = false;
          debounceTimer = null;
        }
      }, DEBOUNCE_DELAY);

      console.log('onChanged.atRest.hasStepError: ', hasStepError)

    },
    async onSubmit({ cancel }) {
      // This form should be refactored to be two steps to avoid all of these bind issues
			cancel();

      const result = await validateForm({ update: true, focusOnError: true });
      if (!result.valid) {
        hasStepError = true;
        return;
      }

     if (step === 1) {
      identifier = $formData.email || $formData.username || ''
      determineIdentifierType(identifier);
      if (result.valid) {
        hasStepError = true;
      };
      await handleSignIn();
     } else if (step === 2) {
      if (result.valid && $formData.emailOtp) {
        onSendToken($formData.emailOtp)
      }
      
     }
    if (result.valid) step = step + 1;
    return;
    },
  });

  const { form: formData, errors, enhance, delayed, validateForm, options } = form;

  // Track emails that have active cooldowns
  const emailCooldowns = $state(new Map<string, number>());

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

  // const { getPasswordError, validatePassword } = passwordHelpers;

  const handleSignIn = async () => {
    loading = true;
    errorMessage = '';

    try {
      if ($formData.password) {
        console.log('awaiting with password')
        await signMeInWithPassword();
      } else {
        console.log('starting token sign in');
        await startTokenSignIn();
      }
    } catch (err) {
      console.error('Error signing in:', err);
      errorMessage = 'Invalid credentials. Please try again.';
    } finally {
      loading = false;
    }
  };

  const signMeInWithPassword = async () => {
    try {
      loading = true;
      errorMessage = '';
      
      if (!$formData.password) return;

      const response = await myUserContext.signMeInWithPassword(identifier, identType, $formData.password);

      if (response !== true) {
        // `response` is already translated
        errorMessage = response;
        return;
      }

      await goto('/');
    } catch (error) {
      console.error('SignInForm.signMeInWithPassword: error:', { error });
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const startTokenSignIn = async () => {
    // Check if this email has an active cooldown
    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        return;
      }
    }

    loading = true;
    errorMessage = '';

    try {
      const response = await myUserContext.signMeInWithToken(identifier);

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

      startResendTimer();
      mfaActionId = response.object.actionProgress.actionId;

      response.object.run.addListener({
        id: 'SignInForm',
        onEvent: async (
          eventType: MultiStepActionEventType,
          action: SidMultiStepActionProgress,
        ): Promise<void> => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            // The notification failed to go out.
            console.error(
              'SignInPage.multiStepActionListener: Notification failed.',
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
              'SignInPage.multiStepActionListener: Notification sent out.',
              action.notificationResult,
            );
            // Switching to the token input for
            tokenStatus = MsaTokenStatus.notificationSent;
            message = translate(AppUiMessage.msaTokenSent);
            step = 2;
            return;
          }

          if (eventType === MultiStepActionEventType.tokenFailed) {
            console.error(
              'SignInPage.multiStepActionListener: incorrect token.',
              action.notificationResult,
            );
            errorMessage = 'We could not verify the token you entered. Please try again.';
            return;
          }

          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(
              'SignInPage.multiStepActionListener: timeout.',
              action.notificationResult,
            );
            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.failed) {
            console.error('SignInPage.multiStepActionListener: error.', action.notificationResult);
            tokenStatus = MsaTokenStatus.verificationFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            return;
          }

          if (eventType === MultiStepActionEventType.success) {
            // The token was accepted. The user is now signed in.
            console.log('SignInPage.multiStepActionListener: success.', action.notificationResult);
            tokenStatus = MsaTokenStatus.success;
            // todo: don't use `errorMessage` as it's rendered as an error (red color)
            message = translate(AppUiMessage.msaTokenSuccess);
            goto('/');
          }
        },
      });
    } catch (error) {
      console.error('SignInForm.startTokenSignIn:', { error });
      tokenStatus = MsaTokenStatus.verificationFailed;
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  // was passed to token form
  const onSendToken = async (token: string): Promise<void> => {
    try {
      if (!mfaActionId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        errorMessage = translate(AppUiMessage.systemError);
        return;
      }

      loading = true;
      errorMessage = '';

      const response = await myUserContext.verifyMultiStepActionToken(mfaActionId, token);

      // Here, we don't have to add another listener, since we already added one when
      // we called `signMeInWithToken`. We do want to check the `result` object to
      // make sure the `verifyMultiStepActionToken` call did not fail. But this
      // function does not actually verify the token. For that, we are waiting for
      // the listener to be called with the result of the token verification.

      if (response !== true) {
        console.error('SignInForm.handleVerifyOtp: invalid response:', { result: response });
        errorMessage = translate(AppUiMessage.systemError); // todo: translate?
        tokenStatus = MsaTokenStatus.unset;
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
    } catch (error) {
      console.error('SignInForm.handleVerifyOtp: error:', { error });
      errorMessage = translate(AppUiMessage.systemError);
      tokenStatus = MsaTokenStatus.unset;
    } finally {
      loading = false;
    }
  };

  // was passed to token form
  const onSendNotification = async () => {
    tokenStatus = MsaTokenStatus.unset;

    if (!mfaActionId) {
      console.error('SignInForm.handleResendOtp: actionId missing.');
      errorMessage = translate(AppUiMessage.systemError); // todo: translate?
      return;
    }

    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        tokenStatus = MsaTokenStatus.unset;
        return;
      }
    }

    try {
      loading = true;
      errorMessage = '';

      const response = await myUserContext.sendMultiStepActionNotification(mfaActionId, identifier);

      if (typeof response === 'string') {
        console.error('SignInForm.handleResendOtp: error:', { error: response });
        errorMessage = response;
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
      startResendTimer();
    } catch (error) {
      console.error('SignInForm.handleResendOtp: error:', { error });
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const startResendTimer = () => {
    resendTimer = 30;
    canResend = false;
    // emailCooldowns.set(emailAddress, Date.now() + resendTimer * 1000);
    // todo also need to store actionId!

    clearInterval(timerInterval);
    console.log('starting resend timer')
    timerInterval = setInterval(() => {
      resendTimer -= 1;
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        canResend = true;
        // emailCooldowns.delete(emailAddress);
      }
    }, 1000);
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

    // When we swap the Password and OTP inputs in the same step, we get binding errors since a value
    // is `undefined` prior to interaction. Until I better understand how to do this, I'm hot swapping
    // the default `emailOtp` values. Maybe our form components need to take a `multistep` flag, or 
    // the form should be refactored to be two steps based on the auth method.
    if ($formData.emailOtp === '' && isOtpStepActive) {
      $formData.emailOtp = undefined
    }

    options.validators = getCurrentValidator();
  });

  const getCurrentStepDescription = () => {
    switch (step) {
      case 1:
        return 'Enter your email address below to sign in to your account';
      case 2:
        return isOtpStepActive ? getOtpMessage($formData) : `Enter your password to sign in as ${identifier}`;
      case 3:
        return getOtpMessage($formData);
    }
  }
</script>

<form method="POST" id="sign-in-form" use:enhance>
  <AuthCard
    title="Sign in"
    description={getCurrentStepDescription()}
  >
    <div class="space-y-4">
      {#if step == 1}
        <!-- TODO: this should be an identinput -->
        <EmailInputComponent
          form={form}
          fieldName="email"
          placeholder='e.g. "student@example.com"'
          label="Email address"
        />
        <FormButtonComponent
          disabled={$delayed || isValidating || hasStepError}
          loading={$delayed}
          buttonText="Sign in"
          loadingText="Signing in..."
        />
      {:else if step == 2}
        {#if isOtpStepActive}
          <OTPInputComponent
            form={form}
            fieldName="emailOtp"
            label="Verification code"
            length={6}
            showResend={true}
            canResend={canResend}
            resendTimer={resendTimer}
            onResendClick={onSendNotification}
          />

          <FormButtonComponent
            disabled={$delayed || isValidating || hasStepError}
            loading={$delayed}
            buttonText="Sign in"
            loadingText="Signing in..."
          />
        {:else}
          <PasswordInputComponent
            form={form}
            fieldName="password"
            label="Password"
            placeholder="Enter your password"
          />
          
          <FormButtonComponent
            disabled={$delayed || isValidating || hasStepError}
            loading={$delayed}
            buttonText="Sign in"
            loadingText="Signing in..."
          />
          <div class="flex text-sm justify-between">
            <Button variant="link" onclick={() => {
              // Instead of coalescing the initial value in the OTPInput, I'm hot
              // swapping it here to be an empty string, which is then updated in
              // the effect. To avoid all of this, put the OTP input in its own step.
              $formData.emailOtp = ''
              isOtpStepActive = true;
              }}>
              Sign in with a token
            </Button>
            <Button variant="link" onclick={async () => await goto('reset-password')}>
              Forgot your password?
            </Button>
          </div>
        {/if}
      {/if}
    <div class="mt-4 text-center text-sm">
      Don't have an account?
      <a href="/signup" class="underline"> Sign up </a>
    </div>
  </AuthCard>
  
  <div class="mt-4"><SuperDebug data={$formData} /></div>
  <div class="mt-4"><SuperDebug data={errors} /> {errorMessage}</div>
</form>
