<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import ChatThreadList from './components/chat-thread-list.svelte';
  import { myChannelContext } from '@/contexts/my-channel-context.svelte';

  interface ChatThread {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: Date;
    unread: number;
  }

  let threads = $state<ChatThread[]>([]);
  let isLoading = $state(true);

  onMount(async () => {
    // Mock data for now - would be replaced with actual API call
    isLoading = true;
    setTimeout(() => {
      threads = [
        { id: '1', name: 'Alice Smith', lastMessage: 'Hey, how are you?', timestamp: new Date(), unread: 2 },
        { id: '2', name: 'Bob Johnson', lastMessage: 'Did you see the latest update?', timestamp: new Date(Date.now() - 3600000), unread: 0 },
        { id: '3', name: 'Carol Williams', lastMessage: 'Thanks for your help!', timestamp: new Date(Date.now() - 86400000), unread: 0 },
      ];
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
    <ChatThreadList {threads} />
  {/if}
</div>
