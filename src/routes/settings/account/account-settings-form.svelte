<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Separator } from '$lib/components/ui/separator';
  import { ChevronRight, AlertTriangle } from 'lucide-svelte';
  import * as Alert from '$lib/components/ui/alert';
  import * as Dialog from '$lib/components/ui/dialog';
  import { goto } from '$app/navigation';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import { AlertDescription } from '$lib/components/ui/alert';
  import passwordHelpers from '$lib/helpers/password-helpers';
  import UpdateUsernameInput from '../../../lib/components/update-username-input.svelte';

  const { getPasswordError, validatePassword } = passwordHelpers;

  let isLoading = $state(false);
  let showDeleteConfirm = $state(false);
  let showEmailEdit = $state(false);
  let showConfirmation = $state(false);
  let showPasswordEdit = $state(false);

  let currentUsername = $state('johndoe');
  let emails = $state(['primary@example.com', 'secondary@example.com']);
  let newEmail = $state('');
  let confirmEmail = $state('');
  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');
  let error = $state('');

  let emailChangePassword = $state('');
  let emailChangeError = $state('');

  const handleUsernameChange = async (newUsername: string) => {
    // TODO: Implement username change API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    currentUsername = newUsername;
    return;
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
    if (!emailChangePassword) {
      emailChangeError = 'Current password is required';
      return;
    }

    try {
      isLoading = true;
      emailChangeError = '';
      // TODO: Implement email change API call with password verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showConfirmation = true;
      emailChangePassword = '';
    } catch (e) {
      emailChangeError = 'Invalid password. Please try again.';
      console.error('Email change failed:', e);
    } finally {
      isLoading = false;
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      error = 'Current password is required';
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      error = getPasswordError(newPassword);
      return;
    }

    if (newPassword !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    try {
      isLoading = true;
      error = '';
      // TODO: Implement password change API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showPasswordEdit = false;
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
    } catch (e) {
      error = 'Failed to update password. Please try again.';
      console.error('Password change failed:', e);
    } finally {
      isLoading = false;
    }
  };
</script>

<div>
  <h4 class="font-lexend mb-4 px-4 text-lg font-bold">General</h4>
  <div class="space-y-4 px-4">
    <UpdateUsernameInput {currentUsername} onSave={handleUsernameChange} />

    <!-- Email Dialog -->
    <button
      class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
      onclick={() => (showEmailEdit = true)}
    >
      <div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2">
        <p class="text-sm font-medium">Email</p>
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
      open={showEmailEdit}
      onOpenChange={(open: boolean) => {
        showEmailEdit = open;
        if (!open) {
          newEmail = '';
          emailChangePassword = '';
          emailChangeError = '';
          showConfirmation = false;
        }
      }}
    >
      <Dialog.Content class="sm:max-w-[425px]">
        {#if !showConfirmation}
          <Dialog.Header class="space-y-2">
            <Dialog.Title class="text-xl font-semibold">Change email</Dialog.Title>
            <Dialog.Description class="text-base text-muted-foreground">
              Enter your new email address and current password to verify.
            </Dialog.Description>
          </Dialog.Header>

          <form
            onsubmit={(e) => {
              e.preventDefault();
              handleEmailChange();
            }}
            class="mt-6 space-y-4"
          >
            {#if emailChangeError}
              <Alert.Root variant="destructive">
                <AlertDescription>{emailChangeError}</AlertDescription>
              </Alert.Root>
            {/if}

            <div class="rounded-lg border bg-muted/50 p-4">
              <p class="text-sm font-medium text-muted-foreground">Current Email</p>
              <p class="mt-1 text-base">{emails[0]}</p>
            </div>

            <div class="space-y-2">
              <label for="new-email" class="text-sm font-medium leading-none"> New Email </label>
              <Input
                id="new-email"
                type="email"
                placeholder="Enter new email address"
                bind:value={newEmail}
                required
              />
            </div>

            <div class="space-y-2">
              <label for="email-change-password" class="text-sm font-medium leading-none">
                Current Password
              </label>
              <PasswordInput
                id="email-change-password"
                placeholder="Enter your current password"
                bind:value={emailChangePassword}
                required
              />
            </div>

            <Dialog.Footer class="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                type="button"
                onclick={() => {
                  showEmailEdit = false;
                  newEmail = '';
                  emailChangePassword = '';
                  emailChangeError = '';
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !newEmail || !emailChangePassword || newEmail === emails[0]}
              >
                {isLoading ? 'Verifying...' : 'Continue'}
              </Button>
            </Dialog.Footer>
          </form>
        {:else}
          <!-- Confirmation Screen -->
          <Dialog.Header class="space-y-2">
            <Dialog.Title class="text-xl font-semibold">Check your email</Dialog.Title>
            <Dialog.Description class="text-base text-muted-foreground">
              We sent a verification link to {newEmail}. Click the link to confirm your new email
              address.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Footer class="mt-6 flex justify-end">
            <Button
              onclick={() => {
                showEmailEdit = false;
                newEmail = '';
                showConfirmation = false;
              }}
            >
              Close
            </Button>
          </Dialog.Footer>
        {/if}
      </Dialog.Content>
    </Dialog.Root>

    <!-- Password Dialog -->
    <button
      class="group flex w-full items-center justify-between rounded-lg py-2 hover:bg-muted/50"
      onclick={() => (showPasswordEdit = true)}
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

    <Dialog.Root
      open={showPasswordEdit}
      onOpenChange={(open: boolean) => {
        showPasswordEdit = open;
        if (!open) {
          currentPassword = '';
          newPassword = '';
          confirmPassword = '';
          error = '';
        }
      }}
    >
      <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header class="space-y-2">
          <Dialog.Title class="text-xl font-semibold">Change password</Dialog.Title>
          <Dialog.Description class="text-base text-muted-foreground">
            Enter your current password and choose a new one.
          </Dialog.Description>
        </Dialog.Header>

        <form
          onsubmit={(e) => {
            e.preventDefault();
            handlePasswordChange();
          }}
          class="mt-6 space-y-4"
        >
          {#if error}
            <Alert.Root variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert.Root>
          {/if}

          <div class="space-y-2">
            <label for="current-password" class="text-sm font-medium leading-none">
              Current Password
            </label>
            <PasswordInput
              id="current-password"
              placeholder="Enter current password"
              bind:value={currentPassword}
              required
            />
          </div>

          <div class="relative space-y-2">
            <label for="new-password" class="text-sm font-medium leading-none">
              New Password
            </label>
            <PasswordInput
              id="new-password"
              placeholder="Enter new password"
              bind:value={newPassword}
              required
            />
            {#if newPassword}
              <div class="space-y-2 text-xs">
                <p class="text-muted-foreground">Password requirements:</p>
                <ul class="list-inside list-disc space-y-1 pl-2">
                  <li
                    class:text-destructive={!validatePassword(newPassword).minLength}
                    class:text-green-500={validatePassword(newPassword).minLength}
                  >
                    At least 8 characters
                  </li>
                </ul>
              </div>
            {/if}
            {#if newPassword && getPasswordError(newPassword)}
              <p class="text-xs text-destructive">{getPasswordError(newPassword)}</p>
            {/if}
          </div>

          <div class="space-y-2">
            <label for="confirm-password" class="text-sm font-medium leading-none">
              Confirm New Password
            </label>
            <PasswordInput
              id="confirm-password"
              placeholder="Confirm new password"
              bind:value={confirmPassword}
              required
            />
            {#if confirmPassword && newPassword !== confirmPassword}
              <p class="text-xs text-destructive">Passwords do not match</p>
            {/if}
          </div>

          <Dialog.Footer class="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onclick={() => {
                showPasswordEdit = false;
                currentPassword = '';
                newPassword = '';
                confirmPassword = '';
                error = '';
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading ||
                !currentPassword ||
                !newPassword ||
                !validatePassword(newPassword).isValid ||
                newPassword !== confirmPassword}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Dialog.Footer>
        </form>
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
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
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
              Type your email <span class="text-muted-foreground">({emails[0]})</span> to confirm
            </label>
            <Input
              id="confirm-email"
              type="email"
              placeholder={emails[0]}
              bind:value={confirmEmail}
            />
          </div>
        </div>

        <Dialog.Footer class="mt-6 flex justify-end gap-2">
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
            disabled={isLoading ||
              confirmEmail.toLowerCase().trim() !== emails[0].toLowerCase().trim()}
            onclick={handleAccountDeletion}
          >
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  </div>
</div>
