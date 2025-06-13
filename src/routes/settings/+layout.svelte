<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import * as Tabs from '@/components/ui/tabs';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { m } from '@/paraglide/messages';

  const isSignedIn = $derived(myUserContext.isSignedIn);

  const tabs = [
    { id: 'account', label: m['setting.account'](), path: '/settings/account', disabled: false },
    {
      id: 'notifications',
      label: m['setting.notification'](),
      path: '/settings/notifications',
      disabled: true,
    },
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

    // Temporarily redirect from the `notifications` tab while it's disabled
    if (page.url.pathname.startsWith('/settings/notifications')) {
      goto('/settings/account', { replaceState: true });
    }
  });
</script>

<div class="container py-8">
  <h1 class="font-lexend text-3xl font-bold tracking-tight">{m['setting.setting_label']()}</h1>

  <Tabs.Root value={activeTab} class="my-8">
    <Tabs.List class="mx-auto grid w-3/5 grid-cols-2">
      {#each tabs as tab}
        <Tabs.Trigger value={tab.id} disabled={tab.disabled} onclick={() => goto(tab.path)}>
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
