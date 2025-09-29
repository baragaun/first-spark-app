<script lang="ts">
  import { Plus, Minus } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import {
    type GiftCardProduct,
    type Brand,
    type ShoppingCart,
    type PurchaseOrder,
    ShoppingCartItem,
  } from '@baragaun/bg-node-client';
  import { toast } from 'svelte-sonner';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { loadMarketplaceData, getMarketplaceData } from '$lib/stores/marketplace-store.svelte';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  import { m } from '@/paraglide/messages';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { giftCardImageDomain } from '$lib/constants';
  import { getPurchaseOrdersStore } from '$lib/stores/order-history.svelte';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

  const purchaseOrdersStore = getPurchaseOrdersStore();

  let marketplaceData = getMarketplaceData();

  let cartItems = $state<ShoppingCartItem[]>([]);
  let loadingItemId = $state<string | null>(null);
  let total = $derived.by(() =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  let showOrderPlacedDialog = $state(false);

  const isMobile = new IsMobile();

  // Function to combine items with same productId AND same price
  function combineDuplicateItems(items: ShoppingCartItem[]): ShoppingCartItem[] {
    const combinedItems = new Map<string, ShoppingCartItem>();

    items.forEach((item) => {
      if (!item.productId) return;
      // Use both productId and price as the key
      const key = `${item.productId}-${item.price}`;
      if (combinedItems.has(key)) {
        const existingItem = combinedItems.get(key)!;
        existingItem.quantity = (existingItem.quantity || 0) + (item.quantity || 0);
        existingItem.totalPrice = (existingItem.totalPrice || 0) + (item.totalPrice || 0);
      } else {
        combinedItems.set(key, { ...item });
      }
    });

    return Array.from(combinedItems.values());
  }

  async function updateItemQuantity(item: ShoppingCartItem, newQuantity: number) {
    if (item == null || item == undefined) return;
    loadingItemId = item.id;
    const minSpinnerTime = 500;
    const startTime = Date.now();
    if (newQuantity < 1) {
      await removeItem(item.id || '');
      const elapsed = Date.now() - startTime;
      if (elapsed < minSpinnerTime) {
        await new Promise((resolve) => setTimeout(resolve, minSpinnerTime - elapsed));
      }
      loadingItemId = null;
      return;
    }
    try {
      // First remove the all other existing items
      for (const cartItem of shoppingCart?.items ?? []) {
        if (
          cartItem.id != item.id &&
          cartItem.productId === item.productId &&
          cartItem.price === item.price
        ) {
          await removeItem(cartItem.id);
        }
      }
      item.quantity = newQuantity;
      const result = await marketplaceContext.updateShoppingCartItem(item);
      if (result.error) {
        console.error('Error updating item quantity:', result.error);
        toast.error(`Failed to update quantity: ${result.error}`);
      } else if (result.object) {
        toast.success('Quantity updated!');
      }
    } catch (error) {
      console.error('Unexpected error updating quantity:', error);
      toast.error('An unexpected error occurred while updating quantity.');
    } finally {
      const elapsed = Date.now() - startTime;
      if (elapsed < minSpinnerTime) {
        await new Promise((resolve) => setTimeout(resolve, minSpinnerTime - elapsed));
      }
      loadingItemId = null;
    }
  }

  async function removeItem(id: string) {
    try {
      const result = await marketplaceContext.deleteShoppingCartItem(id);
      if (result.error) {
        console.error('Error deleting item:', result.error);
        toast.error(`Failed to remove item: ${result.error}`);
      } else {
        cartItems = cartItems.filter((item) => item.id !== id);
        toast.success('Item removed from cart!');
      }
    } catch (error) {
      console.error('Unexpected error deleting item:', error);
      toast.error('An unexpected error occurred while removing the item.');
    }
  }

  async function removeAllItems(item: ShoppingCartItem) {
    for (const cartItem of shoppingCart?.items ?? []) {
      if (cartItem.productId === item.productId && cartItem.price === item.price) {
        await removeItem(cartItem.id);
      }
    }
  }

  async function placeOrder() {
    const order: Partial<PurchaseOrder> = {
      shoppingCartId: myUserContext.myUserId!,
      userId: myUserContext.myUserId!,
      sumItemPrice: total,
      totalPrice: total,
      vat: 0,
    };
    const response = await marketplaceContext.createPurchaseOrder(order);
    if (response.error) {
      console.error('Error creating purchase order:', response.error);
      toast.error(`Failed to create purchase order: ${response.error}`);
      return;
    }
    cartItems = [];
    showOrderPlacedDialog = true;
    purchaseOrdersStore.reset();
  }

  function findProductAndBrand(
    productId: string,
  ): [GiftCardProduct | undefined, Brand | undefined] {
    const product = marketplaceData.products.find((product) => product.id === productId);
    const brand = marketplaceData.brands.find((b) => b.id === product?.brandId);
    return [product, brand];
  }

  let shoppingCart = $state<ShoppingCart | null | undefined>(undefined);

  const loadShoppingCart = async () => {
    const cartResult = await marketplaceContext.findMyShoppingCart();

    if (typeof cartResult === 'string') {
      console.error('Failed to load shopping cart:', cartResult);
      shoppingCart = undefined;
    } else if (cartResult) {
      shoppingCart = cartResult;
      cartItems = combineDuplicateItems(cartResult.items);
    } else {
      shoppingCart = null;
    }
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

  const loadData = async () => {
    await loadMarketplaceData().catch(console.error);
    marketplaceData = getMarketplaceData();
    await loadShoppingCart().catch(console.error);
  };
</script>

<div class="flex min-h-screen flex-col bg-background font-sans antialiased">
  <!-- Top Bar -->
  {#if !isMobile.current}
    <header class="mb-6 px-3 pt-3">
      <h1 class="text-3xl font-bold text-foreground">{m['cart.title']()}</h1>
      <!--    <p class="mt-2 text-muted-foreground">{m['cart.subtitle']()}</p>-->
    </header>
  {/if}

  <div class="container mx-auto flex-1 px-4 py-6">
    {#if cartItems.length > 0}
      <!-- Cart Items Header -->
      <div
        class="grid grid-cols-4 gap-4 border-b border-muted-foreground pb-2 text-sm font-medium text-muted-foreground md:grid-cols-6"
      >
        <div class="col-span-2 text-center text-base md:col-span-3">{m['cart.product']()}</div>
        <div class="text-center text-base">{m['cart.quantity']()}</div>
        <div class="text-center text-base">
          {m['cart.amount']()}
          <span class="currency text-xs md:block">(USD)</span>
        </div>
      </div>
    {/if}

    <!-- Cart Items List -->
    {#if cartItems.length > 0}
      {#each cartItems as item (item.id)}
        {@const [product, brand] = findProductAndBrand(item.productId)}
        <div class="grid grid-cols-4 items-center gap-4 border-b border-border py-4 md:grid-cols-6">
          <div class="col-span-2 flex items-center md:col-span-3">
            <div class="mr-4 h-12 w-16 flex-shrink-0">
              <img
                src={giftCardImageDomain + '/giftcards/' + product?.imageSourceFront}
                alt={''}
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                use:handleImageError
              />
            </div>
            <div class="flex flex-col">
              <span class="text-base font-medium text-foreground"
                >{'$' + item.price / 1000 + ' Gift card to ' + brand?.name}</span
              >
              <Button
                variant="outline"
                size="sm"
                class="mt-1 h-6 w-fit rounded-full border-accent px-2 text-xs text-accent hover:bg-accent hover:text-accent-foreground"
                onclick={() => removeAllItems(item)}
              >
                {m['cart.remove']()}
              </Button>
            </div>
          </div>
          <div class="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              onclick={() => updateItemQuantity(item, (item.quantity || 0) - 1)}
              disabled={loadingItemId === item.id}
            >
              <Minus class="h-4 w-4" />
            </Button>
            <span
              class="flex items-center justify-center text-foreground"
              style="min-width: 1.5em; min-height: 1.5em;"
            >
              {#if loadingItemId === item.id}
                <span
                  class="inline-block h-[1.5em] w-[1.5em] animate-spin rounded-full border-2 border-primary border-t-transparent"
                ></span>
              {:else}
                <span style="display:inline-block; width:1.5em; height:1.5em; text-align:center;"
                  >{item.quantity || 0}</span
                >
              {/if}
            </span>
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              onclick={() => updateItemQuantity(item, (item.quantity || 0) + 1)}
              disabled={loadingItemId === item.id}
            >
              <Plus class="h-4 w-4" />
            </Button>
          </div>
          <div class="text-center text-foreground">
            {(item.price / 1000 || 0).toFixed(2)}
          </div>
        </div>
      {/each}
      <!-- Total Section -->
      <div class="mr-4 py-4 text-right text-foreground">
        <span class="text-lg font-bold">{m['cart.total']()}: USD {(total / 1000).toFixed(2)}</span>
      </div>
    {:else}
      <div class="py-8 text-center text-muted-foreground">{m['cart.empty']()}</div>
    {/if}

    <div>
      <Button
        class="mx-auto mb-6 block rounded-full border border-foreground bg-background text-foreground"
        onclick={() => goto(`/marketplace`)}>{m['cart.continue_shopping']()}</Button
      >
    </div>

    <!-- Place Order Button -->
    {#if cartItems.length > 0}
      <Button
        class="w-full rounded-full bg-nav-foreground py-3 text-lg font-bold text-nav hover:bg-nav-foreground/90"
        onclick={placeOrder}
      >
        {m['cart.place_order']()}
      </Button>
    {/if}
    <AlertDialog open={showOrderPlacedDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m['cart.order_placed']()}</AlertDialogTitle>
          <AlertDialogDescription>{m['cart.order_placed_description']()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onclick={() => {
              showOrderPlacedDialog = false;
              goto('/wallet');
            }}
          >
            {m['cart.okay']()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</div>
