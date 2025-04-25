<script lang="ts">
  import * as Alert from '$lib/components/ui/alert';
  import * as Form from '$lib/components/ui/form/index';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import IdentFormInput from '@/components/forms/form-ident-input.svelte';
  import Label from '@/components/ui/label/label.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { AlertTriangle, ChevronRight } from 'lucide-svelte';
  import { superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { deleteAccountSchema, type DeleteAccountSchema } from '../schema';
  import DeleteAccountDialog from './update-dialog-template.svelte';

  interface DeleteAccountProps {
    currentEmail: string;
    deleteAccountForm: SuperValidated<DeleteAccountSchema>;
  }

  let { currentEmail, deleteAccountForm }: DeleteAccountProps = $props();

  const form = superForm(deleteAccountForm, {
    validators: zodClient(deleteAccountSchema),
    validationMethod: 'oninput',
    dataType: 'json',
    async onSubmit({ cancel }) {
      cancel();
      await handleFormSubmit();
    },
  });

  const { form: formData, validateForm } = form;

  let isLoading = $state(false);
  let showDialog = $state(false);
  let errorMessage = $state('');
  let isSuccess = $state(false);

  const resetDialogState = () => {
    errorMessage = '';
    isSuccess = false;
    form.reset();
    if (isLoading) isLoading = false;
  };

  const handleFormSubmit = async () => {
    const result = await validateForm({ update: true, focusOnError: true });
    if (!result.valid) {
      return;
    }

    await handleAccountDeletion();
    isLoading = false;
  };

  const handleAccountDeletion = async () => {
    try {
      isLoading = true;
      errorMessage = '';

      const result = await myUserContext.deleteMyUser(
        $formData.reason,
        $formData.description,
        true, // deletePhysically
      );

      if (result === true) {
        isSuccess = true;
        setTimeout(() => {
          window.location.href = '/signup';
        }, 1500);
      } else {
        errorMessage = typeof result === 'string' ? result : 'Failed to delete account';
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
      console.error('Error deleting account:', error);
    } finally {
      isLoading = false;
    }
  };

  let isFormValid = $derived(
    $formData.confirmEmail?.toLowerCase().trim() === currentEmail?.toLowerCase().trim(),
  );
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg px-2 py-3 text-destructive hover:bg-destructive/10"
  onclick={() => (showDialog = true)}
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

{#key showDialog}
  <DeleteAccountDialog
    title="Delete Account"
    description="All your data will be permanently removed"
    {form}
    shouldEnableSave={isFormValid || false}
    {isLoading}
    {errorMessage}
    onCancel={resetDialogState}
    showCancel={true}
    showActionButton={true}
    cancelButtonlabel="Cancel"
    actionButtonlabel={isSuccess ? 'Account Deleted' : 'Delete Account'}
    actionButtonloadingText="Deleting..."
    actionButtonExtraClass={isSuccess
      ? 'bg-green-600 hover:bg-green-700'
      : 'bg-destructive hover:bg-destructive/80'}
    success={isSuccess}
    bind:showDialog
    contentClass="max-h-[90vh] overflow-y-auto"
  >
    <Alert.Root variant="destructive" class="mb-4">
      <AlertTriangle class="h-4 w-4" />
      <Alert.Title>Are you absolutely sure?</Alert.Title>
      <Alert.Description>
        All your data will be permanently removed. This action cannot be undone.
      </Alert.Description>
    </Alert.Root>

    <div class="space-y-4">
      <Form.Field {form} name="reason">
        <Label>Reason for deletion <span class="text-muted-foreground">(optional)</span></Label>
        <Form.Control>
          {#snippet children({ props })}
            <Input
              {...props}
              id="reason"
              type="text"
              placeholder="Why are you deleting your account?"
              bind:value={$formData.reason}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="description">
        <Label>Additional details <span class="text-muted-foreground">(optional)</span></Label>
        <Form.Control>
          {#snippet children({ props })}
            <Textarea
              {...props}
              id="description"
              placeholder="Please provide any additional details"
              bind:value={$formData.description}
              rows={3}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <IdentFormInput {form} fieldName="confirmEmail" label={`Type your email (${currentEmail})`} />
    </div>
  </DeleteAccountDialog>
{/key}
