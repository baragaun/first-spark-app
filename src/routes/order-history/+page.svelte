<script lang="ts">
  import { onMount } from 'svelte';
  import type { PurchaseOrder } from '@baragaun/bg-node-client';
  import { marketplaceContext } from '$lib/contexts/marketplace-context.svelte';
  import { ArrowLeft, ChevronRight, ChevronDown } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import { Separator } from '$lib/components/ui/separator';
  import SpinLoadIndicator from '$lib/components/forms/spin-load-indicator.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import AvatarMenu from '$lib/components/layout/nav-bar/avatar-menu.svelte';
  import { goto } from '$app/navigation';
  import { orderHistoryStore, orderHistoryLoaded } from '$lib/stores/order-history';
  import { get } from 'svelte/store';
  import { m } from '@/paraglide/messages';

  let purchaseOrders = $state<PurchaseOrder[]>([]);
  let isLoading = $state(true);
  let filterStatus = $state(m['order_history.all_orders']());

  let filteredOrders = $derived(
    purchaseOrders.filter((order) => {
      if (filterStatus === m['order_history.all_orders']()) return true;
      const o = order as any;
      return o.status?.toLowerCase() === filterStatus.toLowerCase();
    }),
  );

  onMount(async () => {
    isLoading = true;
    if (!get(orderHistoryLoaded)) {
      const result = await marketplaceContext.findPurchaseOrders();
      if (result && typeof result !== 'string') {
        orderHistoryStore.set(result);
        orderHistoryLoaded.set(true);
        purchaseOrders = result;
      } else {
        console.error('Failed to fetch purchase orders:', result);
      }
    } else {
      const storeValue = get(orderHistoryStore);
      purchaseOrders = storeValue || [];
    }
    isLoading = false;
  });

  function formatDate(dateString: string | undefined) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  }
</script>

<div class="container mx-auto px-4 py-6">
  <header class="mb-6">
    <h1 class="text-3xl font-bold text-foreground">{m['order_history.title']()}</h1>
  </header>

  <main class="flex-1 overflow-y-auto bg-gray-100 p-4 dark:bg-gray-900">
    <div
      class="relative mb-3 rounded-xl bg-gradient-to-r from-kcu-lime via-kcu-glacier to-kcu-juniper p-[2px]"
    >
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="w-full">
          <Button variant="outline" class="w-full justify-between rounded-xl hover:bg-transparent">
            {filterStatus}
            <ChevronDown class="h-4 w-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          class="let-10 relative max-h-[300px] w-full overflow-y-auto bg-background"
        >
          <DropdownMenu.Item
            onclick={() => (filterStatus = m['order_history.all_orders']())}
            class="cursor-pointer"
          >
            {m['order_history.all_orders']()}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onclick={() => (filterStatus = m['order_history.delivered']())}
            class="cursor-pointer"
          >
            {m['order_history.delivered']()}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onclick={() => (filterStatus = m['order_history.processing']())}
            class="w-full cursor-pointer"
          >
            {m['order_history.processing']()}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>

    <div class="space-y-1 bg-white p-4 dark:bg-background">
      {#if isLoading}
        <div class="flex items-center justify-center py-8">
          <SpinLoadIndicator />
        </div>
      {:else if filteredOrders.length > 0}
        {#each filteredOrders as order, i (order.id)}
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between rounded py-4 text-left transition"
            onclick={() => goto(`/order-history/${order.id}`)}
          >
            <div>
              <p class="text-gray-600 dark:text-gray-400">
                {m['order_history.order_placed']({ date: formatDate(order.createdAt) })}
              </p>
              <p class="text-gray-800 dark:text-gray-200">
                {m['order_history.total']({ amount: (order.totalPrice / 1000).toFixed(2) })}
              </p>
              <p class="text-gray-600 dark:text-gray-400">
                {m['order_history.status']({ status: order.items.length ?? 'N/A' })}
              </p>
            </div>
            <ChevronRight class="h-5 w-5 text-gray-400" />
          </button>
          {#if i < filteredOrders.length - 1}
            <Separator />
          {/if}
        {/each}
      {:else}
        <div class="flex h-40 items-center justify-center">
          <p class="text-muted-foreground">{m['order_history.no_orders']()}</p>
        </div>
      {/if}
    </div>
  </main>
</div>
