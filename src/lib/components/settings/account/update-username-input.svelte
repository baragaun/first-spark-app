<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ChevronRight, AlertCircle, Check, RefreshCw } from 'lucide-svelte';

  interface UsernameInputProps {
    currentUsername: string;
    onSave: (newUsername: string) => Promise<void>;
  }

  // Props using the interface
  let { currentUsername, onSave }: UsernameInputProps = $props();

  // Group related state variables
  let isLoading = $state(false);
  let showUsernameEdit = $state(false);

  // Username state
  let newUsername = $state('');
  let suggestedUsername = $state('');

  // Validation state
  let isChecking = $state(false);
  let isAvailable = $state<boolean | null>(null);
  let isGeneratingSuggestion = $state(false);

  // Utility variables
  let debounceTimer: number | null = null;

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
    // Simulate API delay
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

  // Check username availability with debounce
  $effect(() => {
    // Skip check if no username or same as current
    if (!newUsername || newUsername === currentUsername) {
      isAvailable = null;
      isChecking = false;
      return;
    }

    // If it's the suggested username, we already know it's available
    if (newUsername === suggestedUsername) {
      isAvailable = true;
      isChecking = false;
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
    }, 200);
  });

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
</script>

Update-username-input<button
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
    if (!open) {
      newUsername = '';
      isAvailable = null;
      suggestedUsername = '';
    }
  }}
>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header class="space-y-2">
      <Dialog.Title class="text-lg font-semibold">Change Username</Dialog.Title>
      <Dialog.Description class="text-sm text-muted-foreground">
        Enter a new username for your account or use our suggestion.
      </Dialog.Description>
    </Dialog.Header>

    <div class="grid gap-4 py-4">
      <div class="space-y-2">
        <label for="current-username" class="text-sm font-medium leading-none">
          Current Username
        </label>
        <Input id="current-username" value={currentUsername} disabled class="bg-muted" />
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label for="new-username" class="text-sm font-medium leading-none"> New Username </label>
          <Button
            variant="ghost"
            size="sm"
            class="h-8 px-2 text-xs"
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
          </Button>
        </div>
        <div class="relative">
          <Input
            id="new-username"
            type="text"
            bind:value={newUsername}
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
        {#if isAvailable === false}
          <p class="text-xs text-red-500">This username is already taken</p>
        {/if}
      </div>
    </div>

    <Dialog.Footer class="flex justify-end gap-2">
      <Button
        variant="outline"
        disabled={isLoading}
        onclick={() => {
          showUsernameEdit = false;
          newUsername = '';
          suggestedUsername = '';
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
