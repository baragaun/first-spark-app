<script lang="ts">
  import * as Alert from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Form from '$lib/components/ui/form/index';
  import { Input } from '$lib/components/ui/input';
  import Label from '@/components/ui/label/label.svelte';
  import { AlertTriangle, ChevronRight } from 'lucide-svelte';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { deleteAccountSchema } from '../schema';

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
    validationMethod: 'oninput',
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
  class="group flex w-full items-center justify-between rounded-lg py-2 text-destructive hover:bg-destructive/10"
  onclick={() => (showDeleteConfirm = true)}
>
  <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
    <p class="text-sm font-medium">Delete Account</p>
  </div>
  <div class="flex items-center gap-2">
    <p class="text-right text-sm opacity-70 group-hover:text-foreground">
      Permanently delete your account
    </p>
    <ChevronRight
      class="h-5 w-5 stroke-[2] opacity-70 transition-opacity group-hover:opacity-100"
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
      <Dialog.Title class="text-lg font-semibold">Delete Account</Dialog.Title>
      <Dialog.Description class="text-sm text-muted-foreground">
        This action cannot be undone. This will permanently delete your account and remove your data
        from our servers.
      </Dialog.Description>
    </Dialog.Header>

    <Alert.Root variant="destructive" class="mt-4">
      <AlertTriangle class="h-4 w-4" />
      <Alert.Title>Are you absolutely sure?</Alert.Title>
      <Alert.Description>
        All your data will be permanently removed. This action cannot be undone.
      </Alert.Description>
    </Alert.Root>

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
      class="mt-4 space-y-4"
    >
      <Form.Field {form} name="confirmEmail">
        <Label>Type your email <span class="text-muted-foreground">({currentEmail})</span></Label>
        <Form.Control>
          {#snippet children({ props })}
            <Input
              {...props}
              id="confirm-email"
              type="email"
              placeholder={currentEmail}
              bind:value={$formData.confirmEmail}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer class="mt-6 flex justify-end gap-2">
        <Button variant="outline" type="button" onclick={() => (showDeleteConfirm = false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          type="submit"
          disabled={isLoading ||
            $formData.confirmEmail.toLowerCase().trim() !== currentEmail.toLowerCase().trim()}
        >
          {isLoading ? 'Deleting...' : 'Delete Account'}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
