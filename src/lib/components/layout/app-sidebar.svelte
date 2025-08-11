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
    House,
    PlugZap,
    Settings,
    ShoppingCartIcon,
    Wallet,
    Zap,
    HistoryIcon,
  } from 'lucide-svelte';
  import { appTitle, headerIcon, headerSmallIcon } from '$lib/stores/app-store';

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
      title: m['sidebar.menu.wallet'](),
      url: '/wallet',
      icon: Wallet,
      requiresAuth: true,
    },
    {
      title: m['sidebar.menu.order_history'](),
      url: '/order-history',
      icon: HistoryIcon,
      requiresAuth: true,
    },
  ];

  let {
    ref = $bindable(null),
    collapsible = 'icon' as ComponentProps<typeof Sidebar.Root>['collapsible'],
    ...restProps
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

<Sidebar.Root bind:ref {collapsible} {...restProps}>
  <Sidebar.Content>
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <div class="justify-horizontal flex items-center pt-2">
            <!-- Commenting first spark logo -->
            <!-- <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
            <img src={$headerIcon} alt="First Spark Logo" class="size-8" />
            </div> -->
            <!-- <span class="font-lexend truncate ps-2 text-xl font-bold text-foreground">
              {$appTitle}
            </span> -->

            {#if sidebar?.open}
              <div class="flex items-center justify-center">
                <img src={$headerIcon} alt="First Spark Logo" class="h-10" />
              </div>
            {:else}
              <div class="flex items-center justify-center">
                <img src={$headerSmallIcon} alt="First Spark Logo" class="h-10" />
              </div>
            {/if}
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
          <h2 class="mb-3 text-sm font-bold">{m['join_first_spark']({ title: $appTitle })}</h2>
          <h3 class="mb-3 text-sm font-medium">{m['welcome_subtitle']()}</h3>
          <div class="flex flex-col gap-2">
            <Button
              href="/signup"
              size="sm"
              class="w-full text-background"
              onclick={handleItemClick}
            >
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
                {#if !isOffline}
                  <Zap class="h-5 w-5" />
                {:else}
                  <PlugZap class="h-5 w-5" />
                {/if}
                <span
                  >{isOffline
                    ? m['connection.offline']()
                    : m['connection.online']({ title: $appTitle })}</span
                >
              </Button>
            {/snippet}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
