<script lang="ts">
  import { onMount } from 'svelte';
  import type { PurchaseOrder } from '@baragaun/bg-node-client';
  import { marketplaceContext } from '$lib/contexts/marketplace-context.svelte';
  import { ArrowLeft, ChevronRight } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import { Separator } from '$lib/components/ui/separator';
  import SpinLoadIndicator from '$lib/components/forms/spin-load-indicator.svelte';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '$lib/components/ui/dropdown-menu';
  import AvatarMenu from '$lib/components/layout/nav-bar/avatar-menu.svelte';

  let purchaseOrders = $state<PurchaseOrder[]>([]);
  let isLoading = $state(true);
  let filterStatus = $state('All Orders');

  let filteredOrders = $derived(
    purchaseOrders.filter((order) => {
      if (filterStatus === 'All Orders') return true;
      const o = order as any;
      return o.status?.toLowerCase() === filterStatus.toLowerCase();
    }),
  );

  onMount(async () => {
    isLoading = true;
    const result = await marketplaceContext.findPurchaseOrders();
    if (result && typeof result !== 'string') {
      purchaseOrders = result;
    } else {
      console.error('Failed to fetch purchase orders:', result);
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
    <h1 class="text-3xl font-bold text-foreground">{'Order History'}</h1>
  </header>

  <main class="flex-1 overflow-y-auto bg-gray-100 p-4 dark:bg-gray-900">
    <div class="mb-4 bg-white p-4 dark:bg-background">
      <Label for="filter" class="text-sm text-muted-foreground">Filter</Label>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="outline"
            class="mt-1 w-full justify-between border-0 border-b-2 border-gray-200 bg-transparent px-1 shadow-none focus-visible:ring-0 dark:border-gray-700"
          >
            {filterStatus}
            <ChevronRight class="h-4 w-4 -rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width]">
          <DropdownMenuItem onclick={() => (filterStatus = 'All Orders')}
            >All Orders</DropdownMenuItem
          >
          <DropdownMenuItem onclick={() => (filterStatus = 'delivered')}>Delivered</DropdownMenuItem
          >
          <DropdownMenuItem onclick={() => (filterStatus = 'processing')}
            >Processing</DropdownMenuItem
          >
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div class="space-y-1 bg-white p-4 dark:bg-background">
      {#if isLoading}
        <div class="flex items-center justify-center py-8">
          <SpinLoadIndicator />
        </div>
      {:else if filteredOrders.length > 0}
        {#each filteredOrders as order, i (order.id)}
          <div class="flex items-center justify-between py-4">
            <div>
              <p class="text-gray-600 dark:text-gray-400">
                Order Placed: {formatDate(order.createdAt)}
              </p>
              <p class="text-gray-800 dark:text-gray-200">
                Total: <span class="font-medium text-foreground"
                  >${(order.totalPrice / 1000).toFixed(2)}</span
                >
              </p>
              <p class="text-gray-600 dark:text-gray-400">
                Status: {order.items.length ?? 'N/A'}
              </p>
            </div>
            <ChevronRight class="h-5 w-5 text-gray-400" />
          </div>
          {#if i < filteredOrders.length - 1}
            <Separator />
          {/if}
        {/each}
      {:else}
        <div class="flex h-40 items-center justify-center">
          <p class="text-muted-foreground">No orders match the filter.</p>
        </div>
      {/if}
    </div>
  </main>
</div>
