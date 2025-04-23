<script lang="ts">
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import OTPFormInput from '@/components/forms/form-otp-input.svelte';
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { AppUiMessage, MsaTokenStatus } from '@/types/enums';
  import { ChevronRight } from 'lucide-svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import {
    changeEmailschemaFirstStep,
    changeEmailschemaLastStep,
    type UpdateEmailFormSchema,
  } from '../schema';

  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import translate from '@/helpers/language/translate';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { onDestroy } from 'svelte';
  import { zod } from 'sveltekit-superforms/adapters';
  import UpdateDialog from './update-dialog-template.svelte';

  interface EmailInputProps {
    emailForm: SuperValidated<UpdateEmailFormSchema>;
  }
  let { emailForm }: EmailInputProps = $props();

  let step = $state(1);
  let isLoading = $state(false);
  let hasStepError = $state(false);
  let canResend = $state(false);
  let resendTimer = $state(30);
  let otpHandler: MsaListenerHandler | undefined = $state(undefined);
  let msaId = $state<string | undefined>(undefined);
  let msaStatus = $state(MsaTokenStatus.unset);
  let timerInterval: ReturnType<typeof setInterval>;
  let debounceTimer: number | null = null;
  let showDialog = $state(false);
  let errorMessage = $state('');
  let isPasswordValid = $state(false);
  let mfaActionId: string | undefined;
  const RESEND_TIMER_DURATION = 30; // s
  const DEBOUNCE_DELAY = 1000;
  const tokenFieldName = 'token';
  const emailFieldName = 'email';
  const passwordFieldName = 'currentPassword';
  const currentEmail = myUserContext.myEmail ;

  const steps = [zod(changeEmailschemaFirstStep), zod(changeEmailschemaLastStep)];
  const getCurrentValidator = () => steps[step - 1];

  const form = superForm(emailForm, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    validationMethod: 'oninput',
    async onChange() {
      if (step === 1) {
        await debounceFormValidation();
      }
    },
    async onSubmit({ cancel }) {
      cancel();
      await handleFormSubmit();
    },
  });

  const { form: formData, errors, options, delayed, validateForm } = form;

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
        const result = await validateForm({ update: true, focusOnError: false });
        isLoading = true;

        // Check availability if needed
        const availability = await checkIdentAvailability();
        hasStepError = !availability || !result.valid;
      } catch (error) {
        console.error('Error debouncing the form input:', error);
      } finally {
        isLoading = false;
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
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
    }
  };

  const checkIdentAvailability = async (): Promise<boolean> => {
    isLoading = true;
    if ($formData.email === currentEmail) {
      updateFormErrors(
        emailFieldName,
        'Please enter a different email address than your current one.',
      );
      return false;
    }

    if (!$formData.email) return false;

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
    } finally {
      isLoading = false;
    }
  };

  function resetDialogState() {
    step = 1;
    isLoading = false;
    errorMessage = '';
    isPasswordValid = false;
    mfaActionId = undefined;
  }

  const updateNewEmail = async (email: string): Promise<boolean> => {
    errorMessage = '';
    try {
      const result = await myUserContext.updateMyUser({
        email: email,
      });

      if (result.error) {
        console.log('updateNewEmail: fail.', result);
        errorMessage = result.error;
        return false;
      }
      console.log('updateNewEmail: success.', result);
      return true;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to update email';
      console.error('Error updating email:', error);
      return false;
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
        console.error('UpdateEmailForm.onEmailSubmit: verifyMyEmail failed.', {
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
        await updateNewEmail($formData.email);
        step = 3;
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
      msaStatus = MsaTokenStatus.verificationFailed;
      updateFormErrors(emailFieldName, translate(AppUiMessage.systemError));
    }
  };

  const verifyEmailToken = async (): Promise<void> => {
    try {
      if (!msaId) {
        console.error('SignInForm.handleVerifyOtp: actionId missing:');
        updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
        return;
      }

      updateFormErrors(tokenFieldName, '');
      isLoading = true;

      const response = await myUserContext.verifyMultiStepActionToken(msaId, $formData.token);

      if (response !== true) {
        console.error('UpdateEmailForm.handleVerifyOtp: invalid response:', { result: response });
        updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
        msaStatus = MsaTokenStatus.unset;
        return;
      }

      msaStatus = MsaTokenStatus.sending;
    } catch (error) {
      console.error('UpdateEmailForm.handleVerifyOtp: error:', { error });
      updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
      msaStatus = MsaTokenStatus.unset;
    } finally {
      // isLoading = false;  // Leave the button in a processing state until success event
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
        updateFormErrors(tokenFieldName, currentErrorMessage);
      }
    }

    options.validators = getCurrentValidator();
  });

  let isEmailFormValid = $derived(
    $formData.email && !$errors.email && $formData.currentPassword && !hasStepError,
  );

  let isTokenFormValid = $derived($formData.token && !$errors.token);

  const resendToken = async () => {
    msaStatus = MsaTokenStatus.unset;

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

      msaStatus = MsaTokenStatus.sending;
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

  const handleBack = () => {
    step = 1;
    errorMessage = '';
  };

  const getDialogDetails = () => {
    switch (step) {
      case 1:
        return {
          title: 'Change email',
          description: 'Enter your new email address and current password to verify.',
          shouldEnableSave: isEmailFormValid,
          showCancel: true,
          showActionButton: true,
          cancelButtonlabel: undefined,
          actionButtonlabel: undefined,
          actionButtonloadingText: 'Saving ...',
        };
      case 2:
        return {
          title: 'Verify your email',
          description: 'Enter the verification code sent to your new email address.',
          shouldEnableSave: isTokenFormValid,
          showCancel: false,
          showActionButton: true,
          cancelButtonlabel: undefined,
          actionButtonlabel: 'Verify my email',
          actionButtonloadingText: 'Verifying...',
          onBackClick: handleBack,
        };
      default:
        return {
          title: 'Email updated successfully',
          description: `Your email has been successfully changed to ${$formData.email}.`,
          shouldEnableSave: undefined,
          showCancel: true,
          showActionButton: false,
          cancelButtonlabel: 'Close',
          actionButtonlabel: undefined,
          actionButtonloadingText: 'Verifying...',
        };
    }
  };

  onDestroy(() => {
    clearInterval(timerInterval);
    if (otpHandler) otpHandler.removeListener();
  });
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
  onclick={() => (showDialog = true)}
>
  <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
    <p class="text-sm font-medium">Email</p>
  </div>
  <div class="flex items-center gap-2">
    <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
      {myUserContext.myEmail}
    </p>
    <ChevronRight
      class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
    />
  </div>
</button>

{#key showDialog}
  {@const dialogDetails = getDialogDetails()}
  <UpdateDialog
    title={dialogDetails.title}
    description={dialogDetails.description}
    {form}
    shouldEnableSave={dialogDetails.shouldEnableSave || false}
    {isLoading}
    {errorMessage}
    onAction={handleFormSubmit}
    onCancel={resetDialogState}
    showCancel={dialogDetails.showCancel}
    showActionButton={dialogDetails.showActionButton}
    cancelButtonlabel={dialogDetails.cancelButtonlabel}
    actionButtonlabel={dialogDetails.actionButtonlabel}
    onBack={dialogDetails.onBackClick}
    bind:showDialog
  >
    {#if step === 1}
      <div class="rounded-lg border bg-muted/50 p-4">
        <p class="text-sm font-medium text-muted-foreground">Current Email</p>
        <p class="mt-1 text-base">{currentEmail}</p>
      </div>

      <div class="space-y-4">
        <IdentFormInput
          {form}
          fieldName="email"
          placeholder="Enter new email address"
          label="New email address"
          {isLoading}
        />

        <PasswordFormInput
          {form}
          fieldName={passwordFieldName}
          label="Current password"
          placeholder="Enter your password"
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
  </UpdateDialog>
{/key}
