<script lang="ts">
  import { Search, ChevronDown } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import type { GiftCardProduct, Brand, ProductCategory } from '@baragaun/bg-node-client';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { goto } from '$app/navigation';
  import { m } from '@/paraglide/messages';
  import { loadMarketplaceData, getMarketplaceData } from '$lib/stores/marketplace-store.svelte';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import { giftCardImageDomain } from '$lib/constants';
  import SpinLoadIndicator from '@/components/forms/spin-load-indicator.svelte';
  import { onMount } from 'svelte';

  let marketplaceData = $state(getMarketplaceData());
  let isLoading = $state(true);

  const isMobile = new IsMobile();
  let searchText = $state('');
  let selectedCategory = $state<ProductCategory | 'All'>('All');

  function navigateToGiftCardDetail(productId: string | null | undefined) {
    if (!productId) return;
    goto(`/marketplace/${productId}`);
  }

  const filteredProducts = $derived(
    marketplaceData.products.filter((product: GiftCardProduct) => {
      // Filter by search query (brand name)
      if (!marketplaceData.brands.some((brand) => brand.id === product.brandId)) {
        return false; // Exclude products with no matching brand
      }

      // Filter by selected category
      if (selectedCategory !== 'All' && !product.categories?.includes(selectedCategory.id)) {
        return false;
      }

      const hasDenominations =
        (product?.denominations?.length ?? 0) > 0 || product.genericGiftCardId != undefined;

      if (!hasDenominations) return false;

      // Filter by search text
      if (searchText.trim()) {
        const cleanSearchText = searchText.trim().toLowerCase();
        const productBrand = marketplaceData.brands.find((brand) => brand.id === product.brandId);
        if (!productBrand || !productBrand.name.toLowerCase().includes(cleanSearchText)) {
          return false;
        }
      }

      return true;
    }),
  );

  const getBrandForGiftCard = (giftCardProduct: GiftCardProduct): Brand | undefined =>
    marketplaceData.brands.find((brand) => brand.id === giftCardProduct.brandId);

  const handleImageError = (node: HTMLImageElement) => {
    const onError = (e: Event) => {
      (e.currentTarget as HTMLImageElement).src = placeholderImage;
    };

    node.addEventListener('error', onError);

    return {
      destroy() {
        node.removeEventListener('error', onError);
      },
    };
  };

  onMount(async () => {
    isLoading = true;
    try {
      await loadMarketplaceData();
    } catch (e) {
      console.error(e);
    } finally {
      marketplaceData = getMarketplaceData();
      isLoading = false;
    }
  });
</script>

<div class="animate-fade-in container mx-auto px-4 py-4 md:px-6">
  <header class="mb-5">
    {#if !isMobile.current}
      <h1 class="text-2xl font-bold tracking-tight text-foreground">{m['marketplace.title']()}</h1>
    {/if}
    <p class="mt-1 text-sm text-muted-foreground">{m['marketplace.subtitle']()}</p>
  </header>

  <!-- Search & Filter -->
  <div class="mb-5 flex items-center gap-3">
    <div class="relative flex-1">
      <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={m['marketplace.search_placeholder']()}
        class="h-11 w-full rounded-2xl border-border/60 bg-muted/40 pl-10 shadow-none placeholder:text-muted-foreground/50 focus-visible:bg-background focus-visible:ring-primary/30"
        bind:value={searchText}
      />
    </div>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline" class="flex h-11 items-center gap-2 rounded-2xl border-border/60 px-4">
          {selectedCategory === 'All' ? m['marketplace.all']() : selectedCategory.labelEn}
          <ChevronDown class="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="max-h-[300px] overflow-y-auto rounded-xl bg-background shadow-soft-lg">
        <DropdownMenu.Item onclick={() => (selectedCategory = 'All')} class="cursor-pointer rounded-lg">
          {m['marketplace.all']()}
          {#if selectedCategory === 'All'}
            <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
          {/if}
        </DropdownMenu.Item>

        {#each marketplaceData.productCategories as category}
          <DropdownMenu.Item onclick={() => (selectedCategory = category)} class="cursor-pointer rounded-lg">
            {category.labelEn}
            {#if selectedCategory !== 'All' && selectedCategory.name === category.name}
              <DropdownMenu.Shortcut>✓</DropdownMenu.Shortcut>
            {/if}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>

  {#if isLoading}
    <div class="flex h-60 items-center justify-center">
      <SpinLoadIndicator />
    </div>
  {:else if filteredProducts.length === 0}
    <div class="flex h-60 flex-col items-center justify-center text-center">
      <Search class="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p class="text-base text-muted-foreground">{m['marketplace.no_results']()}</p>
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-4 pb-6 md:grid-cols-3 lg:grid-cols-4 xl:gap-5">
      {#each filteredProducts as product (product.id)}
        {@const brand = getBrandForGiftCard(product)}
        {#if brand}
          <button
            type="button"
            class="group flex flex-col items-start border-0 bg-transparent p-0 text-left"
            onclick={() => navigateToGiftCardDetail(product.id)}
            onkeydown={(e) => e.key === 'Enter' && navigateToGiftCardDetail(product.id)}
            aria-label={m['marketplace.view_gift_card_aria']({ vendor: brand.name })}
          >
            <div
              class="mb-2.5 aspect-[5/3] w-full overflow-hidden rounded-2xl bg-muted/30 shadow-soft transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-soft-lg"
            >
              <img
                src={giftCardImageDomain + '/giftcards/' + product.imageSourceFront}
                alt={brand.name}
                class="h-full w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                use:handleImageError
              />
            </div>
            <div class="flex items-center gap-2 pl-0.5">
              <div
                class="h-5 w-5 flex-shrink-0 overflow-hidden rounded-full bg-muted/50"
              >
                <img
                  src={giftCardImageDomain + '/vendors/' + brand.logoImageSource}
                  alt=""
                  class="h-full w-full object-contain"
                  use:handleImageError
                />
              </div>
              <span class="truncate text-sm font-medium text-foreground">{brand.name}</span>
            </div>
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>
