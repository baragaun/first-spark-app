<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { walletItemsStore } from '@/stores/wallet-store';
  import { derived } from 'svelte/store';
  import { page } from '$app/state';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
  import type { WalletItem } from '@baragaun/bg-node-client';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';

  let open = $state(true);
  let pin = $state('');
  let verified = $state(false);
  let walletItem = $state<WalletItem | null>(null);

  const walletItemId = page.params.id;

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    await verifyWalletItemTransfer();
  }

  async function verifyWalletItemTransfer() {
    if (!pin) return;
    const response = await marketplaceContext.verifyWalletItemTransfer(walletItemId, pin);
    if (response.error) {
      console.error('Error verifying wallet item transfer:', response.error);
      return;
    }
    if (!response.object) {
      console.error('Error verifying wallet item transfer: no object');
      return;
    }

    walletItem = response.object;
    verified = true;
  }

</script>

{#if verified===false}
<Dialog bind:open>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>
        Hey, You have received a giftcard please enter your pin to accept it.
      </DialogTitle>
    </DialogHeader>

    <form class="space-y-4" onsubmit={handleSubmit}>
      <Input type="password" placeholder="Enter PIN/secret" bind:value={pin} />
      <Button type="submit" class="w-full">Submit</Button>
    </form>
  </DialogContent>
</Dialog>
{:else}
<GiftCardDetails walletItem={walletItem} giftCardItem={null} />
{/if}
