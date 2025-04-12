<script lang="ts">
  import AuthCard from '@/components/auth-card.svelte';
  import FormButtonComponent from '@/components/forms/form-button.svelte';
  import IdentInputComponent from '@/components/forms/form-ident-input.svelte';
  import OTPInputComponent from '@/components/forms/form-otp-input.svelte';
  import PasswordInputComponent from '@/components/forms/form-update-password-input.svelte';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import {
    emailSchema,
    getOtpMessage,
    schemaFirstStep,
    schemaLastStep,
    usernameSchema,
    type SignInFormSchema,
  } from './schema';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { onDestroy } from 'svelte';

  let { data }: { data: { form: SuperValidated<SignInFormSchema> } } = $props();

  const steps = [zod(schemaFirstStep), zod(schemaLastStep)];
  let step = $state(1);
  const getCurrentValidator = () => steps[step - 1];

  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
  let mfaActionId = $state<string | undefined>(undefined);
  let tokenStatus = $state(MsaTokenStatus.unset); // TODO: Integrate into the form
  let resendTimer = $state(30);
  let canResend = $state(false);

  let timerInterval: ReturnType<typeof setInterval>;
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 350; // ms

  let loading = $state(false);

  let message = $state('');
  let errorMessage = $state('');
  let hasStepError = $state(true);
  
  let identifier = $state('');
  let identType = $state(UserIdentType.email);
  const emailCooldowns = $state(new Map<string, number>());  // Track emails that have active cooldowns

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
          // This form is friendlier without the automatic error focusing
          const result = await validateForm({ update: true, focusOnError: false });

          // Skip the initial validation ident & password validation attempt
          if (step === 1 && (!$formData.ident || !$formData.password)) {
            return;
          }

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

  const toggleAuthType = async () => {
    // 1. Remove an existing listener that hasn't failed yet
    // 2. Validate the form on the way out to handle a no-input token request
    // 3. Clear any existing validation errors for the other authType
    // 4. Go to the others step

    if (otpHandler) {
      console.log('togleeauth clearing our otp handler')
      otpHandler.removeListener();
      otpHandler = undefined;
    }

    const result = await validateForm({ update: true, focusOnError: false });
    
    if (step === 1) {
      // Ensure that there is valid ident input before we request a token
      if (result.valid) {
        $formData.authType = 'token';
        $formData.token = '';
        form.errors.subscribe((errors) => {
          if (errors.password && errors.password.length > 0) {
            console.log('blast the password away: ', errors.password)
            $formData.password = undefined;
          }
        })
        await sendTokenForSignIn();
        step = 2
      }

    } else {
      $formData.authType = 'password';
      $formData.password = '';
      // $formData.token = undefined;
      form.errors.subscribe((errors) => {
        if (errors.token && errors.token.length > 0) {
          console.log('blast the token away: ', errors.token)
          $formData.token = undefined;
        }
      })
      step = 1
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
        errors.update((errors) => ({
          ...errors,
          ident: [''],
          password: ['Invalid credentials. Please try again.'],
        }));
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

  const sendTokenForSignIn = async () => {
    identifier = $formData.ident || '';
    identType = determineIdentifierType(identifier);

    if (!$formData.ident) {
      validateForm({ update: true });
      return;
    }
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
      startResendTimer();
      mfaActionId = response.object.actionProgress.actionId;
      otpHandler = new MsaListenerHandler('SignInForm', response, () => {goto('/')});

      return;
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
    if (otpHandler) {
      otpHandler.removeListener();
      otpHandler = undefined;
    }
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
          disabled={$delayed || loading || hasStepError}
          loading={$delayed}
          buttonText="Sign in"
          loadingText="Signing in..."
        />
        <div class="flex justify-between text-sm">
          <Button 
            variant="link" 
            disabled={!$formData.ident}
            onclick={() => toggleAuthType()}
          >
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
          disabled={$delayed || loading || hasStepError}
          loading={$delayed}
          buttonText="Sign in"
          loadingText="Signing in..."
        />
        <div class="flex justify-between text-sm">
          <Button
            variant="link"
            onclick={async () => await toggleAuthType()}
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
