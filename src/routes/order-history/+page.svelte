<script lang="ts">
  import type { PurchaseOrder } from '@baragaun/bg-node-client';
  import { marketplaceContext } from '$lib/contexts/marketplace-context.svelte';
  import { ChevronRight, HistoryIcon } from 'lucide-svelte';
  import SpinLoadIndicator from '$lib/components/forms/spin-load-indicator.svelte';
  import { goto } from '$app/navigation';
  import { getPurchaseOrdersStore } from '$lib/stores/order-history.svelte';
  import { m } from '@/paraglide/messages';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

  const isMobile = new IsMobile();

  const purchaseOrdersStore = getPurchaseOrdersStore();

  let purchaseOrders = $state<PurchaseOrder[]>([]);
  let isLoading = $state(true);

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<div class="animate-fade-in container mx-auto px-4 py-4 md:px-6">
  {#if !isMobile.current}
    <header class="mb-5">
      <h1 class="text-2xl font-bold tracking-tight text-foreground">{m['order_history.title']()}</h1>
    </header>
  {/if}

  <div class="flex-1">
    {#if isLoading}
      <div class="flex h-60 items-center justify-center">
        <SpinLoadIndicator />
      </div>
    {:else if purchaseOrders.length > 0}
      <div class="space-y-3">
        {#each purchaseOrders as order (order.id)}
          <button
            type="button"
            class="group flex w-full items-center justify-between rounded-2xl bg-card p-4 text-left shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg"
            onclick={() => goto(`/order-history/${order.id}`)}
          >
            <div class="flex flex-col gap-1">
              <p class="text-xs text-muted-foreground">
                {m['order_history.order_placed']({ date: formatDate(order.createdAt) })}
              </p>
              <p class="text-base font-semibold text-foreground">
                {m['order_history.total']({ amount: (order.totalPrice / 1000).toFixed(2) })}
              </p>
            </div>
            <ChevronRight class="h-5 w-5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
          </button>
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
          <HistoryIcon class="h-7 w-7 text-muted-foreground/50" />
        </div>
        <p class="text-sm text-muted-foreground">{m['order_history.no_orders']()}</p>
      </div>
    {/if}
  </div>
</div>
