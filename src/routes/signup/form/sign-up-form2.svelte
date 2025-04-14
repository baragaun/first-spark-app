<script lang="ts">
  import { beforeNavigate, goto } from '$app/navigation';
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
    type SignInFormSchema,
  } from './schema';
  import FormUpdatePasswordInput from '@/components/forms/form-update-password-input.svelte';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';

  let { data }: { data: { form: SuperValidated<SignInFormSchema> } } = $props();

  const steps = [zod(schemaFirstStep), zod(schemaSecondStep), zod(schemaLastStep)];
  let step = $state(1);

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
  let otpHandler: MsaListenerHandler | undefined = $state(undefined);

  const getCurrentValidator = () => steps[step - 1];

  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 350; // ms

  $effect(() => {
    if (otpHandler) {
      errorMessage = otpHandler.errorMessage;
      message = otpHandler.message;
    }
  });

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
          await validateForm({ update: true, focusOnError: false });

          if (step === 1) {
            hasStepError = !(await checkIdentAvailability());
            const emailValidationResult = emailSchema.safeParse($formData.email);
          } else if (step === 2) {
          } else if (step === 3) {
            hasStepError = !(await checkIdentAvailability());
            const usernameValidationResult = usernameSchema.safeParse($formData.username);
          }

          // hasStepError = !result.valid;
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
        await registerNewEmail();
        step = 2;
      } else if (step === 2) {
        await verifyEmailToken($formData.token);
      } else if (step === 3) {
        await createCredentials();
      }

      return;
    },
  });

  const { form: formData, errors, enhance, delayed, validateForm, options } = form;

  const startResendTimer = () => {
    resendTimer = 30;
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
    loading = true;
    errorMessage = '';
    let schemaValdationResult;

    if (step === 1) {
      identifier = $formData.email;
      if (!identifier) return false;
      identType = UserIdentType.email;
      schemaValdationResult = emailSchema.safeParse($formData.email);
    } else if (step === 3) {
      identifier = $formData.username;
      if (!identifier) return false;
      identType = UserIdentType.userHandle;
      schemaValdationResult = usernameSchema.safeParse($formData.username);
    }

    if (schemaValdationResult && schemaValdationResult.success) {
      try {
        const response = await myUserContext.isUserIdentAvailable(identifier, identType);

        if (response.error) {
          errorMessage = response.error;
          return false;
        } else if (!response.isAvailable) {
          if (identType === UserIdentType.email) {
            errorMessage = 'This email is currently unavailable for use.';
            form.errors.update((errors) => ({
              ...errors,
              email: [errorMessage],
            }));
          } else {
            errorMessage = 'This username is currently unavailable for use.';
            form.errors.update((errors) => ({
              ...errors,
              username: [errorMessage],
            }));
          }
          return false;
        } else {
          return response.isAvailable;
        }
      } catch (error) {
        console.error('SignUpForm.createCredentials: error:', { error });
        errorMessage = translate(AppUiMessage.systemError);
        return false;
      } finally {
        loading = false;
      }
    } else {
      return false;
    }
  };

  const registerNewEmail = async () => {
    loading = true;
    errorMessage = '';

    if (!$formData.email) {
      validateForm({ update: true });
      return;
    }

    try {
      const signUpResponse = await myUserContext.signUpUser($formData.email);

      if (signUpResponse !== true) {
        console.error('SignUpForm.registerNewEmail: signUpUser failed.', { signUpResponse });
        errorMessage = signUpResponse; // <-- might have to translate this
        return;
      }

      const response = await myUserContext.verifyMyEmail($formData.email);

      if (
        !response ||
        response?.error ||
        !response.object ||
        response.object.error ||
        !response?.object.actionProgress?.actionId ||
        !response?.object.run
      ) {
        console.error('SignUpForm.onEmailSubmit: verifyMyEmail failed.', { response });
        errorMessage = response.error || AppUiMessage.systemError;
        return;
      }

      // We advance instead of waiting for the poll to come back with a `sent` status
      step = 2;
      startResendTimer();

      mfaActionId = response.object.actionProgress.actionId;
      otpHandler = new MsaListenerHandler('SignUpForm', response, () => {
        step = 3;
      });

      return;
    } catch (error) {
      console.error('SignUpForm.registerNewEmail:', { error });
      tokenStatus = MsaTokenStatus.verificationFailed;
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      loading = false;
    }
  };

  const verifyEmailToken = async (token: string): Promise<void> => {
    try {
      if (!mfaActionId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        errorMessage = translate(AppUiMessage.systemError);
        return;
      }

      loading = true;
      errorMessage = '';

      const response = await myUserContext.verifyMultiStepActionToken(mfaActionId, token);

      if (response !== true) {
        console.error('SignUpForm.handleVerifyOtp: invalid response:', { result: response });
        errorMessage = translate(AppUiMessage.systemError);
        tokenStatus = MsaTokenStatus.unset;
        return;
      }

      tokenStatus = MsaTokenStatus.sending;
    } catch (error) {
      console.error('SignIUpForm.handleVerifyOtp: error:', { error });
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

    try {
      loading = true;
      errorMessage = '';

      const response = await myUserContext.sendMultiStepActionNotification(
        mfaActionId,
        $formData.email,
      );

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

  const createCredentials = async () => {
    loading = true;
    errorMessage = '';

    if (!$formData.username || !$formData.password) return;

    try {
      const { error } = await myUserContext.updateMyUser({
        userHandle: $formData.username,
        newPassword: $formData.password,
      });

      if (error) {
        errorMessage = error;
        return;
      }

      await goto('/');
    } catch (error) {
      console.error('SignUpForm.createCredentials: error:', { error });
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

  beforeNavigate(() => {
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
      isValidating = false;
      return;
    }

    options.validators = getCurrentValidator();
  });

  const getCurrentStepDescription = () => {
    switch (step) {
      case 1:
        return 'Enter an email address below create a First Spark account.';
      case 2:
        return `Enter the verification code sent to ${$formData.email}`;
      case 3:
        return 'Choose a username and a password.';
    }
  };

  const getCurrentButtonLabel = () => {
    switch (step) {
      case 1:
        return 'Continue';
      case 2:
        return 'Verify my email';
      case 3:
        return 'Create Account';
    }
  };

  const onBack = () => {
    if (otpHandler) {
      otpHandler.removeListener();
      otpHandler = undefined;
    }

    if (step > 1) {
      step = step - 1;
    }
  };
</script>

<form method="POST" id="sign-up-form" use:enhance>
  <AuthCard
    title="Sign up"
    description={getCurrentStepDescription()}
    showBackButton={step > 1}
    {onBack}
  >
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
        buttonText={getCurrentButtonLabel()}
        loadingText="Processing..."
      />
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <a href="/signup" class="underline"> Sign up </a>
      </div>
    </div></AuthCard
  >

  <div class="mt-4"><SuperDebug data={$formData} /></div>
  <div class="mt-4"><SuperDebug data={errors} /> {errorMessage}</div>
</form>
