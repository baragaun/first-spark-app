<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Alert from '$lib/components/ui/alert';
  import { AlertDescription } from '$lib/components/ui/alert';
  import { ChevronRight, AlertTriangle } from 'lucide-svelte';
  import * as Form from '$lib/components/ui/form/index';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { deleteAccountSchema } from '../../../../routes/settings/account/account-settings-schema';

  interface DeleteAccountProps {
    currentEmail: string;
    onDelete: () => Promise<void>;
    deleteAccountForm: SuperValidated<Infer<typeof deleteAccountSchema>>;
  }

  // Props using the interface
  let { currentEmail, onDelete, deleteAccountForm }: DeleteAccountProps = $props();

  // Initialize superForm
  const form = superForm(deleteAccountForm, {
    validators: zodClient(deleteAccountSchema),
    dataType: 'json',
  });

  // Destructure form helpers
  const { form: formData, enhance, errors } = form;

  // State variables
  let isLoading = $state(false);
  let showDeleteConfirm = $state(false);

  // Reset dialog state when closed
  function resetDialogState() {
    $formData.confirmEmail = '';
    if (isLoading) isLoading = false;
  }

  // Handle account deletion
  const handleAccountDeletion = async () => {
    try {
      isLoading = true;
      await onDelete();
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      isLoading = false;
    }
  };
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
  onclick={() => (showDeleteConfirm = true)}
>
  <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
    <p class="text-sm font-medium">Delete Account</p>
    <p class="text-xs text-muted-foreground">Permanently delete your account</p>
  </div>
  <div class="flex items-center gap-2">
    <ChevronRight
      class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
    />
  </div>
</button>

<Dialog.Root
  open={showDeleteConfirm}
  onOpenChange={(open: boolean) => {
    showDeleteConfirm = open;
    if (!open) resetDialogState();
  }}
>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header class="space-y-2">
      <Dialog.Title class="text-xl font-semibold text-destructive">Delete account</Dialog.Title>
      <Dialog.Description class="text-base text-muted-foreground">
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </Dialog.Description>
    </Dialog.Header>

    <form
      method="POST"
      action="?/deleteAccount"
      use:enhance={{
        onSubmit: () => {
          isLoading = true;
        },
        onResult: ({ result }) => {
          isLoading = false;
          if (result.type === 'success') {
            handleAccountDeletion();
          }
        },
      }}
      class="mt-6 space-y-4"
    >
      <Alert.Root variant="destructive">
        <AlertTriangle class="h-4 w-4" />
        <Alert.Title>Warning</Alert.Title>
        <AlertDescription>
          All of your data will be permanently removed. This action cannot be undone.
        </AlertDescription>
      </Alert.Root>

      <Form.Field {form} name="confirmEmail">
        <label for="confirm-email" class="mb-2 block text-sm font-medium leading-none"
          >Email Confirmation</label
        >
        <Form.Control>
          {#snippet children({ props })}
            <Input
              {...props}
              id="confirm-email"
              type="email"
              placeholder="Enter your email to confirm"
            />
          {/snippet}
        </Form.Control>
        <Form.Description>
          Enter your email address ({currentEmail}) to confirm account deletion
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer class="mt-6 flex justify-end gap-3">
        <Button variant="outline" type="button" onclick={() => (showDeleteConfirm = false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          type="submit"
          disabled={isLoading || $formData.confirmEmail !== currentEmail}
        >
          {isLoading ? 'Deleting...' : 'Delete account'}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
