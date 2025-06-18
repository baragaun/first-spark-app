<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import type { Vendor } from '@baragaun/bg-node-client';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import { Archive, ArrowLeft, ExternalLink, Gift, Printer } from 'lucide-svelte';
  import { vendorsStore } from '$lib/stores/marketplace-store';
  import { derived } from 'svelte/store';
  import { walletItemsStore } from '@/stores/wallet-store';
  import JsBarcode from 'jsbarcode';

  // Add a placeholder for user avatar (replace with real user data if available)
  const userAvatarUrl = 'https://randomuser.me/api/portraits/men/32.jpg';

  const walletCardId = $page.params.id;
  const walletCardImageDomain = 'https://d27wpajtnol6ce.cloudfront.net';

  const walletItemProduct = derived([walletItemsStore], ([$products]) => {
    console.log($products, walletCardId);
    return $products.find((p) => p.id === walletCardId) || null;
  });

  // const vendor = derived(
  //   [vendorsStore, walletItemProduct],
  //   ([$vendors, $product]) => {
  //     if (!$product) return null;
  //     console.log($vendors, $product.vendorId);
  //     return $vendors.find((v) => v.id === $product.vendorId) || null;
  //   },
  // );

  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let selectedTab = $state('use');

  const code = '5045 0794 5057 847';
  const pin = '5749';

  onMount(async () => {
    try {
      isLoading = true;
      const vendorsResponse = await marketplaceContext.findVendors();
      if (typeof vendorsResponse === 'string') {
        error = vendorsResponse;
        return;
      }
      vendorsStore.set(vendorsResponse as Vendor[]);
    } catch (err) {
      error = 'Failed to load gift card details';
      console.error(err);
    } finally {
      isLoading = false;
    }
  });

  let barcodeRef = $state<HTMLCanvasElement>();

  function renderBarcode() {
    if (barcodeRef && code) {
      JsBarcode(barcodeRef, code, { format: 'CODE39', displayValue: false });
    }
  }

  $effect(() => {
    if (barcodeRef && code) {
      renderBarcode();
    }
  });

  onMount(renderBarcode);
</script>

<!-- Header Bar -->
<div
  class="flex items-center justify-between rounded-b-lg bg-foreground px-4 py-3 text-background shadow"
>
  <button onclick={() => history.back()} class="flex items-center">
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="text-lg font-semibold">Gift Card</span>
  <img src={userAvatarUrl} alt="User" class="h-8 w-8 rounded-full object-cover" />
</div>

{#if isLoading}
  <div class="flex h-[60vh] items-center justify-center">
    <div class="text-center">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
      ></div>
      <p class="mt-2 text-muted-foreground">Loading gift card details...</p>
    </div>
  </div>
{:else if error}
  <Card.Root class="mx-auto mt-8 max-w-md">
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
{:else if $walletItemProduct}
  <div class="mx-auto max-w-lg px-4 py-6">
    <!-- Gift Card Image -->
    <div class="my-2 flex justify-center">
      <img
        src={walletCardImageDomain + '/giftcards/' + $walletItemProduct.imageSourceFront}
        alt={$walletItemProduct.name}
        class="aspect-[16/9] w-full max-w-md rounded-2xl object-contain shadow-lg"
        onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
      />
    </div>

    <div class="flex items-center border-b bg-gray-50 px-4 py-2">
      <div class="flex gap-2">
        <div class="flex flex-col items-center">
          <Button variant="ghost" size="icon"><Gift aria-label="Gift" /></Button>
          <span class="text-xs text-gray-500">Gift</span>
        </div>
        <div class="flex flex-col items-center">
          <Button variant="ghost" size="icon"><ExternalLink aria-label="Brand" /></Button>
          <span class="text-xs text-gray-500">Brand</span>
        </div>
        <div class="flex flex-col items-center">
          <Button variant="ghost" size="icon"><Printer aria-label="Print" /></Button>
          <span class="text-xs text-gray-500">Print</span>
        </div>
        <div class="flex flex-col items-center">
          <Button variant="ghost" size="icon"><Archive aria-label="Archive" /></Button>
          <span class="text-xs text-gray-500">Archive</span>
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
        onclick={() => (selectedTab = 'use')}>Use</button
      >
      <button
        class="flex-1 border-b-2 py-2 font-medium"
        style="color: {selectedTab === 'info'
          ? 'var(--primary)'
          : '#888'}; border-color: {selectedTab === 'info' ? 'var(--primary)' : 'transparent'};"
        onclick={() => (selectedTab = 'info')}>Info</button
      >
      <button
        class="flex-1 border-b-2 py-2 font-medium"
        style="color: {selectedTab === 'brand'
          ? 'var(--primary)'
          : '#888'}; border-color: {selectedTab === 'brand' ? 'var(--primary)' : 'transparent'};"
        onclick={() => (selectedTab = 'brand')}>Brand</button
      >
    </div>

    {#if selectedTab === 'use'}
      <!-- Brand and Amounts (Buy Tab) -->
      <div class="flex flex-col items-center justify-center px-2 py-4">
        <div class="flex items-end justify-center">
          <p class="mr-2 text-xl text-gray-400">USD</p>
          <span class="text-400 text-5xl font-semibold text-secondary-foreground">
            {($walletItemProduct.balance / 100).toFixed(0)}
          </span>
          <span class="text-lg font-semibold text-secondary-foreground">
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
          class="text-primary underline">Look up balance</a
        >

        <!-- Card Code and PIN -->
        {#if code}
          <div class="mt-4 flex flex-col items-center">
            <canvas bind:this={barcodeRef} style="height: 70px; width: 360px;"></canvas>
          </div>
        {/if}

        <h class="text-xl text-black">{code}</h>
        <div class="mt-2 flex items-center gap-2">
          <Button size="sm" class="h-8 rounded-full">Zoom</Button>
          <Button size="sm" class="h-8 rounded-full">Copy</Button>
        </div>

        <h class="mt-4 text-xl text-black">{pin}</h>
        <p class="text-sm text-gray-400">Card PIN</p>
        <Button size="sm" class="mt-2 h-8 rounded-full">Copy PIN</Button>
      </div>
    {/if}

    {#if selectedTab === 'info'}
      <div class="px-2 py-4">
        {#if $walletItemProduct.instructionsEn}
          <div class="mb-6">
            <h2 class="text-400 mb-2 text-lg font-semibold text-secondary-foreground">
              How To Redeem
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
              Terms And Conditions
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
            src={'https://d27wpajtnol6ce.cloudfront.net/vendors/' +
              $walletItemProduct.imageSourceBack}
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
            class="rounded-lg bg-primary px-8 py-2 font-semibold tracking-wide text-white shadow transition hover:bg-primary/90"
            style="text-transform: uppercase; letter-spacing: 1px;"
          >
            VISIT ONLINE
          </a>
        {/if}
      </div>
    {/if}
  </div>
{/if}
