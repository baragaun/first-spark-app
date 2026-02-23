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
  import { cn } from '$lib/utils';

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
    walletItem = $bindable(),
    showNavBar = true,
    hideActions = false,
    isVerified = true,
    product,
    brand,
  }: Props = $props();

  const { brands, products, loading, userErrorMessage } = $derived(getMarketplaceData());

  function getProductById() {
    if (productId) {
      product = products.find((p) => p.id === productId);
    } else if (walletItem?.productId) {
      product = products.find((p) => p.id === walletItem?.productId);
    } else {
      product = undefined;
    }
  }

  function getBrandById() {
    if (product?.brandId) {
      brand = brands.find((b) => b.id === product?.brandId);
    } else if (walletItem?.brandId) {
      brand = brands.find((b) => b.id === walletItem?.brandId);
    } else {
      brand = undefined;
    }
  }

  let selectedTab = $state(walletItem ? 'use' : 'buy');

  onMount(() => {
    if (!brand && !product) {
      loadMarketplaceData()
        .then(() => {
          getProductById();
          getBrandById();
        })
        .catch(console.error);
    }
    if (!walletItem) {
      console.warn('No wallet item provided to GiftCardDetails component');
    }
  });

  let isBarcodeViewOpen = $state(false);
  let instructions = $derived(product?.instructionsEn ?? walletItem?.instructionsEn);
  let terms = $derived(product?.termsEn ?? walletItem?.termsEn);
  let imageSourceFront = $derived(product?.imageSourceFront ?? walletItem?.imageSourceFront);
  let isLoading = $derived(false);

  function getBarcodeApiUrl() {
    return `https://barcodeapi.org/api/${
      (walletItem?.barcodeFormat || 'CODE39') === 'QR_CODE' ? 'qr' : 'code39'
    }/${encodeURIComponent(walletItem?.code || '')}`;
  }

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
      isLoading = true;
      await marketplaceContext.archiveWalletItem(walletItem.id, !walletItem?.archivedAt);
      const updatedWalletItem = {
        ...walletItem,
        archivedAt: walletItem.archivedAt ? null : new Date().toISOString(),
      };
      updateWalletItem(updatedWalletItem);
      walletItem = { ...updatedWalletItem };
    } catch (error) {
      console.error('Error archiving wallet item:', error);
    } finally {
      isLoading = false;
    }
  }

  function handlePrintPdf() {
    if (!walletItem || !walletItem.code || !walletItem.pin) return;
    downloadPdf(walletItem, walletItem.code, walletItem.pin);
  }

  async function addDenominationToCart(
    denomination: GiftCardDenomination,
    giftCardProduct?: GiftCardProduct,
    brand?: Brand | null,
  ) {
    if (!giftCardProduct?.id) {
      console.error('GiftCardProduct ID is missing, cannot add to cart.');
      toast.error(m['marketplace.add_to_cart_error']({ reason: 'Gift card details missing.' }));
      return;
    }

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
        toast.success(
          m['marketplace.add_to_cart_success']({
            amount: `${denomination.amount / 1000}`,
            vendor: brand?.name || m['marketplace.buy_gift_card'](),
          }),
        );
        goto('/cart');
      } else {
        toast.error(m['marketplace.add_to_cart_no_object']());
      }
    } catch (error) {
      console.error('Unexpected error adding item to cart:', error);
      toast.error(m['marketplace.add_to_cart_unexpected_error']());
    }
  }

  function openExternal(url: string | null | undefined) {
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

  const tabClass = (tab: string) => cn(
    'flex-1 border-b-2 py-2.5 text-sm font-medium transition-all duration-200',
    selectedTab === tab
      ? 'border-primary text-primary'
      : 'border-transparent text-muted-foreground hover:text-foreground',
  );
</script>

<!-- Header Bar -->
{#if showNavBar}
  <div
    class="flex items-center justify-between bg-primary px-4 py-3.5 text-primary-foreground shadow-soft"
  >
    <button onclick={backAndClose} class="flex items-center rounded-full p-1 transition-colors hover:bg-white/10">
      {#if isBarcodeViewOpen}
        <ZoomOut class="h-5 w-5" />
      {:else}
        <ArrowLeft class="h-5 w-5" />
      {/if}
    </button>
    <span class="flex-1 text-center text-base font-semibold"
      >{isMarketPlace ? m['marketplace.buy_gift_card']() : m['wallet.gift-card.title']()}</span
    >
    <div class="w-7"></div>
  </div>
{/if}

{#if loading || isLoading}
  <div class="flex h-[60vh] items-center justify-center">
    <div class="flex flex-col items-center gap-3">
      <div
        class="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent"
      ></div>
      <p class="text-sm text-muted-foreground">{m['wallet.gift-card.loading']()}</p>
    </div>
  </div>
{:else if userErrorMessage}
  <Card.Root class="mx-auto mt-8 max-w-md">
    <Card.Header>
      <Card.Title>{m['wallet.gift-card.error']()}</Card.Title>
    </Card.Header>
    <Card.Content>
      <p class="text-muted-foreground">{userErrorMessage}</p>
    </Card.Content>
    <Card.Footer>
      <Button href="/marketplace" class="rounded-full">{m['wallet.gift-card.return_to_marketplace']()}</Button>
    </Card.Footer>
  </Card.Root>
{:else if isBarcodeViewOpen}
  <BarcodeView>
    <img src={getBarcodeApiUrl()} class="barcode" alt="Barcode" />
  </BarcodeView>
{:else if walletItem || product}
  <div class="animate-fade-in mx-auto max-w-lg px-4 py-5">
    <!-- Gift Card Image -->
    <div class="mb-4 flex justify-center">
      <img
        src={giftCardImageDomain + '/giftcards/' + imageSourceFront}
        alt={product?.name}
        class="aspect-[16/9] w-full max-w-md rounded-2xl object-cover shadow-soft-lg"
        use:handleImageError
      />
    </div>

    <!-- Actions -->
    {#if walletItem && !hideActions}
      <div class="mb-4 flex items-center rounded-2xl bg-muted/40 px-3 py-2.5">
        <div class="flex gap-1">
          {#if walletItem.transferStartedAt == null || undefined}
            <div class="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                class="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary"
                onclick={() => goto(`/wallet/send-gift-card?id=${walletItem?.id}`)}
                ><Gift class="h-4 w-4" aria-label="Gift" /></Button
              >
              <span class="text-[10px] text-muted-foreground">{m['wallet.gift-card.gift']()}</span>
            </div>
          {/if}
          {#if walletItem.termsUrl}
            <div class="flex flex-col items-center">
              <Button variant="ghost" size="icon" class="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary" onclick={() => openExternal(walletItem?.termsUrl)}
                ><ExternalLink class="h-4 w-4" aria-label="Brand" /></Button
              >
              <span class="text-[10px] text-muted-foreground">{m['wallet.gift-card.brand']()}</span>
            </div>
          {/if}
          {#if walletItem.transferStartedAt == null || undefined}
            <div class="flex flex-col items-center">
              <Button variant="ghost" size="icon" class="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary" onclick={handlePrintPdf}
                ><Printer class="h-4 w-4" aria-label="Print" /></Button
              >
              <span class="text-[10px] text-muted-foreground">{m['wallet.gift-card.print']()}</span>
            </div>
          {/if}
          <div class="flex flex-col items-center">
            <Button variant="ghost" size="icon" class="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary" onclick={archiveWalletItem}
              ><Archive class="h-4 w-4" aria-label="Archive" /></Button
            >
            <span class="text-[10px] text-muted-foreground"
              >{walletItem.archivedAt
                ? m['wallet.gift-card.unarchive']()
                : m['wallet.gift-card.archive']()}</span
            >
          </div>
        </div>
        <span class="ml-auto flex items-center gap-1.5">
          <span
            class={`inline-block h-2 w-2 rounded-full ${walletItem.archivedAt ? 'bg-destructive' : 'bg-secondary'}`}
          ></span>
          <span class="text-xs text-muted-foreground">{walletItem.archivedAt ? 'Archived' : 'Active'}</span>
        </span>
      </div>
    {/if}

    <!-- Tabs -->
    <div class="mb-5 flex border-b border-border/60">
      {#if walletItem}
        <button class={tabClass('use')} onclick={() => (selectedTab = 'use')}>
          {m['wallet.gift-card.use']()}
        </button>
      {:else}
        <button class={tabClass('buy')} onclick={() => (selectedTab = 'buy')}>
          {m['marketplace.tabs.buy']()}
        </button>
      {/if}
      <button class={tabClass('info')} onclick={() => (selectedTab = 'info')}>
        {m['wallet.gift-card.info']()}
      </button>
      <button class={tabClass('brand')} onclick={() => (selectedTab = 'brand')}>
        {m['wallet.gift-card.brand']()}
      </button>
    </div>

    {#if selectedTab === 'use' && walletItem}
      {#if isVerified}
        <div class="flex flex-col items-center justify-center px-2 py-6">
          <div class="flex items-end justify-center">
            <p class="mr-2 text-lg text-muted-foreground">USD</p>
            <span class="text-5xl font-bold text-primary">
              {(walletItem.balance / 1000).toFixed(0)}
            </span>
            <span class="mb-1 text-xl font-semibold text-primary">
              .{(walletItem.balance / 1000).toFixed(2).split('.')[1]}
            </span>
          </div>
          <p class="mt-1 text-xs text-muted-foreground">
            Balance as of {new Date(walletItem.createdAt).toLocaleDateString()}
          </p>
          {#if brand?.balanceLookupUri}
            <a
              href={brand.balanceLookupUri}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1 text-sm text-primary underline">{m['wallet.gift-card.look_up_balance']()}</a
            >
          {/if}
          {#if walletItem.code}
            <div class="mt-6 flex flex-col items-center rounded-2xl bg-white p-4 shadow-soft">
              <img src={getBarcodeApiUrl()} class="barcode" alt="Barcode" />
            </div>
          {/if}

          <div class="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              class="h-9 rounded-full px-5"
              onclick={() => (isBarcodeViewOpen = true)}>{m['wallet.gift-card.zoom']()}</Button
            >
            <Button size="sm" variant="outline" class="h-9 rounded-full px-5"
              >{m['wallet.gift-card.copy']()}</Button
            >
          </div>

          <div class="mt-6 flex flex-col items-center">
            <span class="text-2xl font-bold text-foreground">{walletItem.pin}</span>
            <p class="mt-1 text-xs text-muted-foreground">Card PIN</p>
            <Button size="sm" variant="outline" class="mt-3 h-9 rounded-full px-5"
              >{m['wallet.gift-card.copy_pin']()}</Button
            >
          </div>
        </div>
      {:else}
        <div class="py-12 text-center text-sm text-muted-foreground">
          Please accept card to see all details
        </div>
      {/if}
    {/if}

    {#if selectedTab === 'buy' && product && brand}
      <div class="py-2">
        <div class="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {m['marketplace.brand_label']()}
        </div>
        <div class="mb-5 text-xl font-bold text-foreground">{brand?.name}</div>
        <div class="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {m['marketplace.gift_card_amount_label']()}
        </div>
        <div class="space-y-3">
          {#each getGiftCardDenominations(products, product) as denomination}
            <button
              type="button"
              class="flex w-full items-center justify-center rounded-2xl border border-border/60 bg-card px-6 py-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg active:scale-[0.98]"
              onclick={() => addDenominationToCart(denomination, product, brand)}
              onkeydown={(e) =>
                e.key === 'Enter' && addDenominationToCart(denomination, product, brand)}
            >
              <span class="flex items-end gap-1">
                <span class="text-sm text-muted-foreground">{m['marketplace.usd']()}</span>
                <span class="text-3xl font-bold text-foreground">{denomination.amount / 1000}</span>
              </span>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    {#if selectedTab === 'info'}
      <div class="py-2">
        {#if instructions}
          <div class="mb-6">
            <h2 class="mb-2 text-sm font-semibold text-foreground">
              {m['wallet.gift-card.how_to_redeem']()}
            </h2>
            <div class="text-sm leading-relaxed text-muted-foreground">
              {#if instructions?.trim().startsWith('<')}
                {@html instructions}
              {:else}
                {instructions}
              {/if}
            </div>
          </div>
        {/if}
        {#if terms}
          <div>
            <h2 class="mb-2 text-sm font-semibold text-foreground">
              {m['wallet.gift-card.terms_and_conditions']()}
            </h2>
            <div class="text-sm leading-relaxed text-muted-foreground">
              {#if terms?.trim().startsWith('<')}
                {@html terms}
              {:else}
                {terms}
              {/if}
            </div>
          </div>
        {/if}
      </div>
    {/if}

    {#if selectedTab === 'brand'}
      <div class="flex flex-col items-center py-8">
        <p class="mb-3 text-lg font-semibold text-foreground">{brand?.name ?? 'not found'}</p>
        <div
          class="mb-5 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-soft"
        >
          <img
            src={giftCardImageDomain + '/vendors/' + brand?.logoImageSource}
            alt={brand?.name}
            class="h-full w-full object-contain"
            use:handleImageError
          />
        </div>
        {#if brand?.description}
          <div class="mb-6 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">{brand.description}</div>
        {/if}
        {#if brand?.url}
          <a
            href={brand.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            {m['marketplace.visit_online']()}
            <ExternalLink class="ml-2 h-4 w-4" />
          </a>
        {/if}
      </div>
    {/if}
  </div>
{/if}
