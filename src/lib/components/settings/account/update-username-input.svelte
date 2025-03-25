<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ChevronRight, AlertCircle, Check, RefreshCw } from 'lucide-svelte';
  import * as Form from '$lib/components/ui/form/index';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { usernameSchema } from '../../../../routes/settings/account/account-settings-schema';

  interface UsernameInputProps {
    currentUsername: string;
    onSave: (newUsername: string) => Promise<void>;
    usernameForm: SuperValidated<Infer<typeof usernameSchema>>;
  }

  // Props using the interface
  let { currentUsername, onSave, usernameForm }: UsernameInputProps = $props();

  // Initialize superForm
  const form = superForm(usernameForm, {
    validators: zodClient(usernameSchema),
    dataType: 'json',
  });

  // Destructure form helpers
  const { form: formData, enhance } = form;

  // Group related state variables
  let isLoading = $state(false);
  let showUsernameEdit = $state(false);

  // Username state
  let newUsername = $state(currentUsername || '');
  let suggestedUsername = $state('');

  // Validation state
  let isChecking = $state(false);
  let isAvailable = $state<boolean | null>(null);
  let isGeneratingSuggestion = $state(false);

  // Utility variables
  let debounceTimer: number | null = $state(null);

  // Constants at the top level for better readability
  // Dummy data - simulating a database of taken usernames
  const takenUsernames = ['admin', 'moderator', 'taken', 'username', 'system'];

  // Dummy adjectives and nouns for username generation
  const adjectives = [
    'happy',
    'clever',
    'swift',
    'brave',
    'mighty',
    'gentle',
    'wise',
    'wild',
    'calm',
    'bold',
  ];

  const nouns = [
    'panda',
    'tiger',
    'eagle',
    'wolf',
    'dolphin',
    'falcon',
    'turtle',
    'fox',
    'owl',
    'bear',
  ];

  // Dummy function to generate a random username
  const generateUsername = async (): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate a random username
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);

    const suggestion = `${adjective}${noun}${randomNum}`;

    // Ensure it's not in our "taken" list
    if (takenUsernames.includes(suggestion.toLowerCase())) {
      // Try again if it's taken
      return generateUsername();
    }

    return suggestion;
  };

  // Function to get a suggested username
  const getSuggestedUsername = async () => {
    try {
      isGeneratingSuggestion = true;
      const suggestion = await generateUsername();
      suggestedUsername = suggestion;
      newUsername = suggestion;
      $formData.username = suggestion;

      // Since we know this is available (we just generated it)
      isAvailable = true;
      isChecking = false;
    } catch (error) {
      console.error('Error generating username suggestion:', error);
    } finally {
      isGeneratingSuggestion = false;
    }
  };

  // Get a suggestion when the dialog opens
  $effect(() => {
    if (showUsernameEdit && !suggestedUsername) {
      getSuggestedUsername();
    }
  });

  // Dummy function to check username availability
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Check against our dummy database
    return !takenUsernames.includes(username.toLowerCase());
  };

  // Reset dialog state when closed
  function resetDialogState() {
    newUsername = currentUsername;
    isAvailable = null;
    isChecking = false;
    suggestedUsername = '';
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }

  // Handle username change
  const handleUsernameChange = async () => {
    if (!isAvailable) return;
    try {
      isLoading = true;
      await onSave(newUsername);
      showUsernameEdit = false;
    } finally {
      isLoading = false;
    }
  };

  // Sync newUsername with form data
  $effect(() => {
    if ($formData.username) {
      newUsername = $formData.username;
    }
  });

  // Check username availability with debounce
  $effect(() => {
    // Skip check if no username or same as current
    if (!newUsername || newUsername === currentUsername) {
      isAvailable = null;
      isChecking = false;
      // isGeneratingSuggestion = false;
      return;
    }

    // If it's the suggested username, we already know it's available
    if (newUsername === suggestedUsername) {
      isAvailable = true;
      isChecking = false;
      // isGeneratingSuggestion = false;
      return;
    }

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    isChecking = true;
    debounceTimer = window.setTimeout(async () => {
      try {
        // Use our dummy function instead of actual API call
        isAvailable = await checkUsernameAvailability(newUsername);
      } catch (error) {
        console.error('Error checking username:', error);
        isAvailable = false;
      } finally {
        isChecking = false;
        debounceTimer = null;
      }
    }, 500); // Increased debounce time for better UX
  });
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

    <form method="POST" use:enhance class="grid gap-4 py-4">
      <div class="space-y-2">
        <label for="current-username" class="text-sm font-medium leading-none">
          Current Username
        </label>
        <Input id="current-username" value={currentUsername} disabled class="bg-muted" />
      </div>

      <Form.Field {form} name="username">
        <div class="flex items-center justify-between">
          <label for="username" class="text-sm font-medium leading-none">New Username</label>
          <Form.Button
            variant="ghost"
            size="sm"
            class="h-8 px-2 text-xs"
            type="button"
            disabled={isGeneratingSuggestion}
            onclick={getSuggestedUsername}
          >
            {#if isGeneratingSuggestion}
              <RefreshCw class="mr-1 h-3 w-3 animate-spin" />
              Generating...
            {:else}
              <RefreshCw class="mr-1 h-3 w-3" />
              Suggest new
            {/if}
          </Form.Button>
        </div>
        <Form.Control>
          {#snippet children({ props })}
            <div class="relative">
              <Input
                {...props}
                id="username"
                type="text"
                bind:value={$formData.username}
                class={isAvailable === false
                  ? 'border-red-500 pr-10 focus-visible:ring-red-500'
                  : 'pr-10'}
                disabled={isGeneratingSuggestion}
              />
              {#if isGeneratingSuggestion}
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <div
                    class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
                  ></div>
                </div>
              {:else if isChecking}
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <div
                    class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
                  ></div>
                </div>
              {:else if isAvailable === false}
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-red-500"
                >
                  <AlertCircle class="h-4 w-4" />
                </div>
              {:else if isAvailable === true}
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-green-500"
                >
                  <Check class="h-4 w-4" />
                </div>
              {/if}
            </div>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
        {#if isAvailable === false}
          <p class="text-xs text-red-500">This username is already taken</p>
        {:else if isAvailable === true}
          <p class="text-xs text-green-500">This username is available!</p>
        {/if}
      </Form.Field>
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
        disabled={isLoading ||
          !newUsername ||
          newUsername === currentUsername ||
          isChecking ||
          isAvailable !== true ||
          isGeneratingSuggestion}
        onclick={handleUsernameChange}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
