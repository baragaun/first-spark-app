<script lang="ts">
  import { goto } from '$app/navigation';
  import { Separator } from '$lib/components/ui/separator';
  import UpdateUsernameInput from './update-username-dialog.svelte';
  import UpdateEmailInput from './update-email-input.svelte';
  import UpdatePasswordInput from './update-password-input.svelte';
  import DeleteAccountInput from './delete-account-input.svelte';
  import type { PageData } from '../$types';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  let { data }: { data: PageData } = $props();

  let isLoading = $state(false);

  // User data (would come from API in real implementation)
  let currentUsername = $state(data.currentUsername || myUserContext.myUserHandle || '');
  let currentEmail = $state(data.email || myUserContext.myEmail || '');

  const handleUsernameChange = async (newUsername: string): Promise<void> => {
    try {
      isLoading = true;
      // Call the API to update the username
      await new Promise((resolve) => setTimeout(resolve, 500));
      currentUsername = newUsername;
    } catch (error) {
      console.error('Error updating username:', error);
    } finally {
      isLoading = false;
    }
  };

  const handleEmailChange = async (newEmail: string) => {
    try {
      isLoading = true;
      // Call the API to update the email
      await new Promise((resolve) => setTimeout(resolve, 500));
      currentEmail = newEmail;
      return true;
    } catch (error) {
      console.error('Error updating email:', error);
      return false;
    } finally {
      isLoading = false;
    }
  };

  const handlePasswordChange = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      isLoading = true;
      // Call the API to update the password
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    } finally {
      isLoading = false;
    }
  };

  const handleAccountDeletion = async () => {
    try {
      isLoading = true;
      // Call the API to delete the account
      await new Promise((resolve) => setTimeout(resolve, 500));
      goto('/signup');
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    } finally {
      isLoading = false;
    }
  };
</script>

<div>
  <h4 class="font-lexend mb-4 px-4 text-lg font-bold">General</h4>
  <div class="space-y-4 px-4">
    <UpdateUsernameInput
      {currentUsername}
      usernameForm={data.usernameForm}
      onSave={handleUsernameChange}
    />

    <UpdateEmailInput
      {currentEmail}
      emailForm={data.emailForm}
      onSave={async (newEmail) => {
        await handleEmailChange(newEmail);
      }}
    />

    <UpdatePasswordInput
      passwordForm={data.passwordForm}
      onSave={async (passwordData) => {
        await handlePasswordChange(passwordData);
      }}
    />
  </div>

  <Separator class="my-6" />

  <h4 class="font-lexend mb-4 px-4 text-lg font-bold">Danger Zone</h4>
  <div class="space-y-4 px-4">
    <DeleteAccountInput
      {currentEmail}
      deleteAccountForm={data.deleteAccountForm}
      onDelete={async () => {
        await handleAccountDeletion();
      }}
    />
  </div>
</div>
