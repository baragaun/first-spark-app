<script lang="ts">
  import { cn } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';

  // Notification settings state using Svelte 5 runes
  let emailNotifications = $state(true);
  let pushNotifications = $state(true);
  let isLoading = $state(false);

  // Event subscription states
  let chatMessageReceived = $state(true);
  let buddyApprovedConnection = $state(true);
  let friendReceivedChat = $state(true);
  let pathfinderAcceptedConnection = $state(true);

  // User role state
  let userRole = $state<'student' | 'pathfinder'>('student');

  const handleSave = async () => {};
</script>

<div class="container py-6">
  <div class="flex items-center justify-between">
    <h1 class="font-lexend text-3xl font-bold tracking-tight">Notification Settings</h1>
    <Button variant="outline" href="/settings">Back to Settings</Button>
  </div>

  <div class="mt-8 space-y-6">
    <!-- General Notification Settings -->
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
              class="h-4 w-4 rounded border-input"
            />
            <label for="email-notifications">Email Notifications</label>
          </div>
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="push-notifications"
              bind:checked={pushNotifications}
              class="h-4 w-4 rounded border-input"
            />
            <label for="push-notifications">Push Notifications</label>
          </div>
        </div>
      </Card.Content>
    </Card.Root>

    <!-- User Role Selection -->
    <Card.Root>
      <Card.Header>
        <Card.Title>User Role</Card.Title>
        <Card.Description>Specify your role in the system</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2">
            <input
              type="radio"
              name="userRole"
              value="student"
              bind:group={userRole}
              class="h-4 w-4"
            />
            <span>Student</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
              type="radio"
              name="userRole"
              value="pathfinder"
              bind:group={userRole}
              class="h-4 w-4"
            />
            <span>Pathfinder</span>
          </label>
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
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="chat-message-received"
              bind:checked={chatMessageReceived}
              class="h-4 w-4 rounded border-input"
            />
            <label for="chat-message-received">I received a chat message</label>
          </div>
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="buddy-approved-connection"
              bind:checked={buddyApprovedConnection}
              class="h-4 w-4 rounded border-input"
            />
            <label for="buddy-approved-connection">My buddy approved my connection request</label>
          </div>
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="friend-received-chat"
              bind:checked={friendReceivedChat}
              class="h-4 w-4 rounded border-input"
            />
            <label for="friend-received-chat">My friend received a chat message</label>
          </div>
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="pathfinder-accepted-connection"
              bind:checked={pathfinderAcceptedConnection}
              class="h-4 w-4 rounded border-input"
            />
            <label for="pathfinder-accepted-connection"
              >Pathfinder accepted connection request</label
            >
          </div>
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Save Button -->
    <div class="flex justify-end">
      <Button disabled={isLoading} onclick={handleSave}>
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  </div>
</div>
