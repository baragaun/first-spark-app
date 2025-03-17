<script lang="ts" module>
  import House from 'lucide-svelte/icons/house';
  import Inbox from 'lucide-svelte/icons/inbox';
  import Settings from 'lucide-svelte/icons/settings';
  import BookUser from 'lucide-svelte/icons/book-user';
  import MessageSquare from 'lucide-svelte/icons/message-square';

  const items = [
    {
      title: 'Home',
      url: '/',
      icon: House,
    },
    {
      title: 'Inbox',
      url: '#',
      icon: Inbox,
    },
    {
      title: 'Conversations',
      url: '#',
      icon: MessageSquare,
    },
    {
      title: 'Contacts',
      url: '#',
      icon: BookUser,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ];
</script>

<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import type { ComponentProps } from 'svelte';
  import { page } from '$app/state';

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
            <span class="font-lexend truncate ps-2 text-xl font-bold text-primary">First Spark</span
            >
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
