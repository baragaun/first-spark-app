<script lang="ts">
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';

  import { myUserContext } from '$lib/contexts/my-user-context.svelte';
  import { AppUiMessage } from '@/types/enums';

  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { currentPasswordSchema, passwordSchema, type PasswordSchema } from '../../(data)/schema';
  import { passwordForm } from '../../(data)/account';
  import FormButton from '@/components/forms/form-button.svelte';
  import { Button } from '@/components/ui/button';

  let { onCancel } = $props<{ onCancel?: (() => void) | undefined }>();

  let isLoading = $state(false);
  let hasStepError = $state(false);
  let debounceTimer: number | null = null;
  const DEBOUNCE_DELAY = 500;

  const form = superForm(passwordForm, {
    validators: zod(passwordSchema),
    validationMethod: 'submit-only',
    dataType: 'json',
    async onChange() {
      await debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      await updatePassword();
    },
  });

  const { form: formData, delayed, enhance, errors, validateForm } = form;

  const updateFormErrors = (field: keyof PasswordSchema, message: string) => {
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

        const currentPasswordValidation = currentPasswordSchema.safeParse(
          $formData.currentPassword,
        );

        if (currentPasswordValidation.error) {
          hasStepError = true;
          updateFormErrors('currentPassword', currentPasswordValidation.error?.errors[0].message);
          return;
        }

        const formValidation = await validateForm({ update: true, focusOnError: true });
        hasStepError = !formValidation.valid;
      } catch (error) {
        console.error('Error validating form input:', error);
      } finally {
        isLoading = false;
        debounceTimer = null;
      }
    }, DEBOUNCE_DELAY);
  };

  const verifyCurrentPassword = async (): Promise<boolean> => {
    const verifyMyPasswordResponse = await myUserContext.verifyMyPassword(
      $formData.currentPassword,
    );
    if (
      verifyMyPasswordResponse.object === false ||
      verifyMyPasswordResponse.object?.toString() === 'false'
    ) {
      console.error('Incorrect password', {
        verifyMyPasswordResponse,
      });
      updateFormErrors('currentPassword', 'Incorrect password. Please verify and try again.');
      isLoading = false;
      return false;
    }

    if (verifyMyPasswordResponse.error) {
      console.error('Failed to verify password:', {
        verifyMyPasswordResponse,
      });
      updateFormErrors(
        'currentPassword',
        verifyMyPasswordResponse.error || AppUiMessage.systemError,
      );

      isLoading = false;
      return false;
    }

    return true;
  };

  const updatePassword = async (): Promise<boolean> => {
    try {
      isLoading = true;

      const currentPasswordValidation = await verifyCurrentPassword();

      if (!currentPasswordValidation) {
        return false;
      }

      const result = await myUserContext.updateMyPassword(
        $formData.currentPassword,
        $formData.newPassword,
      );

      if (typeof result === 'string') {
        console.error('UpdatePasswordForm.updatePassword: error:', { error: result });
        updateFormErrors('newPassword', result);
        return false;
      }

      console.log('updatePassword: success.', result);
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      updateFormErrors(
        'newPassword',
        error instanceof Error ? error.message : 'Failed to update password',
      );
      return false;
    } finally {
      isLoading = false;
    }
  };
</script>

<form method="POST" use:enhance class="flex flex-1 flex-col space-y-8 overflow-hidden px-2">
  <div class="space-y-4">
    <PasswordFormInput
      {form}
      fieldName="currentPassword"
      label="Current Password"
      placeholder="Enter your current password"
    />

    <PasswordFormInput
      {form}
      fieldName="newPassword"
      label="New Password"
      placeholder="Enter new password"
    />
  </div>
  <FormButton
    disabled={isLoading || $delayed || hasStepError}
    loading={isLoading}
    buttonText="Save"
    loadingText="Saving..."
  />
  <Button variant="outline" onclick={onCancel}>Cancel</Button>
</form>
