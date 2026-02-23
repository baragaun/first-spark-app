<script lang="ts">
  import { getContext, hasContext, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import * as Tabs from '@/components/ui/tabs';
  import { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { m } from '@/paraglide/messages';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

  const isMobile = new IsMobile();

  const userContext = hasContext('myUserContext')
    ? getContext<MyUserContext>('myUserContext')
    : null;
  const isSignedIn = $derived(userContext?.isSignedIn ?? false);

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
    if (!isSignedIn) {
      goto('/signin', { replaceState: true });
    }

    // Temporarily redirect from the `notifications` tab while it's disabled
    if (page.url.pathname.startsWith('/settings/notifications')) {
      goto('/settings/account', { replaceState: true });
    }
  });
</script>

<div class="animate-fade-in container px-4 py-4 md:px-6">
  {#if !isMobile.current}
    <h1 class="text-2xl font-bold tracking-tight text-foreground">{m['setting.setting_label']()}</h1>
  {/if}

  <Tabs.Root value={activeTab} class="mt-6">
    <Tabs.List class="mx-auto grid w-full max-w-xs grid-cols-2 rounded-2xl bg-muted/50 p-1">
      {#each tabs as tab}
        <Tabs.Trigger
          value={tab.id}
          disabled={tab.disabled}
          onclick={() => goto(tab.path)}
          class="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
        >
          {tab.label}
        </Tabs.Trigger>
      {/each}
    </Tabs.List>
    {#each tabs as tab}
      <Tabs.Content value={tab.id} class="mt-6">
        {@render children()}
      </Tabs.Content>
    {/each}
  </Tabs.Root>
</div>
