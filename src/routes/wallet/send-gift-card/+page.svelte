<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import SendGiftForm from './send-gift-form.svelte';

  let senderName = '';
  let senderEmail = '';
  let message = '';
  let submitted = false;

  function handleSubmit() {
    submitted = true;
    // Add your submit logic here
  }
</script>

<div class="flex h-full w-full items-center justify-center px-4">
  <div class="w-full max-w-md">
    <SendGiftForm />
  </div>
</div>

<!-- <div
  class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"
>
  <button onclick={() => history.back()} class="flex items-center">
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="flex-1 text-center text-lg font-semibold">Send Gift</span>
</div>
<div class="max-w-md mx-auto mt-10 bg-white dark:bg-background p-6 rounded-xl shadow">
  <h1 class="text-2xl font-bold mb-6 text-center">Send Gift</h1>
  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1" for="senderName">Sender Name</label>
      <input
        id="senderName"
        type="text"
        bind:value={senderName}
        class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        required
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1" for="senderEmail">Sender Email</label>
      <input
        id="senderEmail"
        type="email"
        bind:value={senderEmail}
        class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        required
      />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1" for="message">Message</label>
      <textarea
        id="message"
        bind:value={message}
        class="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        rows="4"
      ></textarea>
    </div>
    <button
      type="submit"
      class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      Send Gift
    </button>
    {#if submitted}
      <p class="text-green-600 text-center mt-2">Gift sent!</p>
    {/if}
  </form>
</div> -->
