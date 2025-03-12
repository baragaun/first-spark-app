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
  import { _ } from 'svelte-i18n';

  const sidebar = useSidebar();

  $: items = [
    {
      title: $_('sidebar.menu.home'),
      url: '#',
      icon: House,
    },
    {
      title: $_('sidebar.menu.inbox'),
      url: '#',
      icon: Inbox,
    },
    {
      title: $_('sidebar.menu.conversations'),
      url: '#',
      icon: MessageSquare,
    },
    {
      title: $_('sidebar.menu.contacts'),
      url: '#',
      icon: BookUser,
    },
    {
      title: $_('sidebar.menu.settings'),
      url: '#',
      icon: Settings,
    },
  ];
</script>

<div class="flex">
  <Sidebar.Root collapsible="icon">
    <Sidebar.Content>
      <div class="mt-2 flex items-center p-2">
        <a href="/" class="flex items-center gap-2 transition-colors hover:opacity-90">
          <div in:fly={{ x: -20, duration: 300, delay: 100, easing: quartOut }}>
            <img src="/fs-logo.svg" alt={$_('sidebar.logo.alt')} class="h-8 w-8" />
          </div>
          {#if sidebar.state !== 'collapsed'}
            <span
              in:fly={{ x: -20, duration: 300, delay: 200, easing: quartOut }}
              out:fly={{ x: -20, duration: 200, easing: quartOut }}
              class="font-lexend text-xl font-bold text-primary"
            >
              {$_('sidebar.logo.title')}
            </span>
          {/if}
        </a>
      </div>

      <Sidebar.Group>
        <Sidebar.Menu>
          {#each items as item, i (item.title)}
            <div in:fly={{ x: -20, duration: 300, delay: 150 + i * 50, easing: quartOut }}>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  {#snippet child({ props })}
                    <a href={item.url} {...props}>
                      <item.icon />
                      {#if sidebar.state !== 'collapsed'}
                        <span
                          in:fly={{ x: -20, duration: 300, delay: 200, easing: quartOut }}
                          out:fly={{ x: -20, duration: 200, easing: quartOut }}
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
