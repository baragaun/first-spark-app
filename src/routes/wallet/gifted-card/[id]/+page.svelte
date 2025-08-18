<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { page } from '$app/state';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
  import { GiftCardProduct, type WalletItem } from '@baragaun/bg-node-client';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { m } from '@/paraglide/messages';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  let open = $state(false);
  let pin = $state('');
  let verified = $state(false);
  let walletItem = $state<WalletItem | undefined | null>(null);

  const transferSlug = page.params.id;

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    await acceptWalletItemTransfer();
    open = false;
  }

  async function acceptWalletItemTransfer() {
    if (!pin) return;
    const response = await marketplaceContext.acceptWalletItemTransfer(transferSlug, pin);
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

  async function declineWalletItemTransfer() {
    const response = await marketplaceContext.declineWalletItemTransfer(transferSlug);
    if (response.error) {
      console.error('Error verifying wallet item transfer:', response.error);
      return;
    }
    toast.success('You have declined the gift-card!');
  }

  async function loadWalletItem() {
    const response = await marketplaceContext.findWalletItemByTransferSlug(transferSlug);

    if (typeof response === 'string') {
      console.error('Failed to load wallet item:', response);
      return;
    }

    walletItem = response;
  }

  onMount(async () => {
    loadWalletItem();
  });
</script>

<!-- Header Bar -->
<div
  class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"
>
  <span class="text-lg font-bold"> {m['send_gift_card.received_gift_card']()}</span>

  {#if !verified}
    <div class="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        class="rounded-full hover:bg-background hover:text-nav-foreground/70"
        onclick={() => {
          open = true;
        }}
      >
        Accept
      </Button>
      <Button
        variant="outline"
        size="sm"
        class="rounded-full border-red-600 text-red-700 hover:bg-background hover:text-red-500"
        onclick={() => {
          declineWalletItemTransfer();
        }}
      >
        Decline
      </Button>
    </div>
  {/if}
</div>

<GiftCardDetails
  walletItem={walletItem ?? null}
  giftCardItem={null}
  showNavBar={false}
  hideActions={true}
  isVerified={verified}
/>

<Dialog bind:open>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Please enter your pin to accept it.</DialogTitle>
    </DialogHeader>

    <form class="space-y-4" onsubmit={handleSubmit}>
      <Input
        type="password"
        class="focus-visible:outline-none  focus-visible:ring-white"
        placeholder="Enter PIN/secret"
        bind:value={pin}
      />
      <Button type="submit" class="w-full">Submit</Button>
    </form>
  </DialogContent>
</Dialog>
