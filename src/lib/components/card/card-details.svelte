<script lang="ts">
  import type { WalletItem } from '@baragaun/bg-node-client';
  import placeholderImage from '../../../assets/images/placeholder.png';
  import Button from '../ui/button/button.svelte';
  import {
    Archive,
    ArrowLeft,
    ExternalLink,
    Gift,
    Link,
    LucideFolderOpen,
    Move,
    MoveUpLeft,
    Printer,
    Share,
  } from 'lucide-svelte';

  let activeTab = $state<string>('use');

  interface Props {
    item: WalletItem;
    onBack?: () => void;
  }

  let { item, onBack }: Props = $props();
</script>

{#if onBack}
  <div class="m-4">
    <Button variant="ghost" size="icon" onclick={onBack}><ArrowLeft /></Button>
  </div>
{/if}
<div class="mx-auto w-full overflow-hidden rounded-xl bg-white">
  <img
    src={'https://d27wpajtnol6ce.cloudfront.net/giftcards/' + item.imageSourceFront}
    alt={item.name}
    class="h-60 w-full bg-gray-100 object-cover object-center"
    onerror={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImage)}
  />

  <!-- Icon Button Group -->
  <div class="flex items-center border-b bg-gray-50 px-4 py-2">
    <Button variant="ghost" size="icon" onclick={onBack}><Gift aria-label="Gift" /></Button>
    <Button variant="ghost" size="icon" onclick={onBack}><ExternalLink aria-label="Brand" /></Button
    >
    <Button variant="ghost" size="icon" onclick={onBack}><Printer aria-label="Print" /></Button>
    <Button variant="ghost" size="icon" onclick={onBack}><Archive aria-label="Archive" /></Button>

    <span class="ml-2 flex flex-grow items-center justify-end">
      <span
        class={`mr-1 inline-block h-3 w-3 rounded-full ${item.archivedAt ? 'bg-red-500' : 'bg-green-500'}`}
      ></span>
      <span class="text-xs text-gray-500">{item.archivedAt ? 'Archived' : 'Active'}</span>
    </span>
  </div>

  <!-- Tabs -->
  <div class="px-4 pt-2">
    <div class="mb-2 flex border-b">
      <button
        class="flex-1 py-2 text-sm font-medium focus:outline-none"
        class:bg-blue-100={activeTab === 'use'}
        onclick={() => (activeTab = 'use')}>Use</button
      >
      <button
        class="flex-1 py-2 text-sm font-medium focus:outline-none"
        class:bg-blue-100={activeTab === 'info'}
        onclick={() => (activeTab = 'info')}>Info</button
      >
      <button
        class="flex-1 py-2 text-sm font-medium focus:outline-none"
        class:bg-blue-100={activeTab === 'brand'}
        onclick={() => (activeTab = 'brand')}>Brand</button
      >
    </div>
    {#if activeTab === 'use'}
      <div class="py-2 text-sm">Use tab content here.</div>
    {:else if activeTab === 'info'}
      <div class="py-2 text-sm">Info tab content here.</div>
    {:else}
      <div class="py-2 text-sm">Brand tab content here.</div>
    {/if}
  </div>
</div>
