<script lang="ts" module>
  type T = Record<string, unknown>;
</script>

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
    success = false,
    onCancel,
    onBack,
    showCancel = true,
    showActionButton = true,
    actionButtonExtraClass = '',
    showDialog = $bindable(false),
    contentClass = '',
    children,
  } = $props<{
    title: string;
    description: string;
    cancelButtonlabel?: string;
    actionButtonlabel?: string;
    actionButtonloadingText?: string;
    success?: boolean;
    form: SuperForm<T>;
    shouldEnableSave: boolean;
    isLoading: boolean;
    errorMessage?: string;
    onCancel?: () => void | undefined;
    onBack?: () => void;
    showCancel?: boolean | undefined;
    showActionButton?: boolean;
    children?: Snippet;
    showDialog: boolean;
    actionButtonExtraClass?: string;
    contentClass?: string;
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
  <Dialog.Content class={`flex max-h-[90vh] flex-col sm:max-w-[425px] ${contentClass}`}>
    <Dialog.Header class="space-y-2 px-2">
      {#if onBack}
        <div class="mb-2 flex items-center">
          <button
            type="button"
            class="flex items-center text-sm text-muted-foreground hover:text-foreground"
            onclick={onBack}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-1"
            >
              <path d="m15 18-6-6 6-6" />
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

    <form method="POST" use:enhance class="flex flex-1 flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto px-2 py-4">
        {@render children?.()}
      </div>

      <Dialog.Footer class="mt-auto flex justify-end gap-3 px-2 pt-4">
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
            loading={isLoading && !success}
            {success}
            fullWidth={false}
            buttonText={actionButtonlabel}
            loadingText={actionButtonloadingText}
            extraClass={actionButtonExtraClass}
          />
        {/if}
      </Dialog.Footer>

      {#if errorMessage}
        <ErrorAlert bind:errorMessage />
      {/if}
    </form>
  </Dialog.Content>
</Dialog.Root>
