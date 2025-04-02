<script lang="ts" module>
  import BookUser from 'lucide-svelte/icons/book-user';
  import House from 'lucide-svelte/icons/house';
  import Inbox from 'lucide-svelte/icons/inbox';
  import MessageSquare from 'lucide-svelte/icons/message-square';

  import { m } from '$lib/paraglide/messages';

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
</script>

<script lang="ts">
  import { page } from '$app/state';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { isSignedIn } from '@/contexts/my-user-context.svelte';
  import type { ComponentProps } from 'svelte';
  function isItemActive(itemUrl: string, currentPath: string): boolean {
    if (itemUrl === '/') {
      return currentPath === '/';
    }
    return itemUrl !== '#' && currentPath.startsWith(itemUrl);
  }
  let {
    ref = $bindable(null),
    class: className,
    collapsible = 'icon',
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> = $props();
  // Using $derived rune for reactive computation
  let items = $derived(allItems.filter((item) => !item.requiresAuth || $isSignedIn));
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
        {#each items as item, i (item.title)}
          <Sidebar.MenuItem>
            <Sidebar.MenuButton isActive={isItemActive(item.url, page.url.pathname)}>
              {#snippet child({ props })}
                <a href={item.url} {...props}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        {/each}
      </Sidebar.Menu>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
