<script lang="ts">
  import { goto } from '$app/navigation';
  import AuthCard from '@/components/auth-card.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import EmailFormInput from '@/components/forms/form-ident-input.svelte';
  import OtpFormInput from '@/components/forms/form-otp-input.svelte';
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';
  import { MsaListenerHandler } from '@/contexts/msa-listener-handler.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte.js';
  import translate from '@/helpers/language/translate.js';
  import passwordHelpers from '@/helpers/password-helpers.js';
  import { m } from '@/paraglide/messages';
  import { AppUiMessage } from '@/types/enums.js';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { onDestroy } from 'svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { debounce } from 'throttle-debounce';
  import {
    determineIdentifierType,
    getOtpMessage,
    schemaFirstStep,
    schemaLastStep,
    type ResetPasswordFormSchema,
  } from './schema';

  let { data }: { data: { form: SuperValidated<ResetPasswordFormSchema> } } = $props();

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
  const DEBOUNCE_DELAY = 350; // ms
  const { getPasswordError, validatePassword } = passwordHelpers;

  // Replace setTimeout/clearTimeout with debounce
  const debouncedValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      isLoading = true;
      const result = await validateForm({ update: true, focusOnError: false });
      hasStepError = !result.valid;
    } catch (error) {
      console.error('Error validating form:', error);
    } finally {
      isLoading = false;
    }
  });

  const form = superForm(data.form, {
    dataType: 'json',
    validators: getCurrentValidator(),
    resetForm: false,
    validationMethod: 'submit-only',
    async onChange() {
      if (msaId && !$formData.actionId) {
        $formData.actionId = msaId;
      }

      debouncedValidation();
    },
    async onSubmit({ cancel }) {
      cancel(); // Avoid any actual server-side validation form action

      const result = await validateForm({ update: true, focusOnError: true });
      if (!result.valid) return;

      if (step === 1) {
        await startPasswordReset();
      } else {
        await updateMyPassword();
      }

      return;
    },
  });

  const { form: formData, enhance, errors, delayed, validateForm, options } = form;

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

  const updateFormErrors = (field: keyof ResetPasswordFormSchema, message: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  const isIdentRegistered = async (): Promise<boolean> => {
    isLoading = true;

    identifier = $formData.ident;
    if (!identifier) return false;
    identType = determineIdentifierType(identifier);

    try {
      const response = await myUserContext.isUserIdentAvailable(identifier, identType);

      if (response.error) {
        updateFormErrors('ident', response.error);
        return false;
      }

      if (response.isAvailable) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error checking identifier availability:', error);
      updateFormErrors('ident', translate(AppUiMessage.systemError));
      return false;
    } finally {
      isLoading = false;
    }
  };

  const startPasswordReset = async () => {
    isLoading = true;
    const existingUser = await isIdentRegistered();

    try {
      if (!existingUser) {
        // Feign success and proceed
        // Todo: add the `change email` button like the `sign in with token` button
        step = 2;
        hasStepError = true; // for steps = 2 initially fields are empty keep button disabled
        startResendTimer();

        return;
      }

      const response = await myUserContext.resetMyPassword($formData.ident);

      if (
        !response ||
        response?.error ||
        !response.object ||
        response.object.error ||
        !response?.object.actionProgress?.actionId ||
        !response?.object.run
      ) {
        updateFormErrors('ident', 'Failed to send verification code. Please try again.');
        hasStepError = true;
        isLoading = false;
        // Set to true since we failed to send the verification code
        return;
      }

      const onNotificationSent = () => {
        step = 2;
        hasStepError = true;
        isLoading = false;
      };
      const onFailure = () => {
        isLoading = false;
      };
      const onSuccess = async () => {
        isLoading = false;
        await goto('/');
      };

      msaId = response.object.actionProgress.actionId;
      otpHandler = new MsaListenerHandler(
        'ResetPassword',
        response,
        onNotificationSent,
        onFailure,
        onSuccess,
      );

      startResendTimer();
      return;
    } catch (err) {
      console.error('Error resetting password:', err);
      updateFormErrors('ident', translate(AppUiMessage.systemError));
    } finally {
      isLoading = true; // Leave the button in a processing state until sent event
    }
  };

  const handleResendToken = async () => {
    if (!canResend) return;
    isLoading = true;

    if (!msaId) {
      console.error('ResetPasswordForm.handleResendToken: actionId missing.');
      updateFormErrors('token', translate(AppUiMessage.systemError));
      return;
    }

    try {
      const response = await myUserContext.sendMultiStepActionNotification(
        $formData.actionId,
        $formData.ident,
      );

      if (response !== true) {
        updateFormErrors(
          'token',
          typeof response === 'string' ? response : 'Failed to resend verification code',
        );
        return;
      }

      startResendTimer();
    } catch (error) {
      console.error('Error resending email:', error);
      updateFormErrors('token', 'Failed to resend verification code. Please try again.');
    } finally {
      isLoading = false;
    }
  };

  const updateMyPassword = async () => {
    isLoading = true;

    if (!msaId) {
      console.error('ResetPasswordForm.updateMyPassword: actionId missing:');
      updateFormErrors('token', translate(AppUiMessage.systemError));
      return;
    }

    if (!$formData.newPassword || !$formData.token) return;

    try {
      if (!validatePassword($formData.newPassword).isValid) {
        updateFormErrors('newPassword', getPasswordError($formData.newPassword));
        return;
      }

      const result = await myUserContext.verifyMultiStepActionToken(
        $formData.actionId,
        $formData.token,
        $formData.newPassword,
      );

      if (result !== true) {
        updateFormErrors('token', typeof result === 'string' ? result : 'Failed to verify code');
        return;
      }
    } catch (err) {
      console.error('Error verifying reset code:', err);
      updateFormErrors(
        'newPassword',
        err instanceof Error ? err.message : 'Failed to verify code. Please try again.',
      );
    } finally {
      isLoading = false;
    }
  };

  const getCurrentStepDescription = () => {
    switch (step) {
      case 1:
        return m['reset_password.description']();
      case 2:
        return getOtpMessage($formData);
    }
  };

  const getCurrentStepButtonLabel = () => {
    switch (step) {
      case 1:
        return m['reset_password.buttons.send_email']();
      case 2:
        return m['reset_password.buttons.update_password']();
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

  onDestroy(() => {
    clearInterval(timerInterval);

    if (otpHandler) {
      otpHandler.removeListener();
    }

    // Cancel the debounced function
    debouncedValidation.cancel();
  });
</script>

<form method="POST" id="reset-password-form" use:enhance>
  <AuthCard title={m['reset_password.title']()} description={getCurrentStepDescription()}>
    <div class="space-y-4">
      {#if step == 1}
        <EmailFormInput
          {form}
          fieldName="ident"
          placeholder={m['reset_password.form.identifier_placeholder']()}
          label={m['reset_password.form.identifier_label']()}
          {isLoading}
        />
      {:else if step == 2}
        <PasswordFormInput
          {form}
          fieldName="newPassword"
          label={m['reset_password.new_password_form.label']()}
          placeholder={m['reset_password.new_password_form.placeholder']()}
        />
        <OtpFormInput
          {form}
          fieldName="token"
          label={m['verify_token.verification_code']()}
          length={6}
          showResend={true}
          {canResend}
          {resendTimer}
          onResendClick={handleResendToken}
          showBackButton={true}
          backButtonLabel={m['reset_password.buttons.start_over']()}
          onBackButtonClick={() => {
            step = 1;
            hasStepError = false;
          }}
        />
      {/if}
      <FormButton
        disabled={$delayed || isLoading || hasStepError}
        isLoading={$delayed || isLoading}
        buttonText={getCurrentStepButtonLabel()}
        loadingText={m['reset_password.buttons.processing']()}
      />
    </div>
    <div class="mt-4 text-center text-sm">
      {m['reset_password.buttons.have_account']()}
      <a href="/signup" class="underline"> {m['reset_password.buttons.signup']()} </a>
    </div>
  </AuthCard>

  <!-- commenting as per the issue : https://github.com/baragaun/first-spark-app/issues/113 -->
  <!--   <div class="mt-4"><SuperDebug data={$formData} /></div>
  <div class="mt-4">
    <SuperDebug data={errors} />
  </div> -->
</form>
