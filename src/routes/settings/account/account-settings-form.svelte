<script lang="ts">
  import { goto } from '$app/navigation';
  import { Separator } from '$lib/components/ui/separator';
  import UpdateUsernameInput from '$lib/components/settings/account/update-username-input.svelte';
  import UpdateEmailInput from '$lib/components/settings/account/update-email-input.svelte';
  import UpdatePasswordInput from '$lib/components/settings/account/update-password-input.svelte';
  import DeleteAccountInput from '$lib/components/settings/account/delete-account-input.svelte';
  import type { PageData } from './$types';

  // Get the form data from the page data
  let { data }: { data: PageData } = $props();

  let isLoading = $state(false);

  // User data (would come from API in real implementation)
  let currentUsername = $state(data.currentUsername || 'johndoe');
  let currentEmail = $state(data.emails?.[0] || 'primary@example.com');

  const handleUsernameChange = async (newUsername: string): Promise<void> => {
    try {
      isLoading = true;
      // Call the API to update the username
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
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
