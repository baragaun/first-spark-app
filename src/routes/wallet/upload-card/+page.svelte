<script lang="ts">
  import { onMount } from 'svelte';
  import { uploadedCard } from '@/stores/uploaded-card';
  import { m } from '@/paraglide/messages';

  let brand = '';
  let balance = '';
  let barcode = '';
  let pin = '';
  let imageUrl: string | null = null;
  let isLoading = false;

  onMount(() => {
    uploadedCard.subscribe((data) => {
      brand = data.brand;
      balance = data.balance;
      barcode = data.barcode;
      pin = data.pin;
      imageUrl = data.imageUrl;
      isLoading = data.isLoading ?? false;
    });
  });

  function formatBarcodeInput(value: string) {
    return value
      .replace(/\s+/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  $: formattedBarcode = formatBarcodeInput(barcode);

  function handleBarcodeInput(event: Event) {
    const raw = (event.target as HTMLInputElement).value.replace(/\s+/g, '');
    barcode = raw;
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    // Handle submit logic here
    alert('Gift card submitted!');
  }
</script>

<div class="flex min-h-screen flex-col bg-background">
  <header class="flex items-center justify-between bg-foreground px-4 py-3 text-background">
    <button onclick={() => history.back()} class="text-background">←</button>
    <span class="text-lg font-semibold">{m['upload_card.title']()}</span>
    <div class="h-8 w-8 rounded-full bg-gray-200"></div>
  </header>

  <form
    class="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-8"
    onsubmit={handleSubmit}
  >
    {#if isLoading}
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
      <label for="brand" class="mb-1 block text-sm text-foreground">{brand}</label>
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
    <button
      type="submit"
      class="w-full rounded bg-foreground py-3 font-semibold text-background shadow"
    >
      {m['upload_card.submit']()}
    </button>
  </form>
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
