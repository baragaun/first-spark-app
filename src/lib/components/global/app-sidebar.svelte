<script lang="ts">
  import { page } from '$app/state';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { m } from '$lib/paraglide/messages';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { PlugZap, Zap } from 'lucide-svelte';
  import House from 'lucide-svelte/icons/house';
  import Settings from 'lucide-svelte/icons/settings';
  import type { ComponentProps } from 'svelte';
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
    /* TODO: Hidding the following sidebar buttons as per the issue: https://github.com/baragaun/first-spark-app/issues/112 */
    /* {
      title: m['sidebar.menu.inbox'](),
      url: '#',
      icon: Inbox,
      requiresAuth: true,
    },
    {
      title: m['sidebar.menu.conversations'](),
      url: '#',
      icon: MessageSquare,
      requiresAuth: true,
    },
    {
      title: m['sidebar.menu.contacts'](),
      url: '#',
      icon: BookUser,
      requiresAuth: true,
    }, */
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
    if (sidebar && sidebar.isMobile) {
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

    {#if !isSignedIn}
      <Sidebar.Group class="mb-2 mt-auto px-3 group-data-[collapsible=icon]:hidden">
        <div class="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 class="mb-3 text-sm font-bold">{m['join_first_spark']()}</h2>
          <h3 class="mb-3 text-sm font-medium">{m['welcome_subtitle']()}</h3>
          <div class="flex flex-col gap-2">
            <Button href="/signup" size="sm" class="w-full" onclick={handleItemClick}>
              {m['get_started']()}
            </Button>
            <Button
              href="/signin"
              variant="outline"
              size="sm"
              class="w-full"
              onclick={handleItemClick}
            >
              {m['nav.auth.sign_in']()}
            </Button>
          </div>
        </div>
      </Sidebar.Group>
    {/if}

    <Sidebar.Group
      class={`mb-2 ${!isSignedIn ? '' : 'mt-auto'} px-3 group-data-[collapsible=icon]:mt-auto`}
    >
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
