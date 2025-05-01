<script lang="ts">
  import { Separator } from '$lib/components/ui/separator';
  import { Switch } from '$lib/components/ui/switch';
  
  interface NotificationSettings {
    emailNotifications: boolean;
    usernameChangeNotification: boolean;
    passwordChanges: boolean;
  }

  let {
    initialSettings = {
      emailNotifications: true,
      usernameChangeNotification: true,
      passwordChanges: true,
    },
  } = $props<{ initialSettings?: NotificationSettings }>();

  let settings = $state<NotificationSettings>({ ...initialSettings });

  const toggleSetting = (key: keyof NotificationSettings) => {
    settings[key] = !settings[key];
  };
</script>

<div class="space-y-8 py-8">
  <div>
    <h4 class="font-lexend mb-4 text-lg font-bold">General</h4>
    <div class="space-y-4">
      <div
        class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/50"
        onclick={() => toggleSetting('emailNotifications')}
        onkeydown={(e) => e.key === 'Enter' && toggleSetting('emailNotifications')}
        tabindex="0"
        role="button"
      >
        <div class="space-y-0.5">
          <label for="email-notifications" class="text-sm font-medium">Email Notifications</label>
          <p class="text-sm text-muted-foreground">Receive updates via email</p>
        </div>
        <Switch
          id="email-notifications"
          checked={settings.emailNotifications}
          onchange={() => toggleSetting('emailNotifications')}
        />
      </div>
    </div>
  </div>

  <Separator />

  <!-- Security Section -->
  <div>
    <h4 class="font-lexend mb-4 text-lg font-bold">Security</h4>
    <div class="space-y-4">
      <div
        class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/50"
        onclick={() => toggleSetting('usernameChangeNotification')}
        onkeydown={(e) => e.key === 'Enter' && toggleSetting('usernameChangeNotification')}
        tabindex="0"
        role="button"
      >
        <div class="space-y-0.5">
          <label for="username-change" class="text-sm font-medium">Username Updates</label>
          <p class="text-sm text-muted-foreground">
            I am notified via email when my username is updated
          </p>
        </div>
        <Switch
          id="username-change"
          checked={settings.usernameChangeNotification}
          onchange={() => toggleSetting('usernameChangeNotification')}
        />
      </div>

      <div
        class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/50"
        onclick={() => toggleSetting('passwordChanges')}
        onkeydown={(e) => e.key === 'Enter' && toggleSetting('passwordChanges')}
        tabindex="0"
        role="button"
      >
        <div class="space-y-0.5">
          <label for="password-changes" class="text-sm font-medium">Password Changes</label>
          <p class="text-sm text-muted-foreground">
            Receive notifications when your password is changed
          </p>
        </div>
        <Switch
          id="password-changes"
          checked={settings.passwordChanges}
          onchange={() => toggleSetting('passwordChanges')}
        />
      </div>
    </div>
  </div>
</div>

<!-- <div>
  <h4 class="font-lexend mb-4 px-4 text-lg font-bold">General</h4>

  <div class="space-y-4 px-2">
    <UpdateUsernameDialog usernameForm={usernameForm} />

    <UpdateEmailDialog emailForm={emailForm} />

    <UpdatePasswordDialog passwordForm={passwordForm} />
  </div>

  <Separator class="my-6" />

  <h4 class="font-lexend mb-4 px-4 text-lg font-bold">Danger Zone</h4>
  <div class="space-y-4 px-2">
    <DeleteAccountDialog {currentEmail} deleteAccountForm={deleteAccountForm} />
  </div>
</div> -->
