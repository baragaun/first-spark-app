<script lang="ts">
  import { loadMarketplaceData, getMarketplaceData } from '$lib/stores/marketplace-store.svelte';
  import type { GiftCardProduct, Brand } from '@baragaun/bg-node-client';
  import { goto } from '$app/navigation';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import { Search } from 'lucide-svelte';
  import { ArrowLeft } from 'lucide-svelte';
  import { uploadedBrand, uploadedProduct } from '@/stores/uploaded-card';
  import { m } from '@/paraglide/messages';
  import { Input } from '$lib/components/ui/input';
  import { giftCardImageDomain } from '$lib/constants';

  const {
    brands,
    products,
    // todo: use these:
    // loading,
    // userErrorMessage,
  } = getMarketplaceData();

  let searchText = $state('');

  const filteredProducts = $derived(
    products.filter((product: GiftCardProduct) => {
      // Filter by search query (brand name)
      if (!brands.some((brand) => brand.id === product.brandId)) {
        return false; // Exclude products with no matching brand
      }

      // Filter by search text
      if (searchText.trim()) {
        const cleanSearchText = searchText.trim().toLowerCase();
        const productBrand = brands.find((brand) => brand.id === product.brandId);
        if (!productBrand || !productBrand.name.toLowerCase().includes(cleanSearchText)) {
          return false;
        }
      }

      return true;
    }),
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
      },
    };
  };

  // Load on mount
  $effect(() => {
    loadMarketplaceData().catch(console.error);
  });

  function handleBrandClick(product: GiftCardProduct, brand: Brand) {
    uploadedBrand.set(brand);
    uploadedProduct.set(product);

    goto('/wallet/upload-card');
  }
</script>

<!-- Header -->
<div
  class="sticky top-0 z-10 flex items-center justify-between bg-nav px-4 py-3 text-nav-foreground shadow"
>
  <button onclick={() => history.back()} class="flex items-center">
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="flex-1 text-center text-lg font-bold">{m['upload_card.select_brand']()}</span>
</div>

<!-- Search Bar -->
<div class="sticky top-[56px] z-20 bg-background px-4 py-4">
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

<!-- Brands Grid -->
<div class="flex h-full flex-col">
  <div class="flex-1 overflow-y-auto">
    <div class="mx-auto w-full max-w-5xl px-4 pb-8" style="height: calc(100vh - 120px);">
      <div
        class="grid h-full grid-cols-3 items-start gap-x-2 gap-y-6 overflow-y-auto sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"
      >
        {#each filteredProducts as product (product.id)}
          {@const brand = getBrandForGiftCard(product)}
          {#if brand}
            <button
              class="group flex flex-col items-center justify-center focus:outline-none"
              onclick={() => handleBrandClick(product, brand)}
              onkeydown={(e) => e.key === 'Enter' && handleBrandClick(product, brand)}
            >
              <img
                src={giftCardImageDomain + '/vendors/' + brand.logoImageSource}
                alt={brand.name}
                class="mb-2 h-10 w-16 object-contain transition-transform group-hover:scale-105"
                use:handleImageError
              />
              <span
                class="max-w-[5.5rem] break-words text-center text-xs leading-tight text-gray-500 group-hover:text-primary"
                style="word-break:break-word;"
              >
                {brand.name}
              </span>
            </button>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>
