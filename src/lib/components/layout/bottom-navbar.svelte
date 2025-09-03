<script lang="ts">
  import { getContext } from 'svelte';
  import { page } from '$app/state';
  import { Button } from '@/components/ui/button';
  import type { MyUserContext } from '@/contexts/my-user-context.svelte';
  import { m } from '@/paraglide/messages';
  import { GiftIcon, Settings, ShoppingCartIcon, Wallet, HistoryIcon, Home } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  // Navigation items - same as sidebar but with Home added for mobile
  const items = [
    // {
    //   title: m['sidebar.menu.home'](),
    //   url: '/',
    //   icon: Home,
    //   requiresAuth: false,
    // },
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

  const userContext = getContext<MyUserContext>('myUserContext');
  let isSignedIn: boolean = $derived(userContext.isSignedIn);

  const isItemActive = (itemUrl: string, currentPath: string): boolean => {
    if (itemUrl === '/') {
      return currentPath === '/';
    }
    return itemUrl !== '#' && currentPath.startsWith(itemUrl);
  };

  let visibleItems = $derived(isSignedIn ? items : items.filter((item) => !item.requiresAuth));
</script>

<!-- Bottom Navigation Bar - Only visible on mobile -->
<nav
  class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
>
  <div class="flex h-16 items-center justify-around px-2">
    {#each visibleItems as item (item.title)}
      <Button
        href={item.url}
        variant="link"
        size="lg"
        class={cn(
          'flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-background px-1 py-1 no-underline hover:no-underline',
          isItemActive(item.url, page.url.pathname)
            ? 'bg-background text-nav-foreground hover:bg-background'
            : 'text-foreground hover:text-foreground',
        )}
      >
        <item.icon class="h-[20px] w-[20px]" style="height:20px!important;width:20px!important;" />
        <span class="font-semi-bold truncate text-[11px]">{item.title}</span>
      </Button>
    {/each}
  </div>
</nav>

<!-- Spacer to prevent content from being hidden behind the bottom navbar -->
<div class="h-16 md:hidden"></div>
