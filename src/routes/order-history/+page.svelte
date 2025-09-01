<script lang="ts">
  import type { PurchaseOrder } from '@baragaun/bg-node-client';
  import { marketplaceContext } from '$lib/contexts/marketplace-context.svelte';
  import { ChevronRight } from 'lucide-svelte';
  import { Separator } from '$lib/components/ui/separator';
  import SpinLoadIndicator from '$lib/components/forms/spin-load-indicator.svelte';
  import { goto } from '$app/navigation';
  import { getPurchaseOrdersStore } from '$lib/stores/order-history.svelte';
  import { m } from '@/paraglide/messages';
  // import * as Select from '$lib/components/ui/select/index.js';

  const purchaseOrdersStore = getPurchaseOrdersStore();

  let purchaseOrders = $state<PurchaseOrder[]>([]);
  let isLoading = $state(true);
  // use it later
  // let filterStatus = $state(m['order_history.all_orders']());

  // let filteredOrders = $derived(
  //   purchaseOrders.filter((order) => {
  //     if (filterStatus === m['order_history.all_orders']()) return true;
  //     return order.status?.toLowerCase() === filterStatus.toLowerCase();
  //   }),
  // );

  const loadData = async () => {
    isLoading = true;
    if (!purchaseOrdersStore.isLoaded) {
      const orders = await marketplaceContext.findPurchaseOrders();
      if (orders && typeof orders !== 'string') {
        purchaseOrdersStore.setPurchaseOrders(orders);
        purchaseOrders = purchaseOrdersStore.purchaseOrders;
      }
    } else {
      purchaseOrders = purchaseOrdersStore.purchaseOrders;
    }
    isLoading = false;
  };

  // Load on mount
  $effect(() => {
    loadData().catch(console.error);
  });

  function formatDate(dateString: string | undefined) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  }

  // Currently not used:
  // const statusOptions = [
  //   m['order_history.all_orders'](),
  //   m['order_history.delivered'](),
  //   m['order_history.processing'](),
  // ];
</script>

<div class="container mx-auto px-4 py-6">
  <header class="mb-6">
    <h1 class="text-3xl font-bold text-foreground">{m['order_history.title']()}</h1>
  </header>

  <main class="flex-1 overflow-y-auto dark:bg-gray-900">
    <!-- <div class="relative mb-3 rounded-xl p-[2px]">
      <Select.Root type="single" bind:value={filterStatus}>
        <Select.Trigger class="w-full rounded-2xl bg-black/5 dark:bg-background">
          {filterStatus}
        </Select.Trigger>
        <Select.Content class="w-full rounded-2xl bg-white dark:bg-background">
          {#each statusOptions as option}
            <Select.Item value={option} class="rounded-xl">{option}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div> -->

    <div class="space-y-1 bg-white p-4 dark:bg-background">
      {#if isLoading}
        <div class="flex items-center justify-center py-8">
          <SpinLoadIndicator />
        </div>
      {:else if purchaseOrders.length > 0}
        {#each purchaseOrders as order, i (order.id)}
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
            </div>
            <ChevronRight class="h-5 w-5 text-gray-400" />
          </button>
          {#if i < purchaseOrders.length - 1}
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
