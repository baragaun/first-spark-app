<script lang="ts">
  import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import type { GiftCardProduct, ShoppingCart, ShoppingCartItem } from '@baragaun/bg-node-client';
  import { writable } from 'svelte/store';
  import { toast } from 'svelte-sonner';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { giftCardProductsStore, vendorsStore, dataLoaded } from '$lib/stores/marketplace-store';

  let cartItems: ShoppingCartItem[] = [];
  let currentMitBalance = 6062;
  let selectedPaymentMethod = 'MIT';

  $: subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  $: totalReward = cartItems.reduce((sum, item) => sum + item.price / 1000, 0);
  $: isOrderExceedingBalance = selectedPaymentMethod === 'MIT' && subtotal > currentMitBalance;

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

  function placeOrder() {
    alert('Order Placed!');
    // Implement actual order placement logic here
  }

  function goBack() {
    history.back();
  }

  function filterProduct(productId: String): String {
    const product = $giftCardProductsStore.find((product) => product.id === productId);
    return product?.imageSourceFront ?? '';
  }

  const shoppingCart = writable<ShoppingCart | null | undefined>(undefined);

  onMount(async () => {
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
      <div class="col-span-2 md:col-span-3">Product</div>
      <div class="text-center">Count</div>
      <div class="col-span-1 text-right md:col-span-1">Amount (USD)</div>
      <div class="text-right md:col-span-1"></div>
    </div>

    <!-- Cart Items List -->
    {#if $shoppingCart?.items}
      {#each $shoppingCart.items as item (item.id)}
        <div class="grid grid-cols-4 items-center gap-4 border-b border-border py-4 md:grid-cols-6">
          <div class="col-span-2 flex items-center md:col-span-3">
            <div class="mr-4 h-12 w-16 flex-shrink-0">
              <img
                src={'https://d27wpajtnol6ce.cloudfront.net/giftcards/' +
                  filterProduct(item.productId)}
                alt={''}
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
              />
            </div>
            <div class="flex flex-col">
              <span class="text-base font-medium text-primary"
                >{item.productId ? 'Gift Card' : ''}</span
              >
              <span class="text-sm text-muted-foreground">Reward: MIT {item.price / 1000}</span>
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
          <div class="text-center text-primary">{item.count || 0}</div>
          <div class="col-span-1 text-right text-primary md:col-span-1">
            {item.totalPrice || 0}
          </div>
        </div>
      {/each}
    {:else}
      <div class="py-8 text-center text-muted-foreground">Your cart is empty</div>
    {/if}

    <!-- Total Section -->
    <div class="mt-6 flex items-center justify-end text-primary">
      <span class="mr-4 text-lg font-bold">total: USD {subtotal}</span>
      <!-- <Button variant="outline" class="mr-2" onclick={() => goto(`/marketplace`)}>ADD GIFT</Button> -->
    </div>
    <div class="mt-2 flex justify-end text-primary"></div>

    <!-- Payment Method Section -->
    <!-- <h2 class="mb-4 mt-8 text-lg font-bold text-primary">Payment Method</h2>
    <div class="mb-6 flex space-x-4">
      <button
        class="flex flex-col items-center rounded-lg border p-3 {selectedPaymentMethod === 'MIT'
          ? 'border-primary bg-primary/10'
          : 'border-border'}"
        onclick={() => (selectedPaymentMethod = 'MIT')}
      >
        <img src="/mit-logo.png" alt="MIT" class="mb-1 h-8 w-8" />
        <span class="text-sm text-primary">MIT</span>
      </button>
      <button
        class="flex flex-col items-center rounded-lg border p-3 {selectedPaymentMethod ===
        'CreditCard'
          ? 'border-primary bg-primary/10'
          : 'border-border'}"
        onclick={() => (selectedPaymentMethod = 'CreditCard')}
      >
        <img src="/credit-card-logo.png" alt="Credit Card" class="mb-1 h-8 w-8" />
        <span class="text-sm text-primary">Credit Card</span>
      </button>
      <button
        class="flex flex-col items-center rounded-lg border p-3 {selectedPaymentMethod === 'Bitcoin'
          ? 'border-primary bg-primary/10'
          : 'border-border'}"
        onclick={() => (selectedPaymentMethod = 'Bitcoin')}
      >
        <img src="/bitcoin-logo.png" alt="Bitcoin" class="mb-1 h-8 w-8" />
        <span class="text-sm text-primary">Bitcoin</span>
      </button>
      <button
        class="flex flex-col items-center rounded-lg border p-3 {selectedPaymentMethod === 'DOGE'
          ? 'border-primary bg-primary/10'
          : 'border-border'}"
        onclick={() => (selectedPaymentMethod = 'DOGE')}
      >
        <img src="/dogecoin-logo.png" alt="DOGE" class="mb-1 h-8 w-8" />
        <span class="text-sm text-primary">DOGE</span>
      </button>
      <button
        class="flex flex-col items-center rounded-lg border p-3 {selectedPaymentMethod ===
        'Litecoin'
          ? 'border-primary bg-primary/10'
          : 'border-border'}"
        onclick={() => (selectedPaymentMethod = 'Litecoin')}
      >
        <img src="/litecoin-logo.png" alt="Litecoin" class="mb-1 h-8 w-8" />
        <span class="text-sm text-primary">Litecoin</span>
      </button>
    </div> -->

    <!-- Warning Message -->
    {#if isOrderExceedingBalance}
      <div
        class="mb-6 flex items-start rounded-md border border-orange-200 bg-orange-100 p-4 text-orange-700 shadow-sm"
        role="alert"
      >
        <AlertCircle class="mr-3 mt-1 h-5 w-5 flex-shrink-0" />
        <div>
          <h3 class="mb-1 text-lg font-semibold">
            The payment amount of this order exceeds the balance of your Mimble Wallet.
          </h3>
          <p class="mb-2 text-sm">
            You are paying for this order with your Mimble Wallet using Mimble Tokens (MITs). Your
            current wallet balance is: MIT {currentMitBalance} ($60.62). Please either switch to another
            payment method, or remove items from your shopping cart until the order can be paid with
            your Mimble Token balance.
          </p>
          <p class="text-xs text-muted-foreground">① All gift card purchases are final.</p>
        </div>
      </div>
    {/if}

    <!-- Terms and Conditions -->
    <p class="mb-4 text-sm text-muted-foreground">
      By purchasing this gift card you agree to the terms and conditions of the gift card.
    </p>
    <p class="mb-6 text-sm text-muted-foreground">① All gift card purchases are final.</p>

    <!-- Place Order Button -->
    <Button
      class="w-full py-3 text-lg font-semibold text-background"
      disabled={isOrderExceedingBalance}
      onclick={placeOrder}
    >
      PLACE ORDER
    </Button>
  </div>
</div>
