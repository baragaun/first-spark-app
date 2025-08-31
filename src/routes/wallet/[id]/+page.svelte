<script lang="ts">
  import { page } from '$app/state';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
  import { walletItemsStore } from '@/stores/wallet-store';
  import { derived } from 'svelte/store';

  const walletCardId = page.params.id;

  const walletItem = derived([walletItemsStore], ([$products]) => {
    return $products.find((p) => p.id === walletCardId) || null;
  });
</script>

<GiftCardDetails walletItem={$walletItem} product={null} />
