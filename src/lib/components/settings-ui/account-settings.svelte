<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Separator } from '$lib/components/ui/separator';
  import { ChevronRight, AlertTriangle } from 'lucide-svelte';
  import * as Alert from '$lib/components/ui/alert';
  import * as Dialog from '$lib/components/ui/dialog';
  import DialogOverlayBlur from '$lib/components/ui/dialog/dialog-overlay-blur.svelte';
  import { goto } from '$app/navigation';

  // State management using Svelte 5 runes
  let isLoading = $state(false);
  let showDeleteConfirm = $state(false);
  let showUsernameEdit = $state(false);
  let showEmailEdit = $state(false);
  let showSessionsEdit = $state(false);
  let showDataDownload = $state(false);
  let confirmEmail = $state(''); // Add this line
  let hasPassword = $state(false); // Add this line
  let showConfirmation = $state(false);

  let currentUsername = $state('johndoe');
  let newUsername = $state('');
  let emails = $state(['primary@example.com', 'secondary@example.com']);
  let newEmail = $state('');

  const handleUsernameChange = async () => {
    try {
      isLoading = true;
      // TODO: Implement username change API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      currentUsername = newUsername;
      showUsernameEdit = false;
    } finally {
      isLoading = false;
    }
  };

  const handleEmailAdd = async () => {
    try {
      isLoading = true;
      // TODO: Implement email addition API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      emails = [...emails, newEmail];
      showEmailEdit = false;
      newEmail = '';
    } finally {
      isLoading = false;
    }
  };

  const handleSignOutAll = async () => {
    try {
      isLoading = true;
      // TODO: Implement sign out from all devices API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSessionsEdit = false;
    } finally {
      isLoading = false;
    }
  };

  const handleDataDownload = async () => {
    try {
      isLoading = true;
      // TODO: Implement data download API call
      const dummyData = JSON.stringify({ user: currentUsername, data: 'example' });
      const blob = new Blob([dummyData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentUsername}-data.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      showDataDownload = false;
    } finally {
      isLoading = false;
    }
  };

  const handleAccountDeletion = async () => {
    try {
      isLoading = true;
      // TODO: Implement account deletion API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // After successful deletion, redirect to signup page
      goto('/signup');
    } finally {
      isLoading = false;
    }
  };

  const handleEmailChange = async () => {
    try {
      isLoading = true;
      // TODO: Implement email change API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      emails = [newEmail, ...emails.slice(1)];
      showEmailEdit = false;
      newEmail = '';
    } finally {
      isLoading = false;
    }
  };

  async function handleContinue() {
    try {
      isLoading = true;
      // TODO: Implement your API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showConfirmation = true;
    } catch (error) {
      // Handle error
      console.error('Error:', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="space-y-6">
  <!-- General Section -->
  <div>
    <h4 class="font-lexend mb-4 px-4 text-lg font-bold">General</h4>
    <div class="space-y-4 px-4">
      <!-- Username Dialog -->
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
        class=""
        open={showUsernameEdit}
        onOpenChange={(open: boolean) => {
          showUsernameEdit = open;
          if (!open) {
            newUsername = '';
          }
        }}
      >
        <DialogOverlayBlur class="fixed inset-0 z-50" />
        <Dialog.Content class="sm:max-w-[425px]">
          <Dialog.Header class="space-y-2">
            <Dialog.Title class="text-lg font-semibold">Change Username</Dialog.Title>
            <Dialog.Description class="text-sm text-muted-foreground">
              Enter a new username for your account. Choose something unique and memorable.
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
              <label for="new-username" class="text-sm font-medium leading-none">
                New Username
              </label>
              <Input
                id="new-username"
                type="text"
                placeholder="Enter new username"
                bind:value={newUsername}
              />
            </div>
          </div>

          <Dialog.Footer class="flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={isLoading}
              onclick={() => {
                showUsernameEdit = false;
                newUsername = '';
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading || !newUsername || newUsername === currentUsername}
              onclick={handleUsernameChange}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <!-- Email Dialog -->
      <button
        class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
        onclick={() => (showEmailEdit = true)}
      >
        <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
          <p class="text-sm font-medium">Email Addresses</p>
        </div>
        <div class="flex items-center gap-2">
          <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
            {emails[0]}
          </p>
          <ChevronRight
            class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </div>
      </button>

      <Dialog.Root
        class=""
        open={showEmailEdit}
        onOpenChange={(open: boolean) => {
          showEmailEdit = open;
          if (!open) {
            newEmail = '';
            showConfirmation = false;
          }
        }}
      >
        <Dialog.Content class="sm:max-w-[425px]">
          {#if !showConfirmation}
            <!-- Initial Email Change Screen -->
            <Dialog.Header class="space-y-2">
              <Dialog.Title class="text-xl font-semibold">Change your email address</Dialog.Title>
              <Dialog.Description class="text-base text-muted-foreground">
                To change your email address, you need to create a password first. We'll walk you
                through it.
              </Dialog.Description>
            </Dialog.Header>

            <div class="mt-6 space-y-4">
              <div class="rounded-lg border bg-muted/50 p-4">
                <p class="text-sm font-medium text-muted-foreground">Current Email</p>
                <p class="mt-1 text-base">{emails[0]}</p>
              </div>

              {#if hasPassword}
                <div class="space-y-2">
                  <label for="new-email" class="text-sm font-medium leading-none">
                    New Email Address
                  </label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="Enter new email address"
                    bind:value={newEmail}
                  />
                </div>
              {/if}
            </div>

            <Dialog.Footer class="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onclick={() => {
                  showEmailEdit = false;
                  newEmail = '';
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                onclick={async () => {
                  await handleContinue();
                }}
              >
                Continue
              </Button>
            </Dialog.Footer>
          {:else}
            <!-- Confirmation Screen -->
            <Dialog.Header class="space-y-2">
              <Dialog.Title class="text-xl font-semibold">Check your email</Dialog.Title>
              <Dialog.Description class="text-base text-muted-foreground">
                We sent a message to {emails[0]} with a link to create your password.
              </Dialog.Description>
            </Dialog.Header>

            <Dialog.Footer class="mt-6">
              <Button
                class="w-full"
                onclick={() => {
                  showEmailEdit = false;
                  showConfirmation = false;
                }}
              >
                Done
              </Button>
            </Dialog.Footer>
          {/if}
        </Dialog.Content>
      </Dialog.Root>

      <!-- Password Dialog -->
      <button
        class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
        onclick={() => goto('/reset-password')}
      >
        <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
          <p class="text-sm font-medium">Password</p>
        </div>
        <div class="flex items-center gap-2">
          <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
            Change your password
          </p>
          <ChevronRight
            class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </div>
      </button>

      <!-- Sessions Dialog -->
      <button
        class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
        onclick={() => (showSessionsEdit = true)}
      >
        <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
          <p class="text-sm font-medium">Active Sessions</p>
        </div>
        <div class="flex items-center gap-2">
          <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
            Sign out from all devices
          </p>
          <ChevronRight
            class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </div>
      </button>

      <Dialog.Root
        class=""
        open={showSessionsEdit}
        onOpenChange={(open: boolean) => {
          showSessionsEdit = open;
        }}
      >
        <Dialog.Content class="sm:max-w-[425px]">
          <Dialog.Header class="space-y-2">
            <Dialog.Title class="text-lg font-semibold">Active Sessions</Dialog.Title>
            <Dialog.Description class="text-sm text-muted-foreground">
              Sign out from all devices except your current session.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Footer class="flex justify-end gap-2">
            <Button variant="outline" onclick={() => (showSessionsEdit = false)}>Cancel</Button>
            <Button variant="destructive" disabled={isLoading} onclick={handleSignOutAll}>
              {isLoading ? 'Signing out...' : 'Sign Out All Devices'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <!-- Data Download Dialog -->
      <button
        class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
        onclick={() => (showDataDownload = true)}
      >
        <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
          <p class="text-sm font-medium">Download Your Data</p>
        </div>
        <div class="flex items-center gap-2">
          <p class="text-right text-sm text-muted-foreground group-hover:text-foreground">
            Get a copy of your data
          </p>
          <ChevronRight
            class="h-5 w-5 stroke-[2] text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </div>
      </button>

      <Dialog.Root
        class=""
        open={showDataDownload}
        onOpenChange={(open: boolean) => {
          showDataDownload = open;
        }}
      >
        <Dialog.Content class="sm:max-w-[425px]">
          <Dialog.Header class="space-y-2">
            <Dialog.Title class="text-lg font-semibold">Download Your Data</Dialog.Title>
            <Dialog.Description class="text-sm text-muted-foreground">
              Download a copy of all your personal data in JSON format.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Footer class="flex justify-end gap-2">
            <Button variant="outline" onclick={() => (showDataDownload = false)}>Cancel</Button>
            <Button disabled={isLoading} onclick={handleDataDownload}>
              {isLoading ? 'Preparing...' : 'Download Data'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>

  <Separator />

  <!-- Advanced Section with Delete Account Dialog -->
  <div>
    <h4 class="font-lexend mb-4 px-4 text-lg font-bold">Advanced</h4>
    <div class="space-y-4 px-4">
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
        class=""
        open={showDeleteConfirm}
        onOpenChange={(open: boolean) => {
          showDeleteConfirm = open;
          if (!open) {
            confirmEmail = '';
          }
        }}
      >
        <Dialog.Content class="sm:max-w-[425px]">
          <Dialog.Header class="space-y-2">
            <Dialog.Title class="text-lg font-semibold">Delete Account</Dialog.Title>
            <Dialog.Description class="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </Dialog.Description>
          </Dialog.Header>

          <Alert.Root variant="destructive" class="mt-4">
            <AlertTriangle class="h-4 w-4" />
            <Alert.Title>Are you absolutely sure?</Alert.Title>
            <Alert.Description>
              All your data will be permanently removed. This action cannot be undone.
            </Alert.Description>
          </Alert.Root>

          <div class="mt-4 space-y-4">
            <div class="space-y-2">
              <label for="confirm-email" class="text-sm font-medium leading-none">
                Confirm your email address
              </label>
              <Input
                id="confirm-email"
                type="email"
                placeholder="Enter your email address"
                bind:value={confirmEmail}
              />
            </div>
          </div>

          <Dialog.Footer class="flex justify-end gap-2">
            <Button
              variant="outline"
              onclick={() => {
                showDeleteConfirm = false;
                confirmEmail = '';
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isLoading || confirmEmail !== emails[0]}
              onclick={handleAccountDeletion}
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </div>
</div>
