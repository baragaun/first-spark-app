<script lang="ts">
  import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { goto } from '$app/navigation';
  import { onDestroy } from 'svelte';
  import translate from '@/helpers/language/translate';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import AuthCard from '@/components/auth-card.svelte';
  import EmailFormInput from '@/components/forms/form-ident-input.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import OTPFormInput from '@/components/forms/form-otp-input.svelte';
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';
  import { Button } from '@/components/ui/button';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums';
  import {
    determineIdentifierType,
    getOtpMessage,
    schemaFirstStep,
    schemaLastStep,
    type SignInFormSchema,
  } from './schema';

  let { data }: { data: { form: SuperValidated<SignInFormSchema> } } = $props();

  const steps = [zod(schemaFirstStep), zod(schemaLastStep)];
  let step = $state(1);
  const getCurrentValidator = () => steps[step - 1];

  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
  let msaActionId = $state<string | undefined>(undefined);
  let msaActionStatus = $state(MsaTokenStatus.unset); // TODO: Integrate into the form
  let resendTimer = $state(30);
  let canResend = $state(false);

  let loading = $state(false);
  let errorMessage = $state('');
  let hasStepError = $state(true);

  let identifier = $state('');
  let identType = $state(UserIdentType.email);

  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 350; // ms
  const emailCooldowns = $state(new Map<string, number>()); // Track emails that have active cooldowns

  const form = superForm(data.form, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    async onChange() {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      if (!$formData) return;

      loading = true;

      debounceTimer = window.setTimeout(async () => {
        try {
          // ============================================================
          // Skip the empty validating to allow for error free authType swapping
          if (step === 1 && (!$formData.ident || !$formData.password)) {
            return;
          } else if (step === 2 && !$formData.token) {
            return;
          }
          // ============================================================

          // This form is friendlier without the automatic error focusing
          const result = await validateForm({ update: true, focusOnError: false });

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
      // Bail on any server side action
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

  let timerInterval: ReturnType<typeof setInterval>;
  const startResendTimer = () => {
    resendTimer = 30;
    canResend = false;
    emailCooldowns.set(identifier, Date.now() + resendTimer * 1000);

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

  const updateErrorMessage = (message: string, field: string) => {
    errorMessage = message;
    switch (field) {
      case 'ident': {
        errors.update((errors) => ({
          ...errors,
          ident: [errorMessage],
        }));
      }
      case 'token': {
        errors.update((errors) => ({
          ...errors,
          token: [errorMessage],
        }));
      }
      case 'password': {
        errors.update((errors) => ({
          ...errors,
          password: [errorMessage],
        }));
      }
    }
  };

  const toggleAuthType = async () => {
    // 1. Remove an existing listener that hasn't failed yet
    // 2. Validate the form on the way out to handle a no-input token request
    // 3. Clear any existing validation errors for the other authType
    // 4. Go to the others step

    if (otpHandler) {
      otpHandler.removeListener();
      otpHandler = undefined;
    }

    // Ensure that there is valid ident input before we request a token
    if ($formData.ident && schemaFirstStep.safeParse($formData.ident)) {
      if (step === 1) {
        $formData.authType = 'token';
        $formData.token = '';

        $formData.password = undefined;

        await sendTokenForSignIn();
        step = 2;
      } else {
        $formData.authType = 'password';
        $formData.password = '';

        $formData.token = undefined;

        step = 1;
      }
    }
    return;
  };

  const signMeInWithPassword = async () => {
    if (!$formData.password) return;

    try {
      loading = true;
      updateErrorMessage('', 'password');

      identifier = $formData.ident || '';
      identType = determineIdentifierType(identifier);

      const response = await myUserContext.signMeInWithPassword(
        $formData.ident,
        identType,
        $formData.password,
      );

      if (response !== true) {
        updateErrorMessage('Invalid credentials. Please try again.', 'password');
        return;
      }

      await goto('/');
    } catch (error) {
      console.error('SignInForm.signMeInWithPassword: error:', { error });
      updateErrorMessage(translate(AppUiMessage.systemError), 'password');
    } finally {
      loading = false;
    }
  };

  const sendTokenForSignIn = async () => {
    if (!$formData.ident) {
      validateForm({ update: true });
      return;
    }

    identifier = $formData.ident || '';
    identType = determineIdentifierType(identifier);

    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);

      if (remainingTime > 0) {
        resendTimer = remainingTime;
        return;
      }
    }

    loading = true;
    updateErrorMessage('', 'ident');

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
        updateErrorMessage('Failed to send verification code. Please try again.', 'ident');
        return;
      }
      startResendTimer();
      msaActionId = response.object.actionProgress.actionId;

      const onNotificationSent = () => {
        step = 2;
      };
      const onFailure = () => {
        console.error('onFailure');
      };
      const onSuccess = async () => await goto('/');

      otpHandler = new MsaListenerHandler(
        'SignInForm',
        response,
        onNotificationSent,
        onFailure,
        onSuccess,
      );

      return;
    } catch (error) {
      console.error('SignInForm.startTokenSignIn:', { error });
      msaActionStatus = MsaTokenStatus.verificationFailed;
      updateErrorMessage(translate(AppUiMessage.systemError), 'ident');
    } finally {
      loading = false;
    }
  };

  const verifySignInToken = async (): Promise<void> => {
    loading = true;
    updateErrorMessage('', '');

    try {
      if (!msaActionId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        updateErrorMessage(translate(AppUiMessage.systemError), 'token');
        return;
      }

      if (!$formData.token) return;

      const response = await myUserContext.verifyMultiStepActionToken(msaActionId, $formData.token);

      if (response !== true) {
        console.error('SignInForm.handleVerifyOtp: invalid response:', { result: response });
        updateErrorMessage(translate(AppUiMessage.systemError), 'token');
        msaActionStatus = MsaTokenStatus.unset;
        return;
      }

      msaActionStatus = MsaTokenStatus.sending;
    } catch (error) {
      console.error('SignInForm.handleVerifyOtp: error:', { error });
      updateErrorMessage(translate(AppUiMessage.systemError), 'token');
      msaActionStatus = MsaTokenStatus.unset;
    } finally {
      loading = false;
    }
  };

  const handleResendToken = async () => {
    if (!canResend) return;
    msaActionStatus = MsaTokenStatus.unset;
    loading = true;

    if (!msaActionId) {
      console.error('SignInForm.handleResendToken: actionId missing.');
      updateErrorMessage(translate(AppUiMessage.systemError), 'token');
      return;
    }

    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);
      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        msaActionStatus = MsaTokenStatus.unset;
        return;
      }
    }

    try {
      loading = true;
      updateErrorMessage('', 'ident');

      const response = await myUserContext.sendMultiStepActionNotification(msaActionId, identifier);

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
      console.error('SignInForm.handleResendToken: error:', { error });
      updateErrorMessage(translate(AppUiMessage.systemError), 'ident');
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
        return 'Enter your email address below to sign in to your account';
      case 2:
        return step === 2
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
        <EmailFormInput
          {form}
          fieldName="ident"
          placeholder="Enter your email or username"
          label="Email or Username"
        />
        <PasswordFormInput
          {form}
          fieldName="password"
          label="Password"
          placeholder="Enter your password"
        />
        <FormButton
          disabled={$delayed || loading || hasStepError}
          loading={$delayed}
          buttonText="Sign in"
          loadingText="Signing in..."
        />
        <div class="flex justify-between text-sm">
          <Button variant="link" disabled={!$formData.ident} onclick={() => toggleAuthType()}>
            Sign in with token
          </Button>
          <Button variant="link" onclick={async () => await goto('reset-password')}>
            Forgot your password?
          </Button>
        </div>
      {:else if step === 2}
        <OTPFormInput
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
          buttonText="Sign in"
          loadingText="Signing in..."
        />
        <div class="flex justify-between text-sm">
          <Button variant="link" onclick={async () => await toggleAuthType()}>
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
  <div class="mt-4"><SuperDebug data={errors} />{errorMessage}</div>
</form>
