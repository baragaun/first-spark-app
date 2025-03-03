<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { cn } from '$lib/utils';

  interface NotificationChannels {
    emailNotifications: boolean;
    pushNotifications: boolean;
  }

  interface NotificationEvents {
    chatMessageReceived: boolean;
    buddyApprovedConnection: boolean;
    friendReceivedChat: boolean;
    pathfinderAcceptedConnection: boolean;
  }

  interface SecurityNotifications {
    recoveryCodeUsed: boolean;
    passwordChanged: boolean;
    usernameChanged: boolean;
  }

  interface NotificationSettings
    extends NotificationChannels,
      NotificationEvents,
      SecurityNotifications {}

  type NotificationEventConfig = {
    id: string;
    label: string;
    checked: boolean;
  };

  // Props declaration using runes
  let {
    initialSettings = {
      emailNotifications: true,
      pushNotifications: true,
      chatMessageReceived: true,
      buddyApprovedConnection: true,
      friendReceivedChat: true,
      pathfinderAcceptedConnection: true,
      recoveryCodeUsed: true,
      passwordChanged: true,
      usernameChanged: true,
    },
  } = $props<{ initialSettings?: NotificationSettings }>();

  // State management
  let isLoading = $state(false);
  let emailNotifications = $state(initialSettings.emailNotifications);
  let pushNotifications = $state(initialSettings.pushNotifications);
  let notificationEvents = $state([
    {
      id: 'chat-message-received',
      label: 'I received a chat message',
      checked: initialSettings.chatMessageReceived,
    },
    {
      id: 'buddy-approved-connection',
      label: 'My buddy approved my connection request',
      checked: initialSettings.buddyApprovedConnection,
    },
    {
      id: 'friend-received-chat',
      label: 'My friend received a chat message',
      checked: initialSettings.friendReceivedChat,
    },
    {
      id: 'pathfinder-accepted-connection',
      label: 'Pathfinder accepted connection request',
      checked: initialSettings.pathfinderAcceptedConnection,
    },
  ]);

  let securityNotifications = $state([
    {
      id: 'recovery-code-used',
      label: 'I am notified via email when a recovery code is consumed',
      checked: initialSettings.recoveryCodeUsed,
    },
    {
      id: 'password-changed',
      label: 'I am notified via email when my password is changed',
      checked: initialSettings.passwordChanged,
    },
    {
      id: 'username-changed',
      label: 'I am notified via email when my username is changed',
      checked: initialSettings.usernameChanged,
    },
  ]);

  // Derived state
  let hasChanges = $derived(
    emailNotifications !== initialSettings.emailNotifications ||
      pushNotifications !== initialSettings.pushNotifications ||
      notificationEvents[0].checked !== initialSettings.chatMessageReceived ||
      notificationEvents[1].checked !== initialSettings.buddyApprovedConnection ||
      notificationEvents[2].checked !== initialSettings.friendReceivedChat ||
      notificationEvents[3].checked !== initialSettings.pathfinderAcceptedConnection ||
      securityNotifications[0].checked !== initialSettings.recoveryCodeUsed ||
      securityNotifications[1].checked !== initialSettings.passwordChanged ||
      securityNotifications[2].checked !== initialSettings.usernameChanged,
  );

  // Effect for tracking changes
  $effect(() => {
    if (hasChanges) {
      console.log('Notification settings changed');
    }
  });

  const handleSave = async () => {
    try {
      isLoading = true;
      const settings: NotificationSettings = {
        emailNotifications,
        pushNotifications,
        chatMessageReceived: notificationEvents[0].checked,
        buddyApprovedConnection: notificationEvents[1].checked,
        friendReceivedChat: notificationEvents[2].checked,
        pathfinderAcceptedConnection: notificationEvents[3].checked,
        recoveryCodeUsed: securityNotifications[0].checked,
        passwordChanged: securityNotifications[1].checked,
        usernameChanged: securityNotifications[2].checked,
      };
      // TODO: Implement API call
      await saveNotificationSettings(settings);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      isLoading = false;
    }
  };

  async function saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    // TODO: Implement actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
</script>

<div class="space-y-6">
  <div>
    <h3 class="font-lexend text-lg font-medium">Notification Preferences</h3>
    <p class="text-sm text-muted-foreground">Manage your notification settings and preferences.</p>
  </div>

  <div class="space-y-4">
    <!-- Notification Channels -->
    <Card.Root>
      <Card.Header>
        <Card.Title>Notification Channels</Card.Title>
        <Card.Description>Choose how you want to receive notifications.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="email-notifications"
              bind:checked={emailNotifications}
              class={cn('h-4 w-4 rounded border-input', 'focus:ring-2 focus:ring-primary')}
            />
            <label
              for="email-notifications"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email Notifications
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="push-notifications"
              bind:checked={pushNotifications}
              class={cn('h-4 w-4 rounded border-input', 'focus:ring-2 focus:ring-primary')}
            />
            <label
              for="push-notifications"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Push Notifications
            </label>
          </div>
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Event Subscriptions -->
    <Card.Root>
      <Card.Header>
        <Card.Title>Event Subscriptions</Card.Title>
        <Card.Description>Choose which events you want to be notified about.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="space-y-4">
          {#each notificationEvents as event, i}
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id={event.id}
                bind:checked={notificationEvents[i].checked}
                class={cn('h-4 w-4 rounded border-input', 'focus:ring-2 focus:ring-primary')}
              />
              <label
                for={event.id}
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {event.label}
              </label>
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Security Notifications -->
    <Card.Root>
      <Card.Header>
        <Card.Title>Security Notifications</Card.Title>
        <Card.Description
          >Choose which security events you want to be notified about.</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <div class="space-y-4">
          {#each securityNotifications as notification, i}
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id={notification.id}
                bind:checked={securityNotifications[i].checked}
                class={cn('h-4 w-4 rounded border-input', 'focus:ring-2 focus:ring-primary')}
              />
              <label
                for={notification.id}
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {notification.label}
              </label>
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Save Button -->
    <div class="flex justify-end">
      <Button
        disabled={isLoading || !hasChanges}
        onclick={handleSave}
        class={cn('min-w-[100px]', isLoading && 'cursor-not-allowed opacity-50')}
      >
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  </div>
</div>
