<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import SendGiftCardEmailForm from './send-gift-card-email-form.svelte';
  import SendGiftCardTextForm from './send-gift-card-text-form.svelte';
  import ShareGiftLinkForm from './share-gift-link-form.svelte';
  import type { PageData } from './$types';
  import { m } from '@/paraglide/messages';
  import { Button } from '@/components/ui/button';

  let { data }: { data: PageData } = $props();

  let sendGiftCardType: 'email' | 'sms' | 'share' | '' = $state('');
</script>

<div
  class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"
>
  <button
    onclick={() => (sendGiftCardType === '' ? history.back() : (sendGiftCardType = ''))}
    class="flex items-center"
  >
    <ArrowLeft class="h-6 w-6" />
  </button>
  <span class="flex-1 text-center text-lg font-bold">{m['send_gift_card.send_gift']()}</span>
</div>
{#if sendGiftCardType === ''}
  <div class="mx-auto mt-10 max-w-md rounded-xl bg-white px-6 py-6 shadow dark:bg-background">
    <div class="w-full max-w-md space-y-4">
      <p class="text-md">{m['send_gift_card.note']()}</p>
      <div class="space-y-3">
        <Button
          class="w-full rounded-full border border-foreground bg-background text-foreground"
          onclick={() => (sendGiftCardType = 'email')}>Send Email</Button
        >
        <Button
          class="w-full rounded-full border border-foreground bg-background text-foreground"
          onclick={() => (sendGiftCardType = 'sms')}>Send Text</Button
        >
        <Button
          class="w-full rounded-full bg-nav-foreground py-3 text-lg font-bold text-nav hover:bg-nav-foreground/90"
          onclick={() => (sendGiftCardType = 'share')}>Share Gift Link</Button
        >
      </div>
    </div>
  </div>
{/if}
<div class="flex h-full w-full items-center justify-center px-4">
  <div class="w-full max-w-md">
    {#if sendGiftCardType === 'email'}
      <SendGiftCardEmailForm data={{ form: data.emailForm, walletItemId: data.walletItemId ?? '' }} />
    {:else if sendGiftCardType === 'sms'}
      <SendGiftCardTextForm
        data={{ form: data.smsForm, walletItemId: data.walletItemId ?? '' }}
      />
    {:else if sendGiftCardType === 'share'}
      <ShareGiftLinkForm data={{ form: data.linkForm, walletItemId: data.walletItemId ?? '' }} />
    {/if}
  </div>
</div>
