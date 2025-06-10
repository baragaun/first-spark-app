<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import ChatList from './components/chat-list.svelte';
  import { MessageSquarePlus } from 'lucide-svelte';
  import { channelContext } from '@/contexts/channels/channel-context.svelte';
  import SearchBar from '@/components/ui/search-bar.svelte';

  let searchQuery = $state('');

  let filteredChannels = $derived(
    channelContext.myChannels
      .filter((channel) => {
        if (!channel.latestMessage) return false;
        
        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
          channel.name?.toLowerCase().includes(query) ||
          channel.description?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const aTimestamp = a.latestMessage?.updatedAt || a.latestMessage?.createdAt;
        const bTimestamp = b.latestMessage?.updatedAt || b.latestMessage?.createdAt;
      
        if (!aTimestamp || !bTimestamp) return 0;        
        // Descending
        return new Date(bTimestamp).getTime() - new Date(aTimestamp).getTime();
      })
  );

  const handleSearch = (event: CustomEvent<string>) => {
    searchQuery = event.detail;
  };

  const handleNewChat = () => {
    // This would open a dialog to select a contact
    // goto('/contacts');
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
  <ChatList channels={filteredChannels} />
</div>