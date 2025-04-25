<script lang="ts">
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

  let currentUsername = $state('');
  let currentEmail = $state('');

  onMount(() => {
    updateUserData();
  });

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

  const updateUserData = () => {
    console.log('myUser', myUser);

    currentUsername = myUserContext.myUserHandle || myUser?.userHandle || '';
    currentEmail = myUserContext.myEmail || myUser?.email || '';
  };
</script>

<div>
  <h4 class="font-lexend mb-4 px-4 text-lg font-bold">General</h4>

  <div class="space-y-4 px-2">
    <UpdateUsernameDialog usernameForm={data.usernameForm} />

    <UpdateEmailDialog emailForm={data.emailForm} />

    <UpdatePasswordDialog passwordForm={data.passwordForm} />
  </div>

  <Separator class="my-6" />

  <h4 class="font-lexend mb-4 px-4 text-lg font-bold">Danger Zone</h4>
  <div class="space-y-4 px-2">
    <DeleteAccountDialog {currentEmail} deleteAccountForm={data.deleteAccountForm} />
  </div>
</div>
