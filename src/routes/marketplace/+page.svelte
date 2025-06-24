<script lang="ts">
  import { Search, ChevronDown } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { onMount } from 'svelte';
  import type { GiftCardProduct, Vendor, ProductCategory } from '@baragaun/bg-node-client';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { goto } from '$app/navigation';
  import {
    giftCardProductsStore,
    vendorsStore,
    productCategoriesStore,
    dataLoaded,
  } from '$lib/stores/marketplace-store';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';

  // Initialize the mobile detector
  const isMobile = new IsMobile();

  let searchQuery = '';
  let selectedCategory: ProductCategory | 'All' = 'All';

  const giftCardImageDomain = 'https://d27wpajtnol6ce.cloudfront.net';

  function navigateToGiftCardDetail(giftCardId: string | null | undefined) {
    if (!giftCardId) return;
    goto(`/marketplace/${giftCardId}`);
  }

  $: filteredGiftCardProducts = $giftCardProductsStore.filter((giftCardProduct) => {
    // Filter by search query (vendor name)
    const matchesVendor = $vendorsStore.some(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        vendor.id === giftCardProduct.vendorId,
    );
    // Filter by category
    const matchesCategory =
      selectedCategory === 'All' || giftCardProduct.categories?.includes(selectedCategory.importId);

    const hasDenominations =
      (giftCardProduct.denominations?.length ?? 0) > 0 ||
      giftCardProduct.genericGiftCardId != undefined;
    return matchesVendor && matchesCategory && hasDenominations;
  });

  function getVendorForGiftCard(giftCardProduct: GiftCardProduct): Vendor | undefined {
    return $vendorsStore.find((vendor) => vendor.id === giftCardProduct.vendorId);
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
    <h1 class="text-3xl font-bold text-primary">Marketplace</h1>
    <p class="mt-2 text-muted-foreground">Discover and connect with our partner services</p>
  </header>

  <div class="mb-6 flex items-center gap-4">
    <div class="relative flex-1">
      <!-- Gradient border wrapper -->
      <div
        class="relative rounded-full bg-gradient-to-r from-kcu-orange via-kcu-glacier to-kcu-plum p-[2px]"
      >
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search marketplace"
          class="search-input-override w-full rounded-full border-0 bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          bind:value={searchQuery}
        />
      </div>
    </div>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline" class="flex items-center gap-2">
          {selectedCategory === 'All' ? 'All' : selectedCategory.labelEn}
          <ChevronDown class="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="max-h-[300px] overflow-y-auto bg-background">
        <DropdownMenu.Item onclick={() => (selectedCategory = 'All')} class="cursor-pointer">
          All
          {#if selectedCategory === 'All'}
            <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
          {/if}
        </DropdownMenu.Item>

        {#each $productCategoriesStore as category}
          <DropdownMenu.Item onclick={() => (selectedCategory = category)} class="cursor-pointer">
            {category.labelEn}
            {#if selectedCategory !== 'All' && selectedCategory.name === category.name}
              <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
            {/if}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>

  <div
    class="grid max-h-[calc(100vh-220px)] grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3 lg:grid-cols-4"
  >
    {#each filteredGiftCardProducts as giftCardProduct (giftCardProduct.id)}
      {@const vendor = getVendorForGiftCard(giftCardProduct)}
      {#if vendor}
        <button
          type="button"
          class="group flex flex-col items-center border-0 bg-transparent p-0 text-left transition-all duration-300 hover:scale-105 hover:opacity-90"
          onclick={() => navigateToGiftCardDetail(giftCardProduct.id)}
          onkeydown={(e) => e.key === 'Enter' && navigateToGiftCardDetail(giftCardProduct.id)}
          aria-label={`View ${vendor.name} gift card details`}
        >
          <div
            class="mb-2 aspect-[4/3] w-full overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 group-hover:shadow-xl"
          >
            <img
              src={giftCardImageDomain + '/giftcards/' + giftCardProduct.imageSourceFront}
              alt={vendor.name}
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
            />
          </div>
          <div
            class="flex items-center gap-2 transition-colors duration-300 group-hover:text-primary"
          >
            {#if !isMobile.current}
              <div
                class="h-6 w-6 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110"
              >
                <img
                  src={giftCardImageDomain + '/vendors/' + vendor.logoImageSource}
                  alt=""
                  class="h-full w-full object-cover"
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
