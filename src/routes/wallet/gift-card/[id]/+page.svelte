<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { walletItemsStore } from '@/stores/wallet-store';
  import { derived } from 'svelte/store';
  import { page } from '$app/state';

  let open = $state(true);
  let pin = $state('');
  let verified = $state(false);

  const walletCardId = page.params.id;

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    // Verify secret
    verified = true;
    console.log('PIN submitted:', pin);
  }

  const walletItem = derived([walletItemsStore], ([$products]) => {
    return $products.find((p) => p.id === walletCardId) || null;
  });
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
<div></div>
{/if}
  