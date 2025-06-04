
<script lang="ts">
  import { m } from '$lib/paraglide/messages.js';
  import { Search, ChevronDown } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { GiftCardProduct, Vendor, ProductCategory } from '@baragaun/bg-node-client';
  import placeholderImage from '../../assets/images/placeholder.png';
  
  let searchQuery = '';
  let selectedCategory: ProductCategory | 'All' = 'All';
  
  const giftCardImageDomain = 'https://d27wpajtnol6ce.cloudfront.net';
  const giftCardProducts = writable<GiftCardProduct[]>([]);
  const vendorsList = writable<Vendor[]>([]);
  const productCategoriesList = writable<ProductCategory[]>([]);
  
  $: filteredGiftCardProducts = $giftCardProducts.filter(giftCardProduct => {
    // Filter by search query (vendor name)
    const matchesVendor = $vendorsList.some(vendor => 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
      vendor.id === giftCardProduct.vendorId
    );

    //console.log('jahanvi selectedCategory =', selectedCategory);
    //console.log('jahanvi giftCardProduct.categories =', giftCardProduct.categories);
    
    // Filter by category
    const matchesCategory = selectedCategory === 'All' || 
      giftCardProduct.categories?.includes(
        //$productCategoriesList.find(cat => cat.name === selectedCategory)?.id || ''
        selectedCategory.name,
      );
    
    return matchesVendor && matchesCategory;
  });

  function getVendorForGiftCard(giftCardProduct: GiftCardProduct): Vendor | undefined {
    return $vendorsList.find(vendor => vendor.id === giftCardProduct.vendorId);
  }

  onMount(async () => {
    const giftCardsresponse = await marketplaceContext.findGiftCardProducts();
    giftCardProducts.set(giftCardsresponse as GiftCardProduct[]);
    const vendorsResponse = await marketplaceContext.findVendors();
    vendorsList.set(vendorsResponse as Vendor[]);
    const productCategoriesResponse = await marketplaceContext.findProductCategories();
    productCategoriesList.set(productCategoriesResponse as ProductCategory[]);
    console.log('productCategoriesList', $vendorsList);
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
        
        {#each $productCategoriesList as category}
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

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto max-h-[calc(100vh-220px)]">
    {#each filteredGiftCardProducts as giftCardProduct (giftCardProduct.id)}
      {@const vendor = getVendorForGiftCard(giftCardProduct)}
      {#if vendor}
        <div class="flex flex-col items-center">
          <div class="rounded-lg border bg-card shadow-sm overflow-hidden mb-2 w-full aspect-[4/3]">
            <img 
              src={giftCardImageDomain + '/giftcards/' + giftCardProduct.imageSourceFront} 
              alt={vendor.name} 
              class="w-full h-full object-cover"
              onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
            />
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full overflow-hidden">
              <img 
                src={giftCardImageDomain + '/vendors/' + vendor.logoImageSource} 
                alt="" 
                class="w-full h-full object-cover"
                onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
              />
            </div>
            <span class="text-sm font-medium">{vendor.name}</span>
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>

