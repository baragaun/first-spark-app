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
    PurchaseOrderItem,
  } from '@baragaun/bg-node-client';
  import { writable } from 'svelte/store';
  import { toast } from 'svelte-sonner';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { giftCardProductsStore, vendorsStore, dataLoaded } from '$lib/stores/marketplace-store';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  let cartItems: ShoppingCartItem[] = [];
  $: subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

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
        cartItems = cartItems.filter((item) => item.shoppingCartId !== id);
        toast.success('Item removed from cart!');
      }
    } catch (error) {
      console.error('Unexpected error deleting item:', error);
      toast.error('An unexpected error occurred while removing the item.');
    }
  }

  async function placeOrder() {
    alert('Order Placed!');

    let orderItems: PurchaseOrderItem[] = [];
    for (const item of cartItems) {
      let orderItem: PurchaseOrderItem = {
        id: item.id,
        purchaseOrderId: item.id!,
        shoppingCartItemId: item.shoppingCartId,
        productId: item.productId,
        vendorId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        createdAt: item.createdAt,
      };
      orderItems.push(orderItem);
    }

    let item = cartItems[0];

    const order: PurchaseOrder = {
      shoppingCartId: myUserContext.myUserId!,
      sumItemPrice: item.price,
      totalPrice: item.totalPrice,
      vat: 0,
      items: orderItems,
      userId: '',
      createdAt: ''
    };
    await marketplaceContext.createPurchaseOrder(order);
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
  <header
    class="relative flex items-center justify-center bg-foreground p-4 text-background shadow-md"
  >
    <h1 class="text-lg font-semibold">Shopping Cart</h1>
  </header>

  <div class="container mx-auto flex-1 px-4 py-6">
    {#if cartItems.length > 0}
      <!-- Cart Items Header -->
      <div
        class="grid grid-cols-4 gap-4 border-b border-muted-foreground pb-2 text-sm font-medium text-muted-foreground md:grid-cols-6"
      >
        <div class="col-span-2 text-center text-base md:col-span-3">Product</div>
        <div class="text-center text-base">Quantity</div>
        <div class="text-center text-base">
          Amount
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
              <span class="text-base font-medium text-primary"
                >{'$' + item.price / 1000 + ' Gift card to ' + vendor?.name}</span
              >
              <Button
                variant="outline"
                size="sm"
                class="mt-1 h-6 w-fit rounded-full border-accent px-2 text-xs text-accent hover:bg-accent hover:text-accent-foreground"
                onclick={() => removeItem(item.id || '')}
              >
                Remove
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
            <span class="text-primary">{item.quantity || 0}</span>
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8"
              onclick={() => updateItemQuantity(item, (item.quantity || 0) + 1)}
            >
              <Plus class="h-4 w-4" />
            </Button>
          </div>
          <div class="text-center text-primary">
            {(item.totalPrice / 1000 || 0).toFixed(2)}
          </div>
        </div>
      {/each}
      <!-- Total Section -->
      <div class="mr-4 py-4 text-right text-primary">
        <span class="text-lg font-bold">Total: USD {(subtotal / 1000).toFixed(2)}</span>
      </div>
    {:else}
      <div class="py-8 text-center text-muted-foreground">Your cart is empty</div>
    {/if}

    <div>
      <Button
        class="mx-auto mb-6 block rounded-full border border-foreground bg-background text-foreground"
        onclick={() => goto(`/marketplace`)}>Continue shopping</Button
      >
    </div>

    <!-- Place Order Button -->
    <Button
      class="w-full py-3 text-lg font-semibold text-background"
      disabled={!$shoppingCart?.items || $shoppingCart.items.length === 0}
      onclick={placeOrder}
    >
      PLACE ORDER
    </Button>
  </div>
</div>
