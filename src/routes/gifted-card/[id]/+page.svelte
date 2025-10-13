<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { page } from '$app/state';
  import GiftCardDetails from '@/components/shared/gift-card-details.svelte';
  import {
    Brand,
    GiftCardProduct,
    type WalletItem,
    WalletItemTransferRecipientInfo,
  } from '@baragaun/bg-node-client';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { m } from '@/paraglide/messages';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { logger } from '@/utils/logger';
  import { downloadPdf } from '@/utils/pdf-utils';

  let open = $state(false);
  let showPasswordModal = $state(false);
  let showVerifyPasswordModal = $state(false);
  let password = $state('');
  let showCongratsModal = $state(false);
  let showDeleteWarning = $state(false);
  let showDeleteDialog = $state(false);
  let pin = $state('');
  let verified = $state(false);
  let isLoading = $state(false);
  let acceptedWalletItem = $state<WalletItem | undefined>(undefined);
  let product = $state<GiftCardProduct | undefined>(undefined);
  let brand = $state<Brand | undefined>(undefined);
  let walletItemTransferRecipientInfo = $state<WalletItemTransferRecipientInfo | undefined>(
    undefined,
  );
  let isGiftCardAlreadyAccepted = $state(false);
  let isRememberPin = $state(true);
  let isGiftCardDeclined = $state(false);

  const transferSlug = page.params.id;

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    // Save PIN locally if "Remember pin" is checked
    if (isRememberPin && pin) {
      localStorage.setItem(`gifted_card_pin_${transferSlug}`, pin);
    }

    await acceptWalletItemTransfer();
    open = false;
  }

  async function acceptWalletItemTransfer() {
    if (!pin) return;
    isLoading = true;
    const response = await marketplaceContext.acceptWalletItemTransfer(transferSlug, pin);

    if (response.error) {
      logger.error('Error verifying wallet item transfer', response.error);
      return;
    }

    if (!response.object) {
      logger.error('Error verifying wallet item transfer: no object');
      return;
    }

    acceptedWalletItem = response.object;
    verified = true;
    isLoading = false;
    showCongratsModal = true;
    pin = '';
  }

  async function declineWalletItemTransfer() {
    const response = await marketplaceContext.declineWalletItemTransfer(transferSlug);
    if (response.error) {
      logger.error('Error verifying wallet item transfer', response.error);
      return;
    }
    toast.success(m['gifted_card.decline_success']());
  }

  async function loadData() {
    isLoading = true;

    // Check if PIN is saved locally and auto-fill it
    const savedPin = localStorage.getItem(`gifted_card_pin_${transferSlug}`);
    if (savedPin) {
      pin = savedPin;
    }
    if (password) {
      pin = password;
    }

    try {
      const response = await marketplaceContext.findWalletItemTransferRecipientInfoByTransferSlug(
        transferSlug,
        pin,
      );
      if (typeof response === 'string' || response === null) {
        isLoading = false;
        isGiftCardAlreadyAccepted = true;
        logger.error('Failed to load wallet item', response);
        return;
      }

      if (response.walletItem.pin) {
        verified = true;
      }

      if (response?.product === null || response?.product === undefined) {
        isGiftCardAlreadyAccepted = true;
        isLoading = false;
        showVerifyPasswordModal = true;
        return;
      }

      if (response.walletItem.transferAcceptedAt) {
        isGiftCardAlreadyAccepted = true;
      }

      if (response.walletItemTransfer.declinedAt) {
        isGiftCardDeclined = true;
      }

      walletItemTransferRecipientInfo = response;
      product = walletItemTransferRecipientInfo?.product ?? undefined;
      brand = walletItemTransferRecipientInfo?.brand ?? undefined;

      isLoading = false;
    } catch (error) {
      logger.error('Error loading wallet items', error);
    }
  }

  onMount(async () => {
    await loadData();
  });

  function handlePrintPdf() {
    if (!acceptedWalletItem || !acceptedWalletItem.code || !acceptedWalletItem.pin) return;
    downloadPdf(acceptedWalletItem, acceptedWalletItem.code, acceptedWalletItem.pin);
  }

  async function setPassword() {
    if (!password) return;
    const response = await marketplaceContext.updateWalletItemTransferPassword(
      transferSlug,
      pin,
      password,
    );
    if (response.error) {
      logger.error('Error updating wallet item transfer password', response.error);
      return;
    }
    toast.success('Password set successfully');
    showPasswordModal = false;
  }

  async function verifyPassword() {
    if (!password) return;
    try {
      const response = await marketplaceContext.verifyWalletItemTransferPassword(
        transferSlug,
        password,
      );
      if (response.object === false) {
        toast.error('Invalid Password');
        logger.error('Error verifying wallet item transfer password', response.error);
        return;
      }
      toast.success('Password verified successfully');
      showVerifyPasswordModal = false;
      await loadData();
    } catch (error) {
      logger.error('Error verifying wallet item transfer password', error);
      return;
    }
  }

  async function deletePage() {
    if (!pin) return;
    const response = await marketplaceContext.updateWalletItemTransferShowOnlineFlag(
      transferSlug,
      pin,
      false,
    );

    if (response.error) {
      logger.error('Error updating wallet item transfer', response.error);
      return;
    }
    showDeleteWarning = false;
    showDeleteDialog = false;
    showCongratsModal = false;
  }
</script>

{#if isGiftCardDeclined} 
<div class="flex h-[60vh] flex-col items-center justify-center">
  <span class="px-8 text-center text-lg font-bold text-primary">
    {m['gifted_card.gift_card_declined_message']()}
  </span>
</div>
{:else if isGiftCardAlreadyAccepted && !verified}
  <div class="mt-2 flex justify-end gap-2 px-2">
    <Button
      variant="outline"
      size="sm"
      class="rounded-full hover:bg-background hover:text-nav-foreground/70"
      onclick={() => {
        showCongratsModal = true;
      }}>Secure your card</Button
    >
    <Button
      variant="outline"
      size="sm"
      class="rounded-full hover:bg-background hover:text-nav-foreground/70"
      onclick={() => {
        showVerifyPasswordModal = true;
      }}>Access your card</Button
    >
  </div>
  <div class="flex h-[60vh] flex-col items-center justify-center">
    <span class="px-8 text-center text-lg font-bold text-primary">
      {m['gifted_card.already_accepted_message']()}
    </span>
  </div>
{:else}
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
          }}>{m['gifted_card.accept']()}</Button
        >
        <Button
          variant="outline"
          size="sm"
          class="rounded-full border-red-600 text-red-700 hover:bg-background hover:text-red-500"
          onclick={() => {
            declineWalletItemTransfer();
          }}>{m['gifted_card.decline']()}</Button
        >
      </div>
    {:else}
      <Button
        variant="outline"
        size="sm"
        class="rounded-full hover:bg-background hover:text-nav-foreground/70"
        onclick={() => {
          showCongratsModal = true;
        }}>Secure your card</Button
      >
    {/if}
  </div>

  {#if isLoading}
    <div class="flex h-[60vh] items-center justify-center">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
      ></div>
    </div>
  {/if}

  {#if product && brand}
    <GiftCardDetails
      walletItem={acceptedWalletItem ?? walletItemTransferRecipientInfo?.walletItem}
      {product}
      {brand}
      showNavBar={false}
      hideActions={true}
      isVerified={verified}
    />
  {/if}
{/if}

<Dialog bind:open>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{m['gifted_card.modal_title']()}</DialogTitle>
    </DialogHeader>

    <form class="space-y-4" onsubmit={handleSubmit}>
      <Input
        type="password"
        class="focus-visible:outline-none  focus-visible:ring-white"
        placeholder={m['gifted_card.pin_placeholder']()}
        bind:value={pin}
      />
      <div class="flex items-center gap-2"></div>
      <!-- Add checkbox to remember pin -->
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={isRememberPin} />
        Remember pin
      </label>
      <Button type="submit" class="w-full">{m['gifted_card.submit']()}</Button>
    </form>
  </DialogContent>
</Dialog>

<!-- Congratulations Modal -->
<Dialog open={showCongratsModal} onOpenChange={(e) => (showCongratsModal = e)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Congratulations!</DialogTitle>
    </DialogHeader>
    <div class="space-y-2">
      <div class="text-lg font-semibold">
        This is your card now. You can print it out, or you can come back here to use it.
      </div>
      <div class="mt-4 text-base font-bold">Secure Your Card!</div>
      <div class="text-sm text-muted-foreground">
        This card is now like cash at the store and anyone with this link can use it. You can
        protect this page with a password, or first print the card, then delete this page.
      </div>
    </div>
    <div class="mt-6 flex flex-col gap-2">
      <Button class="w-full" onclick={handlePrintPdf}>Print Card</Button>
      <Button
        class="w-full"
        variant="outline"
        onclick={() => {
          showPasswordModal = true;
        }}>Enter Password</Button
      >
      <Button class="w-full" variant="destructive" onclick={() => (showDeleteWarning = true)}
        >Delete Page</Button
      >
    </div>
  </DialogContent>
</Dialog>

<!-- Password Modal -->
<Dialog open={showPasswordModal} onOpenChange={(e) => (showPasswordModal = e)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Protect Your Card</DialogTitle>
    </DialogHeader>
    <form class="space-y-4" onsubmit={setPassword}>
      <Input
        type="password"
        class="focus-visible:outline-none focus-visible:ring-white"
        placeholder="Enter a secret code to save the password"
        bind:value={pin}
      />
      <Input
        type="password"
        class="focus-visible:outline-none focus-visible:ring-white"
        placeholder="Enter a password to protect this page"
        bind:value={password}
      />
      <Button type="submit" class="w-full">Set Password</Button>
    </form>
  </DialogContent>
</Dialog>

<!-- Verify password Modal -->
<Dialog open={showVerifyPasswordModal} onOpenChange={(e) => (showVerifyPasswordModal = e)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Verify Your Password</DialogTitle>
    </DialogHeader>
    <form class="space-y-4" onsubmit={verifyPassword}>
      <Input
        type="password"
        class="focus-visible:outline-none focus-visible:ring-white"
        placeholder="Enter a password to protect this page"
        bind:value={password}
      />
      <Button type="submit" class="w-full">Verify Password</Button>
    </form>
  </DialogContent>
</Dialog>

<!-- Delete Warning Modal -->
<Dialog open={showDeleteWarning} onOpenChange={(e) => (showDeleteWarning = e)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete Page?</DialogTitle>
    </DialogHeader>
    <div class="space-y-2">
      <div class="text-base">
        Did you already print out or copy this card? Once you delete this page, the card will no
        longer be available at this location.
      </div>
    </div>
    <div class="mt-6 flex flex-col gap-2">
      <Button class="w-full" variant="outline" onclick={() => (showDeleteWarning = false)}
        >Cancel</Button
      >
      <Button class="w-full" variant="destructive" onclick={() => (showDeleteDialog = true)}
        >Delete Page</Button
      >
    </div>
  </DialogContent>
</Dialog>

<!-- Delete Dialog -->
<Dialog open={showDeleteDialog} onOpenChange={(e) => (showDeleteDialog = e)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete Your Page</DialogTitle>
    </DialogHeader>
    <form class="space-y-4" onsubmit={setPassword}>
      <Input
        type="password"
        class="focus-visible:outline-none focus-visible:ring-white"
        placeholder="Enter a secret code to delete the page"
        bind:value={pin}
      />
      <Button variant="destructive" class="w-full" onclick={deletePage}>Delete</Button>
    </form>
  </DialogContent>
</Dialog>
