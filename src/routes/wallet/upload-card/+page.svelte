<script lang="ts">
  import { onMount } from 'svelte';
  import { uploadedCardGetValues } from '@/stores/uploaded-card.svelte';
  import { m } from '@/paraglide/messages';
  import { Button } from '@/components/ui/button';
  import { ArrowLeft } from 'lucide-svelte';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';
  import { goto } from '$app/navigation';
  import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
  import { WalletItem, Brand, GiftCardProduct, ProductType } from '@baragaun/bg-node-client';
  import { toast } from 'svelte-sonner';
  import { giftCardImageDomain } from '$lib/constants';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  let { brandName, balance, barcode, pin, imageUrl, loading, uploadedBrand, uploadedProduct } =
    $state(uploadedCardGetValues());
  let showSuccessDialog = $state(false);

  onMount(() => {
    if (uploadedProduct !== null) {
      imageUrl = giftCardImageDomain + '/giftcards/' + uploadedProduct?.imageSourceFront;
    }
  });

  function formatBarcodeInput(value: string) {
    return value
      .replace(/\s+/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  let formattedBarcode = $derived(formatBarcodeInput(barcode));

  function handleBarcodeInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value.replace(/\s+/g, '');
    barcode = raw;
  }

  function sanitizePriceInput(value: string): string {
    const stripped = value.replace(/[^\d.]/g, '');
    if (stripped === '') return '';
    const parts = stripped.split('.');
    const whole = parts[0];
    const decimals = parts.slice(1).join('');
    let result = whole.replace(/^0+(?=\d)/, '');
    if (result === '') result = '0';
    if (stripped.includes('.')) {
      result = result + '.' + decimals.slice(0, 2);
    }
    if (result === '.') result = '0.';
    return result;
  }

  function handleBalanceInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value;
    balance = sanitizePriceInput(raw);
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const balanceInDollar = +balance * 1000;
    const newWalletItem = new WalletItem();
    newWalletItem.name = uploadedBrand?.name ?? '';
    newWalletItem.pin = pin;
    newWalletItem.balance = balanceInDollar;
    newWalletItem.initialBalance = balanceInDollar;
    newWalletItem.price = balanceInDollar;
    newWalletItem.hasBarcode = true;
    newWalletItem.imageSourceFront = uploadedProduct?.imageSourceFront;
    newWalletItem.brandId = uploadedBrand?.id ?? '';
    newWalletItem.productId = uploadedProduct?.id ?? '';
    newWalletItem.walletId = myUserContext.myUserId ?? '';
    newWalletItem.productType = ProductType.giftCard;
    newWalletItem.instructionsEn = uploadedProduct?.instructionsEn;
    newWalletItem.instructionsUrl = uploadedProduct?.instructionsUrl;
    newWalletItem.termsEn = uploadedProduct?.termsEn;
    newWalletItem.termsUrl = uploadedProduct?.termsUrl;

    const response = await marketplaceContext.createWalletItem(newWalletItem);
    if (response.error) {
      console.error('Error updating giftcard', response.error);
      toast.error(`Failed to update giftcard: ${response.error}`);
      return;
    }
    showSuccessDialog = true;
  }
</script>

<div class="flex min-h-screen flex-col bg-background">
  <div
    class="sticky top-0 z-10 flex items-center justify-between bg-nav px-4 py-3 text-nav-foreground shadow"
  >
    <button onclick={() => history.back()} class="flex items-center">
      <ArrowLeft class="h-6 w-6" />
    </button>
    <span class="flex-1 text-center text-lg font-bold">{m['upload_card.title']()}</span>
  </div>

  <form
    class="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-8"
    onsubmit={handleSubmit}
  >
    {#if loading}
      <div class="mb-6 flex w-full items-center justify-center">
        <span class="loader mr-2"></span> <span>{m['upload_card.loading']()}</span>
      </div>
    {/if}

    {#if imageUrl}
      <img src={imageUrl} alt="Gift Card" class="mb-6 w-64 rounded-xl shadow" />
    {:else}
      <div
        class="mb-6 flex h-40 w-64 items-center justify-center rounded-xl bg-gray-100 text-4xl text-gray-400"
      >
        ?
      </div>
    {/if}
    <div class="mb-4 w-full">
      <label for="brand" class="mb-1 block text-sm text-gray-500">{m['upload_card.brand']()}</label>
      <label for="brand" class="mb-1 block text-sm text-foreground"
        >{uploadedBrand?.name ?? brandName}</label
      >
      <!-- <input id="brand" class="w-full rounded border px-3 py-2" bind:value={brand} placeholder="Amazon.com" /> -->
    </div>
    <div class="mb-4 w-full">
      <label for="balance" class="mb-1 block text-sm text-gray-500"
        >{m['upload_card.balance']()}</label
      >
      <input
        id="balance"
        class="w-full rounded border px-3 py-2"
        bind:value={balance}
        placeholder="Balance"
        inputmode="decimal"
        oninput={handleBalanceInput}
      />
    </div>
    <div class="mb-6 w-full">
      <label for="code" class="mb-1 block text-sm text-gray-500">{m['upload_card.barcode']()}</label
      >
      <input
        id="code"
        class="w-full rounded border px-3 py-2 font-mono tracking-widest"
        value={formattedBarcode}
        oninput={handleBarcodeInput}
        placeholder="Barcode"
      />
    </div>
    <div class="mb-6 w-full">
      <label for="code" class="mb-1 block text-sm text-gray-500">{m['upload_card.pin']()}</label>
      <input id="code" class="w-full rounded border px-3 py-2" bind:value={pin} placeholder="Pin" />
    </div>
    <Button
      variant="default"
      class="w-full rounded py-3 font-semibold shadow"
      onclick={handleSubmit}
    >
      {m['upload_card.submit']()}
    </Button>
  </form>

  <AlertDialog open={showSuccessDialog}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{m['upload_card.upload_success_title']()}</AlertDialogTitle>
        <AlertDialogDescription>{m['upload_card.upload_success_message']()}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction
          onclick={() => {
            showSuccessDialog = false;
            goto('/wallet');
          }}
        >
          {m['cart.okay']()}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>

<style>
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #6366f1;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    animation: spin 1s linear infinite;
    display: inline-block;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
