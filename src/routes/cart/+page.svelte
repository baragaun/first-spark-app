<script lang="ts">
  import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import {
    type GiftCardProduct,
    type Brand,
    type ShoppingCart as ShoppingCartType,
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

  let shoppingCart = $state<ShoppingCartType | null | undefined>(undefined);

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

<div class="animate-fade-in flex min-h-screen flex-col bg-background">
  {#if !isMobile.current}
    <header class="px-6 pb-2 pt-4">
      <h1 class="text-2xl font-bold tracking-tight text-foreground">{m['cart.title']()}</h1>
    </header>
  {/if}

  <div class="container mx-auto flex-1 px-4 py-4 md:px-6">
    <!-- Cart Items List -->
    {#if cartItems.length > 0}
      <div class="space-y-3">
        {#each cartItems as item (item.id)}
          {@const [product, brand] = findProductAndBrand(item.productId)}
          <div class="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft md:gap-4 md:p-4">
            <!-- Product Image -->
            <div class="h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl md:h-20 md:w-28">
              <img
                src={giftCardImageDomain + '/giftcards/' + product?.imageSourceFront}
                alt={''}
                class="h-full w-full object-cover"
                use:handleImageError
              />
            </div>

            <!-- Product Info -->
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <span class="truncate text-sm font-semibold text-foreground">
                {brand?.name}
              </span>
              <span class="text-xs text-muted-foreground">
                ${(item.price / 1000).toFixed(0)} Gift Card
              </span>
              <button
                class="mt-0.5 flex w-fit items-center gap-1 text-xs text-destructive transition-colors hover:text-destructive/80"
                onclick={() => removeAllItems(item)}
              >
                <Trash2 class="h-3 w-3" />
                {m['cart.remove']()}
              </button>
            </div>

            <!-- Quantity Stepper -->
            <div class="flex items-center gap-1.5">
              <button
                class="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-40"
                onclick={() => updateItemQuantity(item, (item.quantity || 0) - 1)}
                disabled={loadingItemId === item.id}
              >
                <Minus class="h-3.5 w-3.5" />
              </button>
              <span class="flex h-8 w-8 items-center justify-center text-sm font-semibold">
                {#if loadingItemId === item.id}
                  <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                {:else}
                  {item.quantity || 0}
                {/if}
              </span>
              <button
                class="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-40"
                onclick={() => updateItemQuantity(item, (item.quantity || 0) + 1)}
                disabled={loadingItemId === item.id}
              >
                <Plus class="h-3.5 w-3.5" />
              </button>
            </div>

            <!-- Price -->
            <div class="w-16 text-right">
              <span class="text-sm font-bold text-foreground">
                ${(item.price / 1000 || 0).toFixed(2)}
              </span>
            </div>
          </div>
        {/each}
      </div>

      <!-- Total & Actions -->
      <div class="mt-6 space-y-3">
        <div class="flex items-center justify-between rounded-2xl bg-muted/40 px-5 py-4">
          <span class="text-sm font-medium text-muted-foreground">{m['cart.total']()}</span>
          <span class="text-xl font-bold text-primary">USD {(total / 1000).toFixed(2)}</span>
        </div>

        <Button
          class="h-12 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
          onclick={placeOrder}
        >
          {m['cart.place_order']()}
        </Button>

        <Button
          variant="ghost"
          class="mx-auto block text-sm text-muted-foreground hover:text-foreground"
          onclick={() => goto(`/marketplace`)}
        >
          {m['cart.continue_shopping']()}
        </Button>
      </div>
    {:else if shoppingCart === undefined}
      <div class="flex h-[60vh] items-center justify-center">
        <div class="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
          <ShoppingCart class="h-7 w-7 text-muted-foreground/50" />
        </div>
        <p class="mb-1 text-base font-medium text-foreground">{m['cart.empty']()}</p>
        <p class="mb-6 text-sm text-muted-foreground">Browse the marketplace to find gift cards</p>
        <Button
          class="rounded-full px-8"
          onclick={() => goto(`/marketplace`)}
        >
          {m['cart.continue_shopping']()}
        </Button>
      </div>
    {/if}

    <AlertDialog open={showOrderPlacedDialog}>
      <AlertDialogContent class="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-center">{m['cart.order_placed']()}</AlertDialogTitle>
          <AlertDialogDescription class="text-center">{m['cart.order_placed_description']()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="justify-center sm:justify-center">
          <AlertDialogAction
            class="rounded-full px-8"
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
