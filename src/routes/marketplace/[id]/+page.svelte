<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import type { GiftCardProduct, Vendor } from '@baragaun/bg-node-client';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import { ArrowLeft } from 'lucide-svelte';
  import { giftCardProductsStore, vendorsStore, dataLoaded } from '$lib/stores/marketplace-store';
  import { derived } from 'svelte/store';

  // Add a placeholder for user avatar (replace with real user data if available)
  const userAvatarUrl = 'https://randomuser.me/api/portraits/men/32.jpg';

  const giftCardId = $page.params.id;
  const giftCardImageDomain = 'https://d27wpajtnol6ce.cloudfront.net';
  
  // Create derived stores for the specific gift card and vendor
  const giftCardProduct = derived(
    [giftCardProductsStore, dataLoaded],
    ([$products, $loaded]) => {
      if (!$loaded) return null;
      return $products.find(p => p.id === giftCardId) || null;
    }
  );
  
  const vendor = derived(
    [vendorsStore, giftCardProduct, dataLoaded],
    ([$vendors, $product, $loaded]) => {
      if (!$loaded || !$product) return null;
      return $vendors.find(v => v.id === $product.vendorId) || null;
    }
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
          error = "Gift card not found";
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
      
      const product = giftCardsResponse?.find(p => p.id === giftCardId);
      if (!product) {
        error = "Gift card not found";
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
      error = "Failed to load gift card details";
      console.error(err);
    } finally {
      isLoading = false;
    }
  });
</script>

<!-- Header Bar -->
<div class="flex items-center justify-between bg-primary text-white px-4 py-3 rounded-b-lg shadow">
  <button onclick={() => history.back()} class="flex items-center">
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="text-lg font-semibold">Buy Gift Card</span>
  <img src={userAvatarUrl} alt="User" class="h-8 w-8 rounded-full object-cover" />
</div>

{#if isLoading}
  <div class="flex h-[60vh] items-center justify-center">
    <div class="text-center">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p class="mt-2 text-muted-foreground">Loading gift card details...</p>
    </div>
  </div>
{:else if error}
  <Card.Root class="mx-auto max-w-md mt-8">
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
  <div class="max-w-lg mx-auto px-4 py-6">
    <!-- Gift Card Image -->
    <div class="flex justify-center my-6">
      <img
        src={giftCardImageDomain + '/giftcards/' + $giftCardProduct.imageSourceFront}
        alt={$vendor.name + " gift card"}
        class="rounded-2xl shadow-lg w-full max-w-md aspect-[16/9] object-contain"
        onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
      />
    </div>

    <!-- Tabs -->
    <div class="flex border-b mb-4">
      <button
        class="flex-1 py-2 border-b-2 font-medium"
        style="color: {selectedTab === 'buy' ? 'var(--primary)' : '#888'}; border-color: {selectedTab === 'buy' ? 'var(--primary)' : 'transparent'};"
        onclick={() => selectedTab = 'buy'}
      >Buy</button>
      <button
        class="flex-1 py-2 border-b-2 font-medium"
        style="color: {selectedTab === 'info' ? 'var(--primary)' : '#888'}; border-color: {selectedTab === 'info' ? 'var(--primary)' : 'transparent'};"
        onclick={() => selectedTab = 'info'}
      >Info</button>
      <button
        class="flex-1 py-2 border-b-2 font-medium"
        style="color: {selectedTab === 'brand' ? 'var(--primary)' : '#888'}; border-color: {selectedTab === 'brand' ? 'var(--primary)' : 'transparent'};"
        onclick={() => selectedTab = 'brand'}
      >Brand</button>
    </div>

    {#if selectedTab === 'buy'}
      <!-- Brand and Amounts (Buy Tab) -->
      <div class="mb-2 text-gray-500 text-sm">Brand</div>
      <div class="mb-4 text-xl font-bold">{$vendor.name}</div>
      <div class="space-y-4">
        {#each $giftCardProduct.denominations ?? [] as denomination}
          <div class="rounded-xl border px-6 py-4 flex flex-col items-center text-2xl font-bold shadow-sm">
            <span class="flex items-end gap-1">
              <span class="text-base align-bottom" style="color: var(--kcu-plum)">USD</span>
              {denomination.amount}
            </span>
            {#if denomination.amount}
              <span class="text-xs text-indigo-400 mt-1">Reward: MIT {denomination.amount}</span>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    {#if selectedTab === 'info'}
      <div class="px-2 py-4">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-400 mb-2">How To Redeem</h2>
          <p class="mb-2">
            <span class="font-bold">Online:</span>
            {$giftCardProduct.instructionsEn}
          </p>
          <p>
            <span class="font-bold">In-store:</span>
            Bring your Gift Card number and PIN to any adidas Sport Performance, adidas Originals, or adidas Outlet store.
          </p>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-400 mb-2">Terms And Conditions</h2>
          <p class="text-gray-700">
            {$giftCardProduct.termsEn}
          </p>
        </div>
      </div>
    {/if}

    {#if selectedTab === 'brand'}
      <div class="flex flex-col items-center py-8">
        <!-- Brand Logo -->
        <div class="w-40 h-40 rounded-2xl shadow-lg bg-white flex items-center justify-center mb-4 overflow-hidden">
          <img
            src={giftCardImageDomain + '/vendors/' + $vendor.logoImageSource}
            alt={$vendor.name}
            class="object-contain w-full h-full"
            onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
          />
        </div>
       <!-- Brand Description -->
        {#if $vendor.description}
          <div class="text-gray-600 text-center max-w-xl mb-8">{$vendor.description}</div>
        {/if}
        <!-- Visit Online Button -->
        {#if $vendor.url}
          <a
            href={$vendor.url}
            target="_blank"
            rel="noopener noreferrer"
            class="bg-primary text-white px-8 py-2 rounded-lg shadow font-semibold tracking-wide transition hover:bg-primary/90"
            style="text-transform: uppercase; letter-spacing: 1px;"
          >
            VISIT ONLINE
          </a>
        {/if}
      </div>
    {/if}
  </div>
{/if}
