<script lang="ts">
  import FormButton from '@/components/forms/form-button.svelte';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import OTPFormInput from '@/components/forms/form-otp-input.svelte';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { MyUserContext } from '@/contexts/users/my-user-context.svelte';
  import translate from '@/helpers/language/translate';
  import { m } from '@/paraglide/messages';
  import { AppUiMessage } from '@/types/enums';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { getContext, onDestroy } from 'svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { debounce } from 'throttle-debounce';
  import {
    emailFormSchemaFirstStep,
    emailFormSchemaLastStep,
    type EmailFormSchema,
  } from '../../(data)/schema';

  let {
    preValidatedForm,
    onClose,
  }: {
    preValidatedForm: SuperValidated<EmailFormSchema>;
    onClose?: () => void;
  } = $props();

  const userContext = getContext<MyUserContext>('myUserContext');
  const currentEmail = $derived(userContext.myEmail);

  let step = $state(1);
  let isLoading = $state(false);
  let awaitingTokenVerification = $state(false);
  let isSuccess = $state(false);
  let hasStepError = $state(true);

  let canResend = $state(false);
  let resendTimer = $state(30);
  let timerInterval: ReturnType<typeof setInterval>;
  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
  let msaId = $state<string | undefined>(undefined);

  const RESEND_TIMER_DURATION = 30; // s
  const DEBOUNCE_DELAY = 500;
  const tokenFieldName = 'token';
  const emailFieldName = 'email';

  const steps = [zod(emailFormSchemaFirstStep), zod(emailFormSchemaLastStep)];
  const getCurrentValidator = () => steps[step - 1];

  // Replace setTimeout/clearTimeout with debounce
  const debounceFormValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      const validationResult = await validateForm({ update: true, focusOnError: false });
      if (validationResult.valid && step === 1) {
        const available = await checkIdentAvailability();
        hasStepError = !available;
      } else {
        hasStepError = !validationResult.valid;
      }
    } catch (error) {
      console.error('Error validating form input:', error);
    }
  });

  const form = superForm(preValidatedForm, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: true,
    validationMethod: 'submit-only',
    async onChange() {
      debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      if (step === 1) {
        await registerNewEmail();
      } else {
        await verifyEmailToken();
      }
    },
  });

  const { form: formData, enhance, errors, options, delayed, validateForm } = form;

  const buttonText = $derived(
    step === 1 ? m['setting.buttons.update']() : m['setting.buttons.verify'](),
  );
  const loadingText = $derived(
    step === 1 ? m['setting.buttons.updating']() : m['setting.buttons.verifying'](),
  );
  const disabled = $derived(isLoading || $delayed || hasStepError);

  const updateFormErrors = (field: keyof EmailFormSchema, message: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  const checkIdentAvailability = async (): Promise<boolean> => {
    if (!$formData.email) return false;

    if ($formData.email === currentEmail) {
      updateFormErrors(emailFieldName, m['setting.email.error.existing']());
      return false;
    }

    const message = m['setting.email.error.unavailable']();

    try {
      const response = await userContext.isUserIdentAvailable($formData.email, UserIdentType.email);

      if (response.error) {
        updateFormErrors(emailFieldName, response.error);
        return false;
      }

      if (!response.isAvailable) {
        updateFormErrors(emailFieldName, message);
        return false;
      }

      return response.isAvailable;
    } catch (error) {
      updateFormErrors(emailFieldName, translate(AppUiMessage.systemError));
      return false;
    }
  };

  const updateEmail = async (email: string) => {
    isLoading = true;
    try {
      const result = await userContext.updateMyUser({
        email: email,
      });

      if (result.error) {
        updateFormErrors(emailFieldName, result.error);
        return;
      }

      isSuccess = true;
      // Show success state briefly before closing
      setTimeout(() => {
        return onClose && onClose();
      }, 1000);
    } catch (error) {
      updateFormErrors(
        emailFieldName,
        error instanceof Error ? error.message : 'Failed to update email',
      );
      return;
    } finally {
      isLoading = false;
    }
  };

  const registerNewEmail = async () => {
    isLoading = true;
    try {
      const verificationResponse = await userContext.verifyMyEmail($formData.email);

      if (
        !verificationResponse ||
        verificationResponse?.error ||
        !verificationResponse.object ||
        verificationResponse.object.error ||
        !verificationResponse?.object.actionProgress?.actionId ||
        !verificationResponse?.object.run
      ) {
        console.error('UpdateEmailForm.registerNewEmail: verifyMyEmail failed.', {
          verificationResponse,
        });
        updateFormErrors(emailFieldName, translate(AppUiMessage.systemError));
        return;
      }

      startResendTimer();

      msaId = verificationResponse.object.actionProgress.actionId;
      const onNotificationSent = () => {
        step = 2;
        hasStepError = true;
        isLoading = false;
      };
      const onFailure = () => {
        if (awaitingTokenVerification && otpHandler) {
          console.error('onFailure');

          updateFormErrors('token', otpHandler.getErrorMessage());
          hasStepError = true;
          awaitingTokenVerification = false;
          isLoading = false;
        }
      };
      const onSuccess = async () => {
        await updateEmail($formData.email);
      };

      otpHandler = new MsaListenerHandler(
        'UpdateEmailForm',
        verificationResponse,
        onNotificationSent,
        onFailure,
        onSuccess,
      );
    } catch (error) {
      console.error('UpdateEmailForm.registerNewEmail:', { error });
      updateFormErrors(emailFieldName, translate(AppUiMessage.systemError));
    } finally {
      // isLoading = false;  // Leave the button in a processing state until success event
    }
  };

  const verifyEmailToken = async (): Promise<void> => {
    try {
      if (!msaId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
        return;
      }

      isLoading = true;
      awaitingTokenVerification = true;

      const response = await userContext.verifyMultiStepActionToken(msaId, $formData.token);
      if (response !== true) {
        console.error('UpdateEmailForm.handleVerifyOtp: invalid response:', { result: response });
        updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
        return;
      }
    } catch (error) {
      console.error('UpdateEmailForm.handleVerifyOtp: error:', { error });
      updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
    } finally {
      // isLoading = false;  // Leave the button in a processing state until success event
    }
  };

  const resendToken = async () => {
    if (!msaId) {
      console.error('UpdateEmailDialog.handleResendOtp: actionId missing.');
      updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
      return;
    }

    try {
      isLoading = true;
      const response = await userContext.sendMultiStepActionNotification(msaId, $formData.email);

      if (typeof response === 'string') {
        console.error('UpdateEmailDialog.handleResendOtp: error:', { error: response });
        updateFormErrors(tokenFieldName, response);
        return;
      }

      startResendTimer();
    } catch (error) {
      console.error('UpdateEmailDialog.resendToken: error:', { error });
      updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
    } finally {
      isLoading = false;
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

  onDestroy(() => {
    clearInterval(timerInterval);
    if (otpHandler) otpHandler.removeListener();

    debounceFormValidation.cancel();
  });

  $effect(() => {
    if (!$formData) {
      isLoading = false;
      return;
    }
    options.validators = getCurrentValidator();
  });
</script>

<form method="POST" use:enhance class="flex flex-1 flex-col space-y-8 overflow-hidden px-2">
  {#if step === 1}
    <div class="space-y-4">
      <div class="space-y-2">
        <label for="current-email" class="text-sm font-medium leading-none">
          {m['setting.email.current_email']()}
        </label>
        <Input id="current-email" value={currentEmail} disabled class="bg-muted" />
      </div>
      <IdentFormInput
        {form}
        fieldName="email"
        placeholder={m['setting.email.email_placeholder']()}
        label={m['setting.email.new_email']()}
        {isLoading}
      />
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
      onResendClick={resendToken}
      showBackButton={true}
      backButtonLabel={m['setting.buttons.change_email']()}
      onBackButtonClick={() => {
        step = 1;
        hasStepError = false;
        formData.update((data) => {
          return {
            email: data.email,
            token: '',
          };
        });
      }}
    />
  {/if}

  <div class="flex flex-col space-y-2">
    <FormButton {disabled} {isLoading} {isSuccess} {buttonText} {loadingText} />
    <Button variant="outline" onclick={onClose}>{m['setting.buttons.cancel']()}</Button>
  </div>
</form>
