<script lang="ts" generics="T extends Record<string, unknown>">
  import * as Dialog from '$lib/components/ui/dialog';
  import ErrorAlert from '@/components/error-alert.svelte';
  import FormButton from '@/components/forms/form-button.svelte';
  import type { Snippet } from 'svelte';
  import type { SuperForm } from 'sveltekit-superforms';

  let {
    title = '',
    description = '',
    form,
    shouldEnableSave = false,
    isLoading = false,
    errorMessage = '',
    cancelButtonlabel = 'Cancel',
    actionButtonlabel = 'Save changes',
    actionButtonloadingText = 'Save ...',
    onAction,
    onCancel,
    onBack,
    showCancel = true,
    showActionButton = true,
    showDialog = $bindable(false),
    children,
  } = $props<{
    title: string;
    description: string;
    cancelButtonlabel?: string;
    actionButtonlabel?: string;
    actionButtonloadingText?: string;
    form: SuperForm<T>;
    shouldEnableSave: boolean;
    isLoading: boolean;
    errorMessage?: string;
    onAction: () => Promise<void> | void;
    onCancel?: () => void | undefined;
    onBack?: () => void;
    showCancel?: boolean | undefined;
    showActionButton?: boolean;
    children?: Snippet;
    showDialog: boolean;
  }>();

  const { enhance, delayed } = form;

  function handleDialogClose() {
    if (!showDialog && onCancel) {
      onCancel();
      form.reset();
    }
  }

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
      {#if onBack}
        <div class="flex items-center mb-2">
          <button 
            type="button"
            class="flex items-center text-sm text-muted-foreground hover:text-foreground"
            onclick={onBack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </button>
        </div>
      {/if}
      <Dialog.Title class="text-xl font-semibold">{title}</Dialog.Title>
      <Dialog.Description class="text-base text-muted-foreground">
        {description}
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" use:enhance class="grid gap-4 py-4">
      {@render children?.()}

      <Dialog.Footer class="flex justify-end gap-3">
        {#if showCancel}
          <FormButton
            disabled={isLoading || $delayed}
            variant="outline"
            fullWidth={false}
            buttonText={cancelButtonlabel}
            onClick={() => {
              showDialog = false;
            }}
          />
        {/if}
        {#if showActionButton}
          <FormButton
            disabled={isLoading || $delayed || !shouldEnableSave}
            loading={isLoading}
            fullWidth={false}
            buttonText={actionButtonlabel}
            loadingText={actionButtonloadingText}
            onClick={onAction}
          />
        {/if}
      </Dialog.Footer>

      {#if errorMessage}
        <ErrorAlert bind:errorMessage />
      {/if}
    </form>
  </Dialog.Content>
</Dialog.Root>
