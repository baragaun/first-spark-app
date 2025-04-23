<script lang="ts">
  import PasswordFormInput from '@/components/forms/form-password-input.svelte';

  import { myUserContext } from '$lib/contexts/my-user-context.svelte';
  import { AppUiMessage } from '@/types/enums';
  import { ChevronRight } from 'lucide-svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import UpdateDialog from './update-dialog-template.svelte';
  import { passwordSchema, type PasswordSchema } from '../schema';

  interface PasswordInputProps {
    passwordForm: SuperValidated<PasswordSchema>;
  }

  let { passwordForm }: PasswordInputProps = $props();
  let isLoading = $state(false);
  let showUpdatePasswordForm = $state(false);
  let step = $state(1);
  let errorMessage = $state('');

  // Initialize superForm
  const form = superForm(passwordForm, {
    validators: zod(passwordSchema),
    validationMethod: 'oninput',
    dataType: 'json',
    async onSubmit({ cancel }) {
      cancel();
      await handlePasswordChange();
    },
  });

  const { form: formData, errors } = form;

  const updateFormErrors = (field: keyof PasswordSchema, message: string) => {
    errors.update((errors) => {
      const newErrors = {
        ...errors,
        [field]: [message],
      };
      return newErrors;
    });
  };

  let hasFormValues = $derived(
    $formData.currentPassword && $formData.newPassword && !$errors.newPassword,
  );

  // Reset dialog state when closed
  function resetDialogState() {
    step = 1;
    isLoading = false;
    errorMessage = '';
    form.reset();
  }

  // Handle password change
  const handlePasswordChange = async () => {
    try {
      isLoading = true;
      errorMessage = '';
      let isValid = await verifyCurrentPassword();
      if (!isValid) return;

      const result = await myUserContext.updateMyPassword(
        $formData.currentPassword,
        $formData.newPassword,
      );

      if (result === true) {
        step = 2;
        console.log('updateNewEmail: success.', result);
      } else {
        // Show error message
        errorMessage = result || 'Failed to update password';
        console.log('updateNewEmail: fail.', result);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      errorMessage = 'An unexpected error occurred';
    } finally {
      isLoading = false;
    }
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

  const getDialogDetails = () => {
    switch (step) {
      case 1:
        return {
          title: 'Change password',
          description: 'Enter your current password and a new password.',
          showActionButton: true,
          shouldEnableSave: hasFormValues,
          cancelButtonlabel: undefined,
          actionButtonlabel: undefined,
          actionButtonloadingText: 'Saving ...',
        };
      default:
        return {
          title: 'Password updated',
          description: 'Your password has been successfully updated.',
          showActionButton: false,
          shouldEnableSave: undefined,
          cancelButtonlabel: 'Close',
          actionButtonlabel: undefined,
          actionButtonloadingText: undefined,
        };
    }
  };
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
  onclick={() => (showUpdatePasswordForm = true)}
>
  <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
    <p class="text-sm font-medium">Password</p>
  </div>
  <div class="flex items-center gap-2">
    <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
      Change your password
    </p>
    <ChevronRight
      class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
    />
  </div>
</button>

{#key showUpdatePasswordForm}
  {@const dialogDetails = getDialogDetails()}
  <UpdateDialog
    title={dialogDetails.title}
    description={dialogDetails.description}
    {form}
    shouldEnableSave={dialogDetails.shouldEnableSave || false}
    {isLoading}
    {errorMessage}
    onAction={handlePasswordChange}
    onCancel={resetDialogState}
    showActionButton={dialogDetails.showActionButton}
    cancelButtonlabel={ dialogDetails.cancelButtonlabel}
    bind:showDialog={showUpdatePasswordForm}
  >
    {#if step === 1}
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
    {/if}
  </UpdateDialog>
{/key}
