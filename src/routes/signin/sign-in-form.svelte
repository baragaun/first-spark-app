<script lang="ts">
  import { goto } from '$app/navigation';
  import AuthCard from '@/components/auth-card.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import EmailFormInput from '@/components/forms/form-ident-input.svelte';
  import OTPFormInput from '@/components/forms/form-otp-input.svelte';
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';
  import { Button } from '@/components/ui/button';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import { m } from '@/paraglide/messages';
  import { AppUiMessage } from '@/types/enums';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { onDestroy } from 'svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
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
  let msaId = $state<string | undefined>(undefined);
  let resendTimer = $state(30);
  let canResend = $state(false);

  let isLoading = $state(false);
  let hasStepError = $state(true);

  let identifier = $state('');
  let identType = $state(UserIdentType.email);

  let timerInterval: ReturnType<typeof setInterval>;
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

      isLoading = true;

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
          isLoading = false;
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
      isLoading = true;

      identifier = $formData.ident || '';
      identType = determineIdentifierType(identifier);

      const response = await myUserContext.signMeInWithPassword(
        $formData.ident,
        identType,
        $formData.password,
      );

      if (response !== true) {
        updateFormErrors('ident', undefined);
        updateFormErrors('password', m['signin.error.invalid_credentials']());
        return;
      }

      await goto('/');
    } catch (error) {
      console.error('SignInForm.signMeInWithPassword: error:', { error });
      updateFormErrors('password', translate(AppUiMessage.systemError));
    } finally {
      isLoading = false;
    }
  };

  const sendTokenForSignIn = async () => {
    isLoading = true;

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
        updateFormErrors('ident', 'Failed to send verification code. Please try again.');
        return;
      }
      startResendTimer();
      msaId = response.object.actionProgress.actionId;

      const onNotificationSent = () => {
        step = 2;
        isLoading = false;
      };
      const onFailure = () => {
        console.error('onFailure');
        isLoading = false;
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
      updateFormErrors('ident', translate(AppUiMessage.systemError));
    } finally {
      isLoading = true; // Leave the button in a processing state until sent event
    }
  };

  const verifySignInToken = async (): Promise<void> => {
    isLoading = true;
    if (!$formData.token) return;

    try {
      if (!msaId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        updateFormErrors('token', translate(AppUiMessage.systemError));
        return;
      }

      const response = await myUserContext.verifyMultiStepActionToken(msaId, $formData.token);

      if (response !== true) {
        console.error('SignInForm.handleVerifyOtp: invalid response:', { result: response });
        updateFormErrors('token', translate(AppUiMessage.systemError));
        isLoading = false;
        return;
      }
    } catch (error) {
      console.error('SignInForm.handleVerifyOtp: error:', { error });
      updateFormErrors('token', translate(AppUiMessage.systemError));
    } finally {
      isLoading = true; // Leave the button in a processing state until sent event
    }
  };

  const handleResendToken = async () => {
    if (!canResend) return;

    if (!msaId) {
      console.error('SignInForm.handleResendToken: actionId missing.');
      updateFormErrors('token', translate(AppUiMessage.systemError));
      return;
    }

    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1000);
      if (remainingTime > 0) {
        // If same email and cooldown active, just show verification screen with current timer
        resendTimer = remainingTime;
        return;
      }
    }

    try {
      isLoading = true;

      const response = await myUserContext.sendMultiStepActionNotification(msaId, identifier);

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
      isLoading = false;
    }
  };
  onDestroy(() => {
    clearInterval(timerInterval);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    if (otpHandler) {
      otpHandler.removeListener();
    }
  });

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

  const getCurrentStepDescription = () => {
    switch (step) {
      case 1:
        return m['signin.description']();
      case 2:
        return step === 2
          ? getOtpMessage($formData)
          : m['signin.sign_with_password_description']({ identifier });
    }
  };
</script>

<form method="POST" id="sign-in-form" use:enhance>
  <AuthCard title={m['signin.title']()} description={getCurrentStepDescription()}>
    <div class="space-y-4">
      {#if step === 1}
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
        <FormButton
          disabled={$delayed || isLoading || hasStepError}
          isLoading={($delayed || isLoading) && !hasStepError}
          buttonText={m['signin.buttons.signin']()}
          loadingText={m['signin.buttons.Signing_in']()}
        />
        <div class="flex justify-between text-sm">
          <Button variant="link" disabled={!$formData.ident} onclick={() => toggleAuthType()}>
            {m['signin.buttons.signin_with_token']()}
          </Button>
          <Button variant="link" onclick={async () => await goto('reset-password')}>
            {m['signin.buttons.forgot_password']()}
          </Button>
        </div>
      {:else if step === 2}
        <OTPFormInput
          {form}
          fieldName="token"
          label={m['verify_token.verification_code']()}
          length={6}
          showResend={true}
          {canResend}
          {resendTimer}
          onResendClick={handleResendToken}
        />
        <FormButton
          disabled={$delayed || isLoading || hasStepError}
          isLoading={($delayed || isLoading) && !hasStepError}
          buttonText={m['signin.buttons.verify']()}
          loadingText={m['signin.buttons.verifying']()}
        />
        <div class="flex justify-between text-sm">
          <Button variant="link" onclick={async () => await toggleAuthType()}>
            {m['signin.buttons.signin_with_password']()}
          </Button>
          <Button variant="link" onclick={async () => await goto('reset-password')}>
            {m['signin.buttons.forgot_password']()}
          </Button>
        </div>
      {/if}
      <div class="mt-4 text-center text-sm">
        {m['signin.have_account']()}
        <a href="/signup" class="underline"> {m['signin.buttons.signup']()} </a>
      </div>
    </div>
  </AuthCard>

  <!-- commenting as per the issue : https://github.com/baragaun/first-spark-app/issues/113 -->
  <!--   <div class="mt-4"><SuperDebug data={$formData} /></div>
  <div class="mt-4"><SuperDebug data={errors} /></div> -->
</form>
