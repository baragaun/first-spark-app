<script lang="ts">
  import { WalletItem } from '@baragaun/bg-node-client';
  import { Tabs } from 'bits-ui';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { giftCardProductsStore } from '@/stores/marketplace-store';
  import { Wallet } from 'lucide-svelte';
  // Tabs and wallet items
  let activeTab = $state<string>('Active');
  let walletItems = $state<WalletItem[]>([
    new WalletItem({
      id: '1',
      name: 'Active Wallet 1',
      balance: 1000,
      archivedAt: null,
      createdAt: '2024-01-01T00:00:00Z',
    }),
    new WalletItem({
      id: '2',
      name: 'Active Wallet 2',
      balance: 2000,
      archivedAt: null,
      createdAt: '2024-04-01T00:00:00Z',
    }),
    new WalletItem({
      id: '3',
      name: 'Active Wallet 3',
      balance: 3000,
      archivedAt: null,
      createdAt: '2024-06-01T00:00:00Z',
    }),
    new WalletItem({
      id: '4',
      name: 'Archived Wallet 4',
      balance: 4000,
      archivedAt: new Date('2024-01-01T00:00:00Z'),
      createdAt: '2024-08-01T00:00:00Z',
    }),
    new WalletItem({
      id: '5',
      name: 'Archived Wallet 5',
      balance: 5000,
      archivedAt: new Date('2024-01-01T00:00:00Z'),
      createdAt: '2024-10-08T00:00:00Z',
    }),
  ]);
  let search = $state<string>('');

  function filterProduct(productId: String): String {
    const product = $giftCardProductsStore.find((product) => product.id === productId);
    return product?.imageSourceFront ?? '';
  }

  let displayedItems = $derived.by(() => {
    if (activeTab === 'Active') {
      return walletItems.filter((item) => item.archivedAt == null && item.name.includes(search));
    } else {
      return walletItems.filter((item) => item.archivedAt != null && item.name.includes(search));
    }
  });
</script>

<div class="container mx-auto px-4 py-6">
  <div class="flex">
    <Wallet class=" h-12 w-12 mr-2" />
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-primary">Wallet</h1>
      <p class="mt-2 text-muted-foreground">Your mimble token balance</p>
    </header>
  </div>

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
  <input
    type="text"
    placeholder="Search ..."
    bind:value={search}
    class="my-4 w-full rounded border px-3 py-2"
  />
  <!-- Wallet Items -->
  <div class="mt-6 grid gap-4">
    {#if displayedItems.length === 0}
      <div class="py-8 text-center text-muted-foreground">Your wallet is empty</div>
    {/if}
    {#each displayedItems as item}
      <div class="border-borde col-span-2 flex items-center justify-between border-b md:col-span-3">
        <div class="flex flex-shrink-0">
          <img
            src={'https://d27wpajtnol6ce.cloudfront.net/giftcards/' + filterProduct(item.productId)}
            alt={''}
            class="mr-4 h-12 w-16 object-cover transition-transform duration-300 group-hover:scale-110"
            onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
          />
          <div class="flex flex-col">
            <span class="text-base font-medium text-primary">{item.name ? item.name : ''}</span>
            <span class="text-sm text-muted-foreground">${item.balance / 100}</span>
          </div>
        </div>

        <div class="text-sm text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      </div>
    {/each}
  </div>
</div>
