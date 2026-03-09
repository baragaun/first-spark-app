<script lang="ts">
  import { getContext, type ComponentProps } from 'svelte';
  import { page } from '$app/state';
  import { env } from '$env/dynamic/public';
  import { Button } from '@/components/ui/button';
  import * as Sidebar from '@/components/ui/sidebar';
  import type { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { m } from '@/paraglide/messages';
  import {
    GiftIcon,
    PlugZap,
    Settings,
    ShoppingCartIcon,
    Wallet,
    Zap,
    HistoryIcon,
  } from 'lucide-svelte';
  import { cn } from '$lib/utils.js';
  import { appTitle, headerIcon, headerSmallIcon } from '@/stores/app-store.svelte';

  const items = [
    // {
    //   title: m['sidebar.menu.home'](),
    //   url: '/',
    //   icon: House,
    // },
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
      title: m['sidebar.menu.wallet'](),
      url: '/wallet',
      icon: Wallet,
      requiresAuth: true,
    },
    {
      title: m['sidebar.menu.marketplace'](),
      url: '/marketplace',
      icon: GiftIcon,
      requiresAuth: true,
    },
    {
      title: m['sidebar.menu.cart'](),
      url: '/cart',
      icon: ShoppingCartIcon,
      requiresAuth: true,
    },
    {
      title: m['sidebar.menu.order_history'](),
      url: '/order-history',
      icon: HistoryIcon,
      requiresAuth: true,
    },
    {
      title: m['sidebar.menu.settings'](),
      url: '/settings',
      icon: Settings,
      requiresAuth: true,
    },
  ];

  let {
    ref = $bindable(null),
    collapsible = 'icon' as ComponentProps<typeof Sidebar.Root>['collapsible'],
  } = $props();

  const userContext = getContext<MyUserContext>('myUserContext');
  let isOffline: boolean = $derived(userContext.isOffline);
  let isSignedIn: boolean = $derived(userContext.isSignedIn);

  const isItemActive = (itemUrl: string, currentPath: string): boolean => {
    if (itemUrl === '/') {
      return currentPath === '/';
    }
    return itemUrl !== '#' && currentPath.startsWith(itemUrl);
  };

  const isDevEnv = env.PUBLIC_APP_ENVIRONMENT === 'development';
  const toggleConnection = () => {
    isOffline = !isOffline;
  };

  let visibleItems = $derived(isSignedIn ? items : items.filter((item) => !item.requiresAuth));

  const sidebar = Sidebar.useSidebar();

  const handleItemClick = () => {
    if (sidebar && sidebar.isMobile) {
      sidebar.setOpenMobile(false);
    }
  };
</script>

<Sidebar.Root bind:ref {collapsible}>
  <Sidebar.Content>
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <div class="flex items-center px-1 py-3">
            <div class="flex min-h-[2.5rem] w-full items-center justify-center">
              {#if sidebar?.open}
                <img src={headerIcon()} alt="Logo" class="h-10 object-contain" />
              {:else}
                <img
                  src={headerSmallIcon()}
                  alt="Logo"
                  class="h-9 w-9 object-contain"
                />
              {/if}
            </div>
          </div>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Group class="px-2">
      <Sidebar.Menu>
        {#each visibleItems as item, i (item.title)}
          <Sidebar.MenuItem>
            <Sidebar.MenuButton isActive={isItemActive(item.url, page.url.pathname)}>
              {#snippet child({ props })}
                <a
                  href={item.url}
                  onclick={handleItemClick}
                  {...props}
                  class={cn(
                    props.class,
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isItemActive(item.url, page.url.pathname)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <item.icon class="h-5 w-5 shrink-0" />
                  <span class="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        {/each}
      </Sidebar.Menu>
    </Sidebar.Group>

    {#if !isSignedIn}
      <Sidebar.Group class="mb-2 mt-auto px-3 group-data-[collapsible=icon]:hidden">
        <div class="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-white shadow-soft">
          <h2 class="mb-2 text-sm font-bold">{m['join_first_spark']({ title: appTitle() })}</h2>
          <h3 class="mb-4 text-xs font-medium text-white/80">{m['welcome_subtitle']()}</h3>
          <div class="flex flex-col gap-2">
            <Button
              href="/signup"
              size="sm"
              class="w-full rounded-full bg-white text-primary shadow-sm hover:bg-white/90"
              onclick={handleItemClick}
            >
              {m['get_started']()}
            </Button>
            <Button
              href="/signin"
              variant="outline"
              size="sm"
              class="w-full rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
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
              <Button {...props} disabled={!isDevEnv} onclick={toggleConnection} variant="ghost" class={cn(props.class, 'text-muted-foreground hover:text-foreground')}>
                {#if !isOffline}
                  <Zap class="h-4 w-4 shrink-0" />
                {:else}
                  <PlugZap class="h-4 w-4 shrink-0" />
                {/if}
                <span class="truncate text-xs group-data-[collapsible=icon]:hidden"
                  >{isOffline
                    ? m['connection.offline']()
                    : m['connection.online']({ title: appTitle() })}</span
                >
              </Button>
            {/snippet}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
