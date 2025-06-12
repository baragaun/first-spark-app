<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import AuthCard from '@/components/auth-card.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import OTPFormInput from '@/components/forms/form-otp-input.svelte';
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage } from '@/types/enums';
  import {
    UserIdentType,
    type MultiStepActionProgressResult,
    type QueryResult,
  } from '@baragaun/bg-node-client';
  import { onDestroy, onMount } from 'svelte';
  import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { debounce } from 'throttle-debounce';
  import {
    emailSchema,
    schemaFirstStep,
    schemaLastStep,
    schemaSecondStep,
    usernameSchema,
    type SignUpFormSchema,
  } from './schema';
  import { m } from '@/paraglide/messages';
  import { getLocale } from '@/paraglide/runtime';
  import { turnstile } from '@svelte-put/cloudflare-turnstile';
  import { env } from '$env/dynamic/public';
  import { appTitle } from '@/stores/app-store';

  let { data }: { data: { form: SuperValidated<SignUpFormSchema> } } = $props();

  const steps = [
    {
      schema: zod(schemaFirstStep),
      description: m['signup.email_description']({ title: $appTitle }),
      buttonLabel: m['signup.buttons.sign_up'](),
      loadingLabel: m['signup.buttons.sign_up'](),
      requiredFields: ['email'] as const,
    },
    {
      schema: zod(schemaSecondStep),
      description: '',
      buttonLabel: m['signup.buttons.verify'](),
      loadingLabel: m['signup.buttons.verifying'](),
      requiredFields: ['token'] as const,
    },
    {
      schema: zod(schemaLastStep),
      description: m['signup.create_credentials_description'](),
      buttonLabel: m['signup.buttons.create_account'](),
      loadingLabel: m['signup.buttons.creating_account'](),
      requiredFields: ['username', 'password'] as const,
    },
  ];

  let cloudflareToken = $state('');
  let step = $state(1);
  let isLoading = $state(false);
  let hasStepError = $state(true);

  let canResend = $state(false);
  let resendTimer = $state(30);
  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
  let msaId = $state<string | undefined>(undefined);

  let identifier = $state('');
  let identType = $state(UserIdentType.email);

  let timerInterval: ReturnType<typeof setInterval>;
  const DEBOUNCE_DELAY = 500; // ms
  const RESEND_TIMER_DURATION = 30; // s

  const debouncedFormValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      const requiredFields = steps[step - 1].requiredFields;

      const missingRequiredFields = requiredFields.some(
        (field) => !$formData[field] || $formData[field].trim() === '',
      );

      if (missingRequiredFields) {
        hasStepError = true;
        return;
      }

      // Validate the identifier
      const result = await validateForm({ update: true, focusOnError: false });
      isLoading = true;

      // Check availability if needed
      if (step === 1 || step === 3) {
        const availability = await checkIdentAvailability();
        hasStepError = !availability || !result.valid;
      } else if (step === 2) {
        // For OTP verification step, only check if the form is valid
        hasStepError = !result.valid || !$formData.token || $formData.token.length < 6;
      }
    } catch (error) {
      console.error('Error debouncing the form input:', error);
    } finally {
      isLoading = false;
    }
  });

  const getCurrentValidator = () => steps[step - 1].schema;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    validationMethod: 'submit-only',
    async onChange() {
      debouncedFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel(); // Avoid the server-side form action
      await handleFormSubmit();
    },
  });

  const { form: formData, errors, enhance, delayed, validateForm, options } = form;

  const updateFormErrors = (field: keyof SignUpFormSchema, message: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  const handleFormSubmit = async () => {
    const result = await validateForm({ update: true, focusOnError: true });
    if (!result.valid) {
      hasStepError = true;
      return;
    }

    switch (step) {
      case 1:
        await registerNewEmail();
        break;
      case 2:
        await verifyEmailToken();
        break;
      case 3:
        await createCredentials();
        break;
    }
  };

  const startResendTimer = () => {
    resendTimer = RESEND_TIMER_DURATION;
    canResend = false;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      resendTimer -= 1;
      if (resendTimer <= 0) {
        clearInterval(timerInterval);
        canResend = true;
      }
    }, 1000);
  };

  const setStep = (newStep: number) => {
    step = newStep;
    hasStepError = true; // Disable button initially when step changes
  };

  const getCurrentStepDescription = (): string => {
    const description = steps[step - 1].description;
    return step === 2
      ? m['signup.verification_description']({ email: $formData.email || '' })
      : description;
  };

  const checkIdentAvailability = async (): Promise<boolean> => {
    isLoading = true;

    if (step === 1) {
      identifier = $formData.email || '';
      if (!identifier) return false;
      identType = UserIdentType.email;

      const validationResult = emailSchema.safeParse($formData.email);
      if (!validationResult.success) return false;
    } else if (step === 3) {
      identifier = $formData.username || '';
      if (!identifier) return false;
      identType = UserIdentType.userHandle;

      if (identifier === myUserContext.myUserHandle) return true;

      const validationResult = usernameSchema.safeParse($formData.username);
      if (!validationResult.success) return false;
    }

    const fieldName = identType === UserIdentType.email ? 'email' : 'username';
    const message =
      identType === UserIdentType.email
        ? m['signup.errors.email_unavailable']()
        : m['signup.errors.username_unavailable']();

    try {
      const response = await myUserContext.isUserIdentAvailable(identifier, identType);

      if (response.error) {
        updateFormErrors(step === 1 ? 'email' : 'username', response.error);
        return false;
      }

      if (!response.isAvailable) {
        updateFormErrors(fieldName, message);
        return false;
      }

      return response.isAvailable;
    } catch (error) {
      console.error('SignUpForm.checkIdentAvailability:', { error });
      updateFormErrors(fieldName, translate(AppUiMessage.systemError));
      return false;
    } finally {
      isLoading = false;
    }
  };

  const setupOtpMsaHandler = (
    msaVerificationResponse: QueryResult<MultiStepActionProgressResult>,
  ) => {
    const msaId = msaVerificationResponse.object?.actionProgress?.actionId || '';

    const onNotificationSent = () => {
      setStep(2);
      isLoading = false;
    };

    const onFailure = () => {
      console.error('onFailure');
      isLoading = false;
    };

    const onSuccess = async () => {
      try {
        await myUserContext.updateMyUser({ isEmailVerified: true });
      } catch (error) {
        console.error('SignUpForm.setupOtpMsaHandler error updating verification:', { error });
      }
      if (!myUserContext.myUser?.passwordUpdatedAt) {
        setStep(3);
      } else {
        // If this user already has a password, consider their onboarding complete
        await goto('/');
      }
      isLoading = false;
    };

    return {
      msaId,
      handler: new MsaListenerHandler(
        'SignUpForm',
        msaVerificationResponse,
        onNotificationSent,
        onFailure,
        onSuccess,
      ),
    };
  };

  const registerNewEmail = async () => {
    isLoading = true;

    if (!$formData.email) {
      validateForm({ update: true });
      return;
    }

    try {
      const signUpResponse = await myUserContext.signUpUser($formData.email);

      if (signUpResponse !== true) {
        console.error('SignUpForm.registerNewEmail: signUpUser failed.', { signUpResponse });
        updateFormErrors('email', signUpResponse);
        return;
      }

      const verificationResponse = await myUserContext.verifyMyEmail($formData.email);

      if (
        !verificationResponse ||
        verificationResponse?.error ||
        !verificationResponse.object ||
        verificationResponse.object.error ||
        !verificationResponse?.object.actionProgress?.actionId ||
        !verificationResponse?.object.run
      ) {
        console.error('SignUpForm.onEmailSubmit: verifyMyEmail failed.', { verificationResponse });
        updateFormErrors('email', translate(AppUiMessage.systemError));
        return;
      }

      startResendTimer();

      const { msaId: newMsaId, handler } = setupOtpMsaHandler(verificationResponse);
      msaId = newMsaId;
      otpHandler = handler;
    } catch (error) {
      console.error('SignUpForm.registerNewEmail:', { error });
      updateFormErrors('email', translate(AppUiMessage.systemError));
    } finally {
      isLoading = true; // Leave the button in a processing state until sent event
    }
  };

  const verifyEmailToken = async (): Promise<void> => {
    try {
      if (!msaId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        updateFormErrors('token', translate(AppUiMessage.systemError));
        return;
      }

      isLoading = true;

      const response = await myUserContext.verifyMultiStepActionToken(msaId, $formData.token || '');

      if (response !== true) {
        console.error('SignUpForm.handleVerifyOtp: invalid response:', { result: response });
        updateFormErrors('token', translate(AppUiMessage.systemError));
        return;
      }

      try {
        await getSuggestedUsername();
      } catch (error) {
        console.error('SignUpForm.getSuggestedUsername: error:', { error });
        updateFormErrors('token', translate(AppUiMessage.systemError));
      }
    } catch (error) {
      console.error('SignUpForm.handleVerifyOtp: error:', { error });
      updateFormErrors('token', translate(AppUiMessage.systemError));
    } finally {
      isLoading = true; // Leave the button in a processing state until success event
    }
  };

  const resendToken = async () => {
    if (!msaId) {
      console.error('SignUpForm.handleResendOtp: actionId missing.');
      updateFormErrors('token', translate(AppUiMessage.systemError));
      return;
    }

    try {
      isLoading = true;

      const response = await myUserContext.sendMultiStepActionNotification(msaId, $formData.email);

      if (typeof response === 'string') {
        console.error('SignInForm.handleResendOtp: error:', { error: response });
        updateFormErrors('token', response);
        return;
      }

      startResendTimer();
    } catch (error) {
      console.error('SignUpForm.resendToken: error:', { error });
      updateFormErrors('token', translate(AppUiMessage.systemError));
    } finally {
      isLoading = false;
    }
  };

  const getSuggestedUsername = async () => {
    if (!$formData.email) return;

    try {
      isLoading = true;
      const result = await myUserContext.findAvailableUserHandle($formData.email);

      if (result && typeof result === 'object' && 'object' in result) {
        $formData.username = result.object ?? '';
      } else if (typeof result === 'string') {
        $formData.username = result;
      }
    } catch (error) {
      console.error('Error getting suggested handle:', error);
    } finally {
      isLoading = false;
    }
  };

  const createCredentials = async () => {
    isLoading = true;

    if (!$formData.password) return;

    try {
      const { error } = await myUserContext.updateMyUser({
        userHandle: $formData.username,
        newPassword: $formData.password,
      });

      if (error) {
        updateFormErrors('password', error);
        return;
      }

      await goto('/');
    } catch (error) {
      console.error('SignUpForm.createCredentials: error:', { error });
      updateFormErrors('password', translate(AppUiMessage.systemError));
    } finally {
      isLoading = false;
    }
  };

  $effect(() => {
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

  onMount(async () => {
    const stepParam = page.url.searchParams.get('step');
    if (stepParam) {
      const targetStep = parseInt(stepParam, 10);

      if (!isNaN(targetStep) && targetStep > 1 && targetStep <= steps.length) {
        setStep(targetStep);

        identifier = step === 2 ? myUserContext.myEmail || '' : myUserContext.myUserHandle || '';
        $formData = {
          email: myUserContext.myEmail || '',
          token: '',
          username: myUserContext.myUserHandle || '',
          password: '',
        };

        if (targetStep === 2) {
          try {
            const verificationResponse = await myUserContext.verifyMyEmail($formData.email);
            const { msaId: newMsaId, handler } = setupOtpMsaHandler(verificationResponse);
            msaId = newMsaId;
            otpHandler = handler;
          } catch (error) {
            console.error('SignUpForm.registerNewEmail:', { error });
            updateFormErrors('email', translate(AppUiMessage.systemError));
          }
        }
      }
    }
  });

  onDestroy(() => {
    clearInterval(timerInterval);

    if (otpHandler) {
      otpHandler.removeListener();
    }

    // Cancel the debounced function
    debouncedFormValidation.cancel();
  });
</script>

<form method="POST" id="sign-up-form" use:enhance>
  <AuthCard title={m['signup.title']()} description={getCurrentStepDescription()}>
    <div class="space-y-4">
      {#if step === 1}
        <IdentFormInput
          {form}
          fieldName="email"
          placeholder={m['signup.email_placeholder']()}
          label={m['signup.email_title']()}
        />
        <div
          use:turnstile
          turnstile-sitekey={env.PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
          turnstile-theme="auto"
          turnstile-size="flexible"
          turnstile-language={getLocale()}
          turnstile-response-field-name="turnstile"
          turnstile-response-field
          onturnstile={(e) => (cloudflareToken = e.detail.token)}
        ></div>
      {:else if step === 2}
        <OTPFormInput
          {form}
          fieldName="token"
          label={m['verify_token.verification_code']()}
          length={6}
          showResend={true}
          {canResend}
          {resendTimer}
          onResendClick={resendToken}
        />
      {:else if step === 3}
        <IdentFormInput
          {form}
          fieldName="username"
          placeholder={m['signup.username_placeholder']()}
          label={m['signup.username']()}
          {identType}
          suggestUsername={getSuggestedUsername}
          {isLoading}
        />
        <PasswordFormInput
          {form}
          fieldName="password"
          label={m['signup.password']()}
          placeholder={m['signup.password_placeholder']()}
        />
      {/if}
      <FormButton
        disabled={$delayed || isLoading || hasStepError || cloudflareToken === ''}
        isLoading={$delayed || isLoading}
        buttonText={steps[step - 1].buttonLabel}
        loadingText={steps[step - 1].loadingLabel}
      />
      <div class="mt-4 text-center text-sm">
        {m['signup.buttons.have_account']()}
        <a href="/signin" class="underline">{m['signup.buttons.sign_in']()} </a>
      </div>
    </div></AuthCard
  >

  <!-- commenting as per the issue : https://github.com/baragaun/first-spark-app/issues/113 -->
  <!-- <div class="mt-4"><SuperDebug data={$formData} /></div> -->
  <!-- <div class="mt-4"><SuperDebug data={errors} /></div> -->
</form>
