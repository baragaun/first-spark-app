<script lang="ts">
  import BookUser from 'lucide-svelte/icons/book-user';
  import House from 'lucide-svelte/icons/house';
  import Inbox from 'lucide-svelte/icons/inbox';
  import MessageSquare from 'lucide-svelte/icons/message-square';
  import Settings from 'lucide-svelte/icons/settings';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import type { ComponentProps } from 'svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { m } from '$lib/paraglide/messages';
  import { page } from '$app/state';
  import { PlugZap, Zap } from 'lucide-svelte';
  import { Button } from '../ui/button';

  const isOnline = $derived(!myUserContext.isOffline);
  const isSignedIn = $derived(myUserContext.isSignedIn);
  const isDevEnv = $derived(import.meta.env.DEV);

  const isItemActive = (itemUrl: string, currentPath: string): boolean => {
    if (itemUrl === '/') {
      return currentPath === '/';
    }
    return itemUrl !== '#' && currentPath.startsWith(itemUrl);
  };

  const items = [
    {
      title: m['sidebar.menu.home'](),
      url: '/',
      icon: House,
    },
    {
      title: m['sidebar.menu.inbox'](),
      url: '#',
      icon: Inbox,
    },
    {
      title: m['sidebar.menu.conversations'](),
      url: '#',
      icon: MessageSquare,
    },
    {
      title: m['sidebar.menu.contacts'](),
      url: '#',
      icon: BookUser,
    },
    {
      title: m['sidebar.menu.settings'](),
      url: '/settings',
      icon: Settings,
      requiresAuth: true,
    },
  ];

  let visibleItems = $derived(isSignedIn ? items : items.filter((item) => !item.requiresAuth));

  const toggleConnection = () => {
    myUserContext.isOffline = !myUserContext.isOffline;
  };

  let {
    ref = $bindable(null),
    class: className,
    collapsible = 'icon',
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> = $props();

  const sidebar = Sidebar.useSidebar();

  const handleItemClick = () => {
    if (sidebar.isMobile) {
      sidebar.setOpenMobile(false);
    }
  };
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
  <Sidebar.Content>
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <div class="justify-horizontal flex items-center pt-2">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
              <img src="/fs-logo.svg" alt="First Spark Logo" class="size-8" />
            </div>
            <span class="font-lexend truncate ps-2 text-xl font-bold text-primary">
              First Spark
            </span>
          </div>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Group>
      <Sidebar.Menu>
        {#each visibleItems as item, i (item.title)}
          <Sidebar.MenuItem>
            <Sidebar.MenuButton isActive={isItemActive(item.url, page.url.pathname)}>
              {#snippet child({ props })}
                <a href={item.url} onclick={handleItemClick} {...props}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        {/each}
      </Sidebar.Menu>
    </Sidebar.Group>
    <Sidebar.Group class="mb-2 mt-auto">
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            {#snippet child({ props })}
              <Button {...props} disabled={!isDevEnv} onclick={toggleConnection} variant="ghost">
                {#if isOnline}
                  <Zap class="h-5 w-5" />
                {:else}
                  <PlugZap class="h-5 w-5" />
                {/if}
                <span>{isOnline ? m['connection.online']() : m['connection.offline']()}</span>
              </Button>
            {/snippet}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
