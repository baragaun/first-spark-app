<script lang="ts">
  import { goto } from '$app/navigation';
  import { AlertDialog } from 'bits-ui';
  import { onMount } from 'svelte';
  let imageUrl: string | null = 'https://d27wpajtnol6ce.cloudfront.net/giftcards/amazon-1.jpg';
  let brand = 'Amazon.com';
  let balance = '';
  let code = '';

  // Optionally, receive uploaded file via query param or store
  onMount(() => {
    // You can set imageUrl here if you pass it from the upload action
  });

  function handleSubmit(event: Event) {
    event.preventDefault();
    // Handle submit logic here
    alert('Gift card submitted!');
  }
</script>

<div class="flex min-h-screen flex-col bg-background">
  <header class="flex items-center justify-between bg-foreground px-4 py-3 text-background">
    <button onclick={() => history.back()} class="text-background">←</button>
    <span class="text-lg font-semibold">Upload Gift Card</span>
    <div class="h-8 w-8 rounded-full bg-gray-200"></div>
  </header>

  <form
    class="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-8"
    onsubmit={handleSubmit}
  >
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
      <label for="brand" class="mb-1 block text-sm text-gray-500">Brand</label>
      <label for="brand" class="mb-1 block text-sm text-foreground">{brand}</label>
      <!-- <input id="brand" class="w-full rounded border px-3 py-2" bind:value={brand} placeholder="Amazon.com" /> -->
    </div>
    <div class="mb-4 w-full">
      <label for="balance" class="mb-1 block text-sm text-gray-500">Balance</label>
      <input
        id="balance"
        class="w-full rounded border px-3 py-2"
        bind:value={balance}
        placeholder="Balance"
      />
    </div>
    <div class="mb-6 w-full">
      <label for="code" class="mb-1 block text-sm text-gray-500">Code</label>
      <input
        id="code"
        class="w-full rounded border px-3 py-2"
        bind:value={code}
        placeholder="Code"
      />
    </div>
    <button
      type="submit"
      class="w-full rounded bg-foreground py-3 font-semibold text-background shadow">SUBMIT</button
    >
  </form>
</div>
