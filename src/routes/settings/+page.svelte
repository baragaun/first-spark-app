<script lang="ts">
  import { cn } from '$lib/utils';
  import AccountSettings from '@/components/settings-ui/account-settings.svelte';
  import NotificationSettings from '@/components/settings-ui/notification-settings.svelte';
  import { Button } from '$lib/components/ui/button';

  // State management using Svelte 5 runes
  let activeTab = $state('account'); // 'account' or 'notifications'
</script>

<div class="container py-6">
  <h1 class="font-lexend text-3xl font-bold tracking-tight">Settings</h1>

  <!-- Settings Navigation -->
  <div class="mt-8 border-b">
    <div class="flex space-x-8">
      <Button
        variant="ghost"
        class={cn(
          'relative h-9 rounded-none border-b-2 border-transparent px-4',
          activeTab === 'account' && 'border-primary font-medium text-foreground',
          activeTab !== 'account' && 'text-muted-foreground',
        )}
        onclick={() => (activeTab = 'account')}
      >
        Account
      </Button>
      <Button
        variant="ghost"
        class={cn(
          'relative h-9 rounded-none border-b-2 border-transparent px-4',
          activeTab === 'notifications' && 'border-primary font-medium text-foreground',
          activeTab !== 'notifications' && 'text-muted-foreground',
        )}
        onclick={() => (activeTab = 'notifications')}
      >
        Notifications
      </Button>
    </div>
  </div>

  <!-- Settings Content -->
  <div class="mt-8">
    {#if activeTab === 'account'}
      <AccountSettings />
    {:else if activeTab === 'notifications'}
      <NotificationSettings />
    {/if}
  </div>
</div>
