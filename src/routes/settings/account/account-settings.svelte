<script lang="ts">
  import { Separator } from '$lib/components/ui/separator';
  import { m } from '$lib/paraglide/messages';
  import DeleteAccountForm from './components/delete-account-form.svelte';
  import SettingsDialog from './components/settings-dialog.svelte';
  import UpdateEmailForm from './components/update-email-form.svelte';
  import UpdatePasswordForm from './components/update-password-form.svelte';
  import UpdateUsernameForm from './components/update-username-form.svelte';

  let { 
    data,
    myUser,
   } = $props();

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
</script>

<div class="space-y-8 py-8">
  <h4 class="font-lexend text-lg font-bold">{m['setting.account']()}</h4>
  <div class="space-y-4">
    <SettingsDialog
      label={m['setting.username.label']()}
      sublabel={myUser?.userHandle || ''}
      title={m['setting.username.change_username']()}
      subtitle={m['setting.username.change_username_description']()}
      bind:showContent={showUpdateUsernameDialog}
    >
      <UpdateUsernameForm
        preValidatedForm={data.accountForms.usernameForm}
        onClose={resetDialogStates}
      />
    </SettingsDialog>

    <SettingsDialog
      label={m['setting.email.label']()}
      sublabel={myUser?.email || ''}
      title={m['setting.email.change_email']()}
      subtitle={m['setting.email.change_email_description']()}
      bind:showContent={showUpdateEmailDialog}
    >
      <UpdateEmailForm preValidatedForm={data.accountForms.emailForm} onClose={resetDialogStates} />
    </SettingsDialog>

    <SettingsDialog
      label={m['setting.password.label']()}
      sublabel="********"
      title={m['setting.password.change_password']()}
      subtitle={m['setting.password.change_password_description']()}
      bind:showContent={showUpdatePasswordDialog}
    >
      <UpdatePasswordForm
        preValidatedForm={data.accountForms.passwordForm}
        onClose={resetDialogStates}
      />
    </SettingsDialog>
  </div>

  <Separator />
  <h4 class="font-lexend text-lg font-bold">{m['setting.danger_zone']()}</h4>
  <div class="flex cursor-pointer items-center justify-between rounded-lg hover:bg-muted/50">
    <SettingsDialog
      label={m['setting.delete_account.label']()}
      sublabel={m['setting.delete_account.sublabel']()}
      title={m['setting.delete_account.your_account']()}
      subtitle={m['setting.delete_account.delete_account_description']()}
      destructive={true}
      bind:showContent={showDeleteAccountDialog}
    >
      <DeleteAccountForm
        preValidatedForm={data.accountForms.deleteAccountForm}
        onClose={resetDialogStates}
      />
    </SettingsDialog>
  </div>
</div>
