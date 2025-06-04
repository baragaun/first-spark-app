<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import type { GiftCardProduct, Vendor } from '@baragaun/bg-node-client';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import { ArrowLeft } from 'lucide-svelte';

  const giftCardId = $derived(page.params.id);
  const giftCardImageDomain = 'https://d27wpajtnol6ce.cloudfront.net';
  
  const giftCardProduct = writable<GiftCardProduct | null>(null);
  const vendor = writable<Vendor | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      isLoading = true;
      // Fetch gift card products
      const giftCardsResponse = await marketplaceContext.findGiftCardProducts();
      if (typeof giftCardsResponse === 'string') {
        error = giftCardsResponse;
        return;
      }
      
      // Find the specific gift card by ID
      const product = giftCardsResponse?.find(p => p.id === giftCardId);
      if (!product) {
        error = "Gift card not found";
        return;
      }
      giftCardProduct.set(product);
      
      // Fetch vendors
      const vendorsResponse = await marketplaceContext.findVendors();
      if (typeof vendorsResponse === 'string') {
        error = vendorsResponse;
        return;
      }
      
      // Find the vendor for this gift card
      const productVendor = vendorsResponse?.find(v => v.id === product.vendorId);
      if (productVendor) {
        vendor.set(productVendor);
      }
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
              
              {#if $giftCardProduct.terms}
                <div>
                  <h3 class="font-medium">Terms & Conditions</h3>
                  <p class="text-muted-foreground">{$giftCardProduct.terms}</p>
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