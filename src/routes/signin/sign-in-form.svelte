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

  import IdentInputComponent from '@/components/forms/form-ident-input.svelte';
  import OTPInputComponent from '@/components/forms/form-otp-input.svelte';
  import PasswordInputComponent from '@/components/forms/form-update-password-input.svelte';
  import FormButtonComponent from '@/components/forms/form-button.svelte';
  import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { onDestroy } from 'svelte';
  import AuthCard from '@/components/auth-card.svelte';
  import {
    emailSchema,
    getOtpMessage,
    schemaFirstStep,
    schemaLastStep,
    usernameSchema,
    type SignInFormSchema,
  } from './schema';

  let { data }: { data: { form: SuperValidated<SignInFormSchema> } } = $props();

  const steps = [zod(schemaFirstStep), zod(schemaLastStep)];
  let step = $state(1);

  let isOtpStepActive = $state(false);

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
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (!$formData) return;

      isValidating = true;

      debounceTimer = window.setTimeout(async () => {
        try {
          console.log('currentvalidator: ', getCurrentValidator());
          const result = await validateForm({ update: true });
          // Skip the initial validation ident & password validation attempt
          if (step === 1 && !$formData.password) {
            return;
          }
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
      if (!result.valid) {
        hasStepError = true;
        return;
      }

      if (step === 1) {
        await signMeInWithPassword();
      } else if (step === 2 && $formData.token) {
        await verifySignInToken();
      }

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

  const toggleAuthType = () => {
    console.log('toggling auth type...');

    isOtpStepActive = !isOtpStepActive;
    if (step === 1) {
      console.log('toggleAuthType.token', step);
      $formData.authType = 'token';
      $formData.token = '';
    } else {
      console.log('toggleAuthType.pass', step);
      $formData.authType = 'password';
      $formData.token = undefined;
    }

    errorMessage = '';
  };

  const signMeInWithPassword = async () => {
    try {
      loading = true;
      errorMessage = '';

      identifier = $formData.ident || '';
      identType = determineIdentifierType(identifier);

      if (!$formData.password) return;
      const response = await myUserContext.signMeInWithPassword(
        identifier,
        identType,
        $formData.password,
      );

      if (response !== true) {
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

  const startResendTimer = () => {
    resendTimer = 30;
    canResend = false;
    emailCooldowns.set(identifier, Date.now() + resendTimer * 1000);
    // todo also need to store actionId!

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      resendTimer -= 1;
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        canResend = true;
        emailCooldowns.delete(identifier);
      }
    }, 1000);
  };

  const startTokenSignIn = async () => {
    identifier = $formData.ident || '';
    identType = determineIdentifierType(identifier);

    if (!$formData.ident) {
      validateForm({ update: true });
      return;
    }

    toggleAuthType();

    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
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

      // We advance instead of waiting for the poll to come back with a `sent` status
      step = 2;
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

  const verifySignInToken = async (): Promise<void> => {
    loading = true;
    errorMessage = '';

    try {
      if (!mfaActionId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        errorMessage = translate(AppUiMessage.systemError);
        return;
      }

      if (!$formData.token) return;

      const response = await myUserContext.verifyMultiStepActionToken(mfaActionId, $formData.token);

      if (response !== true) {
        console.error('SignInForm.handleVerifyOtp: invalid response:', { result: response });
        errorMessage = translate(AppUiMessage.systemError);
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

  const resendToken = async () => {
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
        return 'Enter your email address below to sign in to your account';
      case 2:
        return isOtpStepActive
          ? getOtpMessage($formData)
          : `Enter your password to sign in as ${identifier}`;
      case 3:
        return getOtpMessage($formData);
    }
  };
</script>

<form method="POST" id="sign-in-form" use:enhance>
  <AuthCard title="Sign in" description={getCurrentStepDescription()}>
    <div class="space-y-4">
      {#if step === 1}
        <!-- TODO: this should be called identinput -->
        <IdentInputComponent
          {form}
          fieldName="ident"
          placeholder="Enter your email or username"
          label="Email or Username"
        />
        <PasswordInputComponent
          {form}
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
        <div class="flex justify-between text-sm">
          <Button variant="link" onclick={async () => await startTokenSignIn()}>
            Sign in with token
          </Button>
          <Button variant="link" onclick={async () => await goto('reset-password')}>
            Forgot your password?
          </Button>
        </div>
      {:else if step === 2}
        <OTPInputComponent
          {form}
          fieldName="token"
          label="Verification code"
          length={6}
          showResend={true}
          {canResend}
          {resendTimer}
          onResendClick={resendToken}
        />
        <FormButtonComponent
          disabled={$delayed || isValidating || hasStepError}
          loading={$delayed}
          buttonText="Sign in"
          loadingText="Signing in..."
        />
        <div class="flex justify-between text-sm">
          <Button
            variant="link"
            onclick={() => {
              toggleAuthType();
              step = 1;
              // TODO: Clean up the active listener
            }}
          >
            Sign in with password
          </Button>
          <Button variant="link" onclick={async () => await goto('reset-password')}>
            Forgot your password?
          </Button>
        </div>
      {/if}
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <a href="/signup" class="underline"> Sign up </a>
      </div>
    </div></AuthCard
  >

  <div class="mt-4"><SuperDebug data={$formData} /></div>
  <div class="mt-4"><SuperDebug data={errors} /> {errorMessage}</div>
</form>
