<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import {
    GiftCardDenomination,
    type GiftCardProduct,
    type Vendor,
    type ShoppingCartItem,
  } from '@baragaun/bg-node-client';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import { ArrowLeft } from 'lucide-svelte';
  import { giftCardProductsStore, vendorsStore, dataLoaded } from '$lib/stores/marketplace-store';
  import { derived } from 'svelte/store';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';

  // Add a placeholder for user avatar (replace with real user data if available)
  const userAvatarUrl = 'https://randomuser.me/api/portraits/men/32.jpg';

  const giftCardId = $page.params.id;
  const giftCardImageDomain = 'https://d27wpajtnol6ce.cloudfront.net';

  // Create derived stores for the specific gift card and vendor
  const giftCardProduct = derived([giftCardProductsStore, dataLoaded], ([$products, $loaded]) => {
    if (!$loaded) return null;
    return $products.find((p) => p.id === giftCardId) || null;
  });

  const vendor = derived(
    [vendorsStore, giftCardProduct, dataLoaded],
    ([$vendors, $product, $loaded]) => {
      if (!$loaded || !$product) return null;
      return $vendors.find((v) => v.id === $product.vendorId) || null;
    },
  );

  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let selectedTab = $state('buy');

  onMount(async () => {
    try {
      isLoading = true;

      // If data is already loaded in the stores, use it
      if ($dataLoaded) {
        if (!$giftCardProduct) {
          error = 'Gift card not found';
        }
        isLoading = false;
        return;
      }

      // Otherwise, fetch the data
      const giftCardsResponse = await marketplaceContext.findGiftCardProducts();
      if (typeof giftCardsResponse === 'string') {
        error = giftCardsResponse;
        return;
      }
      giftCardProductsStore.set(giftCardsResponse as GiftCardProduct[]);

      const product = giftCardsResponse?.find((p) => p.id === giftCardId);
      if (!product) {
        error = 'Gift card not found';
        return;
      }

      const vendorsResponse = await marketplaceContext.findVendors();
      if (typeof vendorsResponse === 'string') {
        error = vendorsResponse;
        return;
      }
      vendorsStore.set(vendorsResponse as Vendor[]);

      dataLoaded.set(true);
    } catch (err) {
      error = 'Failed to load gift card details';
      console.error(err);
    } finally {
      isLoading = false;
    }
  });

  function getDenominations(
    giftCardProduct: GiftCardProduct | null | undefined,
  ): GiftCardDenomination[] {
    let denominationsToReturn: GiftCardDenomination[] = [];
    if (giftCardProduct?.denominations && giftCardProduct.denominations.length > 0) {
      denominationsToReturn = giftCardProduct.denominations;
    } else if (giftCardProduct?.genericGiftCardId) {
      const genericProduct = $giftCardProductsStore.find(
        (product) => product.id === giftCardProduct.genericGiftCardId,
      );

      if (genericProduct?.denominations && genericProduct.denominations.length > 0) {
        denominationsToReturn = genericProduct.denominations;
      }
    }
    return [...denominationsToReturn].sort((a, b) => a.amount - b.amount);
  }

  async function addDenominationToCart(
    denomination: GiftCardDenomination,
    giftCardProduct: GiftCardProduct,
  ) {
    if (!giftCardProduct.id) {
      console.error('GiftCardProduct ID is missing, cannot add to cart.');
      toast.error('Failed to add item to cart: Gift card details missing.');
      return;
    }

    // Construct the item to add to cart using the correct type
    const count = 1;
    const itemToAdd: Partial<ShoppingCartItem> = {
      shoppingCartId: myUserContext.myUserId,
      productId: giftCardProduct.id,
      quantity: count,
      price: denomination.amount,
      totalPrice: count * denomination.amount,
    };

    try {
      const result = await marketplaceContext.createShoppingCartItem(itemToAdd);

      if (result.error) {
        console.error('Error adding item to cart:', result.error);
        toast.error(`Failed to add item to cart: ${result.error}`);
      } else if (result.object) {
        console.log('Item added to cart:', result.object);
        toast.success(
          `$${denomination.amount / 1000} ${giftCardProduct.name || 'Gift Card'} added to cart!`,
        );
        // Optionally navigate to cart page or update cart count somewhere
        goto('/cart'); // Navigate to shopping cart page after adding
      } else {
        toast.error('Failed to add item to cart: No object returned.');
      }
    } catch (error) {
      console.error('Unexpected error adding item to cart:', error);
      toast.error('An unexpected error occurred while adding to cart.');
    }
  }
</script>

<!-- Header Bar -->
<div
  class="flex items-center justify-between rounded-b-lg bg-foreground px-4 py-3 text-background shadow"
>
  <button onclick={() => history.back()} class="flex items-center">
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="text-lg font-semibold">Buy Gift Card</span>
  <img src={userAvatarUrl} alt="User" class="h-8 w-8 rounded-full object-cover" />
</div>

{#if isLoading}
  <div class="flex h-[60vh] items-center justify-center">
    <div class="text-center">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
      ></div>
      <p class="mt-2 text-muted-foreground">Loading gift card details...</p>
    </div>
  </div>
{:else if error}
  <Card.Root class="mx-auto mt-8 max-w-md">
    <Card.Header>
      <Card.Title>Error</Card.Title>
    </Card.Header>
    <Card.Content>
      <p>{error}</p>
    </Card.Content>
    <Card.Footer>
      <Button href="/marketplace">Return to Marketplace</Button>
    </Card.Footer>
  </Card.Root>
{:else if $giftCardProduct && $vendor}
  <div class="mx-auto max-w-lg px-4 py-6">
    <!-- Gift Card Image -->
    <div class="my-6 flex justify-center">
      <img
        src={giftCardImageDomain + '/giftcards/' + $giftCardProduct.imageSourceFront}
        alt={$vendor.name + ' gift card'}
        class="aspect-[16/9] w-full max-w-md rounded-2xl object-contain shadow-lg"
        onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
      />
    </div>

    <!-- Tabs -->
    <div class="mb-4 flex border-b">
      <button
        class="flex-1 border-b-2 py-2 font-medium"
        style="color: {selectedTab === 'buy'
          ? 'var(--primary)'
          : '#888'}; border-color: {selectedTab === 'buy' ? 'var(--primary)' : 'transparent'};"
        onclick={() => (selectedTab = 'buy')}>Buy</button
      >
      <button
        class="flex-1 border-b-2 py-2 font-medium"
        style="color: {selectedTab === 'info'
          ? 'var(--primary)'
          : '#888'}; border-color: {selectedTab === 'info' ? 'var(--primary)' : 'transparent'};"
        onclick={() => (selectedTab = 'info')}>Info</button
      >
      <button
        class="flex-1 border-b-2 py-2 font-medium"
        style="color: {selectedTab === 'brand'
          ? 'var(--primary)'
          : '#888'}; border-color: {selectedTab === 'brand' ? 'var(--primary)' : 'transparent'};"
        onclick={() => (selectedTab = 'brand')}>Brand</button
      >
    </div>

    {#if selectedTab === 'buy'}
      <!-- Brand and Amounts (Buy Tab) -->
      <div class="text-500 mb-2 text-sm text-secondary-foreground">Brand</div>
      <div class="mb-4 text-xl font-bold">{$vendor.name}</div>
      <div class="text-500 mb-2 text-sm text-secondary-foreground">Gift Card Amount</div>
      <div class="space-y-4">
        {#each getDenominations($giftCardProduct) as denomination}
          <button
            type="button"
            class="flex w-full cursor-pointer flex-col items-center rounded-xl border px-6 py-4 text-2xl font-bold shadow-sm transition-colors hover:bg-gray-100"
            onclick={() => addDenominationToCart(denomination, $giftCardProduct)}
            onkeydown={(e) =>
              e.key === 'Enter' && addDenominationToCart(denomination, $giftCardProduct)}
          >
            <span class="flex items-end gap-1">
              <span class="align-bottom text-base text-muted-foreground">USD</span>
              <span class="text-4xl">{denomination.amount / 1000}</span>
            </span>
          </button>
        {/each}
      </div>
    {/if}

    {#if selectedTab === 'info'}
      <div class="px-2 py-4">
        {#if $giftCardProduct.instructionsEn}
          <div class="mb-6">
            <h2 class="text-400 mb-2 text-lg font-semibold text-secondary-foreground">
              How To Redeem
            </h2>
            {#if $giftCardProduct.instructionsEn?.trim().startsWith('<')}
              <p class="mb-2">
                {@html $giftCardProduct.instructionsEn}
              </p>
            {:else}
              <p class="mb-2">
                {$giftCardProduct.instructionsEn}
              </p>
            {/if}
          </div>
        {/if}
        {#if $giftCardProduct.termsEn}
          <div>
            <h2 class="text-400 mb-2 text-lg font-semibold text-secondary-foreground">
              Terms And Conditions
            </h2>
            {#if $giftCardProduct.instructionsEn?.trim().startsWith('<')}
              <p class="mb-2">
                {@html $giftCardProduct.termsEn}
              </p>
            {:else}
              <p class="mb-2">
                {$giftCardProduct.termsEn}
              </p>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

    {#if selectedTab === 'brand'}
      <div class="flex flex-col items-center py-8">
        <!-- Brand Logo -->
        <div
          class="mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg"
        >
          <img
            src={giftCardImageDomain + '/vendors/' + $vendor.logoImageSource}
            alt={$vendor.name}
            class="h-full w-full object-contain"
            onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
          />
        </div>
        <!-- Brand Description -->
        {#if $vendor.description}
          <div class="text-600 mb-8 max-w-xl text-center">{$vendor.description}</div>
        {/if}
        <!-- Visit Online Button -->
        {#if $vendor.url}
          <a
            href={$vendor.url}
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg bg-primary px-8 py-2 font-semibold tracking-wide text-white shadow transition hover:bg-primary/90"
            style="text-transform: uppercase; letter-spacing: 1px;"
          >
            VISIT ONLINE
          </a>
        {/if}
      </div>
    {/if}
  </div>
{/if}
