<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '@/components/ui/dialog';
  import ChatList from './components/chat-list.svelte';
  import { Plus, Edit } from 'lucide-svelte';
  import { ChannelContext } from '@/contexts/channels/channel-context.svelte';
  import { MyUserContext } from '@/contexts/users/my-user-context.svelte';
  import { UsersContext } from '@/contexts/users/users-context.svelte';
  import SearchBar from '@/components/ui/search-bar.svelte';
  import { m } from '@/paraglide/messages';
  import { getContext, onMount } from 'svelte';
  import FindUsers from '@/components/find-users.svelte';

  const channelsContext = getContext<ChannelContext>('channelContext');
  const myUserContext = getContext<MyUserContext>('myUserContext');
  const usersContext = getContext<UsersContext>('usersContext');

  let searchQuery = $state('');
  let isNewChatDialogOpen = $state(false);

  let filteredChannels = $derived(
    channelsContext.myChannels
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
      }),
  );
  let skip = $derived.by(() => filteredChannels.length);

  const handleScroll = async (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 100) {
      await channelsContext.findMyChannels(skip);
    }
  };

  const handleSearch = (event: CustomEvent<string>) => {
    searchQuery = event.detail;
  };

  const handleNewChat = () => {
    isNewChatDialogOpen = true;
  };

  const handleDialogClose = () => {
    isNewChatDialogOpen = false;
  };

  onMount(async () => {
    await channelsContext.findMyChannels(skip);
    // Ensure users context is initialized
    if (usersContext && myUserContext.myUserId) {
      try {
        await usersContext.ensureUsersLoaded([myUserContext.myUserId]);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    }
  });
</script>

<div class="container mx-auto">
  <div
    class="sticky sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4"
  >
    <h1 class="text-2xl font-bold">{m['chat.list_title']()}</h1>
    <div class="flex items-center gap-2">
      <SearchBar on:search={handleSearch} />
      <Button variant="ghost" onclick={handleNewChat}>
        <Plus class="h-5 w-5" />
      </Button>
    </div>
  </div>

  <ChatList channels={filteredChannels} {handleScroll} />

  <!-- New Chat Dialog -->
  <Dialog.Root open={isNewChatDialogOpen} onOpenChange={handleDialogClose}>
    <Dialog.Content class="max-w-md rounded-xl">
      <Dialog.Header>
        <Dialog.Title class="flex items-center gap-2">
          <Edit class="h-5 w-5" />
          {m['chat.compose']()}
        </Dialog.Title>
        <Dialog.Description>
          Search for a user to start a new conversation TRANSLATE ME
        </Dialog.Description>
      </Dialog.Header>

      <div class="py-4">
        <FindUsers />
      </div>
    </Dialog.Content>
  </Dialog.Root>
</div>
