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

  interface UpdateUsernameDialogProps {
    currentUsername: string;
    onSave: (newUsername: string) => Promise<void>;
    usernameForm: SuperValidated<Infer<typeof usernameSchema>>;
  }

  // Props using the interface
  let { currentUsername, onSave, usernameForm }: UpdateUsernameDialogProps = $props();

  const form = superForm(usernameForm, {
    validators: zodClient(usernameSchema),
    validationMethod: 'oninput',
    dataType: 'json',
    delayMs: 300, // Add 300ms debounce for all form validations
  });

  const { form: formData, errors } = form;

  let isLoading = $state(false);
  let showUsernameEdit = $state(false);
  let isUsernameAvailable = $state(true);

  // Dummy data - simulating a database of taken usernames
  const takenUsernames = ['admin', 'moderator', 'taken', 'username', 'system'];

  // Dummy adjectives and nouns for username generation
  // const adjectives = [
  //   'happy',
  //   'clever',
  //   'swift',
  //   'brave',
  //   'mighty',
  //   'gentle',
  //   'wise',
  //   'wild',
  //   'calm',
  //   'bold',
  // ];

  // const nouns = [
  //   'panda',
  //   'tiger',
  //   'eagle',
  //   'wolf',
  //   'dolphin',
  //   'falcon',
  //   'turtle',
  //   'fox',
  //   'owl',
  //   'bear',
  // ];

  // // Dummy function to generate a random username
  // const getSuggestedHandle = async (): Promise<string> => {
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  //   const noun = nouns[Math.floor(Math.random() * nouns.length)];
  //   const randomNum = Math.floor(Math.random() * 1000);
  //   const suggestion = `${adjective}${noun}${randomNum}`;
  //   if (takenUsernames.includes(suggestion.toLowerCase())) {
  //     return getSuggestedHandle();
  //   }
  //   return suggestion;
  // };

  // Derived state to check if form has values and is valid
  let hasFormValues = $derived($formData.username && !$errors.username && isUsernameAvailable);

  // userContext function integration to find available User-handle
  const getSuggestedHandle = async (): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const result = await myUserContext.findAvailableUserHandle(currentUsername);
      console.log('getSuggestedHandle', result);
      if (typeof result === 'string') {
        return result;
      }
    } catch (error) {
      console.error('Error getting suggested handle:', error);
    }
    return '';
  };

  const checkUsernameAvailability = async (
    ident: string,
    type: UserIdentType,
  ): Promise<{ isAvailable: boolean; isCurrentIdent: boolean }> => {
    const isCurrentIdent =
      type === UserIdentType.userHandle && ident === myUserContext.myUserHandle;

    if (isCurrentIdent) {
      console.log('isCurrentIdent', { isCurrentIdent });
      isUsernameAvailable = false;
      return { isAvailable: isUsernameAvailable, isCurrentIdent: true };
    }

    try {
      const result = await myUserContext.isUserIdentAvailable(ident, type);
      isUsernameAvailable = result.isAvailable ?? false;
      console.log('checkUsernameAvailability', result.isAvailable);
      return { isAvailable: isUsernameAvailable, isCurrentIdent: false };
    } catch (error) {
      console.error('Error checking identifier availability:', error);
      return { isAvailable: false, isCurrentIdent: false };
    }
  };

  // Reset dialog state when closed
  function resetDialogState() {
    $formData.username = currentUsername;
  }

  // Handle username change
  const handleUsernameChange = async () => {
    try {
      isLoading = true;
      await onSave($formData.username);
      showUsernameEdit = false;
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
        {form}
        name="username"
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
      <Button type="submit" disabled={isLoading || !hasFormValues} onclick={handleUsernameChange}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
