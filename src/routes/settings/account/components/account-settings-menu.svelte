<script lang="ts">
  import { goto } from '$app/navigation';
  import { Separator } from '$lib/components/ui/separator';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { onMount } from 'svelte';
  import type { PageData } from '../$types';
  import DeleteAccountDialog from './delete-account-dialog.svelte';
  import UpdateEmailDialog from './update-email-dialog.svelte';
  import UpdatePasswordDialog from './update-password-dialog.svelte';
  import UpdateUsernameDialog from './update-username-dialog.svelte';

  const myUser = $derived(myUserContext.myUser);

  let { data }: { data: PageData } = $props();

  let isLoading = $state(false);

  let currentUsername = $state('');
  let currentEmail = $state('');

  // Subscribe to the myUser store
  $effect(() => {
    if (myUser) {
      console.log('myUser', myUser);

      currentUsername = myUser.userHandle || myUserContext.myUserHandle || '';
      currentEmail = myUser?.email || myUserContext.myEmail || '';
    } else {
      console.log('updateUserData', myUser);
      updateUserData();
    }
  });

  function updateUserData() {
    console.log('myUser', myUser);

    currentUsername =
      data.currentUsername || myUserContext.myUserHandle || myUser?.userHandle || '';
    currentEmail = data.email || myUserContext.myEmail || myUser?.email || '';
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
    <UpdateUsernameDialog
      {currentUsername}
      {currentEmail}
      usernameForm={data.usernameForm}
      onSave={async () => {
        await handleUsernameEmailChange();
      }}
    />

    <UpdateEmailDialog
      {currentEmail}
      emailForm={data.emailForm}
      onSave={async (newEmail) => {
        await handleUsernameEmailChange();
      }}
    />

    <UpdatePasswordDialog passwordForm={data.passwordForm} />
  </div>

  <Separator class="my-6" />

  <h4 class="font-lexend mb-4 px-4 text-lg font-bold">Danger Zone</h4>
  <div class="space-y-4 px-4">
    <DeleteAccountDialog
      {currentEmail}
      deleteAccountForm={data.deleteAccountForm}
      onDelete={async () => {
        await handleAccountDeletion();
      }}
    />
  </div>
</div>
