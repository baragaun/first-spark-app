<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Separator } from '$lib/components/ui/separator';
  import { ChevronRight, AlertTriangle } from 'lucide-svelte';
  import * as Alert from '$lib/components/ui/alert';
  import { goto } from '$app/navigation';

  // State management using Svelte 5 runes
  let isLoading = $state(false);
  let showDeleteConfirm = $state(false);
  let showUsernameEdit = $state(false);
  let currentUsername = $state('johndoe'); // Replace with actual username from auth
  let newUsername = $state('');
  let emails = $state(['primary@example.com', 'secondary@example.com']); // Replace with actual emails

  const handleUsernameChange = async () => {
    try {
      isLoading = true;
      // TODO: Implement username change API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      currentUsername = newUsername;
      showUsernameEdit = false;
    } catch (error) {
      console.error('Failed to update username:', error);
    } finally {
      isLoading = false;
    }
  };

  const handleEmailRemoval = async (email: string) => {
    try {
      isLoading = true;
      // TODO: Implement email removal API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      emails = emails.filter((e) => e !== email);
    } catch (error) {
      console.error('Failed to remove email:', error);
    } finally {
      isLoading = false;
    }
  };

  const handlePasswordChange = async () => {
    isLoading = true;
    try {
      // TODO: Implement password change logic
      await goto('/reset-password');
    } finally {
      isLoading = false;
    }
  };

  const handleSignOutAll = async () => {
    try {
      isLoading = true;
      // TODO: Implement sign out from all devices logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      isLoading = false;
    }
  };

  const handleDataDownload = async () => {
    try {
      isLoading = true;
      // TODO: Implement data download logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulate file download
      const dummyData = JSON.stringify({ user: currentUsername, data: 'example' });
      const blob = new Blob([dummyData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentUsername}-data.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      isLoading = false;
    }
  };

  const handleAccountDeletion = async () => {
    try {
      isLoading = true;
      // TODO: Implement account deletion logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await goto('/signup');
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="space-y-6">
  <!-- General Section -->
  <div>
    <h4 class="font-lexend mb-4 px-4 text-lg font-bold">General</h4>
    <div class="space-y-4 px-4">
      <!-- Username -->
      {#if !showUsernameEdit}
        <button
          class="flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
          onclick={() => (showUsernameEdit = true)}
        >
          <p class="text-sm font-medium">Username</p>
          <div class="flex items-center gap-2">
            <p class="text-sm text-muted-foreground">{currentUsername}</p>
            <ChevronRight class="h-4 w-4" />
          </div>
        </button>
      {:else}
        <div class="py-2">
          <div class="flex items-center gap-4">
            <p class="font-lexend text-lg font-medium">Username</p>
            <div class="flex flex-1 items-center justify-end gap-2">
              <Input
                type="text"
                placeholder="New username"
                bind:value={newUsername}
                class="max-w-[200px]"
              />
              <Button size="sm" disabled={isLoading || !newUsername} onclick={handleUsernameChange}>
                Save
              </Button>
              <Button size="sm" variant="outline" onclick={() => (showUsernameEdit = false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Email -->
      <button
        class="flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
        onclick={() => goto('/settings/email')}
      >
        <p class="text-sm font-medium">Email Addresses</p>
        <div class="flex items-center gap-2">
          <p class="text-sm text-muted-foreground">{emails[0]}</p>
          <ChevronRight class="h-4 w-4" />
        </div>
      </button>

      <!-- Password -->
      <button
        class="flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
        onclick={handlePasswordChange}
      >
        <p class="text-sm font-medium">Password</p>
        <div class="flex items-center gap-2">
          <p class="text-sm text-muted-foreground">Change your password</p>
          <ChevronRight class="h-4 w-4" />
        </div>
      </button>

      <!-- Active Sessions -->
      <button
        class="flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
        onclick={handleSignOutAll}
      >
        <p class="text-sm font-medium">Active Sessions</p>
        <div class="flex items-center gap-2">
          <p class="text-sm text-muted-foreground">Sign out from all devices</p>
          <ChevronRight class="h-4 w-4" />
        </div>
      </button>

      <!-- Data Download -->
      <button
        class="flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
        onclick={handleDataDownload}
      >
        <p class="text-sm font-medium">Download Your Data</p>
        <div class="flex items-center gap-2">
          <p class="text-sm text-muted-foreground">Get a copy of your data</p>
          <ChevronRight class="h-4 w-4" />
        </div>
      </button>
    </div>
  </div>

  <Separator />

  <!-- Advanced Section -->
  <div>
    <h4 class="font-lexend mb-4 px-4 text-lg font-bold">Advanced</h4>
    <div class="space-y-4 px-4">
      <!-- Delete Account -->
      {#if !showDeleteConfirm}
        <button
          class="flex w-full items-center justify-between rounded-lg py-2 text-destructive hover:bg-destructive/10"
          onclick={() => (showDeleteConfirm = true)}
        >
          <p class="text-sm font-medium">Delete Account</p>
          <div class="flex items-center gap-2">
            <p class="text-sm opacity-70">Permanently delete your account</p>
            <ChevronRight class="h-4 w-4" />
          </div>
        </button>
      {:else}
        <Alert.Root variant="destructive" class="mt-4">
          <AlertTriangle class="h-4 w-4" />
          <Alert.Title>Are you absolutely sure?</Alert.Title>
          <Alert.Description>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </Alert.Description>
          <div class="mt-4 flex space-x-4">
            <Button variant="destructive" disabled={isLoading} onclick={handleAccountDeletion}>
              {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
            </Button>
            <Button
              variant="outline"
              disabled={isLoading}
              onclick={() => (showDeleteConfirm = false)}
            >
              Cancel
            </Button>
          </div>
        </Alert.Root>
      {/if}
    </div>
  </div>
</div>
