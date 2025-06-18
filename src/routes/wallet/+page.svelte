<script lang="ts">
  import { WalletItem } from '@baragaun/bg-node-client';
  import { Tabs } from 'bits-ui';
  import { onMount } from 'svelte';
  import placeholderImage from '../../assets/images/placeholder.png';
  import { Wallet } from 'lucide-svelte';
  import WalletCard from '@/components/card/card-details.svelte';
  import { goto } from '$app/navigation';
  import { walletItemsStore } from '@/stores/wallet-store';
  // Tabs and wallet items
  let activeTab = $state<string>('Active');
  let search = $state<string>('');
  let selectedCard: WalletItem | null = $state<WalletItem | null>(null);

  // Load demo data on mount
  onMount(async () => {
    const res = await fetch('/wallet-data.json');
    walletItemsStore.set(await res.json());
  });

  let displayedItems = $derived.by(() => {
    if (activeTab === 'Active') {
      return $walletItemsStore.filter(
        (item) => item.archivedAt == null && item.name.includes(search),
      );
    } else {
      return $walletItemsStore.filter(
        (item) => item.archivedAt != null && item.name.includes(search),
      );
    }
  });

  function navigateToGiftCardDetail(walletItemId: string) {
    goto(`/wallet/${walletItemId}`);
  }
</script>

{#if selectedCard}
  <div class="container mx-auto">
    <WalletCard item={selectedCard} onBack={() => (selectedCard = null)} />
  </div>
{:else}
  <div class="container mx-auto px-4 py-6">
    <div class="flex">
      <Wallet class=" mr-2 h-12 w-12" />
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
            </div>
          </div>
          <div class="text-sm text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </button>
      {/each}
    </div>
  </div>
{/if}
