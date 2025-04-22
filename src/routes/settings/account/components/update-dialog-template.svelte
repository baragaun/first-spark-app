<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import ErrorAlert from '@/components/error-alert.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import type { Snippet } from 'svelte';
  import type { SuperForm } from 'sveltekit-superforms';

  // Use props with $props() rune
  let {
    title = '',
    description = '',
    form,
    shouldEnableSave = false,
    isLoading = false,
    errorMessage = '',
    cancelButtonlabel = 'Cancel',
    actionButtonlabel = 'Save changes',
    onSave,
    onCancel,
    showCancel = true,
    showActionButton = true,
    showDialog = $bindable(false),
    children,
  } = $props<{
    title: string;
    description: string;
    cancelButtonlabel?: string;
    actionButtonlabel?: string;
    form: SuperForm<any, any>;
    shouldEnableSave: boolean | string;
    isLoading: boolean;
    errorMessage: string;
    onSave: () => Promise<void> | void;
    onCancel: () => void;
    showCancel?: boolean;
    showActionButton?: boolean;
    children?: Snippet;
    showDialog: boolean;
  }>();

  // Reset function
  function handleDialogClose() {
    if (!showDialog && onCancel) {
      onCancel();
    }
  }

  // Use $effect for side effects
  $effect(() => {
    if (!showDialog) {
      handleDialogClose();
    }
  });
</script>

<Dialog.Root
  open={showDialog}
  onOpenChange={(open: boolean) => {
    showDialog = open;
    if (!open) handleDialogClose();
  }}
>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header class="space-y-2">
      <Dialog.Title class="text-xl font-semibold">{title}</Dialog.Title>
      <Dialog.Description class="text-base text-muted-foreground">
        {description}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:form.enhance class="grid gap-4 py-4">
      {@render children?.()}

      <Dialog.Footer class="flex justify-end gap-3">
        {#if showCancel}
          <FormButton
            disabled={isLoading}
            variant="outline"
            fullWidth={false}
            buttonText={cancelButtonlabel}
            onClick={() => {
              showDialog = false;
              if (onCancel) onCancel();
            }}
          />
        {/if}
        {#if showActionButton}
          <FormButton
            disabled={isLoading || !shouldEnableSave}
            loading={isLoading}
            fullWidth={false}
            buttonText={actionButtonlabel}
            loadingText="Saving..."
            onClick={onSave}
          />
        {/if}
      </Dialog.Footer>

      {#if errorMessage}
        <ErrorAlert bind:errorMessage />
      {/if}
    </form>
  </Dialog.Content>
</Dialog.Root>
