<script lang="ts">
  import { goto } from '$app/navigation';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import translate from '@/helpers/language/translate';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  import IdentInputComponent from '@/components/forms/form-ident-input.svelte';
  import OTPInputComponent from '@/components/forms/form-otp-input.svelte';
  import FormButtonComponent from '@/components/forms/form-button.svelte';
  import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { onDestroy } from 'svelte';
  import AuthCard from '@/components/auth-card.svelte';
  import {
    emailSchema,
    schemaFirstStep,
    schemaLastStep,
    schemaSecondStep,
    usernameSchema,
    type SignUpFormSchema,
  } from './schema';
  import FormUpdatePasswordInput from '@/components/forms/form-update-password-input.svelte';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';

  let { data }: { data: { form: SuperValidated<SignUpFormSchema> } } = $props();

  const steps = [
    { schema: zod(schemaFirstStep), description: 'Enter an email address below create a First Spark account.' },
    { schema: zod(schemaSecondStep), description: 'Enter the verification code we sent to {email}' },
    { schema: zod(schemaLastStep), description: 'Choose a username and a password for your account.' }
  ];


  let step = $state(1);

  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
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
  let timerInterval: ReturnType<typeof setInterval>;


  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 350; // ms
  const RESEND_TIMER_DURATION = 30; // s

  const getCurrentValidator = () => steps[step - 1].schema;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    async onChange() {
      debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel(); // Avoid the server-side validation form action
      await handleFormSubmit();
    },
  });

  const { form: formData, errors, enhance, delayed, validateForm, options } = form;

  function getCurrentStepDescription() {
    const description = steps[step - 1].description;
    return step === 2 ? description.replace('{email}', $formData.email) : description;
  }

  function updateErrorMessage(message: string, field: keyof SignUpFormSchema) {
    errorMessage = message;
    if (message) {
      errors.update((errors) => ({
        ...errors,
        [field]: [message],
      }));
    }
  }

  async function debounceFormValidation() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (!$formData) return;

    isValidating = true;

    debounceTimer = window.setTimeout(async () => {
      try {
        await validateForm({ update: true });

        if (step === 1 || step === 3) {
          hasStepError = !(await checkIdentAvailability());
        }
      } catch (error) {
        console.error('Error validating form:', error);
      } finally {
        isValidating = false;
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  };

  async function handleFormSubmit() {
    const result = await validateForm({ update: true, focusOnError: true });
    if (!result.valid) {
      hasStepError = true;
      return;
    }

    switch (step) {
      case 1: await registerNewEmail(); break;
      case 2: await verifyEmailToken(); break; 
      case 3: await createCredentials(); break;
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

  async function checkIdentAvailability(): Promise<boolean> {
    loading = true;
    updateErrorMessage('', step === 1 ? 'email' : 'username');

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

    try {
      const response = await myUserContext.isUserIdentAvailable(identifier, identType);

      if (response.error) {
        updateErrorMessage(response.error, step === 1 ? 'email' : 'username');
        return false;
      } 
      
      if (!response.isAvailable) {
        const fieldName = identType === UserIdentType.email ? 'email' : 'username';
        const message = `This ${fieldName} is currently unavailable for use.`;
        updateErrorMessage(message, fieldName);
        return false;
      }
      
      return response.isAvailable;
    } catch (error) {
      console.error('SignUpForm.checkIdentAvailability:', { error });
      updateErrorMessage(translate(AppUiMessage.systemError), step === 1 ? 'email' : 'username');
      return false;
    } finally {
      loading = false;
    }
  }

  const registerNewEmail = async () => {
    loading = true;
    updateErrorMessage('', 'email');

    if (!$formData.email) {
      validateForm({ update: true });
      return;
    }

    try {
      const signUpResponse = await myUserContext.signUpUser($formData.email);

      if (signUpResponse !== true) {
        console.error('SignUpForm.registerNewEmail: signUpUser failed.', { signUpResponse });
        updateErrorMessage(signUpResponse, 'email');
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
        updateErrorMessage(translate(AppUiMessage.systemError), 'email');
        return;
      }

      startResendTimer();

      mfaActionId = verificationResponse.object.actionProgress.actionId;
      const onNotificationSent = () => { step = 2; };
      const onFailure = () => { console.error('onFailure'); };
      const onSuccess = async () => { step = 3; };

      otpHandler = new MsaListenerHandler(
        'SignUpForm', 
        verificationResponse, 
        onNotificationSent, 
        onFailure, 
        onSuccess
      );

    } catch (error) {
      console.error('SignUpForm.registerNewEmail:', { error });
      tokenStatus = MsaTokenStatus.verificationFailed;
      updateErrorMessage(translate(AppUiMessage.systemError), 'email');
    } finally {
      loading = false;
    }
  };

  const verifyEmailToken = async (): Promise<void> => {
    try {
      if (!mfaActionId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        updateErrorMessage(translate(AppUiMessage.systemError), 'token');
        return;
      }

      loading = true;
      errorMessage = '';

      const response = await myUserContext.verifyMultiStepActionToken(mfaActionId, $formData.token);

      if (response !== true) {
        console.error('SignUpForm.handleVerifyOtp: invalid response:', { result: response });
        updateErrorMessage(translate(AppUiMessage.systemError), 'token');
        tokenStatus = MsaTokenStatus.unset;
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
      
      try {
        await getSuggestedUsername();
      } catch (error) {
        console.error('SignUpForm.getSuggestedUsername: error:', { error });  
        updateErrorMessage(translate(AppUiMessage.systemError), 'token');
      }

    } catch (error) {
      console.error('SignUpForm.handleVerifyOtp: error:', { error });
      updateErrorMessage(translate(AppUiMessage.systemError), 'token');
      tokenStatus = MsaTokenStatus.unset;
    } finally {
      loading = false;
    }
  };

  const resendToken = async () => {
    tokenStatus = MsaTokenStatus.unset;

    if (!mfaActionId) {
      console.error('SignUpForm.handleResendOtp: actionId missing.');
      updateErrorMessage(translate(AppUiMessage.systemError), 'token');
      return;
    }

    try {
      loading = true;
      updateErrorMessage('', 'token');

      const response = await myUserContext.sendMultiStepActionNotification(
        mfaActionId,
        $formData.email,
      );

      if (typeof response === 'string') {
        console.error('SignInForm.handleResendOtp: error:', { error: response });
        updateErrorMessage(response, 'token');
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
      startResendTimer();
    } catch (error) {
      console.error('SignUpForm.resendToken: error:', { error });
      updateErrorMessage(translate(AppUiMessage.systemError), 'token');
    } finally {
      loading = false;
    }
  };

  const getSuggestedUsername = async () => {
    if (!$formData.email) return;

    if (myUserContext.myUserHandle) {
      $formData.username = myUserContext.myUserHandle;
      return;
    }

    try {
      loading = true;
      const result = await myUserContext.findAvailableUserHandle($formData.email);
      if (typeof result === 'string') {
        $formData.username = result;
      }
    } catch (error) {
      console.error('Error getting suggested handle:', error);
    } finally {
      loading = false;
    }
  };

  const createCredentials = async () => {
    loading = true;
    updateErrorMessage('', 'password');

    if (!$formData.password) return;

    try {
      const { error } = await myUserContext.updateMyUser({
        userHandle: $formData.username,
        newPassword: $formData.password,
      });

      if (error) {
        errorMessage = error;
        updateErrorMessage(error, 'password');
        return;
      }

      await goto('/');
    } catch (error) {
      console.error('SignUpForm.createCredentials: error:', { error });
      updateErrorMessage(translate(AppUiMessage.systemError), 'password');
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
      isValidating = false;
      return;
    }

    if (otpHandler) {
      const currentErrorMessage = otpHandler.getErrorMessage();
      if (currentErrorMessage) {
        updateErrorMessage(currentErrorMessage, 'token')
      }
    }

    options.validators = getCurrentValidator();
  });
</script>

<form method="POST" id="sign-up-form" use:enhance>
  <AuthCard title="Sign up" description={getCurrentStepDescription()}>
    <div class="space-y-4">
      {#if step === 1}
        <!-- TODO: this should be called identinput -->
        <IdentInputComponent
          {form}
          fieldName="email"
          placeholder="e.g. 'student@example.com'"
          label="Email address"
        />
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
      {:else if step === 3}
        <IdentInputComponent
          {form}
          fieldName="username"
          placeholder="e.g. 'giraffe08'"
          label="Username"
        />
        <FormUpdatePasswordInput
          {form}
          fieldName="password"
          label="Password"
          placeholder="Enter your password"
        />
      {/if}
      <FormButtonComponent
        disabled={$delayed || isValidating || hasStepError}
        loading={$delayed}
        buttonText="Sign Up"
        loadingText="Signing up..."
      />
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <a href="/signup" class="underline"> Sign up </a>
      </div>
    </div></AuthCard
  >

  <div class="mt-4"><SuperDebug data={$formData} /></div>
  <div class="mt-4"><SuperDebug data={errors} /></div>
</form>
