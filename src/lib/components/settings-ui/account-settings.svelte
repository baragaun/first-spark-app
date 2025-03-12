<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Separator } from '$lib/components/ui/separator';
  import { ChevronRight, AlertTriangle } from 'lucide-svelte';
  import * as Alert from '$lib/components/ui/alert';
  import * as Dialog from '$lib/components/ui/dialog';
  import DialogOverlayBlur from '$lib/components/ui/dialog/dialog-overlay-blur.svelte';
  import { goto } from '$app/navigation';
  import { PasswordInput } from '$lib/components/ui/password-input';
  import AlertDescription from '../ui/alert/alert-description.svelte';

  // State management using Svelte 5 runes
  let isLoading = $state(false);
  let showDeleteConfirm = $state(false);
  let showUsernameEdit = $state(false);
  let showEmailEdit = $state(false);
  // let showSessionsEdit = $state(false);
  // let showDataDownload = $state(false);
  let confirmEmail = $state('');
  let showConfirmation = $state(false);
  let showPasswordEdit = $state(false);

  let currentUsername = $state('johndoe');
  let newUsername = $state('');
  let emails = $state(['primary@example.com', 'secondary@example.com']);
  let newEmail = $state('');
  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');
  let error = $state('');

  let emailChangePassword = $state('');
  let emailChangeError = $state('');

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

  // handleEmail function removed as it's not being used

  /* Commenting out unused functions for milestone-1
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
  */

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

  // Remove unused handleContinue function since it's redundant with handleEmailChange

  type PasswordValidation = {
    minLength: boolean;
    notTooSimple: boolean;
    noRepetitivePattern: boolean;
    doesNotReuseEmail: boolean;
    isValid: boolean;
  };

  const commonPasswords = [
    '123456',
    'password',
    '123456789',
    '12345678',
    '12345',
    '1234567',
    '1234567890',
    'qwerty',
    'abc123',
    'password1',
  ];

  const validatePassword = (password: string): PasswordValidation => {
    const repetitivePattern = /^(.)\1+$/;
    const result: PasswordValidation = {
      minLength: true,
      notTooSimple: true,
      noRepetitivePattern: true,
      doesNotReuseEmail: true,
      isValid: true,
    };

    if (password.length < 8) {
      result.minLength = false;
      result.isValid = false;
    }

    if (commonPasswords.includes(password.toLowerCase())) {
      result.notTooSimple = false;
      result.isValid = false;
    }

    if (repetitivePattern.test(password)) {
      result.noRepetitivePattern = false;
      result.isValid = false;
    }

    if (emails[0]) {
      const firstEmailPart = emails[0].split('@')[0];
      if (firstEmailPart && password.toLowerCase().includes(firstEmailPart.toLowerCase())) {
        result.doesNotReuseEmail = false;
        result.isValid = false;
      }
    }

    return result;
  };

  const getPasswordError = (password: string) => {
    if (!password) {
      return '';
    }

    const validation = validatePassword(password);

    if (!validation.minLength) {
      return 'Password must be at least 8 characters long';
    }

    if (
      !validation.notTooSimple ||
      !validation.noRepetitivePattern ||
      !validation.doesNotReuseEmail
    ) {
      return 'Password is too simple or guessable';
    }

    return '';
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
        class=""
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
              <Dialog.Title class="text-xl font-semibold">Change your email</Dialog.Title>
              <Dialog.Description class="text-base text-muted-foreground">
                Enter your current password and new email address.
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
                  disabled={isLoading ||
                    !newEmail ||
                    !emailChangePassword ||
                    newEmail === emails[0]}
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

            <Dialog.Footer class="mt-6">
              <Button
                class="w-full"
                onclick={() => {
                  showEmailEdit = false;
                  showConfirmation = false;
                  newEmail = '';
                  emailChangePassword = '';
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
        class=""
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

      <!-- Sessions Dialog - Commented out for milestone-1
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
      -->

      <!-- Data Download Dialog - Commented out for milestone-1
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
      -->
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
</div>
