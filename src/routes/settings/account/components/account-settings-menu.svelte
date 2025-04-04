<script lang="ts">
  import { goto } from '$app/navigation';
  import { Separator } from '$lib/components/ui/separator';
  import UpdateUsernameInput from './update-username-dialog.svelte';
  import UpdateEmailInput from './update-email-dialog.svelte';
  import UpdatePasswordInput from './update-password-dialog.svelte';
  import DeleteAccountInput from './delete-account-input.svelte';
  import type { PageData } from '../$types';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { onMount } from 'svelte';

  let { data }: { data: PageData } = $props();

  let isLoading = $state(false);

  let currentUsername = $state('');
  let currentEmail = $state('');

  function updateUserData() {
    currentUsername = data.currentUsername || myUserContext.myUserHandle || '';
    currentEmail = data.email || myUserContext.myEmail || '';
  }

  onMount(() => {
    updateUserData();
  });

  const handleUsernameEmailChange = async () => {
    try {
      isLoading = true;
      updateUserData();
      return true;
    } catch (error) {
      console.error('Error updating username:', error);
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
      {currentEmail}
      usernameForm={data.usernameForm}
      onSave={async () => {
        await handleUsernameEmailChange();
      }}
    />

    <UpdateEmailInput
      {currentEmail}
      emailForm={data.emailForm}
      onSave={async (newEmail) => {
        await handleUsernameEmailChange();
      }}
    />

    <UpdatePasswordInput passwordForm={data.passwordForm} />
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
