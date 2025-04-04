<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ChevronRight } from 'lucide-svelte';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { passwordSchema } from '../../../../routes/settings/account/account-settings-schema';
  import { myUserContext } from '$lib/contexts/my-user-context.svelte';
  import ErrorAlert from '@/components/error-alert.svelte';

  interface PasswordInputProps {
    passwordForm: SuperValidated<Infer<typeof passwordSchema>>;
  }

  // Props using the interface
  let { passwordForm }: PasswordInputProps = $props();

  // Get the user context
  const userContext = myUserContext;

  // Initialize superForm
  const form = superForm(passwordForm, {
    validators: zodClient(passwordSchema),
    validationMethod: 'oninput',
    dataType: 'json',
  });

  // Destructure form helpers
  const { form: formData, enhance, errors } = form;

  let isLoading = $state(false);
  let showPasswordEdit = $state(false);
  let showSuccess = $state(false);
  let errorMessage = $state('');
  let isCurrentPassworValid = $state(false);
  let isNewPassworValid = $state(true);

  // Derived state to check if form has values and is valid
  let hasFormValues = $derived(
    //$formData.currentPassword && $formData.newPassword && !$errors.newPassword,
    $formData.currentPassword &&
      $formData.newPassword &&
      !$errors.currentPassword &&
      isNewPassworValid,
  );

  // Reset dialog state when closed
  function resetDialogState() {
    $formData.currentPassword = '';
    $formData.newPassword = '';
    showSuccess = false;
    if (isLoading) isLoading = false;
  }

  // Handle password change
  const handlePasswordChange = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      isLoading = true;
      const result = await userContext.updateMyPassword(
        $formData.currentPassword,
        $formData.newPassword,
      );

      if (result === true) {
        showSuccess = true;
        showPasswordEdit = false;
      } else {
        // Show error message
        errorMessage = result || 'Failed to update password';
      }
    } catch (error) {
      console.error('Error updating password:', error);
      errorMessage = 'An unexpected error occurred';
    } finally {
      isLoading = false;
    }
  };
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
  onclick={() => (showPasswordEdit = true)}
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

<Dialog.Root
  open={showPasswordEdit}
  onOpenChange={(open: boolean) => {
    showPasswordEdit = open;
    if (!open) resetDialogState();
  }}
>
  <Dialog.Content class="sm:max-w-[425px]">
    {#if !showSuccess}
      <Dialog.Header class="space-y-2">
        <Dialog.Title class="text-xl font-semibold">Change password</Dialog.Title>
        <Dialog.Description class="text-base text-muted-foreground">
          Enter your current password and a new password.
        </Dialog.Description>
      </Dialog.Header>

      <form method="POST" class="mt-6 space-y-4" use:enhance onsubmit={handlePasswordChange}>
        <div class="space-y-2">
          <label for="current-password" class="block text-sm font-medium leading-none">
            Current Password
          </label>
          <PasswordInput
            id="current-password"
            bind:value={$formData.currentPassword}
            bind:isValid={isCurrentPassworValid}
            placeholder="Enter current password"
          />
          {#if $errors.currentPassword}
            <p class="text-xs text-destructive">{$errors.currentPassword[0]}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <label for="new-password" class="block text-sm font-medium leading-none">
            New Password
          </label>
          <PasswordInput
            id="new-password"
            placeholder="Enter new password"
            bind:value={$formData.newPassword}
            bind:isValid={isNewPassworValid}
            showValidation={true}
          />
        </div>

        <Dialog.Footer class="mt-6 flex justify-end gap-3">
          <Button variant="outline" type="button" onclick={() => (showPasswordEdit = false)}
            >Cancel</Button
          >
          <Button type="submit" disabled={isLoading || !hasFormValues}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </Dialog.Footer>
      </form>
      {#if errorMessage}
        <ErrorAlert bind:errorMessage />
      {/if}
    {:else}
      <!-- Success screen -->
      <Dialog.Header>
        <Dialog.Title class="text-xl font-semibold">Password updated</Dialog.Title>
      </Dialog.Header>
      <div class="mt-6 space-y-4">
        <p class="text-sm text-muted-foreground">Your password has been successfully updated.</p>
        <Dialog.Footer class="flex justify-end">
          <Button variant="outline" onclick={() => (showPasswordEdit = false)}>Close</Button>
        </Dialog.Footer>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
