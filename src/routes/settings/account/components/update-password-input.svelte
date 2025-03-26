<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ChevronRight } from 'lucide-svelte';
  import * as Form from '$lib/components/ui/form/index';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { passwordSchema } from '../../../../routes/settings/account/account-settings-schema';

  interface PasswordInputProps {
    onSave: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
    passwordForm: SuperValidated<Infer<typeof passwordSchema>>;
  }

  // Props using the interface
  let { onSave, passwordForm }: PasswordInputProps = $props();

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

  // Derived state to check if form has values and is valid
  let hasFormValues = $derived(
    $formData.currentPassword &&
      $formData.newPassword &&
      $formData.confirmPassword &&
      !$errors.newPassword &&
      !$errors.confirmPassword,
  );

  // Reset dialog state when closed
  function resetDialogState() {
    $formData.currentPassword = '';
    $formData.newPassword = '';
    $formData.confirmPassword = '';
    showSuccess = false;
    if (isLoading) isLoading = false;
  }

  // Handle password change
  const handlePasswordChange = async () => {
    try {
      isLoading = true;
      await onSave({
        currentPassword: $formData.currentPassword,
        newPassword: $formData.newPassword,
      });
      showSuccess = true;
    } catch (error) {
      console.error('Error updating password:', error);
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
    <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">••••••••</p>
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

      <form
        method="POST"
        action="?/updatePassword"
        use:enhance={{
          onSubmit: () => {
            isLoading = true;
          },
          onResult: ({ result }) => {
            isLoading = false;
            if (result.type === 'success') {
              handlePasswordChange();
            }
          },
        }}
        class="mt-6 space-y-4"
      >
        <Form.Field {form} name="currentPassword">
          <label for="current-password" class="mb-2 block text-sm font-medium leading-none"
            >Current Password</label
          >
          <Form.Control>
            {#snippet children({ props })}
              <PasswordInput
                {...props}
                id="current-password"
                bind:value={$formData.currentPassword}
                placeholder="Enter current password"
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="newPassword">
          <label for="new-password" class="mb-2 block text-sm font-medium leading-none"
            >New Password</label
          >
          <Form.Control>
            {#snippet children({ props })}
              <PasswordInput
                {...props}
                id="new-password"
                placeholder="Enter new password"
                bind:value={$formData.newPassword}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="confirmPassword">
          <label for="confirm-password" class="mb-2 block text-sm font-medium leading-none"
            >Confirm Password</label
          >
          <Form.Control>
            {#snippet children({ props })}
              <PasswordInput
                {...props}
                id="confirm-password"
                placeholder="Confirm new password"
                bind:value={$formData.confirmPassword}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Dialog.Footer class="mt-6 flex justify-end gap-3">
          <Button variant="outline" type="button" onclick={() => (showPasswordEdit = false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !hasFormValues}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </Dialog.Footer>
      </form>
    {:else}
      <!-- Success screen -->
      <Dialog.Header>
        <Dialog.Title class="text-xl font-semibold">Password updated</Dialog.Title>
      </Dialog.Header>
      <div class="mt-6 space-y-4">
        <p class="text-sm text-muted-foreground">Your password has been successfully updated.</p>
        <Dialog.Footer class="flex justify-end">
          <Button
            variant="outline"
            onclick={() => {
              showPasswordEdit = false;
            }}
          >
            Close
          </Button>
        </Dialog.Footer>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
