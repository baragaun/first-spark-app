<script lang="ts">
  import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import type {
    GiftCardProduct,
    Vendor,
    ShoppingCart,
    ShoppingCartItem,
  } from '@baragaun/bg-node-client';
  import { writable } from 'svelte/store';
  import { toast } from 'svelte-sonner';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { giftCardProductsStore, vendorsStore, dataLoaded } from '$lib/stores/marketplace-store';

  let cartItems: ShoppingCartItem[] = [];
  $: subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  async function removeItem(id: string) {
    console.log(`jahanvi ${id}`);
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

  function placeOrder() {
    alert('Order Placed!');
    // Implement actual order placement logic here
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
      // We need to map it to our local CartItem interface
      cartItems = cartResult.items;
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
    <Button
      class="absolute right-4 rounded-lg border border-background text-background"
      onclick={() => goto(`/marketplace`)}>ADD GIFT</Button
    >
  </header>

  <div class="container mx-auto flex-1 px-4 py-6">
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

    <!-- Cart Items List -->
    {#if $shoppingCart?.items}
      {#each $shoppingCart.items as item (item.id)}
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
                onclick={() => removeItem(item.productId || '')}
              >
                Remove
              </Button>
            </div>
          </div>
          <div class="text-center text-primary">{item.quantity || 0}</div>
          <div class="text-center text-primary">
            {item.totalPrice / 1000 || 0}
          </div>
        </div>
      {/each}
    {:else}
      <div class="py-8 text-center text-muted-foreground">Your cart is empty</div>
    {/if}

    <!-- Total Section -->
    <div class="mt-6 flex items-center justify-end text-primary">
      <span class="mr-4 text-lg font-bold">Total: USD {subtotal / 1000}</span>
    </div>
    <!-- <div class="mt-2 flex justify-end text-primary"></div> -->

    <!-- Terms and Conditions -->
    <p class="mb-4 text-sm text-muted-foreground">
      By purchasing this gift card you agree to the terms and conditions of the gift card.
    </p>
    <p class="mb-6 text-sm text-muted-foreground">① All gift card purchases are final.</p>

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
