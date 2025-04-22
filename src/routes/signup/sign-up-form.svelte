<script lang="ts">
  import { goto } from '$app/navigation';
  import AuthCard from '@/components/auth-card.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import OTPFormInput from '@/components/forms/form-otp-input.svelte';
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage } from '@/types/enums';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { onDestroy } from 'svelte';
  import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import {
    emailSchema,
    schemaFirstStep,
    schemaLastStep,
    schemaSecondStep,
    usernameSchema,
    type SignUpFormSchema,
  } from './schema';

  let { data }: { data: { form: SuperValidated<SignUpFormSchema> } } = $props();

  const steps = [
    {
      schema: zod(schemaFirstStep),
      description: 'Provide an email address to create your First Spark account.',
      buttonLabel: 'Sign up',
      description: 'Provide an email address to create your First Spark account.',
      buttonLabel: 'Sign up',
    },
    {
      schema: zod(schemaSecondStep),
      description: `Enter the verification code we sent to {email}.`,
      buttonLabel: 'Submit',
    },
    {
      schema: zod(schemaLastStep),
      description: 'Choose a username and a password for your account.',
      buttonLabel: 'Sign Up',
      buttonLabel: 'Sign Up',
    },
  ];

  const getCurrentStepDescription = (): string => {
    const description = steps[step - 1].description;
    return step === 2 ? description.replace('{email}', $formData.email) : description;
  };

  let step = $state(1);
  let isLoading = $state(false);
  let hasStepError = $state(true); // Start with a disabled state

  let canResend = $state(false);
  let resendTimer = $state(30);
  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
  let msaId = $state<string | undefined>(undefined);
  let msaStatus = $state(MsaTokenStatus.unset);

  let identifier = $state('');
  let identType = $state(UserIdentType.email);

  let timerInterval: ReturnType<typeof setInterval>;
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 500; // ms
  const RESEND_TIMER_DURATION = 30; // s

  const getCurrentValidator = () => steps[step - 1].schema;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    validationMethod: 'submit-only',
    validationMethod: 'submit-only',
    async onChange() {
      debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel(); // Avoid the server-side form action
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

  const debounceFormValidation = async () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (!$formData) return;

    debounceTimer = window.setTimeout(async () => {
      try {
        // Validate the identifier
        const result = await validateForm({ update: true, focusOnError: false });
        isLoading = true;

        // Check availability if needed
        if (step === 1 || step === 3) {
          const availability = await checkIdentAvailability();
          hasStepError = !availability || !result.valid;
        }
      } catch (error) {
        console.error('Error debouncing the form input:', error);
        console.error('Error debouncing the form input:', error);
      } finally {
        isLoading = false;
        isLoading = false;
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  };

  const handleFormSubmit = async () => {
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

  const checkIdentAvailability = async (): Promise<boolean> => {
    isLoading = true;
  const checkIdentAvailability = async (): Promise<boolean> => {
    isLoading = true;

    if (step === 1) {
      identifier = $formData.email;
      if (!identifier) return false;
      identType = UserIdentType.email;
      const validationResult = emailSchema.safeParse($formData.email);
      if (!validationResult.success) return false;
    } else if (step === 3) {
      identifier = $formData.username;
      if (!identifier) return false;
      identType = UserIdentType.userHandle;

      if (identifier === myUserContext.myUserHandle) return true;
      const validationResult = usernameSchema.safeParse($formData.username);
      if (!validationResult.success) return false;
    }

    const fieldName = identType === UserIdentType.email ? 'email' : 'username';
    const message = `This ${fieldName} is currently unavailable for use.`;

    const fieldName = identType === UserIdentType.email ? 'email' : 'username';
    const message = `This ${fieldName} is currently unavailable for use.`;

    try {
      const response = await myUserContext.isUserIdentAvailable(identifier, identType);

      if (response.error) {
        updateFormErrors(step === 1 ? 'email' : 'username', response.error);
        updateFormErrors(step === 1 ? 'email' : 'username', response.error);
        return false;
      }

      if (!response.isAvailable) {
        updateFormErrors(fieldName, message);
        updateFormErrors(fieldName, message);
        return false;
      }

      return response.isAvailable;
    } catch (error) {
      console.error('SignUpForm.checkIdentAvailability:', { error });
      updateFormErrors(fieldName, translate(AppUiMessage.systemError));
      updateFormErrors(fieldName, translate(AppUiMessage.systemError));
      return false;
    } finally {
      isLoading = false;
      isLoading = false;
    }
  };

  const registerNewEmail = async () => {
    isLoading = true;
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
        updateFormErrors('email', translate(AppUiMessage.systemError));
        return;
      }

      startResendTimer();

      msaId = verificationResponse.object.actionProgress.actionId;
      msaId = verificationResponse.object.actionProgress.actionId;
      const onNotificationSent = () => {
        step = 2;
        isLoading = false;
        isLoading = false;
      };
      const onFailure = () => {
        console.error('onFailure');
        isLoading = false;
        isLoading = false;
      };
      const onSuccess = async () => {
        step = 3;
        isLoading = false;
        isLoading = false;
      };

      otpHandler = new MsaListenerHandler(
        'SignUpForm',
        verificationResponse,
        onNotificationSent,
        onFailure,
        onSuccess,
      );
    } catch (error) {
      console.error('SignUpForm.registerNewEmail:', { error });
      msaStatus = MsaTokenStatus.verificationFailed;
      updateFormErrors('email', translate(AppUiMessage.systemError));
    } finally {
      // isLoading = false;  // Leave the button in a processing state until sent event
    }
  };

  const verifyEmailToken = async (): Promise<void> => {
    try {
      if (!msaId) {
      if (!msaId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        updateFormErrors('token', translate(AppUiMessage.systemError));
        updateFormErrors('token', translate(AppUiMessage.systemError));
        return;
      }

      updateFormErrors('token', '');
      isLoading = true;

      const response = await myUserContext.verifyMultiStepActionToken(msaId, $formData.token);
      const response = await myUserContext.verifyMultiStepActionToken(msaId, $formData.token);

      if (response !== true) {
        console.error('SignUpForm.handleVerifyOtp: invalid response:', { result: response });
        updateFormErrors('token', translate(AppUiMessage.systemError));
        msaStatus = MsaTokenStatus.unset;
        return;
      }

      msaStatus = MsaTokenStatus.sending;

      try {
        await getSuggestedUsername();
      } catch (error) {
        console.error('SignUpForm.getSuggestedUsername: error:', { error });
        updateFormErrors('token', translate(AppUiMessage.systemError));
        updateFormErrors('token', translate(AppUiMessage.systemError));
      }
    } catch (error) {
      console.error('SignUpForm.handleVerifyOtp: error:', { error });
      updateFormErrors('token', translate(AppUiMessage.systemError));
      msaStatus = MsaTokenStatus.unset;
    } finally {
      // isLoading = false;  // Leave the button in a processing state until success event
    }
  };

  const resendToken = async () => {
    msaStatus = MsaTokenStatus.unset;

    if (!msaId) {
      console.error('SignUpForm.handleResendOtp: actionId missing.');
      updateFormErrors('token', translate(AppUiMessage.systemError));
      updateFormErrors('token', translate(AppUiMessage.systemError));
      return;
    }

    try {
      isLoading = true;
      isLoading = true;

      const response = await myUserContext.sendMultiStepActionNotification(msaId, $formData.email);

      if (typeof response === 'string') {
        console.error('SignInForm.handleResendOtp: error:', { error: response });
        updateFormErrors('token', response);
        updateFormErrors('token', response);
        return;
      }

      msaStatus = MsaTokenStatus.sending;
      startResendTimer();
    } catch (error) {
      console.error('SignUpForm.resendToken: error:', { error });
      updateFormErrors('token', translate(AppUiMessage.systemError));
      updateFormErrors('token', translate(AppUiMessage.systemError));
    } finally {
      isLoading = false;
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
    // Clear any remaining token errors
    updateFormErrors('token', '');

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

  onDestroy(() => {
    clearInterval(timerInterval);
    if (otpHandler) otpHandler.removeListener();
  });
</script>

<form method="POST" id="sign-up-form" use:enhance>
  <AuthCard title="Sign up" description={getCurrentStepDescription()}>
    <div class="space-y-4">
      {#if step === 1}
        <!-- TODO: this should be called identinput -->
        <IdentFormInput
          {form}
          fieldName="email"
          placeholder="e.g. 'student@example.com'"
          label="Email address"
        />
      {:else if step === 2}
        <OTPFormInput
          {form}
          fieldName="token"
          label="Verification code"
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
          placeholder="e.g. 'giraffe08'"
          label="Username"
          {identType}
          suggestUsername={getSuggestedUsername}
          {isLoading}
        />
        <PasswordFormInput
          {form}
          fieldName="password"
          label="Password"
          placeholder="Enter your password"
        />
      {/if}
      <FormButton
        disabled={$delayed || isLoading || hasStepError}
        loading={$delayed || isLoading}
        buttonText="Sign Up"
        loadingText={steps[step - 1].buttonLabel}
        loadingText={steps[step - 1].buttonLabel}
      />
      <div class="mt-4 text-center text-sm">
        Do you already have an account?
        <a href="/signin" class="underline"> Sign in </a>
      </div>
    </div></AuthCard
  >
  <div class="mt-4"><SuperDebug data={$formData} /></div>
  <div class="mt-4"><SuperDebug data={errors} /></div>
</form>
