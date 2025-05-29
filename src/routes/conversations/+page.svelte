<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { onMount } from 'svelte';
  import ChatList from './components/chat-list.svelte';
  import { MessageSquarePlus } from 'lucide-svelte';
  import { channelContext } from '@/contexts/channel-context.svelte';
  import { myChannels } from '@/stores/channel-store';
  import SearchBar from '@/components/search-bar.svelte';

  let searchQuery = $state('');

  let filteredChannels = $derived(
    $myChannels.filter((channel) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        channel.name?.toLowerCase().includes(query) ||
        channel.description?.toLowerCase().includes(query)
      );
    }),
  );

  onMount(async () => {
    await channelContext.findMyChannels();
  });

  const handleSearch = (event: CustomEvent<string>) => {
    searchQuery = event.detail;
  };

  const handleNewChat = () => {
    // This would open a dialog to select a contact
    // goto('/contacts');
  };

  const handleDeleteChannel = async (event: CustomEvent<{ channelId: string }>) => {
    const { channelId } = event.detail;
    try {
      // Remove from local state
      $myChannels = $myChannels.filter((channel) => channel.id !== channelId);

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
      <SearchBar on:search={handleSearch} />
      <Button onclick={handleNewChat}>
        <MessageSquarePlus class="h-5 w-5" />
      </Button>
    </div>
  </div>
  <ChatList channels={filteredChannels} on:deleteChannel={handleDeleteChannel} />
</div>
