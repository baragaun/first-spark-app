<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import SendGiftCardForm from './send-gift-card-form.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div
  class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"
>
  <button onclick={() => history.back()} class="flex items-center">
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="flex-1 text-center text-lg font-semibold">Send Gift</span>
</div>
<div class="flex h-full w-full items-center justify-center px-4">
  <div class="w-full max-w-md">
    <SendGiftCardForm data={{ form: data.form, walletItemId: data.walletItemId ?? '' }} />
  </div>
</div>
