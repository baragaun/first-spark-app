<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import type { Brand } from '@baragaun/bg-node-client';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import { Archive, ArrowLeft, ExternalLink, Gift, Printer, ZoomOut } from 'lucide-svelte';
  import { brandsStore } from '$lib/stores/marketplace-store';
  import { derived } from 'svelte/store';
  import { walletItemsStore } from '@/stores/wallet-store';
  import BarcodeView from './barcode-view.svelte';
  import { downloadPdf } from '@/utils/pdf-utils';
  import { m } from '@/paraglide/messages';
  import { giftCardImageDomain } from '$lib/constants';

  const walletCardId = $page.params.id;

  const walletItemProduct = derived([walletItemsStore], ([$products]) => {
    return $products.find((p) => p.id === walletCardId) || null;
  });

  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let selectedTab = $state('use');
  let isBarcodeViewOpen = $state(false);

  onMount(async () => {
    try {
      isLoading = true;
      const brandsResponse = await marketplaceContext.findBrands();
      if (typeof brandsResponse === 'string') {
        error = brandsResponse;
        return;
      }
      brandsStore.set(brandsResponse as Brand[]);
    } catch (err) {
      error = 'Failed to load gift card details';
      console.error(err);
    } finally {
      isLoading = false;
    }
  });

  const barcodeFormat = $walletItemProduct?.barcodeFormat || 'CODE39';

  const barcodeApiUrl = `https://barcodeapi.org/api/${barcodeFormat === 'QR_CODE' ? 'qr' : 'code39'}/${encodeURIComponent($walletItemProduct?.code || '')}`;

  function backAndClose() {
    if (isBarcodeViewOpen) {
      isBarcodeViewOpen = false;
    } else {
      history.back();
    }
  }

  async function archiveWalletItem() {
    if (!$walletItemProduct) return;
    await marketplaceContext.archiveWalletItem($walletItemProduct.id, !$walletItemProduct?.archivedAt);
    history.back();
  }

  function handlePrintPdf() {
    if (!$walletItemProduct || !$walletItemProduct.code || !$walletItemProduct.pin) return;
    downloadPdf($walletItemProduct, $walletItemProduct.code, $walletItemProduct.pin);
  }
</script>

<!-- Header Bar -->
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
  <span class="flex-1 text-center text-lg font-semibold">{m['wallet.gift-card.title']()}</span>
</div>

{#if isLoading}
  <div class="flex h-[60vh] items-center justify-center">
    <div class="text-center">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
      ></div>
      <p class="mt-2 text-muted-foreground">{m['wallet.gift-card.loading']()}</p>
    </div>
  </div>
{:else if error}
  <Card.Root class="mx-auto mt-8 max-w-md">
    <Card.Header>
      <Card.Title>{m['wallet.gift-card.error']()}</Card.Title>
    </Card.Header>
    <Card.Content>
      <p>{error}</p>
    </Card.Content>
    <Card.Footer>
      <Button href="/marketplace">{m['wallet.gift-card.return_to_marketplace']()}</Button>
    </Card.Footer>
  </Card.Root>
{:else if isBarcodeViewOpen}
  <BarcodeView>
    <img src={barcodeApiUrl} class="barcode" alt="Barcode" />
  </BarcodeView>
{:else if $walletItemProduct}
  <div class="mx-auto max-w-lg px-4 py-6">
    <!-- Gift Card Image -->
    <div class="my-2 flex justify-center">
      <img
        src={giftCardImageDomain + '/giftcards/' + $walletItemProduct.imageSourceFront}
        alt={$walletItemProduct.name}
        class="aspect-[16/9] w-full max-w-md rounded-2xl object-contain shadow-lg"
        onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
      />
    </div>

    <div class="flex items-center border-b bg-gray-50 px-4 py-2">
      <div class="flex gap-2">
        <div class="flex flex-col items-center">
          <Button variant="ghost" size="icon"><Gift aria-label="Gift" /></Button>
          <span class="text-xs text-gray-500">{m['wallet.gift-card.gift']()}</span>
        </div>
        <div class="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            href={$walletItemProduct.termsUrl}
            target="_blank"
            rel="noopener noreferrer"><ExternalLink aria-label="Brand" /></Button
          >
          <span class="text-xs text-gray-500">{m['wallet.gift-card.brand']()}</span>
        </div>
        <div class="flex flex-col items-center">
          <Button variant="ghost" size="icon" onclick={handlePrintPdf}
            ><Printer aria-label="Print" /></Button
          >
          <span class="text-xs text-gray-500">{m['wallet.gift-card.print']()}</span>
        </div>
        <div class="flex flex-col items-center">
          <Button variant="ghost" size="icon" onclick={archiveWalletItem}><Archive aria-label="Archive" /></Button>
          <span class="text-xs text-gray-500">{m['wallet.gift-card.archive']()}</span>
        </div>
      </div>
      <span class="ml-2 flex flex-grow items-center justify-end">
        <span
          class={`mr-1 inline-block h-3 w-3 rounded-full ${$walletItemProduct.archivedAt ? 'bg-red-500' : 'bg-green-500'}`}
        ></span>
        <span class="text-xs text-gray-500"
          >{$walletItemProduct.archivedAt ? 'Archived' : 'Active'}</span
        >
      </span>
    </div>

    <!-- Tabs -->
    <div class="mb-4 flex border-b">
      <button
        class="flex-1 border-b-2 py-2 font-medium"
        style="color: {selectedTab === 'use'
          ? 'var(--primary)'
          : '#888'}; border-color: {selectedTab === 'use' ? 'var(--primary)' : 'transparent'};"
        onclick={() => (selectedTab = 'use')}>{m['wallet.gift-card.use']()}</button
      >
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

    {#if selectedTab === 'use'}
      <!-- Brand and Amounts (Buy Tab) -->
      <div class="flex flex-col items-center justify-center px-2 py-4">
        <div class="flex items-end justify-center">
          <p class="mr-2 text-xl text-gray-400">USD</p>
          <span class="text-400 text-5xl font-semibold text-foreground">
            {($walletItemProduct.balance / 100).toFixed(0)}
          </span>
          <span class="text-lg font-semibold text-foreground">
            .{($walletItemProduct.balance / 100).toFixed(2).split('.')[1]}
          </span>
        </div>
        <p class="text-sm text-gray-400">
          Balance as of {new Date($walletItemProduct.createdAt).toLocaleDateString()}
        </p>
        <a
          href="https://www.google.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary underline">{m['wallet.gift-card.look_up_balance']()}</a
        >

        <!-- Card Code and PIN -->
        {#if $walletItemProduct.code}
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

        <h class="mt-4 text-xl text-black">{$walletItemProduct.pin}</h>
        <p class="text-sm text-gray-400">Card PIN</p>
        <Button size="sm" class="mt-2 h-8 rounded-full bg-primary text-primary-foreground"
          >{m['wallet.gift-card.copy_pin']()}</Button
        >
      </div>
    {/if}

    {#if selectedTab === 'info'}
      <div class="px-2 py-4">
        {#if $walletItemProduct.instructionsEn}
          <div class="mb-6">
            <h2 class="text-400 mb-2 text-lg font-semibold text-secondary-foreground">
              {m['wallet.gift-card.how_to_redeem']()}
            </h2>
            {#if $walletItemProduct.instructionsEn?.trim().startsWith('<')}
              <p class="mb-2">
                {@html $walletItemProduct.instructionsEn}
              </p>
            {:else}
              <p class="mb-2">
                {$walletItemProduct.instructionsEn}
              </p>
            {/if}
          </div>
        {/if}
        {#if $walletItemProduct.termsEn}
          <div>
            <h2 class="text-400 mb-2 text-lg font-semibold text-secondary-foreground">
              {m['wallet.gift-card.terms_and_conditions']()}
            </h2>
            {#if $walletItemProduct.instructionsEn?.trim().startsWith('<')}
              <p class="mb-2">
                {@html $walletItemProduct.termsEn}
              </p>
            {:else}
              <p class="mb-2">
                {$walletItemProduct.termsEn}
              </p>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

    {#if selectedTab === 'brand'}
      <div class="flex flex-col items-center py-8">
        <!-- Brand Logo -->
        <div
          class="mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg"
        >
          <img
            src={giftCardImageDomain + '/brands/' + $walletItemProduct.imageSourceBack}
            alt={$walletItemProduct.name}
            class="h-full w-full object-contain"
            onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
          />
        </div>
        <!-- Brand Description -->
        {#if $walletItemProduct.instructionsUrl}
          <div class="text-600 mb-8 max-w-xl text-center">{$walletItemProduct.instructionsUrl}</div>
        {/if}
        <!-- Visit Online Button -->
        {#if $walletItemProduct.termsUrl}
          <a
            href={$walletItemProduct.termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg bg-nav px-8 py-2 font-semibold tracking-wide text-nav-foreground shadow transition hover:bg-nav/90"
            style="text-transform: uppercase; letter-spacing: 1px;"
          >
            {m['wallet.gift-card.visit_online']()}
          </a>
        {/if}
      </div>
    {/if}
  </div>
{/if}
