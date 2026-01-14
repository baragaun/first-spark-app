<script lang="ts">
  import { Tabs } from 'bits-ui';
  import { onMount } from 'svelte';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { Search, Upload } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { getWalletItemsStore, loadWalletItems } from '@/stores/wallet-store.svelte';
  import { uploadedCardSetValues } from '@/stores/uploaded-card.svelte';
  import Tesseract from 'tesseract.js';
  import { m } from '@/paraglide/messages';
  import { giftCardImageDomain } from '@/constants';
  import type { WalletItem } from '@baragaun/bg-node-client';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
  import { extractGiftCardWithAI } from '$lib/utils/ai-client';
  import { toast } from 'svelte-sonner';

  const isMobile = new IsMobile();

  const TabId = {
    ACTIVE: 'active',
    GIFTED: 'gifted',
    ARCHIVED: 'archived',
  };
  type TabId = (typeof TabId)[keyof typeof TabId];

  // Tabs and wallet items
  let currentTab = $state<string>(TabId.ACTIVE);
  let searchQuery = $state<string>('');
  let fileInputRef: HTMLInputElement;
  let isModelAvailable = $state(true);

  onMount(async () => {
    loadWalletItems();
  });

  let displayedItems = $derived.by(() => {
    if (currentTab === TabId.ACTIVE) {
      return getWalletItemsStore().filter(
        (item) =>
          item.archivedAt == null &&
          item.transferStartedAt == null &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else if (currentTab === TabId.GIFTED) {
      return getWalletItemsStore().filter(
        (item) =>
          item.transferStartedAt != null &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else {
      return getWalletItemsStore().filter(
        (item) =>
          item.archivedAt != null && item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
  });

  function navigateToGiftCardDetail(walletItem: WalletItem) {
    if (!walletItem.id) return;
    if (walletItem.transferStartedAt == null) goto(`/wallet/${walletItem.id}`);
    else goto(`/wallet/transferred/${walletItem.id}`);
  }

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  }

  function uploadAction() {
    // goto(`/wallet/upload-gift-card`);
    // TODO - below code will allow to browse files
    if (fileInputRef) {
      fileInputRef.value = '';
      fileInputRef.click();
    }
  }

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

  async function handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;

        // Set loading and navigate instantly
        uploadedCardSetValues({ imageUrlData: imageDataUrl, isLoading: true });
        goto('/wallet/upload-card');
        // Now process extraction in background
        let barcode = '';
        try {
          let detector: any;
          if (
            typeof window !== 'undefined' &&
            typeof (window as any).BarcodeDetector !== 'undefined'
          ) {
            detector = new (window as any).BarcodeDetector({
              formats: ['code_128', 'ean_13', 'ean_8', 'code_39', 'upc_a', 'upc_e', 'codabar'],
            });
          } else {
            throw new Error('BarcodeDetector is not available');
          }
          const img = new window.Image();
          img.src = imageDataUrl;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const barcodes = await detector.detect(canvas);
            if (barcodes.length > 0) {
              barcode = barcodes[0].rawValue || barcodes[0].value || '';
            }
          }
        } catch (e) {
          console.warn('Barcode detection failed:', e);
        }

        // Step 1: Extract text with Tesseract OCR
        const {
          data: { text },
        } = await Tesseract.recognize(imageDataUrl, 'eng');
        console.log('OCR Result Text:', text);

        // Step 2: Try GitHub Models AI extraction if available
        if (isModelAvailable) {
          console.log('🤖 Using GitHub Models AI for extraction...');
          const aiResult = await extractGiftCardWithAI(text);

          console.log('GitHub Models Result:', aiResult);

          if (aiResult.success && aiResult.data) {
            // Use AI-extracted data
            uploadedCardSetValues({
              brandNameValue: aiResult.data.brandName,
              balanceValue: aiResult.data.balance,
              barcodeValue: aiResult.data.barcode || barcode,
              pinValue: aiResult.data.pin,
              imageUrlData: imageDataUrl,
              isLoading: false,
            });
            toast.success('Gift card extracted with AI!');
            return;
          } else {
            console.log('⚠️ AI extraction failed, falling back to regex');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<div class="container mx-auto px-4 py-2">
  {#if !isMobile.current}
    <div class="flex">
      <header class="mb-6">
        <h1 class="text-3xl font-bold text-foreground">{m['wallet.title']()}</h1>
        <!--      <p class="mt-2 text-muted-foreground">{m['wallet.subtitle']()}</p>-->
      </header>
    </div>
  {/if}

  <div class="flex flex-col">
    <!-- Fixed Header Section -->
    <div class="flex-shrink-0">
      <!-- Tab Navigation -->
      <Tabs.Root bind:value={currentTab}>
        <Tabs.List
          class="flex h-10 w-full items-center justify-center rounded-2xl bg-muted p-1 text-muted-foreground "
        >
          <Tabs.Trigger
            value={TabId.ACTIVE}
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {m['wallet.tabs.active']()}
          </Tabs.Trigger>
          <Tabs.Trigger
            value={TabId.GIFTED}
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {m['wallet.tabs.gifted']()}
          </Tabs.Trigger>
          <Tabs.Trigger
            value={TabId.ARCHIVED}
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {m['wallet.tabs.archived']()}
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <!-- Search -->
      <div class="mb-3 mt-3 flex items-center gap-3">
        {#if displayedItems.length > 10}
          <div
            class="relative flex-1 rounded-full bg-gradient-to-r from-kcu-lime via-kcu-glacier to-kcu-juniper p-[2px]"
          >
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="search"
              class="search-input-override w-full rounded-full border-0 bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              bind:value={searchQuery}
            />
          </div>
          <div class="mt-3 flex flex-col items-center justify-center">
            <Button
              class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-kcu-lime via-kcu-glacier to-kcu-juniper p-[2px]"
              onclick={uploadAction}
              aria-label="Upload"
            >
              <div
                class="flex h-full w-full items-center justify-center rounded-full bg-background"
              >
                <Upload class="h-5 w-5 text-primary" />
              </div>
            </Button>
            <span class="ml-2 text-sm font-medium text-primary">{m['wallet.upload_card']()}</span>
          </div>
        {:else}
          <div class="mt-3 flex w-full flex-row items-center justify-end">
            <div class="flex-1"></div>
            <Button
              class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-kcu-lime via-kcu-glacier to-kcu-juniper p-[2px]"
              onclick={uploadAction}
              aria-label="Upload"
            >
              <div
                class="flex h-full w-full items-center justify-center rounded-full bg-background"
              >
                <Upload class="h-5 w-5 text-primary" />
              </div>
            </Button>
            <span class="mx-2 text-sm font-medium text-primary">{m['wallet.upload_card']()}</span>
          </div>
        {/if}

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
    <div class="relative flex-1 overflow-y-auto">
      {#if displayedItems.length === 0}
        <div class="py-8 text-center text-muted-foreground">
          {currentTab === TabId.ACTIVE ? m['wallet.empty']() : m['wallet.gifted.no_items_found']()}
        </div>
      {/if}
      {#each displayedItems as item}
        <button
          type="button"
          class="border-borde col-span-2 flex w-full items-start justify-between border-b text-left focus:outline-none md:col-span-3"
          onclick={() => navigateToGiftCardDetail(item)}
          onkeydown={(e) => e.key === 'Enter' && navigateToGiftCardDetail(item)}
        >
          <div class="my-2 flex flex-shrink-0">
            <img
              src={giftCardImageDomain + '/giftcards/' + item.imageSourceFront}
              alt={item.imageSourceFront}
              class="mr-4 w-32 rounded-xl object-cover shadow-lg"
              use:handleImageError
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
