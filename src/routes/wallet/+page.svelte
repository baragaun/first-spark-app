<script lang="ts">
  import { Tabs } from 'bits-ui';
  import { onMount } from 'svelte';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { Search, Upload, ChevronRight, Wallet as WalletIcon } from 'lucide-svelte';
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
  import { logger } from '@/utils/logger';
  import { PUBLIC_IS_MODEL_AVAILABLE } from '$env/static/public';

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
  let isModelAvailable = $state(PUBLIC_IS_MODEL_AVAILABLE === 'true');

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
    if (!isModelAvailable) {
      goto(`/wallet/upload-gift-card`);
      return;
    }

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
        } finally {
          logger.info('Detected barcode:', barcode);
        }

        // Step 1: Extract text with Tesseract OCR
        const {
          data: { text },
        } = await Tesseract.recognize(imageDataUrl, 'eng');

        // Step 2: Try GitHub Models AI extraction if available
        if (isModelAvailable) {
          const aiResult = await extractGiftCardWithAI(text);

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
            toast.error('AI extraction failed, please enter details manually.');
            logger.error('AI extraction failed:', aiResult.error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<div class="animate-fade-in container mx-auto px-4 py-4 md:px-6">
  {#if !isMobile.current}
    <header class="mb-5">
      <h1 class="text-2xl font-bold tracking-tight text-foreground">{m['wallet.title']()}</h1>
    </header>
  {/if}

  <div class="flex flex-col">
    <!-- Fixed Header Section -->
    <div class="flex-shrink-0">
      <!-- Tab Navigation -->
      <Tabs.Root bind:value={currentTab}>
        <Tabs.List
          class="flex h-11 w-full items-center justify-center rounded-2xl bg-muted/50 p-1 text-muted-foreground"
        >
          <Tabs.Trigger
            value={TabId.ACTIVE}
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            {m['wallet.tabs.active']()}
          </Tabs.Trigger>
          <Tabs.Trigger
            value={TabId.GIFTED}
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            {m['wallet.tabs.gifted']()}
          </Tabs.Trigger>
          <Tabs.Trigger
            value={TabId.ARCHIVED}
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
          >
            {m['wallet.tabs.archived']()}
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <!-- Search & Upload -->
      <div class="mb-4 mt-4 flex items-center gap-3">
        {#if displayedItems.length > 10}
          <div class="relative flex-1">
            <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cards..."
              class="h-11 w-full rounded-2xl border-border/60 bg-muted/40 pl-10 shadow-none placeholder:text-muted-foreground/50 focus-visible:bg-background focus-visible:ring-primary/30"
              bind:value={searchQuery}
            />
          </div>
        {:else}
          <div class="flex-1"></div>
        {/if}
        <Button
          class="flex h-10 items-center gap-2 rounded-full bg-secondary px-4 text-secondary-foreground shadow-sm hover:bg-secondary/90"
          onclick={uploadAction}
          aria-label="Upload"
        >
          <Upload class="h-4 w-4" />
          <span class="text-sm font-medium">{m['wallet.upload_card']()}</span>
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

    <!-- Wallet Items Section -->
    <div class="relative flex-1 space-y-3">
      {#if displayedItems.length === 0}
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
            <WalletIcon class="h-7 w-7 text-muted-foreground/50" />
          </div>
          <p class="text-sm text-muted-foreground">
            {currentTab === TabId.ACTIVE ? m['wallet.empty']() : m['wallet.gifted.no_items_found']()}
          </p>
        </div>
      {/if}
      {#each displayedItems as item}
        <button
          type="button"
          class="group flex w-full items-center gap-4 rounded-2xl bg-card p-3 text-left shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onclick={() => navigateToGiftCardDetail(item)}
          onkeydown={(e) => e.key === 'Enter' && navigateToGiftCardDetail(item)}
        >
          <img
            src={giftCardImageDomain + '/giftcards/' + item.imageSourceFront}
            alt={item.imageSourceFront}
            class="w-28 flex-shrink-0 rounded-xl object-cover shadow-sm"
            use:handleImageError
          />
          <div class="flex min-w-0 flex-1 flex-col gap-0.5">
            <span class="truncate text-sm font-semibold text-foreground">{item.name ? item.name : ''}</span>
            <span class="text-lg font-bold text-primary">${(item.balance / 1000).toFixed(2)}</span>
            <span class="text-xs text-muted-foreground">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
            </span>
          </div>
          <ChevronRight class="h-5 w-5 flex-shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
        </button>
      {/each}
    </div>
  </div>
</div>