<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { ArrowLeft } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import SpinLoadIndicator from '$lib/components/forms/spin-load-indicator.svelte';
  import { marketplaceContext } from '$lib/contexts/marketplace-context.svelte';
  import type { PurchaseOrder, GiftCardProduct, Brand } from '@baragaun/bg-node-client';
  import { orderHistoryStore, orderHistoryLoaded } from '$lib/stores/order-history';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import { get } from 'svelte/store';
  import { giftCardProductsStore, brandsStore, dataLoaded } from '@/stores/marketplace-store';
  import { giftCardImageDomain } from '$lib/constants';

  let order: PurchaseOrder | undefined;
  let isLoading = true;

  onMount(async () => {
    isLoading = true;

    // fetch product data if not loaded
    if (!$dataLoaded) {
      const giftCardsResponse = await marketplaceContext.findGiftCardProducts();
      giftCardProductsStore.set(giftCardsResponse as GiftCardProduct[]);

      const brandsResponse = await marketplaceContext.findBrands();
      brandsStore.set(brandsResponse as Brand[]);

      dataLoaded.set(true);
    }

    const id = $page.params.id;
    if (!get(orderHistoryLoaded)) {
      const orders = await marketplaceContext.findPurchaseOrders();
      if (orders && typeof orders !== 'string') {
        orderHistoryStore.set(orders);
        orderHistoryLoaded.set(true);
        order = orders.find((o: any) => o.id === id);
      }
    } else {
      const storeValue = get(orderHistoryStore);
      order = storeValue?.find((o: any) => o.id === id);
    }
    isLoading = false;
  });

  function formatDateTime(dateString: string | undefined) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('en-US') +
      ' ' +
      date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    );
  }

  function findProductAndBrand(
    productId: String,
  ): [GiftCardProduct | undefined, Brand | undefined] {
    const product = $giftCardProductsStore.find((product) => product.id === productId);
    const brand = $brandsStore.find((b) => b.id === product?.brandId);
    return [product, brand];
  }
</script>

<div
  class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"
>
  <button onclick={() => history.back()} class="flex items-center">
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="flex-1 text-center text-lg font-semibold">Order</span>
</div>

<div class="container mx-auto px-4 py-6">
  {#if isLoading}
    <div class="flex items-center justify-center py-8">
      <SpinLoadIndicator />
    </div>
  {:else if order}
    <div class="mb-8">
      <div class="mb-1 text-lg font-semibold">{order?.shoppingCartId}</div>
      <div class="text-sm text-muted-foreground">Type</div>
      <div class="mb-2 font-bold">Purchase</div>
      <div class="text-sm text-muted-foreground">Paid with</div>
      <div class="mb-2 font-bold">Credit Card</div>
      <div class="text-sm text-muted-foreground">Reference ID</div>
      <div class="mb-2 break-all font-bold">{order.id}</div>
      <Button variant="outline" class="border-primary text-primary">OPEN</Button>
    </div>

    {#each order.items as item}
      {@const [product, brand] = findProductAndBrand(item.productId)}
      <div class="mb-8">
        <div class="mb-2 flex items-center">
          <span class="mr-2 text-2xl">🎁</span>
          <span class="text-lg font-semibold text-muted-foreground">Purchase</span>
        </div>
        <img
          src={giftCardImageDomain + '/giftcards/' + product?.imageSourceFront}
          alt="Gift Card"
          class="mb-2 h-24 w-40 rounded object-cover shadow"
          onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
        />
        <div class="text-sm text-muted-foreground">ID</div>
        <div class="mb-2 break-all font-bold">{item.id}</div>
        <div class="text-sm text-muted-foreground">Brand</div>
        <div class="mb-2 font-bold">{brand?.name}</div>
        <div class="text-sm text-muted-foreground">Purchase Date</div>
        <div class="mb-2 font-bold">{formatDateTime(item.createdAt)}</div>
        <div class="text-sm text-muted-foreground">Amount</div>
        <div class="mb-2 font-bold">${(item.price / 1000).toFixed(0)}</div>
        <Button variant="outline" class="border-primary text-primary">OPEN</Button>
      </div>
    {/each}
  {:else}
    <div class="text-center text-muted-foreground">Order not found.</div>
  {/if}
</div>
