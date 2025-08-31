<script lang="ts">
  import { Search, ChevronDown } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import type { GiftCardProduct, Brand, ProductCategory } from '@baragaun/bg-node-client';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { goto } from '$app/navigation';
  import { m } from '@/paraglide/messages';
  import { loadMarketplaceData, getMarketplaceData } from '$lib/stores/marketplace-store';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import { giftCardImageDomain } from '$lib/constants';

  const {
    brands,
    products,
    productCategories,
    // todo: use these:
    // loading,
    // userErrorMessage,
  } = getMarketplaceData();

  const isMobile = new IsMobile();
  let searchText = $state('');
  let selectedCategory = $state<ProductCategory | 'All'>('All');

  function navigateToGiftCardDetail(productId: string | null | undefined) {
    if (!productId) return;
    goto(`/marketplace/${productId}`);
  }

  const filteredProducts = $derived(
    products.filter((product: GiftCardProduct) => {
      // Filter by search query (brand name)
      if (!brands.some((brand) => brand.id === product.brandId)) {
        return false; // Exclude products with no matching brand
      }

      // Filter by selected category
      if (selectedCategory !== 'All' && !product.categories?.includes(selectedCategory.id)) {
        return false;
      }

      // Filter by search text
      if (searchText.trim()) {
        const cleanSearchText = searchText.trim().toLowerCase();
        const productBrand = brands.find(brand => brand.id === product.brandId);
        if (!productBrand || !productBrand.name.toLowerCase().includes(cleanSearchText)) {
          return false;
        }
      }

      return true;
    })
  );

  const getBrandForGiftCard = (giftCardProduct: GiftCardProduct): Brand | undefined =>
    brands.find((brand) => brand.id === giftCardProduct.brandId);

  const handleImageError = (node: HTMLImageElement) => {
    const onError = (e: Event) => {
      (e.currentTarget as HTMLImageElement).src = placeholderImage;
    };

    node.addEventListener('error', onError);

    return {
      destroy() {
        node.removeEventListener('error', onError);
      }
    };
  };

  // Load on mount
  $effect(() => {
    loadMarketplaceData().catch(console.error);
  });
</script>

<div class="container mx-auto px-4 py-6">
  <header class="mb-6">
    <h1 class="text-3xl font-bold text-foreground">{m['marketplace.title']()}</h1>
    <p class="mt-2 text-muted-foreground">{m['marketplace.subtitle']()}</p>
  </header>

  <div class="mb-6 flex items-center gap-4">
    <div class="relative flex-1">
      <!-- Gradient border wrapper -->
      <div
        class="relative rounded-full bg-gradient-to-r from-kcu-glacier via-kcu-juniper to-kcu-lime p-[2px]"
      >
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={m['marketplace.search_placeholder']()}
          class="search-input-override w-full rounded-full border-0 bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          bind:value={searchText}
        />
      </div>
    </div>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline" class="flex items-center gap-2">
          {selectedCategory === 'All' ? m['marketplace.all']() : selectedCategory.labelEn}
          <ChevronDown class="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="max-h-[300px] overflow-y-auto bg-background">
        <DropdownMenu.Item onclick={() => (selectedCategory = 'All')} class="cursor-pointer">
          {m['marketplace.all']()}
          {#if selectedCategory === 'All'}
            <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
          {/if}
        </DropdownMenu.Item>

        {#each productCategories as category}
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
    {#each filteredProducts as product (product.id)}
      {@const brand = getBrandForGiftCard(product)}
      {#if brand}
        <button
          type="button"
          class="group flex flex-col items-center border-0 bg-transparent p-0 text-left transition-all duration-300 hover:scale-105 hover:opacity-90"
          onclick={() => navigateToGiftCardDetail(product.id)}
          onkeydown={(e) => e.key === 'Enter' && navigateToGiftCardDetail(product.id)}
          aria-label={m['marketplace.view_gift_card_aria']({ vendor: brand.name })}
        >
          <div
            class="mb-2 aspect-[4/3] w-full overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 group-hover:shadow-xl"
          >
            <img
              src={giftCardImageDomain + '/giftcards/' + product.imageSourceFront}
              alt={brand.name}
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              use:handleImageError
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
                  src={giftCardImageDomain + '/vendors/' + brand.logoImageSource}
                  alt=""
                  class="h-full w-full object-cover"
                  use:handleImageError
                />
              </div>
            {/if}
            <span class="text-sm font-medium">{brand.name}</span>
          </div>
        </button>
      {/if}
    {/each}
  </div>
</div>
