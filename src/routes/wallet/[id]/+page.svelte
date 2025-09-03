<script lang="ts">
  import { page } from '$app/state';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
  import { getWalletItemsStore } from '@/stores/wallet-store.svelte';

  const walletItemId = page.params.id;

  let walletItem = $derived(getWalletItemsStore().find((p) => p.id === walletItemId) || undefined);
</script>

<GiftCardDetails {walletItem} />
