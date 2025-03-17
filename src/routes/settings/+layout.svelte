<script lang="ts">
  import { cn } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  let { children } = $props();

  let activeTab = $derived.by(() => {
    const path = page.url.pathname;
    if (path.includes('/notifications')) return 'notifications';
    return 'account';
  });
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
        onclick={() => goto('/settings/account')}
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
        onclick={() => goto('/settings/notifications')}
      >
        Notifications
      </Button>
    </div>
  </div>

  <!-- Settings Content -->
  <div class="mt-8">
    {@render children()}
  </div>
</div>
