<script lang="ts">
  import { Separator } from '$lib/components/ui/separator';
  import { Switch } from '$lib/components/ui/switch';

  interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    chatMessageReceived: boolean;
    buddyApprovedConnection: boolean;
    friendReceivedChat: boolean;
    pathfinderAcceptedConnection: boolean;
    unreadMessagesReminder: boolean;
    newMessageNotification: boolean;
    buddySubscribed: boolean;
    buddyUnsubscribed: boolean;
    conversationClosed: boolean;
    securityAlerts: boolean;
    newDeviceLogin: boolean;
    usernameChangeNotification: boolean;
    passwordChanges: boolean;
  }

  let {
    initialSettings = {
      emailNotifications: true,
      pushNotifications: true,
      chatMessageReceived: true,
      buddyApprovedConnection: true,
      friendReceivedChat: true,
      pathfinderAcceptedConnection: true,
      unreadMessagesReminder: true,
      newMessageNotification: true,
      buddySubscribed: true,
      buddyUnsubscribed: true,
      conversationClosed: true,
      securityAlerts: true,
      newDeviceLogin: true,
      usernameChangeNotification: true,
      passwordChanges: true,
    },
  } = $props<{ initialSettings?: NotificationSettings }>();

  let settings = $state<NotificationSettings>({ ...initialSettings });

  // Watch for changes and save automatically
  $effect(() => {
    if (JSON.stringify(settings) !== JSON.stringify(initialSettings)) {
      saveNotificationSettings();
      initialSettings = { ...settings };
    }
  });

  async function saveNotificationSettings(): Promise<void> {
    // TODO: Implement actual API call using the settings state variable
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
</script>

<div class="space-y-6">
  <!-- General Section -->
  <div>
    <h4 class="font-lexend mb-4 px-4 text-lg font-bold">General</h4>
    <div class="space-y-4 px-4">
      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="email-notifications" class="text-sm font-medium">Email Notifications</label>
          <p class="text-sm text-muted-foreground">Receive updates via email</p>
        </div>
        <Switch id="email-notifications" bind:checked={settings.emailNotifications} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="push-notifications" class="text-sm font-medium">Push Notifications</label>
          <p class="text-sm text-muted-foreground">Receive updates via push notifications</p>
        </div>
        <Switch id="push-notifications" bind:checked={settings.pushNotifications} />
      </div>
    </div>
  </div>

  <Separator />

  <!-- Message Section -->
  <div>
    <h4 class="font-lexend mb-4 px-4 text-lg font-bold">Message</h4>
    <div class="space-y-4 px-4">
      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="chat-messages" class="text-sm font-medium">Chat Messages</label>
          <p class="text-sm text-muted-foreground">Get notified when you receive a chat message</p>
        </div>
        <Switch id="chat-messages" bind:checked={settings.chatMessageReceived} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="buddy-connections" class="text-sm font-medium">Buddy Connections</label>
          <p class="text-sm text-muted-foreground">
            Get notified when your buddy approved your connection request
          </p>
        </div>
        <Switch id="buddy-connections" bind:checked={settings.buddyApprovedConnection} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="friend-chat-updates" class="text-sm font-medium">Friend Chat Updates</label>
          <p class="text-sm text-muted-foreground">
            Get notified when friends receive chat messages
          </p>
        </div>
        <Switch id="friend-chat-updates" bind:checked={settings.friendReceivedChat} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="pathfinder-updates" class="text-sm font-medium">Pathfinder Updates</label>
          <p class="text-sm text-muted-foreground">
            Get notified when Pathfinder accepted connection request
          </p>
        </div>
        <Switch id="pathfinder-updates" bind:checked={settings.pathfinderAcceptedConnection} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="unread-messages" class="text-sm font-medium">Unread Messages Reminder</label>
          <p class="text-sm text-muted-foreground">
            Receive email notification reminders for unread messages when away
          </p>
        </div>
        <Switch id="unread-messages" bind:checked={settings.unreadMessagesReminder} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="new-messages" class="text-sm font-medium">New Message Notifications</label>
          <p class="text-sm text-muted-foreground">Receive email notifications for new messages</p>
        </div>
        <Switch id="new-messages" bind:checked={settings.newMessageNotification} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="buddy-subscribed" class="text-sm font-medium">Buddy Subscriptions</label>
          <p class="text-sm text-muted-foreground">
            Receive email notifications when a Buddy subscribes to your chat
          </p>
        </div>
        <Switch id="buddy-subscribed" bind:checked={settings.buddySubscribed} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="buddy-unsubscribed" class="text-sm font-medium">Buddy Unsubscriptions</label>
          <p class="text-sm text-muted-foreground">
            Receive email notifications when a Buddy unsubscribes from your chat
          </p>
        </div>
        <Switch id="buddy-unsubscribed" bind:checked={settings.buddyUnsubscribed} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="conversation-closed" class="text-sm font-medium">Conversation Closed</label>
          <p class="text-sm text-muted-foreground">
            Receive email notifications when a conversation is closed
          </p>
        </div>
        <Switch id="conversation-closed" bind:checked={settings.conversationClosed} />
      </div>
    </div>
  </div>

  <Separator />

  <!-- Security Section -->
  <div>
    <h4 class="font-lexend mb-4 px-4 text-lg font-bold">Security</h4>
    <div class="space-y-4 px-4">
      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="security-alerts" class="text-sm font-medium">Security Alerts</label>
          <p class="text-sm text-muted-foreground">
            Get notified about important security updates and alerts
          </p>
        </div>
        <Switch id="security-alerts" bind:checked={settings.securityAlerts} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="new-device-login" class="text-sm font-medium">New Device Login</label>
          <p class="text-sm text-muted-foreground">
            Receive alerts when your account is accessed from a new device
          </p>
        </div>
        <Switch id="new-device-login" bind:checked={settings.newDeviceLogin} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="username-change" class="text-sm font-medium">Username Updates</label>
          <p class="text-sm text-muted-foreground">
            I am notified via email when my username is updated
          </p>
        </div>
        <Switch id="username-change" bind:checked={settings.usernameChangeNotification} />
      </div>

      <div class="flex items-center justify-between py-2">
        <div class="space-y-0.5">
          <label for="password-changes" class="text-sm font-medium">Password Changes</label>
          <p class="text-sm text-muted-foreground">
            Receive notifications when your password is changed
          </p>
        </div>
        <Switch id="password-changes" bind:checked={settings.passwordChanges} />
      </div>
    </div>
  </div>
</div>
