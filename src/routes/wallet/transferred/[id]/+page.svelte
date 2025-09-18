<script lang="ts">
  import { page } from '$app/state';
  import { m } from '@/paraglide/messages';
  import { Button } from '$lib/components/ui/button';
  import placeholderImage from '../../../../assets/images/placeholder.png';
  import { ExternalLink, Archive, ShoppingBag, User, ArrowLeft, X } from 'lucide-svelte';
  import { giftCardImageDomain } from '@/constants';
  import { onMount } from 'svelte';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import {
    getWalletItemsStore,
    getWalletItemTransfersStore,
    loadWalletItems,
    loadWalletItemTransfers,
    updateWalletItem,
  } from '@/stores/wallet-store.svelte';
  import type { WalletItemTransfer } from '@baragaun/bg-node-client';

  // Get wallet item by id from store
  const walletItemId = page.params.id;
  let loading = $state(false);
  let walletItem = $state(getWalletItemsStore().find((p) => p.id === walletItemId));
  let walletItemTransfer: WalletItemTransfer | undefined | null = $state(null);

  onMount(async () => {
    if (!walletItem) {
      loading = true;
      loadWalletItems().then(() => {
        walletItem = getWalletItemsStore().find((p) => p.id === walletItemId);
        loading = false;
      });
    }
    loadWalletItemTransfers().then(() => {
      walletItemTransfer = getWalletItemTransfersStore().find(
      (walletItemTransfer) => walletItemTransfer.walletItemId === walletItemId,
    );
    });
  });

  function formatDateTime(dateString: string | undefined) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('en-US') +
      ' ' +
      date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    );
  }

  async function archiveWalletItem() {
    if (!walletItem) {
      console.error('No wallet item found to archive.');
      return;
    }

    try {
      await marketplaceContext.archiveWalletItem(walletItemId, !walletItem?.archivedAt);
      updateWalletItem(walletItem);
    } catch (error) {
      console.error('Error archiving wallet item:', error);
      // todo: show user error
    }
  }

  async function declineWalletItemTransfer() {
    if (!walletItemTransfer) {
      console.error('No wallet item found to decline.');
      return;
    }

    if (!walletItemTransfer.transferSlug) {
      console.error('The wallet item transfer has no transferSlug.');
      return;
    }

    try {
      const walletItemTransferResult = await marketplaceContext.declineWalletItemTransfer(
        walletItemTransfer.transferSlug,
      );

      if (walletItemTransferResult.error) {
        console.error('Error declining wallet item transfer:', walletItemTransferResult.error);
      }
    } catch (error) {
      console.error('Error declining wallet item transfer:', error);
      // todo: show user error
    }

    history.back();
  }

  const handleImageError = (node: HTMLImageElement) => {
    const onError = (e: Event) => {
      (e.currentTarget as HTMLImageElement).src = placeholderImage;
    };

    node.addEventListener('error', onError);

    return {
      destroy() {
        node.removeEventListener('error', onError);
      },
    };
  };
</script>

<div
  class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"
>
  <button onclick={() => history.back()} class="flex items-center">
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="flex-1 text-center text-lg font-semibold">{m['wallet.gift-card.title']()}</span>
</div>
{#if loading || !walletItem}
  <div class="flex h-[60vh] items-center justify-center">
    <div
      class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
    ></div>
  </div>
{:else if walletItem}
  <div class="mx-auto max-w-2xl px-4 py-6">
    <!-- Gift Card Image -->
    <div class="my-2 flex justify-center">
      <img
        src={giftCardImageDomain + '/giftcards/' + walletItem.imageSourceFront}
        alt={walletItem.name}
        class="aspect-[16/9] w-full max-w-md rounded-2xl object-contain shadow-lg"
        use:handleImageError
      />
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 border-b bg-gray-50 px-4 py-1">
      <div class="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          href={walletItem.termsUrl}
          target="_blank"
          rel="noopener noreferrer"><ExternalLink aria-label="Brand" /></Button
        >
        <span class="text-xs text-gray-500">{m['wallet.gift-card.brand']()}</span>
      </div>
      <div class="flex flex-col items-center">
        <Button variant="ghost" size="icon" onclick={archiveWalletItem}
          ><Archive aria-label="Archive" /></Button
        >
        <span class="text-xs text-gray-500"
          >{walletItem.archivedAt
            ? m['wallet.gift-card.unarchive']()
            : m['wallet.gift-card.archive']()}</span
        >
      </div>
      {#if !walletItem?.transferAcceptedAt}
        <div class="flex flex-col items-center">
          <Button variant="ghost" size="icon" onclick={declineWalletItemTransfer}>
            <X aria-label="Close" />
          </Button>
          <span class="text-xs text-gray-500">{m['setting.buttons.cancel']()}</span>
        </div>
      {/if}

      <span class="ml-2 flex flex-grow items-center justify-end gap-2">
        <span class="rounded border px-2 py-0.5 text-xs text-gray-600"
          >{m['wallet.gifted.active']()}</span
        >
        <span class="rounded border bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
          >{walletItem?.transferAcceptedAt
            ? m['wallet.gifted.gifted']()
            : m['order_history.processing']()}</span
        >
      </span>
    </div>

    <br />

    <div class="mb-8">
      <div class="mb-2 flex items-center">
        <User size={24} color="#005f61" />
        <span class="pl-2 text-lg font-semibold text-muted-foreground"
          >{m['wallet.gifted.recipient_details']()}</span
        >
      </div>
      <div class="text-sm text-muted-foreground">{m['wallet.gifted.name']()}</div>
      <div class="mb-2 font-bold">{walletItemTransfer?.recipientFullName}</div>
      <div class="text-sm text-muted-foreground">{m['wallet.gifted.email']()}</div>
      <div class="mb-2 break-all font-bold">{walletItemTransfer?.recipientEmail}</div>
      <div class="text-sm text-muted-foreground">{m['wallet.gifted.message']()}</div>
      <div class="mb-2 break-all font-bold">{walletItemTransfer?.messageText}</div>
      <div class="text-sm text-muted-foreground">{m['wallet.gifted.date_sent']()}</div>
      <div class="mb-2 break-all font-bold">
        {formatDateTime(walletItem.transferStartedAt ?? '')}
      </div>
    </div>

    <!-- How To Redeem -->
    <div class="mb-2 mt-6 text-lg font-semibold text-gray-700">
      {m['wallet.gift-card.how_to_redeem']()}
    </div>
    <div class="mb-4 text-sm text-gray-600">{walletItem.instructionsEn}</div>
    <!-- Terms And Conditions -->
    <div class="mb-2 text-lg font-semibold text-gray-700">
      {m['wallet.gift-card.terms_and_conditions']()}
    </div>
    <div class="mb-4 text-sm text-gray-600">{walletItem.termsEn}</div>
    <div class="mb-8">
      <div class="mb-2 flex items-center">
        <ShoppingBag size={24} color="#005f61" />
        <span class="pl-2 text-lg font-semibold text-muted-foreground"
          >{m['order_history.order']()}</span
        >
      </div>
      <div class="mb-1 text-lg font-semibold">{walletItem.purchaseOrderItemId}</div>
      <div class="text-sm text-muted-foreground">{m['order_history.purchase_date']()}</div>
      <div class="mb-2 font-bold">{formatDateTime(walletItem.createdAt)}</div>
      <div class="text-sm text-muted-foreground">{m['order_history.reference_id']()}</div>
      <div class="mb-2 break-all font-bold">{walletItem.id}</div>
    </div>
  </div>

{:else}
  <div class="py-12 text-center text-muted-foreground">
    {m['wallet.gifted.no_items_found']()}
  </div>
{/if}
