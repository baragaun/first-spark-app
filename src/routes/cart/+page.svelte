<script lang="ts">
  import { Plus, Minus } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import {
    type GiftCardProduct,
    type Vendor,
    type ShoppingCart,
    type PurchaseOrder,
    ShoppingCartItem,
  } from '@baragaun/bg-node-client';
  import { writable, derived } from 'svelte/store';
  import { toast } from 'svelte-sonner';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { giftCardProductsStore, vendorsStore, dataLoaded } from '$lib/stores/marketplace-store';
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
  import type { PurchaseOrderInput } from '../../../../bg-node-client/lib/fsdata/gql/graphql';

  let cartItems = $state<ShoppingCartItem[]>([]);
  let total = $derived.by(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));

  let showOrderPlacedDialog = $state(false);

  // Function to combine items with same productId
  function combineDuplicateItems(items: ShoppingCartItem[]): ShoppingCartItem[] {
    const combinedItems = new Map<string, ShoppingCartItem>();

    items.forEach((item) => {
      if (!item.productId) return;

      if (combinedItems.has(item.productId)) {
        const existingItem = combinedItems.get(item.productId)!;
        existingItem.quantity = (existingItem.quantity || 0) + (item.quantity || 0);
        existingItem.totalPrice = (existingItem.totalPrice || 0) + (item.totalPrice || 0);
      } else {
        combinedItems.set(item.productId, { ...item });
      }
    });

    return Array.from(combinedItems.values());
  }

  async function updateItemQuantity(item: ShoppingCartItem, newQuantity: number) {
    if (newQuantity < 1) {
      //await removeItem(item.id || '');
      item.quantity = 0;
      await marketplaceContext.updateShoppingCartItem(item);
      return;
    }

    try {
      // First remove the existing item
      //await removeItem(item.id || '');

      item.quantity = newQuantity;
      const result = await marketplaceContext.updateShoppingCartItem(item);

      //const result = await marketplaceContext.createShoppingCartItem(newItem);
      if (result.error) {
        console.error('Error updating item quantity:', result.error);
        toast.error(`Failed to update quantity: ${result.error}`);
      } else if (result.object) {
        // Update the local cart items
        cartItems = cartItems.map((cartItem) =>
          cartItem.id === item.id ? (result.object as ShoppingCartItem) : cartItem,
        );
        toast.success('Quantity updated!');
      }
    } catch (error) {
      console.error('Unexpected error updating quantity:', error);
      toast.error('An unexpected error occurred while updating quantity.');
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

  async function placeOrder() {
    const order: PurchaseOrderInput = {
      shoppingCartId: myUserContext.myUserId!,
      userId: myUserContext.myUserId!,
      sumItemPrice: total,
      totalPrice: total,
      vat: 0,
    };
    await marketplaceContext.createPurchaseOrder(order).then(async (result) => {
      if (result.error) {
        console.error('Error creating purchase order:', result.error);
        toast.error(`Failed to create purchase order: ${result.error}`);
      } else {
        toast.success('Purchase order created!');
        await marketplaceContext.emptyMyShoppingCart();
        showOrderPlacedDialog = true;
      }
    });
  }

  function goBack() {
    history.back();
  }

  function findProductAndVendor(
    productId: String,
  ): [GiftCardProduct | undefined, Vendor | undefined] {
    const product = $giftCardProductsStore.find((product) => product.id === productId);
    const vendor = $vendorsStore.find((vendor) => vendor.id === product?.vendorId);
    return [product, vendor];
  }

  const shoppingCart = writable<ShoppingCart | null | undefined>(undefined);

  onMount(async () => {
    // fetch product data if not loaded
    if (!$dataLoaded) {
      const giftCardsResponse = await marketplaceContext.findGiftCardProducts();
      giftCardProductsStore.set(giftCardsResponse as GiftCardProduct[]);

      const vendorsResponse = await marketplaceContext.findVendors();
      vendorsStore.set(vendorsResponse as Vendor[]);

      dataLoaded.set(true);
    }

    // Fetch shopping cart data
    const cartResult = await marketplaceContext.findMyShoppingCart();

    if (typeof cartResult === 'string') {
      // Handle error case, e.g., show a toast or log
      console.error('Failed to load shopping cart:', cartResult);
      shoppingCart.set(undefined); // Set to undefined on error
    } else if (cartResult) {
      shoppingCart.set(cartResult);
      // Combine duplicate items before setting cartItems
      cartItems = combineDuplicateItems(cartResult.items);
    } else {
      shoppingCart.set(null); // No cart found
    }
  });
</script>

<div class="flex min-h-screen flex-col bg-background font-sans antialiased">
  <!-- Top Bar -->
  <header class="mb-6 px-3 pt-3">
    <h1 class="text-3xl font-bold text-foreground">{m['cart.title']()}</h1>
    <p class="mt-2 text-muted-foreground">{m['cart.subtitle']()}</p>
  </header>

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
        {@const [product, vendor] = findProductAndVendor(item.productId)}
        <div class="grid grid-cols-4 items-center gap-4 border-b border-border py-4 md:grid-cols-6">
          <div class="col-span-2 flex items-center md:col-span-3">
            <div class="mr-4 h-12 w-16 flex-shrink-0">
              <img
                src={'https://d27wpajtnol6ce.cloudfront.net/giftcards/' + product?.imageSourceFront}
                alt={''}
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
              />
            </div>
            <div class="flex flex-col">
              <span class="text-base font-medium text-foreground"
                >{'$' + item.price / 1000 + ' Gift card to ' + vendor?.name}</span
              >
              <Button
                variant="outline"
                size="sm"
                class="mt-1 h-6 w-fit rounded-full border-accent px-2 text-xs text-accent hover:bg-accent hover:text-accent-foreground"
                onclick={() => removeItem(item.id || '')}
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
            >
              <Minus class="h-4 w-4" />
            </Button>
            <span class="text-foreground">{item.quantity || 0}</span>
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              onclick={() => updateItemQuantity(item, (item.quantity || 0) + 1)}
            >
              <Plus class="h-4 w-4" />
            </Button>
          </div>
          <div class="text-center text-foreground">
            {(item.totalPrice / 1000 || 0).toFixed(2)}
          </div>
        </div>
      {/each}
      <!-- Total Section -->
      <div class="mr-4 py-4 text-right text-foreground">
        <span class="text-lg font-bold"
          >{m['cart.total']()}: USD {(total / 1000).toFixed(2)}</span
        >
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
    <Button
      class="w-full rounded-full bg-nav py-3 text-lg font-bold text-nav-foreground hover:bg-nav/90"
      onclick={placeOrder}
      disabled={cartItems.length === 0}
    >
      {m['cart.place_order']()}
    </Button>
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
            }}
          >
            {m['cart.okay']()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</div>
