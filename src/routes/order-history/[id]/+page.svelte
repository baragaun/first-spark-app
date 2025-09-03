<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import SpinLoadIndicator from '$lib/components/forms/spin-load-indicator.svelte';
  import { marketplaceContext } from '$lib/contexts/marketplace-context.svelte';
  import type { PurchaseOrder, GiftCardProduct, Brand } from '@baragaun/bg-node-client';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import { loadMarketplaceData, getMarketplaceData } from '$lib/stores/marketplace-store.svelte';
  import { giftCardImageDomain } from '$lib/constants';
  import { m } from '@/paraglide/messages';
  import { ShoppingBag, GiftIcon } from 'lucide-svelte';
  import { getWalletItemsStore, loadWalletItems } from '@/stores/wallet-store.svelte';
  import { page } from '$app/state';
  import { getPurchaseOrdersStore } from '$lib/stores/order-history.svelte';

  let marketplaceData = getMarketplaceData();

  const purchaseOrdersStore = getPurchaseOrdersStore();

  const purchaseOrderId = $derived(page.params.id);

  let purchaseOrder = $state<PurchaseOrder | undefined>();
  let isLoading = $state(false);

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
    productId: string,
  ): [GiftCardProduct | undefined, Brand | undefined] {
    const product = marketplaceData.products.find((product) => product.id === productId);
    const brand = marketplaceData.brands.find((b) => b.id === product?.brandId);
    return [product, brand];
  }

  async function navigateToWalletItemDetailScreen(purchaseOrderItemId: string) {
    if (getWalletItemsStore().length == 0) await loadWalletItems();
    const walletItem = getWalletItemsStore().find(
      (item) => item.purchaseOrderItemId == purchaseOrderItemId,
    );
    if (walletItem != undefined && walletItem != null) {
      goto(`/wallet/${walletItem?.id}`);
    }
  }

  const loadData = async () => {
    isLoading = true;
    await loadMarketplaceData().catch(console.error);
    marketplaceData = getMarketplaceData();

    // fetch product data if not loaded
    if (!purchaseOrdersStore.isLoaded) {
      const purchaseOrders = await marketplaceContext.findPurchaseOrders();
      if (purchaseOrders && typeof purchaseOrders !== 'string') {
        purchaseOrdersStore.setPurchaseOrders(purchaseOrders);
      }
    }
    purchaseOrder = purchaseOrdersStore.purchaseOrders.find(
      (o: PurchaseOrder) => o.id === purchaseOrderId,
    );
    isLoading = false;
  };

  const handleImageError = (node: HTMLImageElement) => {
    const onError = (e: Event) => {
      (e.currentTarget as HTMLImageElement).src = placeholderImage;
    };

    node.addEventListener('error', onError);

    return {
      destroy() {
        node.removeEventListener('error', onError);
      },
    };
  };

  // Load on mount
  $effect(() => {
    loadData().catch(console.error);
  });
</script>

<div
  class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"
>
  <button onclick={() => history.back()} class="flex items-center">
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="flex-1 text-center text-lg font-bold">{m['order_history.order']()}</span>
</div>

<div class="container mx-auto px-4 py-6">
  {#if isLoading}
    <div class="flex items-center justify-center py-8">
      <SpinLoadIndicator />
    </div>
  {:else if purchaseOrder}
    <div class="mb-2 flex items-center">
      <ShoppingBag size={24} color="#005f61" />
      <span class="pl-2 text-lg font-semibold text-muted-foreground"
        >{m['order_history.order']()}</span
      >
    </div>
    <div class="mb-8">
      <div class="mb-1 text-lg font-semibold">{purchaseOrder?.shoppingCartId}</div>
      <div class="text-sm text-muted-foreground">{m['order_history.purchase_date']()}</div>
      <div class="mb-2 font-bold">{formatDateTime(purchaseOrder.createdAt)}</div>
      <div class="text-sm text-muted-foreground">{m['order_history.reference_id']()}</div>
      <div class="mb-2 break-all font-bold">{purchaseOrder.id}</div>
    </div>

    {#each purchaseOrder.items as item}
      {@const [product, brand] = findProductAndBrand(item.productId)}
      <div class="mb-8">
        <div class="mb-2 flex items-center">
          <GiftIcon size={24} color="#005f61" />
          <span class="pl-2 text-lg font-semibold text-muted-foreground"
            >{m['order_history.type_purchase']()}</span
          >
        </div>
        <img
          src={giftCardImageDomain + '/giftcards/' + product?.imageSourceFront}
          alt="Gift Card"
          class="mb-2 h-24 w-40 rounded object-cover shadow"
          use:handleImageError
        />
        <div class="text-sm text-muted-foreground">{m['order_history.id']()}</div>
        <div class="mb-2 break-all font-bold">{item.id}</div>
        <div class="text-sm text-muted-foreground">{m['order_history.brand']()}</div>
        <div class="mb-2 font-bold">{brand?.name}</div>
        <div class="text-sm text-muted-foreground">{m['order_history.purchase_date']()}</div>
        <div class="mb-2 font-bold">{formatDateTime(item.createdAt)}</div>
        <div class="text-sm text-muted-foreground">{m['order_history.amount']()}</div>
        <div class="mb-2 font-bold">${(item.price / 1000).toFixed(0)}</div>
        <Button
          variant="outline"
          onclick={() => navigateToWalletItemDetailScreen(item.id)}
          class="h-8 rounded-xl border-primary text-primary">{m['order_history.open']()}</Button
        >
      </div>
    {/each}
  {:else}
    <div class="text-center text-muted-foreground">{m['order_history.not_found']()}</div>
  {/if}
</div>
