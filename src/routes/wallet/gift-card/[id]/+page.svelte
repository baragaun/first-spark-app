<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { walletItemsStore } from '@/stores/wallet-store';
  import { derived } from 'svelte/store';
  import { page } from '$app/state';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
  import { GiftCardProduct, type WalletItem } from '@baragaun/bg-node-client';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { giftCardImageDomain } from '@/constants';
  import placeholderImage from '../../../../assets/images/placeholder.png';
  import { m } from '@/paraglide/messages';
  import { ArrowLeft } from 'lucide-svelte';

  let open = $state(true);
  let pin = $state('');
  let verified = $state(false);
  let walletItem = $state<WalletItem | null>(null);

  const walletItemId = page.params.id;

  const product = new GiftCardProduct();
  product.imageSourceFront = 'landrys-1.jpg';
  product.name = '1-800 Baskets';

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

  function backAndClose(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    throw new Error('Function not implemented.');
  }
</script>

<!-- Header Bar -->
<div
  class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"
>
  <span class="text-lg font-bold"> {m['send_gift_card.received_gift_card']()}</span>

  <!-- Accept/Decline Buttons -->
  <div class="flex gap-2">
    <Button
      variant="default"
      size="sm"
      class="rounded-full"
      onclick={() => {
        // TODO: Implement accept logic
        console.log('Accept clicked');
      }}
    >
      Accept
    </Button>
    <Button
      variant="destructive"
      size="sm"
      class="rounded-full"
      onclick={() => {
        // TODO: Implement decline logic
        console.log('Decline clicked');
      }}
    >
      Decline
    </Button>
  </div>
</div>

<div>
  <div class="my-2 flex justify-center">
    <img
      src={giftCardImageDomain + '/giftcards/' + product?.imageSourceFront}
      alt={product?.name}
      class="aspect-[16/9] w-full max-w-md rounded-2xl object-contain shadow-lg"
      onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
    />
  </div>
  <header class="mb-6">
    <h1 class="mt-2 text-center text-2xl font-bold text-muted-foreground">{product?.name}</h1>
  </header>
</div>

<!-- {#if verified===false}
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
{/if} -->
