<script lang="ts">
  import { page } from '$app/state';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
</script>

<GiftCardDetails productId={page.params.id} />
