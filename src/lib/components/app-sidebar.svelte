<script lang="ts">
  import House from 'lucide-svelte/icons/house';
  import Inbox from 'lucide-svelte/icons/inbox';
  import Settings from 'lucide-svelte/icons/settings';
  import BookUser from 'lucide-svelte/icons/book-user';
  import MessageSquare from 'lucide-svelte/icons/message-square';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
  import { fly } from 'svelte/transition';
  import { quartOut } from 'svelte/easing';
  import { getStores } from '$app/stores';
  import { _ } from 'svelte-i18n';

  const { page } = getStores();
  const sidebar = useSidebar();

  // State declarations using runes
  let items = $state({
    home: { title: $_('sidebar.menu.home'), url: '/', icon: House },
    inbox: { title: $_('sidebar.menu.inbox'), url: '#', icon: Inbox },
    conversations: { title: $_('sidebar.menu.conversations'), url: '#', icon: MessageSquare },
    contacts: { title: $_('sidebar.menu.contacts'), url: '#', icon: BookUser },
    settings: { title: $_('sidebar.menu.settings'), url: '/settings', icon: Settings },
  });

  // Derived values using runes
  let currentPath = $derived.by(() => $page.url.pathname);
  let sidebarState = $derived.by(() => sidebar.state);
  let itemsList = $derived.by(() => Object.values(items));
  let isActive = (url: string) => {
    if (url === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(url);
  };
</script>

<div class="flex">
  <Sidebar.Root collapsible="icon">
    <Sidebar.Content>
      <div class="mt-2 flex items-center p-2">
        <a href="/" class="flex items-center gap-2 transition-colors hover:opacity-90">
          <div transition:fly={{ x: -20, duration: 300, delay: 100, easing: quartOut }}>
            <img src="/fs-logo.svg" alt="App Logo" class="h-8 w-8" />
          </div>
          {#if sidebarState !== 'collapsed'}
            <span
              in:fly={{ x: -20, duration: 300, delay: 200, easing: quartOut }}
              out:fly={{ x: -20, duration: 200, easing: quartOut }}
              class="font-lexend text-xl font-bold text-primary"
            >
              First Spark
            </span>
          {/if}
        </a>
      </div>

      <Sidebar.Group>
        <Sidebar.Menu>
          {#each itemsList as item, i}
            {@const delay = 150 + i * 50}
            <div transition:fly={{ x: -20, duration: 300, delay, easing: quartOut }}>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton isActive={isActive(item.url)}>
                  {#snippet child({ props })}
                    <a href={item.url} {...props}>
                      <item.icon />
                      {#if sidebarState !== 'collapsed'}
                        <span
                          transition:fly={{ x: -20, duration: 300, delay: 200, easing: quartOut }}
                        >
                          {item.title}
                        </span>
                      {/if}
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </div>
          {/each}
        </Sidebar.Menu>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar.Root>
</div>
