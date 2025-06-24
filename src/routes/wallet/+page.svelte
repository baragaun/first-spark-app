<script lang="ts">
  import { WalletItem } from '@baragaun/bg-node-client';
  import { Tabs } from 'bits-ui';
  import { onMount } from 'svelte';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { Wallet } from 'lucide-svelte';
  import { Search, Upload } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { walletItemsStore } from '@/stores/wallet-store';
  // Tabs and wallet items
  let activeTab = $state<string>('Active');
  let searchQuery = $state<string>('');
  let fileInputRef: HTMLInputElement;

  // Load demo data on mount
  onMount(async () => {
    const res = await fetch('/wallet-data.json');
    walletItemsStore.set(await res.json());
  });

  let displayedItems = $derived.by(() => {
    if (activeTab === 'Active') {
      return $walletItemsStore.filter(
        (item) =>
          item.archivedAt == null && item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else {
      return $walletItemsStore.filter(
        (item) =>
          item.archivedAt != null && item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
  });

  function navigateToGiftCardDetail(walletItemId: string) {
    goto(`/wallet/${walletItemId}`);
  }

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  }

  function uploadAction() {
    if (fileInputRef) {
      fileInputRef.value = '';
      fileInputRef.click();
    }
  }

  function handleFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      // Handle the selected file(s) here
      // For now, just log them
      console.log(files);
    }
    goto('/wallet/upload-card');
  }
</script>

<div class="container mx-auto px-4 py-6">
  <div class="flex">
    <Wallet class=" mr-2 h-12 w-12" />
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-primary">Wallet</h1>
      <p class="mt-2 text-muted-foreground">Your KCU token balance</p>
    </header>
  </div>

  <div class="flex h-[calc(100vh-200px)] flex-col">
    <!-- Fixed Header Section -->
    <div class="flex-shrink-0">
      <!-- Tab Navigation -->
      <Tabs.Root bind:value={activeTab}>
        <Tabs.List
          class="flex h-10 w-full items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
        >
          <Tabs.Trigger
            value="Active"
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Active
          </Tabs.Trigger>
          <Tabs.Trigger
            value="Archive"
            class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Archive
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
        <div class="py-8 text-center text-muted-foreground">Your wallet is empty</div>
      {/if}
      {#each displayedItems as item}
        <button
          type="button"
          class="border-borde col-span-2 flex w-full items-start justify-between border-b text-left focus:outline-none md:col-span-3"
          onclick={() => navigateToGiftCardDetail(item.id)}
          onkeydown={(e) => e.key === 'Enter' && navigateToGiftCardDetail(item.id)}
        >
          <div class="mb-4 flex flex-shrink-0">
            <img
              src={'https://d27wpajtnol6ce.cloudfront.net/giftcards/' + item.imageSourceFront}
              alt={item.imageSourceFront}
              class="mr-4 w-32 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
              onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
            />
            <div class="flex flex-col">
              <span class="text-base font-medium text-primary">{item.name ? item.name : ''}</span>
              <span class="text-lg font-bold text-muted-foreground"
                >${(item.balance / 100).toFixed(2)}</span
              >
              <span class="text-sm text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}</span
              >
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
