<script lang="ts">
  import { page } from '$app/state';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
  import { getWalletItemsStore, loadWalletItems } from '@/stores/wallet-store.svelte';
  import { onMount } from 'svelte';

  const walletItemId = page.params.id;
  let loading = $state(false);
  let walletItem = $state(getWalletItemsStore().find((p) => p.id === walletItemId));

  onMount(() => {
    if (!walletItem) {
      loading = true;
      loadWalletItems().then(() => {
        walletItem = getWalletItemsStore().find((p) => p.id === walletItemId);
        loading = false;
      });
    }
  });
</script>

{#if loading || !walletItem}
  <div class="flex h-[60vh] items-center justify-center">
    <div
      class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
    ></div>
  </div>
{:else}
  <GiftCardDetails bind:walletItem={walletItem} />
{/if}
