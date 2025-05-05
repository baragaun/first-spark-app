<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import * as Tabs from '$components/ui/tabs/index.js';
  import { myUserContext } from '$contexts/my-user-context.svelte';
  import { onMount } from 'svelte';

  const isSignedIn = $derived(myUserContext.isSignedIn);

  const tabs = [
    { id: 'account', label: 'Account', path: '/settings/account' },
    { id: 'notifications', label: 'Notifications', path: '/settings/notifications' },
  ];

  let { children } = $props();

  let activeTab = $derived.by(() => {
    const path = page.url.pathname;
    if (path === '/settings') {
      return 'account';
    }
    return tabs.find((tab) => path.startsWith(tab.path))?.id || 'account';
  });

  onMount(() => {
    // TODO: This redirection should happen earlier but we are using the client to determine auth.
    // Maybe we can try to make it less jarring with Skeleton?
    if (!isSignedIn) {
      goto('/signin', { replaceState: true });
    }
  });
</script>

<div class="container py-8">
  <h1 class="font-lexend text-3xl font-bold tracking-tight">Settings</h1>

  <Tabs.Root value={activeTab} class="my-8">
    <Tabs.List class="mx-auto grid w-3/5 grid-cols-2 border-b">
      {#each tabs as tab}
        <Tabs.Trigger value={tab.id} onclick={() => goto(tab.path)}>
          {tab.label}
        </Tabs.Trigger>
      {/each}
    </Tabs.List>
    {#each tabs as tab}
      <Tabs.Content value={tab.id}>
        {@render children()}
      </Tabs.Content>
    {/each}
  </Tabs.Root>
</div>
