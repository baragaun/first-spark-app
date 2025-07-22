<script lang="ts">
  import { Tabs } from 'bits-ui';
  import { onMount } from 'svelte';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { Wallet } from 'lucide-svelte';
  import { Search, Upload } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { walletItemsStore } from '@/stores/wallet-store';
  import { uploadedCard } from '@/stores/uploaded-card';
  import Quagga from 'quagga';
  import Tesseract from 'tesseract.js';
  import { m } from '@/paraglide/messages';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { giftCardImageDomain } from '@/constants';
  import type { WalletItem } from '@baragaun/bg-node-client';

  // Tabs and wallet items
  let activeTab = $state<string>('Active');
  let searchQuery = $state<string>('');
  let fileInputRef: HTMLInputElement;
  let isLoading = false;

  onMount(async () => {
    loadWalletItems();
    // loadWalletItemTransfers();
  });

  let displayedItems = $derived.by(() => {
    if (activeTab === 'Active') {
      return $walletItemsStore.filter(
        (item) =>
          item.archivedAt == null &&
          item.transferredAt == null &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else if (activeTab === 'Transferred') {
      return $walletItemsStore.filter(
        (item) =>
          item.transferredAt != null && item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else {
      return $walletItemsStore.filter(
        (item) =>
          item.archivedAt != null && item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
  });

  async function loadWalletItems() {
    isLoading = true;
    const response = await marketplaceContext.findWalletItems();
    if (typeof response === 'string') {
      console.error('Failed to load wallet items:', response);
      return;
    }
    if (!response) return;

    walletItemsStore.set(response);
    isLoading = false;
  }

  //todo test function
  async function loadWalletItemTransfers() {
    isLoading = true;
    const response = await marketplaceContext.findWalletItemTransfers();
    if (typeof response === 'string') {
      console.error('Failed to load wallet item transfers:', response);
      return;
    }
    if (!response) return;
    isLoading = false;
  }

  function navigateToGiftCardDetail(walletItem: WalletItem) {
    if (!walletItem.id) return;
    if (walletItem.transferredAt == null) goto(`/wallet/${walletItem.id}`);
    else goto(`/wallet/transferred/${walletItem.id}`);
  }

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  }

  function uploadAction() {
    goto(`/wallet/upload-gift-card`);
    // TODO - below code will allow to browse files
    // if (fileInputRef) {
    //   fileInputRef.value = '';
    //   fileInputRef.click();
    // }
  }

  function handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;

        // Set loading and navigate instantly
        uploadedCard.set({
          brand: '',
          balance: '',
          barcode: '',
          pin: '',
          imageUrl: imageDataUrl,
          isLoading: true,
        });
        goto('/wallet/upload-card');
        // Now process extraction in background
        Quagga.decodeSingle(
          {
            src: imageDataUrl,
            numOfWorkers: 0,
            inputStream: { size: 800 },
            decoder: {
              readers: [
                'code_128_reader',
                'ean_reader',
                'ean_8_reader',
                'code_39_reader',
                'upc_reader',
                'upc_e_reader',
                'codabar_reader',
              ],
            },
          },
          async (result: any) => {
            let barcode = '';
            let company = '';
            let price = '';
            let pin = '';
            if (result && result.codeResult) {
              barcode = result.codeResult.code;
            }
            const {
              data: { text },
            } = await Tesseract.recognize(imageDataUrl, 'eng');
            console.log(text);
            const priceMatch = text.match(/\$\s?\d+[.,]?\d*/);
            price = priceMatch ? priceMatch[0] : '';
            const lines = text
              .split(/\r?\n/)
              .map((l) => l.trim())
              .filter(Boolean);
            // Improved brand extraction: find a line that looks like a brand (all uppercase, not price/barcode/pin)
            const brandLine = lines.find(
              (l) => /^[A-Z0-9 '&.-]{3,}$/.test(l) && !/\$|pin|\d{4,}/i.test(l),
            );
            company = brandLine || lines[0] || '';
            // Improved barcode extraction: look for 16-20 digit numbers (with or without spaces)
            if (!barcode) {
              // Try to find a long number (with or without spaces)
              const joined = text.replace(/\s+/g, '');
              const barcodeMatch = joined.match(/\d{16,20}/);
              if (barcodeMatch) {
                barcode = barcodeMatch[0];
              } else {
                // fallback: try spaced numbers
                const spacedMatch = text.match(/(\d{4,}\s?){4,6}/);
                if (spacedMatch) {
                  barcode = spacedMatch[0].replace(/\s+/g, '');
                }
              }
            }
            // Improved pin extraction: look for Pin: xxxx or pin xxxx
            let pinMatch = text.match(/pin\s*:?\s*(\d{4,8})/i);
            if (!pinMatch) {
              // fallback: try to find a 4-8 digit number after the word Pin
              pinMatch = text.match(/Pin[^\d]*(\d{4,8})/i);
            }
            if (pinMatch) {
              pin = pinMatch[1];
            }
            // Update store with extracted values and set loading false
            uploadedCard.set({
              brand: company,
              balance: price,
              barcode,
              pin,
              imageUrl: imageDataUrl,
              isLoading: false,
            });
          },
        );
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<div class="container mx-auto px-4 py-6">
  <div class="flex">
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-foreground">{m['wallet.title']()}</h1>
      <p class="mt-2 text-muted-foreground">{m['wallet.subtitle']()}</p>
    </header>
  </div>

  <div class="flex h-[calc(100vh-200px)] flex-col">
    <!-- Fixed Header Section -->
    <div class="flex-shrink-0">
      <!-- Tab Navigation -->
      <Tabs.Root bind:value={activeTab}>
        <Tabs.List
          class="flex h-10 w-full items-center justify-center rounded-2xl bg-muted p-1 text-muted-foreground "
        >
          <Tabs.Trigger
            value="Active"
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {m['wallet.active']()}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Archive"
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {m['wallet.archive']()}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Transferred"
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Transferred
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <!-- Search -->
      <div class="mb-3 mt-3 flex items-center gap-3">
        <div
          class="relative flex-1 rounded-full bg-gradient-to-r from-kcu-lime via-kcu-glacier to-kcu-juniper p-[2px]"
        >
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="search"
            class="search-input-override w-full rounded-full border-0 bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            bind:value={searchQuery}
          />
        </div>
        <Button
          class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-kcu-lime via-kcu-glacier to-kcu-juniper p-[2px]"
          onclick={uploadAction}
          aria-label="Upload"
        >
          <div class="flex h-full w-full items-center justify-center rounded-full bg-background">
            <Upload class="h-5 w-5 text-primary" />
          </div>
        </Button>
        <input
          type="file"
          bind:this={fileInputRef}
          class="hidden"
          onchange={handleFileChange}
          accept="image/*"
          capture={isMobileDevice() ? 'environment' : undefined}
        />
      </div>
    </div>

    <!-- Scrollable Wallet Items Section -->
    <div class="flex-1 overflow-y-auto">
      {#if displayedItems.length === 0}
        <div class="py-8 text-center text-muted-foreground">
          {activeTab === 'Active' ? m['wallet.empty']() : m['wallet.transferred.no_items_found']()}
        </div>
      {/if}
      {#each displayedItems as item}
        <button
          type="button"
          class="border-borde col-span-2 flex w-full items-start justify-between border-b text-left focus:outline-none md:col-span-3"
          onclick={() => navigateToGiftCardDetail(item)}
          onkeydown={(e) => e.key === 'Enter' && navigateToGiftCardDetail(item)}
        >
          <div class="mb-4 flex flex-shrink-0">
            <img
              src={giftCardImageDomain + '/giftcards/' + item.imageSourceFront}
              alt={item.imageSourceFront}
              class="mr-4 w-32 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
              onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
            />
            <div class="flex flex-col">
              <span class="text-base font-medium text-foreground">{item.name ? item.name : ''}</span
              >
              <span class="text-lg font-bold text-muted-foreground"
                >${(item.balance / 1000).toFixed(2)}</span
              >
              <span class="text-sm text-muted-foreground">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span
              >
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
