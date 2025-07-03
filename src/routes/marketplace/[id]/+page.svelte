<script lang="ts">
  import { page } from '$app/state';
  import { derived } from 'svelte/store';
  import { giftCardProductsStore, dataLoaded } from '$lib/stores/marketplace-store';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
  const giftCardId = page.params.id;

  const giftCardItem = derived([giftCardProductsStore, dataLoaded], ([$products, $loaded]) => {
    if (!$loaded) return null;
    return $products.find((p) => p.id === giftCardId) || null;
  });
</script>

<GiftCardDetails walletItem={null} giftCardItem={$giftCardItem} />
