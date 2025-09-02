<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import {
    GiftCardDenomination,
    ShoppingCartItem,
    WalletItem,
    type Brand,
    type GiftCardProduct,
  } from '@baragaun/bg-node-client';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import { Archive, ArrowLeft, ExternalLink, Gift, Printer, ZoomOut } from 'lucide-svelte';
  import { updateWalletItem } from '@/stores/wallet-store.svelte';
  import BarcodeView from './barcode-view.svelte';
  import { downloadPdf } from '@/utils/pdf-utils';
  import { m } from '@/paraglide/messages';
  import { giftCardImageDomain } from '$lib/constants';
  import { goto } from '$app/navigation';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { toast } from 'svelte-sonner';
  import { page } from '$app/state';
  import { getMarketplaceData, loadMarketplaceData } from '@/stores/marketplace-store.svelte';
  import { getGiftCardDenominations } from '@/utils/marketplace-utils';
  import { onMount } from 'svelte';

  interface Props {
    productId?: string;
    walletItem?: WalletItem;
    showNavBar?: boolean;
    hideActions?: boolean;
    isVerified?: boolean;
    product?: GiftCardProduct;
    brand?: Brand;
  }

  let {
    productId,
    walletItem,
    showNavBar = true,
    hideActions = false,
    isVerified = true,
    product,
    brand,
  }: Props = $props();

  const { brands, products, loading, userErrorMessage } = getMarketplaceData();

  if (!product) {
    if (productId) {
      product = products.find((p) => p.id === productId);
    } else if (walletItem?.productId) {
      product = products.find((p) => p.id === walletItem.productId);
    } else {
      product = undefined;
    }
  }

  if (!brand) {
    if (product?.brandId) {
      brand = brands.find((b) => b.id === product.brandId);
    } else if (walletItem?.brandId) {
      brand = brands.find((b) => b.id === walletItem.brandId);
    } else {
      brand = undefined;
    }
  }

  // const item = $derived(
  //   (() => {
  //     if (walletItem) {
  //       return walletItem;
  //     }
  //     if (productId) {
  //       return products.find((p) => p.id === productId);
  //     }
  //   })(),
  // );

  let selectedTab = $state(walletItem ? 'use' : 'buy');

  onMount(() => {
    if (!brand && !product) {
      console.log('Loading marketplace data 123:', brand, product);
      loadMarketplaceData().catch(console.error);
    }
  });

  let isBarcodeViewOpen = $state(false);
  let instructions = $derived(product?.instructionsEn ?? walletItem?.instructionsEn);
  let terms = $derived(product?.termsEn ?? walletItem?.termsEn);
  let imageSourceFront = $derived(product?.imageSourceFront ?? walletItem?.imageSourceFront);
  const barcodeFormat = walletItem?.barcodeFormat || 'CODE39';
  const barcodeApiUrl = `https://barcodeapi.org/api/${
    barcodeFormat === 'QR_CODE' ? 'qr' : 'code39'
  }/${encodeURIComponent(walletItem?.code || '')}`;

  // onMount(async () => {
  //   if (!loading) {
  //     try {
  //       if (walletItem?.brandId) {
  //         loading = true;
  //         const brandsResponse = await marketplaceContext.findBrand(walletItem?.brandId);
  //         if (typeof brandsResponse === 'string') {
  //           userErrorMessage = brandsResponse;
  //           return;
  //         }
  //         brand = brandsResponse || null;
  //       }
  //     } catch (err) {
  //       error = 'Failed to load gift card details';
  //       console.error(err);
  //     } finally {
  //       loading = false;
  //     }
  //   }
  // });

  function backAndClose() {
    if (isBarcodeViewOpen) {
      isBarcodeViewOpen = false;
    } else {
      history.back();
    }
  }

  async function archiveWalletItem() {
    if (!walletItem) {
      console.error('No wallet item found to archive.');
      return;
    }

    try {
      await marketplaceContext.archiveWalletItem(walletItem.id, !walletItem?.archivedAt);
      walletItem.archivedAt = walletItem.archivedAt ? null : new Date().toISOString();
      updateWalletItem(walletItem);
    } catch (error) {
      console.error('Error archiving wallet item:', error);
      // todo: show user error
    }
  }

  function handlePrintPdf() {
    if (!walletItem || !walletItem.code || !walletItem.pin) return;
    downloadPdf(walletItem, walletItem.code, walletItem.pin);
  }

  async function addDenominationToCart(
    denomination: GiftCardDenomination,
    giftCardProduct: GiftCardProduct,
    brand: Brand | null,
  ) {
    if (!giftCardProduct.id) {
      console.error('GiftCardProduct ID is missing, cannot add to cart.');
      toast.error(m['marketplace.add_to_cart_error']({ reason: 'Gift card details missing.' }));
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
        toast.error(m['marketplace.add_to_cart_error']({ reason: result.error }));
      } else if (result.object) {
        console.log('Item added to cart:', result.object);
        toast.success(
          m['marketplace.add_to_cart_success']({
            amount: `${denomination.amount / 1000}`,
            vendor: brand?.name || m['marketplace.buy_gift_card'](),
          }),
        );
        // Optionally navigate to cart page or update cart count somewhere
        goto('/cart'); // Navigate to shopping cart page after adding
      } else {
        toast.error(m['marketplace.add_to_cart_no_object']());
      }
    } catch (error) {
      console.error('Unexpected error adding item to cart:', error);
      toast.error(m['marketplace.add_to_cart_unexpected_error']());
    }
  }

  function openExternal(url: string | null | undefined) {
    console.log(url);
    if (!url) return;
    const normalized = /^(https?:)?\/\//i.test(url) ? url : `https://${url}`;
    window.open(normalized, '_blank', 'noopener,noreferrer');
  }

  let isMarketPlace: boolean = $derived(page.url.pathname.startsWith('/marketplace/'));

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
</script>

<!-- Header Bar -->
{#if showNavBar}
  <div
    class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"
  >
    <button onclick={backAndClose} class="flex items-center">
      {#if isBarcodeViewOpen}
        <ZoomOut class="h-6 w-6" />
      {:else}
        <ArrowLeft class="h-6 w-6" />
      {/if}
    </button>
    <span class="flex-1 text-center text-lg font-bold"
      >{isMarketPlace ? m['marketplace.buy_gift_card']() : m['wallet.gift-card.title']()}</span
    >
  </div>
{/if}

{#if loading}
  <div class="flex h-[60vh] items-center justify-center">
    <div class="text-center">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
      ></div>
      <p class="mt-2 text-muted-foreground">{m['wallet.gift-card.loading']()}</p>
    </div>
  </div>
{:else if userErrorMessage}
  <Card.Root class="mx-auto mt-8 max-w-md">
    <Card.Header>
      <Card.Title>{m['wallet.gift-card.error']()}</Card.Title>
    </Card.Header>
    <Card.Content>
      <p>{userErrorMessage}</p>
    </Card.Content>
    <Card.Footer>
      <Button href="/marketplace">{m['wallet.gift-card.return_to_marketplace']()}</Button>
    </Card.Footer>
  </Card.Root>
{:else if isBarcodeViewOpen}
  <BarcodeView>
    <img src={barcodeApiUrl} class="barcode" alt="Barcode" />
  </BarcodeView>
{:else if walletItem || product}
  <div class="mx-auto max-w-lg px-4 py-6">
    <!-- Gift Card Image -->
    <div class="my-2 flex justify-center">
      <img
        src={giftCardImageDomain + '/giftcards/' + imageSourceFront}
        alt={product?.name}
        class="aspect-[16/9] w-full max-w-md rounded-2xl object-contain shadow-lg"
        use:handleImageError
      />
    </div>

    <!-- Actions -->
    {#if walletItem && !hideActions}
      <div class="flex items-center border-b bg-gray-50 px-4 py-2">
        <div class="flex gap-2">
          {#if walletItem.transferStartedAt == null || undefined}
            <div class="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                onclick={() => goto(`/wallet/send-gift-card?id=${walletItem.id}`)}
                ><Gift aria-label="Gift" /></Button
              >
              <span class="text-xs text-gray-500">{m['wallet.gift-card.gift']()}</span>
            </div>
          {/if}
          {#if walletItem.termsUrl}
            <div class="flex flex-col items-center">
              <Button variant="ghost" size="icon" onclick={() => openExternal(walletItem.termsUrl)}
                ><ExternalLink aria-label="Brand" /></Button
              >
              <span class="text-xs text-gray-500">{m['wallet.gift-card.brand']()}</span>
            </div>
          {/if}
          {#if walletItem.transferStartedAt == null || undefined}
            <div class="flex flex-col items-center">
              <Button variant="ghost" size="icon" onclick={handlePrintPdf}
                ><Printer aria-label="Print" /></Button
              >
              <span class="text-xs text-gray-500">{m['wallet.gift-card.print']()}</span>
            </div>
          {/if}
          <div class="flex flex-col items-center">
            <Button variant="ghost" size="icon" onclick={archiveWalletItem}
              ><Archive aria-label="Archive" /></Button
            >
            <span class="text-xs text-gray-500"
              >{walletItem.archivedAt
                ? m['wallet.gift-card.unarchive']()
                : m['wallet.gift-card.archive']()}</span
            >
          </div>
        </div>
        <span class="ml-2 flex flex-grow items-center justify-end">
          <span
            class={`mr-1 inline-block h-3 w-3 rounded-full ${walletItem.archivedAt ? 'bg-red-500' : 'bg-green-500'}`}
          ></span>
          <span class="text-xs text-gray-500">{walletItem.archivedAt ? 'Archived' : 'Active'}</span>
        </span>
      </div>
    {/if}

    <!-- Tabs -->
    <div class="mb-4 flex border-b">
      {#if walletItem}
        <button
          class="flex-1 border-b-2 py-2 font-medium"
          style="color: {selectedTab === 'use'
            ? 'var(--primary)'
            : '#888'}; border-color: {selectedTab === 'use' ? 'var(--primary)' : 'transparent'};"
          onclick={() => (selectedTab = 'use')}>{m['wallet.gift-card.use']()}</button
        >
      {:else}
        <button
          class="flex-1 border-b-2 py-2 font-medium"
          style="color: {selectedTab === 'Buy'
            ? 'var(--primary)'
            : '#888'}; border-color: {selectedTab === 'buy' ? 'var(--primary)' : 'transparent'};"
          onclick={() => (selectedTab = 'buy')}>{m['marketplace.tabs.buy']()}</button
        >
      {/if}
      <button
        class="flex-1 border-b-2 py-2 font-medium"
        style="color: {selectedTab === 'info'
          ? 'var(--primary)'
          : '#888'}; border-color: {selectedTab === 'info' ? 'var(--primary)' : 'transparent'};"
        onclick={() => (selectedTab = 'info')}>{m['wallet.gift-card.info']()}</button
      >
      <button
        class="flex-1 border-b-2 py-2 font-medium"
        style="color: {selectedTab === 'brand'
          ? 'var(--primary)'
          : '#888'}; border-color: {selectedTab === 'brand' ? 'var(--primary)' : 'transparent'};"
        onclick={() => (selectedTab = 'brand')}>{m['wallet.gift-card.brand']()}</button
      >
    </div>

    {#if selectedTab === 'use' && walletItem}
      {#if isVerified}
        <!-- Brand and Amounts (Buy Tab) -->
        <div class="flex flex-col items-center justify-center px-2 py-4">
          <div class="flex items-end justify-center">
            <p class="mr-2 text-xl text-gray-400">USD</p>
            <span class="text-400 text-5xl font-semibold text-foreground">
              {(walletItem.balance / 1000).toFixed(0)}
            </span>
            <span class="text-lg font-semibold text-foreground">
              .{(walletItem.balance / 1000).toFixed(2).split('.')[1]}
            </span>
          </div>
          <p class="text-sm text-gray-400">
            Balance as of {new Date(walletItem.createdAt).toLocaleDateString()}
          </p>
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline">{m['wallet.gift-card.look_up_balance']()}</a
          >

          <!-- Card Code and PIN -->
          {#if walletItem.code}
            <div class="mt-4 flex flex-col items-center">
              <img src={barcodeApiUrl} class="barcode" alt="Barcode" />
            </div>
          {/if}

          <div class="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              class="h-8 rounded-full bg-primary text-primary-foreground"
              onclick={() => (isBarcodeViewOpen = true)}>{m['wallet.gift-card.zoom']()}</Button
            >
            <Button size="sm" class="h-8 rounded-full bg-primary text-primary-foreground"
              >{m['wallet.gift-card.copy']()}</Button
            >
          </div>

          <h class="mt-4 text-xl text-black">{walletItem.pin}</h>
          <p class="text-sm text-gray-400">Card PIN</p>
          <Button size="sm" class="mt-2 h-8 rounded-full bg-primary text-primary-foreground"
            >{m['wallet.gift-card.copy_pin']()}</Button
          >
        </div>
      {:else}
        <div class="h-full w-full text-center text-muted-foreground">
          Please accept card to see all details
        </div>
      {/if}
    {/if}

    {#if selectedTab === 'buy' && product && brand}
      <!-- Brand and Amounts (Buy Tab) -->
      <div class="text-500 mb-2 text-sm text-secondary-foreground">
        {m['marketplace.brand_label']()}
      </div>
      <div class="mb-4 text-xl font-bold">{brand?.name}</div>
      <div class="text-500 mb-2 text-sm text-secondary-foreground">
        {m['marketplace.gift_card_amount_label']()}
      </div>
      <div class="space-y-4">
        {#each getGiftCardDenominations(products, product) as denomination}
          <button
            type="button"
            class="flex w-full cursor-pointer flex-col items-center rounded-xl border px-6 py-4 text-2xl font-bold shadow-sm transition-colors hover:bg-gray-100"
            onclick={() => addDenominationToCart(denomination, product, brand)}
            onkeydown={(e) =>
              e.key === 'Enter' && addDenominationToCart(denomination, product, brand)}
          >
            <span class="flex items-end gap-1">
              <span class="align-bottom text-base text-gray-400">{m['marketplace.usd']()}</span>
              <span class="text-4xl">{denomination.amount / 1000}</span>
            </span>
          </button>
        {/each}
      </div>
    {/if}

    {#if selectedTab === 'info'}
      <div class="px-2 py-4">
        {#if instructions}
          <div class="mb-6">
            <h2 class="text-400 mb-2 text-lg font-semibold text-secondary-foreground">
              {m['wallet.gift-card.how_to_redeem']()}
            </h2>
            {#if instructions?.trim().startsWith('<')}
              <p class="mb-2">
                {@html instructions}
              </p>
            {:else}
              <p class="mb-2">
                {instructions}
              </p>
            {/if}
          </div>
        {/if}
        {#if terms}
          <div>
            <h2 class="text-400 mb-2 text-lg font-semibold text-secondary-foreground">
              {m['wallet.gift-card.terms_and_conditions']()}
            </h2>
            {#if terms?.trim().startsWith('<')}
              <p class="mb-2">
                {@html terms}
              </p>
            {:else}
              <p class="mb-2">
                {terms}
              </p>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

    {#if selectedTab === 'brand'}
      <div class="flex flex-col items-center py-8">
        <p>{brand?.name ?? 'not found'}</p>
        <!-- Brand Logo -->
        <div
          class="mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg"
        >
          <img
            src={giftCardImageDomain + '/vendors/' + brand?.logoImageSource}
            alt={brand?.name}
            class="h-full w-full object-contain"
            use:handleImageError
          />
        </div>
        <!-- Brand Description -->
        {#if brand?.description}
          <div class="text-600 mb-8 max-w-xl text-center">{brand.description}</div>
        {/if}
        <!-- Visit Online Button -->
        {#if brand?.url}
          <a
            href={brand.url}
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg bg-nav-foreground px-8 py-2 font-semibold tracking-wide text-nav shadow transition hover:bg-nav-foreground/90"
            style="text-transform: uppercase; letter-spacing: 1px;"
          >
            {m['marketplace.visit_online']()}
          </a>
        {/if}
      </div>
    {/if}
  </div>
{/if}
