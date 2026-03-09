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
  import { getMarketplaceData, loadMarketplaceData } from '@/stores/marketplace-store.svelte';
  import { giftCardImageDomain } from '$lib/constants';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { toast } from 'svelte-sonner';

  // Get reactive store values
  const uploadedCard = uploadedCardGetValues();

  // Create local state for editable fields
  let brandName = $state('');
  let balance = $state(0.0);
  let barcode = $state('');
  let pin = $state('');
  let imageUrl = $state('');
  let frontImage = $state('');
  let backImage = $state('');
  let loading = $state(false);
  let uploadedBrand = $state<Brand | null>(null);
  let uploadedProduct = $state<GiftCardProduct | null>(null);
  let brands = $state<Brand[]>([]);
  let products = $state<GiftCardProduct[]>([]);
  let showSuccessDialog = $state(false);

  // Sync local state with store values whenever they change
  $effect(() => {
    brandName = uploadedCard.brandName;
    balance = uploadedCard.balance;
    barcode = uploadedCard.barcode;
    pin = uploadedCard.pin;
    imageUrl = uploadedCard.imageUrl;
    frontImage = uploadedCard.frontImage;
    backImage = uploadedCard.backImage;
    loading = uploadedCard.loading;
    uploadedBrand = uploadedCard.uploadedBrand;
    uploadedProduct = uploadedCard.uploadedProduct;
  });

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

  function handleBalanceInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value;
    balance = Number(raw);
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    await loadData();

    if (!brandName) {
      return toast.error('No brand name found');
    }

    let matchedProduct = undefined;
    if (brandName) {
      const cleanSearchText = brandName.trim().toLowerCase();
      matchedProduct = products.find((product) => {
        const productBrand = brands.find((brand) => brand.id === product.brandId);
        return productBrand && productBrand.name.toLowerCase().includes(cleanSearchText);
      });
    }

    // fallback to uploadedProduct if not found
    if (!matchedProduct) {
      return toast.error('No matching product found');
    }

    const balanceInDollar = balance * 1000;
    const newWalletItem = new WalletItem();
    newWalletItem.name = brandName ?? '';
    newWalletItem.pin = pin;
    newWalletItem.balance = balanceInDollar;
    newWalletItem.initialBalance = balanceInDollar;
    newWalletItem.price = balanceInDollar;
    newWalletItem.hasBarcode = true;
    newWalletItem.imageSourceFront = matchedProduct?.imageSourceFront;
    newWalletItem.brandId = matchedProduct?.brandId ?? '';
    newWalletItem.productId = matchedProduct?.id ?? '';
    newWalletItem.walletId = myUserContext.myUserId ?? '';
    newWalletItem.productType = ProductType.giftCard;
    newWalletItem.instructionsEn = matchedProduct?.instructionsEn;
    newWalletItem.instructionsUrl = matchedProduct?.instructionsUrl;
    newWalletItem.termsEn = matchedProduct?.termsEn;
    newWalletItem.termsUrl = matchedProduct?.termsUrl;

    const response = await marketplaceContext.createWalletItem(newWalletItem);
    if (response.error) {
      console.error('Error updating giftcard', response.error);
      toast.error(`Failed to update giftcard: ${response.error}`);
      return;
    }
    showSuccessDialog = true;
  }

  const loadData = async () => {
    if (getMarketplaceData().products.length > 0) {
      const data = getMarketplaceData();
      brands = data.brands;
      products = data.products;
      return;
    }
    await loadMarketplaceData().catch(console.error);
    const data = getMarketplaceData();
    brands = data.brands;
    products = data.products;
  };
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

    {#if frontImage || backImage}
      <div class="mb-6 flex gap-3">
        {#if frontImage}
          <div class="overflow-hidden rounded-xl shadow">
            <img src={frontImage} alt="Front" class="h-32 w-48 object-cover" />
            <p class="bg-muted/50 py-1 text-center text-xs text-muted-foreground">
              {m['upload_card.step_front']()}
            </p>
          </div>
        {/if}
        {#if backImage}
          <div class="overflow-hidden rounded-xl shadow">
            <img src={backImage} alt="Back" class="h-32 w-48 object-cover" />
            <p class="bg-muted/50 py-1 text-center text-xs text-muted-foreground">
              {m['upload_card.step_back']()}
            </p>
          </div>
        {/if}
      </div>
    {:else if imageUrl}
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
