<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import ChatList from './components/chat-thread-list.svelte';
  import { Channel } from '@baragaun/bg-node-client';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let channels = $state<Channel[]>([]);
  let isLoading = $state(true);

  onMount(async () => {
    isLoading = true;
    // Use the mock data from the layout
    setTimeout(() => {
      channels = data.channels;
      isLoading = false;
    }, 500);
  });

  const handleNewChat = () => {
    // This would open a dialog to select a contact
    goto('/contacts');
  };
</script>

<div class="container mx-auto max-w-4xl py-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Chats</h1>
    <Button onclick={handleNewChat}>New Chat</Button>
  </div>

  {#if isLoading}
    <div class="flex h-40 items-center justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  {:else}
    <ChatList threads={channels} />
  {/if}
</div>
