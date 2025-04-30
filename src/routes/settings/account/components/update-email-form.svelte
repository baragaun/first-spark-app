<script lang="ts">
  import FormButton from '@/components/forms/form-button.svelte';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import OTPFormInput from '@/components/forms/form-otp-input.svelte';
  import { Input } from '@/components/ui/input';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import translate from '@/helpers/language/translate';
  import { onDestroy } from 'svelte';
  import { zod } from 'sveltekit-superforms/adapters';
  import { AppUiMessage } from '@/types/enums';
  import { superForm } from 'sveltekit-superforms';
  import { emailForm } from '../../(data)/account';
  import {
    changeEmailschemaFirstStep,
    changeEmailschemaLastStep,
    type UpdateEmailFormSchema,
  } from '../../(data)/schema';
  import { Button } from '@/components/ui/button';

  let { onCancel } = $props<{ onCancel?: (() => void) | undefined }>();

  let currentEmail = $derived(myUserContext.myEmail);
  let step = $state(1);
  let isLoading = $state(false);
  let hasStepError = $state(false);

  let canResend = $state(false);
  let resendTimer = $state(30);
  let timerInterval: ReturnType<typeof setInterval>;
  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
  let msaId = $state<string | undefined>(undefined);

  let debounceTimer: number | null = null;
  const RESEND_TIMER_DURATION = 30; // s
  const DEBOUNCE_DELAY = 500;
  const tokenFieldName = 'token';
  const emailFieldName = 'email';

  const steps = [zod(changeEmailschemaFirstStep), zod(changeEmailschemaLastStep)];
  const getCurrentValidator = () => steps[step - 1];

  const form = superForm(emailForm, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: true,
    validationMethod: 'submit-only',
    async onChange() {
      await debounceFormValidation();
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

  const updateFormErrors = (field: keyof UpdateEmailFormSchema, message: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  const debounceFormValidation = async () => {
    if (debounceTimer) clearTimeout(debounceTimer);

    if (!$formData) return;

    debounceTimer = window.setTimeout(async () => {
      try {
        isLoading = true;
        const result = await validateForm({ update: true, focusOnError: false });
        if (result.valid && step === 1) {
          hasStepError = await checkIdentAvailability();
        }
        hasStepError = !result.valid;
      } catch (error) {
        console.error('Error validating form input:', error);
      } finally {
        isLoading = false;
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  };

  const checkIdentAvailability = async (): Promise<boolean> => {
    // We are not setting isLoading here until we have a better debounce
    console.log('checling ident');
    if (!$formData.email) return false;

    if ($formData.email === currentEmail) {
      updateFormErrors(
        emailFieldName,
        'Please enter a different email address than your current one.',
      );
      return false;
    }

    const validationResult = changeEmailschemaFirstStep.safeParse($formData);

    if (!validationResult.success) return false;

    const message = `This ${emailFieldName} is currently unavailable for use.`;

    try {
      const response = await myUserContext.isUserIdentAvailable(
        $formData.email,
        UserIdentType.email,
      );

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

  const updateEmail = async (email: string): Promise<boolean> => {
    isLoading = true;
    try {
      const result = await myUserContext.updateMyUser({
        email: email,
      });

      if (result.error) {
        updateFormErrors(emailFieldName, result.error);
        return false;
      }
      console.log('updateNewEmail: success.', result);
      return true;
    } catch (error) {
      updateFormErrors(
        emailFieldName,
        error instanceof Error ? error.message : 'Failed to update email',
      );
      return false;
    } finally {
      isLoading = false;
    }
  };

  const registerNewEmail = async () => {
    isLoading = true;
    try {
      const verificationResponse = await myUserContext.verifyMyEmail($formData.email);

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
        isLoading = false;
      };
      const onFailure = () => {
        console.error('onFailure');
        isLoading = false;
      };
      const onSuccess = async () => {
        await updateEmail($formData.email);
        isLoading = false;
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

      const response = await myUserContext.verifyMultiStepActionToken(msaId, $formData.token);
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
      const response = await myUserContext.sendMultiStepActionNotification(msaId, $formData.email);

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
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
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
        updateFormErrors(tokenFieldName, currentErrorMessage);
      }
    }

    options.validators = getCurrentValidator();
  });
</script>

<form method="POST" use:enhance class="flex flex-1 flex-col space-y-8 overflow-hidden px-2">
  {#if step === 1}
    <div class="space-y-4">
      <div class="space-y-2">
        <label for="current-email" class="text-sm font-medium leading-none"> Current email </label>
        <Input id="current-email" value={currentEmail} disabled class="bg-muted" />
      </div>
      <IdentFormInput
        {form}
        fieldName="email"
        placeholder="e.g. 'anne@example.com'"
        label="New email"
        {isLoading}
      />
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
      onResendClick={resendToken}
    />
  {/if}

  <FormButton
    disabled={isLoading || $delayed || hasStepError}
    loading={isLoading}
    buttonText="Submit"
    loadingText="Processing..."
  />
  <Button variant="outline" onclick={onCancel}>Cancel</Button>
</form>
