<script lang="ts">
  import { page } from '$app/state';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
  import { walletItemsStore } from '@/stores/wallet-store';

  const walletCardId = page.params.id;

  let walletItem = $derived($walletItemsStore.find((p) => p.id === walletCardId) || undefined);
</script>

<GiftCardDetails {walletItem} />
