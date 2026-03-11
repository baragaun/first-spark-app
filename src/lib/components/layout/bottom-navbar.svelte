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
  class="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white/85 backdrop-blur-xl shadow-[0_-1px_12px_rgb(0_0_0/0.06)] md:hidden"
  style="padding-bottom: env(safe-area-inset-bottom, 0px);"
>
  <div class="flex h-16 items-center justify-around px-1">
    {#each visibleItems as item (item.title)}
      <a
        href={item.url}
        aria-label={item.title}
        class={cn(
          'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isItemActive(item.url, page.url.pathname)
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <div
          class={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200',
            isItemActive(item.url, page.url.pathname) && 'bg-primary/10',
          )}
        >
          <item.icon class="h-[20px] w-[20px]" />
        </div>
        <span
          class={cn(
            'truncate text-[10px] font-medium',
            isItemActive(item.url, page.url.pathname) && 'font-semibold',
          )}
        >
          {item.title}
        </span>
      </a>
    {/each}
  </div>
</nav>

<!-- Spacer to prevent content from being hidden behind the bottom navbar -->
<div class="h-16 md:hidden"></div>
