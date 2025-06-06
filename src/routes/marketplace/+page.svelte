
<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
  import { Search, ChevronDown } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { onMount } from 'svelte';
  import type { GiftCardProduct, Vendor, ProductCategory } from '@baragaun/bg-node-client';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { goto } from '$app/navigation';
  import { giftCardProductsStore, vendorsStore, productCategoriesStore, dataLoaded } from '$lib/stores/marketplace-store';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  
  // Initialize the mobile detector
  const isMobile = new IsMobile();
  
  let searchQuery = '';
  let selectedCategory: ProductCategory | 'All' = 'All';
  
  const giftCardImageDomain = 'https://d27wpajtnol6ce.cloudfront.net';
  
  function navigateToGiftCardDetail(giftCardId: string) {
    goto(`/marketplace/${giftCardId}`);
  }

  $: filteredGiftCardProducts = $giftCardProductsStore.filter(giftCardProduct => {
    // Filter by search query (vendor name)
    const matchesVendor = $vendorsStore.some(vendor => 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
      vendor.id === giftCardProduct.vendorId
    );

    // Filter by category
    const matchesCategory = selectedCategory === 'All' || 
      giftCardProduct.categories?.includes(
        selectedCategory.id,
      );
    
    return matchesVendor && matchesCategory;
  });

  function getVendorForGiftCard(giftCardProduct: GiftCardProduct): Vendor | undefined {
    return $vendorsStore.find(vendor => vendor.id === giftCardProduct.vendorId);
  }

  onMount(async () => {
    const giftCardsresponse = await marketplaceContext.findGiftCardProducts();
    giftCardProductsStore.set(giftCardsresponse as GiftCardProduct[]);
    const vendorsResponse = await marketplaceContext.findVendors();
    vendorsStore.set(vendorsResponse as Vendor[]);
    const productCategoriesResponse = await marketplaceContext.findProductCategories();
    productCategoriesStore.set(productCategoriesResponse as ProductCategory[]);
    dataLoaded.set(true);
  });
</script>

<div class="container mx-auto px-4 py-6">
  <header class="mb-6">
    <h1 class="text-3xl font-bold text-primary">First Spark Marketplace</h1>
    <p class="text-muted-foreground mt-2">Discover and connect with our partner services</p>
  </header>

  <div class="flex items-center gap-4 mb-6">
    <div class="relative flex-1">
      <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        type="search" 
        placeholder="Search marketplace" 
        class="pl-10"
        bind:value={searchQuery}
      />
    </div>
    
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline" class="flex items-center gap-2">
          {selectedCategory === 'All' ? 'All' : selectedCategory.labelEn}
          <ChevronDown class="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="max-h-[300px] overflow-y-auto">
        <DropdownMenu.Item 
          onclick={() => selectedCategory = 'All'}
          class="cursor-pointer"
        >
          All
          {#if selectedCategory === 'All'}
            <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
          {/if}
        </DropdownMenu.Item>
        
        {#each $productCategoriesStore as category}
          <DropdownMenu.Item 
            onclick={() => selectedCategory = category}
            class="cursor-pointer"
          >
            {category.labelEn}
            {#if selectedCategory !== 'All' && selectedCategory.name === category.name}
              <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
            {/if}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-220px)]">
    {#each filteredGiftCardProducts as giftCardProduct (giftCardProduct.id)}
      {@const vendor = getVendorForGiftCard(giftCardProduct)}
      {#if vendor}
        <button 
          type="button"
          class="flex flex-col items-center text-left bg-transparent border-0 p-0 hover:opacity-90 transition-opacity" 
          onclick={() => navigateToGiftCardDetail(giftCardProduct.id)}
          onkeydown={(e) => e.key === 'Enter' && navigateToGiftCardDetail(giftCardProduct.id)}
          aria-label={`View ${vendor.name} gift card details`}
        >
          <div class="rounded-lg border bg-card shadow-sm overflow-hidden mb-2 w-full aspect-[4/3]">
            <img 
              src={giftCardImageDomain + '/giftcards/' + giftCardProduct.imageSourceFront} 
              alt={vendor.name} 
              class="w-full h-full object-cover"
              onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
            />
          </div>
          <div class="flex items-center gap-2">
            {#if !isMobile.current}
              <div class="w-6 h-6 rounded-full overflow-hidden">
                <img 
                  src={giftCardImageDomain + '/vendors/' + vendor.logoImageSource} 
                  alt="" 
                  class="w-full h-full object-cover"
                  onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
                />
              </div>
            {/if}
            <span class="text-sm font-medium">{vendor.name}</span>
          </div>
        </button>
      {/if}
    {/each}
  </div>
</div>

