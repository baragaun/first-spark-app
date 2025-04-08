<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ChevronRight } from 'lucide-svelte';
  import { UsernameInput } from '$lib/components/ui/username-input';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { usernameSchema } from '../../../../routes/settings/account/account-settings-schema';
  import { UserIdentType } from '@baragaun/bg-node-client';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import ErrorAlert from '@/components/error-alert.svelte';

  interface UpdateUsernameDialogProps {
    currentUsername: string;
    currentEmail: string;
    onSave: () => Promise<void>;
    usernameForm: SuperValidated<Infer<typeof usernameSchema>>;
  }

  let { currentUsername, onSave, currentEmail, usernameForm }: UpdateUsernameDialogProps = $props();

  const form = superForm(usernameForm, {
    validators: zodClient(usernameSchema),
    validationMethod: 'oninput',
    dataType: 'json',
  });

  const { form: formData, errors } = form;

  let isLoading = $state(false);
  let showUsernameEdit = $state(false);
  let isUsernameAvailable = $state<boolean | null>(null);
  let errorMessage = $state('');

  let hasFormValues = $derived(
    $formData.username &&
      !$errors.username &&
      isUsernameAvailable &&
      $formData.username !== currentUsername,
  );

  const getSuggestedHandle = async (): Promise<string> => {
    try {
      const result = await myUserContext.findAvailableUserHandle(currentEmail);

      if (result && typeof result === 'object' && 'object' in result) {
        isUsernameAvailable = true;
        return result.object ?? '';
      }

      if (typeof result === 'string') {
        isUsernameAvailable = true;
        return result;
      }
      return '';
    } catch (error) {
      console.error('Error getting suggested handle:', error);
      isUsernameAvailable = false;
      return '';
    }
  };

  const checkUsernameAvailability = async (ident: string, type: UserIdentType): Promise<void> => {
    try {
      const result = await myUserContext.isUserIdentAvailable(ident, type);
      isUsernameAvailable = result.isAvailable ?? false;
      return;
    } catch (error) {
      console.error('Error checking identifier availability:', error);
      isUsernameAvailable = false;
    }
  };

  const handleUsernameChange = async (): Promise<boolean> => {
    errorMessage = '';
    try {
      const result = await myUserContext.updateMyUser({
        userHandle: $formData.username,
      });

      if (result.error) {
        errorMessage = result.error;
        return false;
      }
      return true;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to update username';
      console.error('Error updating username:', error);
      return false;
    }
  };

  function resetDialogState() {
    errorMessage = '';
    form.reset();
  }

  const saveUsername = async () => {
    try {
      isLoading = true;
      const success = await handleUsernameChange();
      if (success) {
        if (typeof onSave === 'function') {
          await onSave();
        }
        showUsernameEdit = false;
      }
    } finally {
      isLoading = false;
    }
  };
</script>

<button
  class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
  onclick={() => (showUsernameEdit = true)}
>
  <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
    <p class="text-sm font-medium">Username</p>
  </div>
  <div class="flex items-center gap-2">
    <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
      {currentUsername}
    </p>
    <ChevronRight
      class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
    />
  </div>
</button>

<Dialog.Root
  open={showUsernameEdit}
  onOpenChange={(open: boolean) => {
    showUsernameEdit = open;
    if (!open) resetDialogState();
  }}
>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header class="space-y-2">
      <Dialog.Title class="text-lg font-semibold">Change Username</Dialog.Title>
      <Dialog.Description class="text-sm text-muted-foreground">
        Enter a new username for your account or use our suggestion.
      </Dialog.Description>
    </Dialog.Header>

    <form method="POST" class="grid gap-4 py-4">
      <div class="space-y-2">
        <label for="current-username" class="text-sm font-medium leading-none">
          Current Username
        </label>
        <Input id="current-username" value={currentUsername} disabled class="bg-muted" />
      </div>

      <UsernameInput
        bind:username={$formData.username}
        bind:isUsernameAvailable
        label="New Username"
        placeholder="Enter username"
        {currentUsername}
        checkAvailability={checkUsernameAvailability}
        generateUsername={getSuggestedHandle}
      />
    </form>

    <Dialog.Footer class="flex justify-end gap-2">
      <Button
        variant="outline"
        disabled={isLoading}
        onclick={() => {
          showUsernameEdit = false;
          resetDialogState();
        }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isLoading || !hasFormValues}
        onclick={() => {
          saveUsername();
          resetDialogState();
        }}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Dialog.Footer>
    {#if errorMessage}
      <ErrorAlert bind:errorMessage />
    {/if}
  </Dialog.Content>
</Dialog.Root>
