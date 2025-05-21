<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import ChatList from './components/chat-list.svelte';
  import ChatSearch from './components/chat-search.svelte';
  import { Channel } from '@baragaun/bg-node-client';
  import type { PageData } from '../conversations/$types';
  import { MessageSquarePlus } from 'lucide-svelte';
  import { conversationContext } from '@/contexts/conversation-context.svelte';

  let { data }: { data: PageData } = $props();

  let channels = $state<Channel[]>([]);
  let filteredChannels = $state<Channel[]>([]);
  let isLoading = $state(true);
  let searchQuery = $state('');

  onMount(async () => {
    isLoading = true;
    // Use the mock data from the layout
    setTimeout(() => {
      channels = data.channels;
      filteredChannels = channels;
      isLoading = false;
    }, 500);

    conversationContext.initialize();
    conversationContext.findMyChannels();
  });

  const handleSearch = (event: CustomEvent<string>) => {
    searchQuery = event.detail;
    if (!searchQuery) {
      filteredChannels = channels;
      return;
    }

    const query = searchQuery.toLowerCase();
    filteredChannels = channels.filter((channel) => {
      // Search in channel name
      if (channel.name?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in description
      if (channel.description?.toLowerCase().includes(query)) {
        return true;
      }

      // Could add more search criteria here

      return false;
    });
  };

  const handleNewChat = () => {
    // This would open a dialog to select a contact
    // goto('/contacts');
  };

  const handleDeleteChannel = async (event: CustomEvent<{ channelId: string }>) => {
    const { channelId } = event.detail;
    try {
      // Remove from local state
      channels = channels.filter((channel) => channel.id !== channelId);
      filteredChannels = filteredChannels.filter((channel) => channel.id !== channelId);

      // Here you would call your API to delete the channel
      // For example:
      // await myChannelContext.deleteChannel(channelId);

      // For now, we'll just update the UI
    } catch (error) {
      console.error('Failed to delete channel:', error);
      // Optionally show an error message to the user
    }
  };
</script>

<div class="container mx-auto max-w-4xl py-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Conversations</h1>
    <div class="flex items-center gap-2">
      <ChatSearch on:search={handleSearch} />
      <Button onclick={handleNewChat}>
        <MessageSquarePlus class="h-5 w-5" />
      </Button>
    </div>
  </div>

  {#if isLoading}
    <div class="flex h-40 items-center justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  {:else}
    <ChatList channels={filteredChannels} on:deleteChannel={handleDeleteChannel} />
  {/if}
</div>
