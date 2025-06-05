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

<div class="container mx-auto px-4 py-6">
  <Button variant="ghost" href="/marketplace" class="mb-4 flex items-center gap-2">
    <ArrowLeft class="h-4 w-4" />
    <span>Back to Marketplace</span>
  </Button>

  {#if isLoading}
    <div class="flex h-[60vh] items-center justify-center">
      <div class="text-center">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p class="mt-2 text-muted-foreground">Loading gift card details...</p>
      </div>
    </div>
  {:else if error}
    <Card.Root class="mx-auto max-w-md">
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
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <!-- Left side: Gift card image -->
      <div class="flex flex-col items-center">
        <div class="rounded-lg border bg-card shadow-sm overflow-hidden w-full max-w-md aspect-[4/3]">
          <img 
            src={giftCardImageDomain + '/giftcards/' + $giftCardProduct.imageSourceFront} 
            alt={$vendor.name + " gift card"} 
            class="w-full h-full object-contain"
            onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
          />
        </div>
        {#if $giftCardProduct.imageSourceBack}
          <div class="rounded-lg border bg-card shadow-sm overflow-hidden w-full max-w-md aspect-[4/3] mt-4">
            <img 
              src={giftCardImageDomain + '/giftcards/' + $giftCardProduct.imageSourceBack} 
              alt={$vendor.name + " gift card back"} 
              class="w-full h-full object-contain"
              onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
            />
          </div>
        {/if}
      </div>
      
      <!-- Right side: Gift card details -->
      <div>
        <Card.Root>
          <Card.Header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={giftCardImageDomain + '/vendors/' + $vendor.logoImageSource} 
                  alt={$vendor.name} 
                  class="w-full h-full object-cover"
                  onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
                />
              </div>
              <Card.Title class="text-2xl">{$vendor.name}</Card.Title>
            </div>
            <Card.Description>
              Gift Card Details
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div class="space-y-4">
              {#if $giftCardProduct.description}
                <div>
                  <h3 class="font-medium">Description</h3>
                  <p class="text-muted-foreground">{$giftCardProduct.description}</p>
                </div>
              {/if}
              
              {#if $giftCardProduct.categories && $giftCardProduct.categories.length > 0}
                <div>
                  <h3 class="font-medium">Categories</h3>
                  <div class="flex flex-wrap gap-2 mt-1">
                    {#each $giftCardProduct.categories as category}
                      <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                        {category}
                      </span>
                    {/each}
                  </div>
                </div>
              {/if}
              
              {#if $giftCardProduct.termsEn}
                <div>
                  <h3 class="font-medium">Terms & Conditions</h3>
                  <p class="text-muted-foreground">{$giftCardProduct.termsEn}</p>
                </div>
              {/if}
            </div>
          </Card.Content>
          <Card.Footer class="flex justify-between">
            <Button variant="outline" href="/marketplace">
              Back to Marketplace
            </Button>
            <Button>
              Purchase
            </Button>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  {/if}
</div>
