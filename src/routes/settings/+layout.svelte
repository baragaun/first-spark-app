<script lang="ts">
  import { cn } from '$lib/utils';
  import { Button } from '$lib/components/ui/button';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  const tabs = [
    { id: 'account', label: 'Account', path: '/settings/account' },
    { id: 'notifications', label: 'Notifications', path: '/settings/notifications' },
  ];

  let { children } = $props();
  let activeTab = $derived.by(() => {
    const path = page.url.pathname;
    // If we're at /settings, default to account tab without changing URL
    if (path === '/settings') {
      return 'account';
    }
    return tabs.find((tab) => path.startsWith(tab.path))?.id || 'account';
  });
</script>

<div class="container py-6">
  <h1 class="font-lexend text-3xl font-bold tracking-tight">Settings</h1>
  <!-- Settings Navigation -->
  <div class="mt-8 border-b">
    <div class="flex space-x-8">
      {#each tabs as tab}
        <Button
          variant="ghost"
          class={cn(
            'relative h-9 rounded-none border-b-2 border-transparent px-4',
            activeTab === tab.id
              ? 'border-primary font-medium text-foreground'
              : 'text-muted-foreground',
          )}
          onclick={() => goto(tab.path)}
        >
          {tab.label}
        </Button>
      {/each}
    </div>
  </div>

  <!-- Settings Content -->
  <div class="mt-8">
    {@render children()}
  </div>
</div>
