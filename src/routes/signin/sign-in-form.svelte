<script lang="ts">
  import { goto } from '$app/navigation';
  import AuthCard from '@/components/auth-card.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import EmailFormInput from '@/components/forms/form-ident-input.svelte';
  import OTPFormInput from '@/components/forms/form-otp-input.svelte';
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';
  import { Button } from '@/components/ui/button';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { type MyUserContext } from '@/contexts/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import { m } from '@/paraglide/messages';
  import { AppUiMessage } from '@/types/enums';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { getContext, onDestroy } from 'svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { debounce } from 'throttle-debounce';
  import { getLocale } from '@/paraglide/runtime';
  import { turnstile } from '@svelte-put/cloudflare-turnstile';
  import { env } from '$env/dynamic/public';
  import { appTitle } from '@/stores/app-store.svelte';
  import {
    determineIdentifierType,
    getOtpMessage,
    schemaFirstStep,
    schemaLastStep,
    type SignInFormSchema,
  } from './schema';

  let { data }: { data: { form: SuperValidated<SignInFormSchema> } } = $props();

  const userContext = getContext<MyUserContext>('myUserContext');
  let cloudflareToken = $state('');
  let formState = $state({
    isLoading: false,
    hasStepError: false,
    step: 1,
  });

  let otpState = $state({
    handler: undefined as MsaListenerHandler | undefined,
    msaId: undefined as string | undefined,
    resendTimer: 30,
    canResend: false,
  });

  const buttonState = $derived.by(() => ({
    isDisabled: !isFormValid || formState.isLoading || formState.hasStepError,
    isLoading: ($delayed || formState.isLoading) && !formState.hasStepError,
  }));

  const steps = [zod(schemaFirstStep), zod(schemaLastStep)];
  const getCurrentValidator = () => steps[formState.step - 1];

  let identifier = $state('');
  let identType = $state(UserIdentType.email);

  let timerInterval: ReturnType<typeof setInterval>;
  const DEBOUNCE_DELAY = 350; // ms
  const emailCooldowns = $state(new Map<string, number>()); // Track emails that have active cooldowns

  const isFormValid = $derived.by(() => {
    if (formState.step === 1) {
      return $formData.ident && $formData.password && cloudflareToken;
    } else if (formState.step === 2) {
      return $formData.ident && $formData.token;
    }
    return false;
  });

  const debouncedValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      // ============================================================
      // Skip the empty validating to allow for error free authType swapping
      if (formState.step === 1 && (!$formData.ident || !$formData.password)) {
        return;
      } else if (formState.step === 2 && !$formData.token) {
        return;
      }
      // ============================================================

      // This form is friendlier without the automatic error focusing
      const result = await validateForm({ update: true, focusOnError: false });

      formState.hasStepError = !result.valid;
    } catch (error) {
      console.error('Error validating form:', error);
    } finally {
      formState.isLoading = false;
    }
  });

  const form = superForm(data.form, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    async onChange() {
      if (!$formData) return;
      debouncedValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      const result = await validateForm({ update: true, focusOnError: true });
      if (!result.valid) {
        formState.hasStepError = true;
        return;
      }

      if (formState.step === 1) {
        await signMeInWithPassword();
      } else if (formState.step === 2 && $formData.token) {
        await verifySignInToken();
      }
      return;
    },
  });

  const { form: formData, errors, enhance, delayed, validateForm, options, isTainted } = form;

  const startResendTimer = () => {
    otpState.resendTimer = 30;
    otpState.canResend = false;
    emailCooldowns.set(identifier, Date.now() + otpState.resendTimer * 1000);

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      otpState.resendTimer -= 1;
      if (otpState.resendTimer <= 0) {
        clearInterval(timerInterval);
        otpState.canResend = true;
        emailCooldowns.delete(identifier);
      }
    }, 1000);
  };

  const setStep = (newStep: number) => {
    formState.step = newStep;
    formState.hasStepError = true; // Disable button initially when step changes
  };

  const updateFormErrors = (field: keyof SignInFormSchema, message?: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  const toggleAuthType = async () => {
    if (otpState.handler) {
      otpState.handler.removeListener();
      otpState.handler = undefined;
    }

    // Ensure that there is valid ident input before we request a token
    if ($formData.ident && schemaFirstStep.safeParse($formData.ident)) {
      if (formState.step === 1) {
        $formData.authType = 'token';
        $formData.token = '';
        $formData.password = undefined;
        await sendTokenForSignIn();
        setStep(2);
      } else {
        $formData.authType = 'password';
        $formData.password = '';
        $formData.token = undefined;
        setStep(1);
      }
    }
    return;
  };

  const onSignIn = async () => {
    const onboardingCompletion = userContext.myUserOnboardingCompletion;
    if (onboardingCompletion === 0) {
      console.error('signMeInWithPassword.success.onboardingCompletion: User data not found.');
    } else if (onboardingCompletion === 1) {
      await goto('/');
    } else {
      await goto(`/signup?step=${onboardingCompletion}`);
    }
  };

  const signMeInWithPassword = async () => {
    if (!$formData.password) return;

    try {
      formState.isLoading = true;

      identifier = $formData.ident || '';
      identType = determineIdentifierType(identifier);

      const response = await userContext.signMeInWithPassword(
        $formData.ident,
        identType,
        $formData.password,
      );

      if (response !== true) {
        updateFormErrors('ident', undefined);
        updateFormErrors('password', m['signin.error.invalid_credentials']());
        formState.hasStepError = true;
        return;
      }

      await onSignIn();
    } catch (error) {
      console.error('SignInForm.signMeInWithPassword: error:', { error });
      updateFormErrors('password', translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };

  const sendTokenForSignIn = async () => {
    formState.isLoading = true;

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
        otpState.resendTimer = remainingTime;
        return;
      }
    }

    try {
      const response = await userContext.signMeInWithToken(identifier);

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
      startResendTimer();
      otpState.msaId = response.object.actionProgress.actionId;

      const onNotificationSent = () => {
        setStep(2);
        formState.isLoading = false;
      };
      const onFailure = () => {
        if (otpState.handler) {
          console.error('onFailure');

          updateFormErrors('token', otpState.handler.getErrorMessage());
          formState.hasStepError = true;
          formState.isLoading = false;
        }
      };
      const onSuccess = async () => {
        await onSignIn();
      };

      otpState.handler = new MsaListenerHandler(
        'SignInForm',
        response,
        onNotificationSent,
        onFailure,
        onSuccess,
      );

      return;
    } catch (error) {
      console.error('SignInForm.startTokenSignIn:', { error });
      updateFormErrors('ident', translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };

  const verifySignInToken = async (): Promise<void> => {
    formState.isLoading = true;
    if (!$formData.token) return;

    try {
      if (!otpState.msaId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        updateFormErrors('token', translate(AppUiMessage.systemError));
        return;
      }

      const response = await userContext.verifyMultiStepActionToken(
        otpState.msaId,
        $formData.token,
      );

      if (response !== true) {
        console.error('SignInForm.handleVerifyOtp: invalid response:', { result: response });
        updateFormErrors('token', translate(AppUiMessage.systemError));
        formState.isLoading = false;
        return;
      }
    } catch (error) {
      console.error('SignInForm.handleVerifyOtp: error:', { error });
      updateFormErrors('token', translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = true; // Leave the button in a processing state until sent event
    }
  };

  const handleResendToken = async () => {
    if (!otpState.canResend) return;

    if (!otpState.msaId) {
      console.error('SignInForm.handleResendToken: actionId missing.');
      updateFormErrors('token', translate(AppUiMessage.systemError));
      return;
    }

    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);
      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        otpState.resendTimer = remainingTime;
        return;
      }
    }

    try {
      formState.isLoading = true;

      const response = await userContext.sendMultiStepActionNotification(
        otpState.msaId,
        identifier,
      );

      if (typeof response === 'string') {
        console.error('SignInForm.handleResendToken: error:', { error: response });
        updateFormErrors('token', response);
        return;
      }

      startResendTimer();
    } catch (error) {
      console.error('SignInForm.handleResendToken: error:', { error });
      updateFormErrors('ident', translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };
  onDestroy(() => {
    clearInterval(timerInterval);

    if (otpState.handler) {
      otpState.handler.removeListener();
    }

    // Cancel the debounced function
    debouncedValidation.cancel();
  });

  $effect(() => {
    if (!$formData) {
      formState.isLoading = false;
      return;
    }

    options.validators = getCurrentValidator();
  });

  const getCurrentStepDescription = () => {
    switch (formState.step) {
      case 1:
        return m['signin.description']();
      case 2:
        return formState.step === 2
          ? getOtpMessage($formData)
          : m['signin.sign_with_password_description']({ identifier });
    }
  };
</script>

<form method="POST" id="sign-in-form" use:enhance>
  <AuthCard title={m['signin.title']()} description={getCurrentStepDescription()}>
    <div class="space-y-4">
      {#if formState.step === 1}
        <EmailFormInput
          {form}
          fieldName="ident"
          placeholder={m['signin.identifier_placeholder']()}
          label={m['signin.identifier_label']()}
        />
        <PasswordFormInput
          {form}
          fieldName="password"
          label={m['signin.password_label']()}
          placeholder={m['signin.password_placeholder']()}
        />
        <div
          class="w-full overflow-x-hidden"
          use:turnstile
          turnstile-sitekey={env.PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
          turnstile-theme="auto"
          turnstile-size="normal"
          turnstile-language={getLocale()}
          turnstile-response-field-name="turnstile"
          turnstile-response-field
          onturnstile={(e) => (cloudflareToken = e.detail.token)}
        ></div>
        <FormButton
          disabled={buttonState.isDisabled}
          isLoading={buttonState.isLoading}
          buttonText={m['signin.buttons.signin']()}
          loadingText={m['signin.buttons.Signing_in']()}
        />
        <div class="flex flex-col justify-between gap-2 text-sm sm:flex-row">
          <Button variant="link" disabled={!$formData.ident} onclick={() => toggleAuthType()}>
            {m['signin.buttons.signin_with_token']()}
          </Button>
          <Button variant="link" onclick={async () => await goto('reset-password')}>
            {m['signin.buttons.forgot_password']()}
          </Button>
        </div>
      {:else if formState.step === 2}
        <OTPFormInput
          {form}
          fieldName="token"
          label={m['verify_token.verification_code']()}
          length={6}
          showResend={true}
          canResend={otpState.canResend}
          resendTimer={otpState.resendTimer}
          onResendClick={handleResendToken}
        />
        <FormButton
          disabled={buttonState.isLoading}
          isLoading={buttonState.isLoading}
          buttonText={m['signin.buttons.verify']()}
          loadingText={m['signin.buttons.verifying']()}
        />
        <div class="flex flex-col justify-between gap-2 text-sm sm:flex-row">
          <Button variant="link" onclick={async () => await toggleAuthType()}>
            {m['signin.buttons.signin_with_password']()}
          </Button>
          <Button variant="link" onclick={async () => await goto('reset-password')}>
            {m['signin.buttons.forgot_password']()}
          </Button>
        </div>
      {/if}
      <div class="mt-4 break-words text-center text-sm">
        {m['signin.have_account']({ title: appTitle() })}
        <a href="/signup" class="underline"> {m['signin.buttons.signup']()} </a>
      </div>
    </div>
  </AuthCard>

  <!-- commenting as per the issue : https://github.com/baragaun/first-spark-app/issues/113 -->
  <!-- <div class="mt-4"><SuperDebug data={$formData} /></div> -->
  <!-- <div class="mt-4"><SuperDebug data={errors} /></div> -->
</form>
