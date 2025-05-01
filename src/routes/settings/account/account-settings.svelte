<script lang="ts">
  import SettingsDialog from './components/settings-dialog.svelte';
  import UpdateUsernameForm from './components/update-username-form.svelte';
  import UpdateEmailForm from './components/update-email-form.svelte';
  import UpdatePasswordForm from './components/update-password-form.svelte';
  import DeleteAccountForm from './components/delete-account-form.svelte';
  import { Separator } from '$lib/components/ui/separator';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  
  let { data }: { data: PageData } = $props();

  let myEmail = $derived(myUserContext.myEmail);
  let myUsername = $derived(myUserContext.myUserHandle);

  let showUpdateUsernameDialog = $state(false);
  let showUpdateEmailDialog = $state(false);
  let showUpdatePasswordDialog = $state(false);
  let showDeleteAccountDialog = $state(false);

  const resetDialogStates = () => {
    showUpdateUsernameDialog = false;
    showUpdateEmailDialog = false;
    showUpdatePasswordDialog = false;
    showDeleteAccountDialog = false;
  };

  const handleDeleteAccount = () => {
    resetDialogStates();
    goto('/');
  }
</script>

<div class="space-y-8 py-8">
  <h4 class="font-lexend text-lg font-bold">Account</h4>
  <div class="space-y-4">
    <SettingsDialog
      label="My username"
      sublabel={myUsername || ''}
      title="Change your username"
      subtitle="You can change your username at anytime. Your previous username becomes immediately available for use."
      bind:showContent={showUpdateUsernameDialog}
    >
      <UpdateUsernameForm preValidatedForm={data.accountForms.usernameForm} onClose={resetDialogStates} />
    </SettingsDialog>

    <SettingsDialog
      label="My email"
      sublabel={myEmail || ''}
      title="Change your registered email"
      subtitle="Enter and different email and a verification code to update your account."
      bind:showContent={showUpdateEmailDialog}
    >
      <UpdateEmailForm preValidatedForm={data.accountForms.emailForm} onClose={resetDialogStates} />
    </SettingsDialog>

    <SettingsDialog
      label="My password"
      sublabel="********"
      title="Change your password"
      subtitle="Your password should be unique and updated regularly."
      bind:showContent={showUpdatePasswordDialog}
    >
      <UpdatePasswordForm preValidatedForm={data.accountForms.passwordForm} onClose={resetDialogStates} />
    </SettingsDialog>
  </div>

  <Separator />

  <h4 class="font-lexend text-lg font-bold">Danger Zone</h4>
  <div class="space-y-4">
    <SettingsDialog
      label="Delete my account"
      sublabel="Permanently delete your account and any associated data"
      title="Delete your account"
      subtitle={"We're sorry to see you go! Please provide any feedback you may have before departing so that we can better improve."}
      destructive={true}
      bind:showContent={showDeleteAccountDialog}
    >
      <DeleteAccountForm preValidatedForm={data.accountForms.deleteAccountForm} onClose={handleDeleteAccount} />
    </SettingsDialog>
  </div>
</div>
