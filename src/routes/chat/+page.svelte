<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '@/components/ui/dialog';
  import ChatList from './components/chat-list.svelte';
  import { MessageSquarePlus, Plus, Send, Edit } from 'lucide-svelte';
  import { ChannelContext } from '@/contexts/channels/channel-context.svelte';
  import { MyUserContext } from '@/contexts/users/my-user-context.svelte';
  import { UsersContext } from '@/contexts/users/users-context.svelte';
  import SearchBar from '@/components/ui/search-bar.svelte';

  import MessageInput from './components/message-input.svelte';
  import { m } from '@/paraglide/messages';
  import { getContext, onMount } from 'svelte';
  import type { UserListItem, ChannelMessage } from '@baragaun/bg-node-client';

  const channelsContext = getContext<ChannelContext>('channelContext');
  const myUserContext = getContext<MyUserContext>('myUserContext');
  const usersContext = getContext<UsersContext>('usersContext');

  let searchQuery = $state('');
  let isNewChatDialogOpen = $state(false);
  let selectedUser = $state<UserListItem | null>(null);

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
      })
  );

  const handleSearch = (event: CustomEvent<string>) => {
    searchQuery = event.detail;
  };

  const handleNewChat = () => {
    isNewChatDialogOpen = true;
  };

  const handleUserSelect = (user: UserListItem) => {
    selectedUser = user;
  };

  const handleSendMessage = async (messageText: string) => {
    if (!selectedUser) return;

    try {
      const channel = await channelsContext.createChannel({
        userIds: [selectedUser.id],
      });

      if (!channel || typeof channel === 'string') {
        console.error('CreateChannel: received error.', { channel });
        return;
      }

      const newMessage: Partial<ChannelMessage> = {
        channelId: channel.id,
        messageText,
      };
      
      const response = await channelsContext.createChannelMessage(newMessage);
      if (!response || typeof response === 'string') {
        console.error('CreateChannelMessage: received error.', { response });
        return;
      }

      // Close dialog and navigate to new chat
      isNewChatDialogOpen = false;
      selectedUser = null;
      goto(`/chat/${channel.id}`);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDialogClose = () => {
    isNewChatDialogOpen = false;
    selectedUser = null;
  };

  onMount(async () => {
    await channelsContext.findMyChannels();
    
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

<div class="p-8">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">{m['chat.list_title']()}</h1>
    <div class="flex items-center gap-2">
      <SearchBar on:search={handleSearch} />
      <Button variant='ghost' onclick={handleNewChat}>
        <Plus class="h-5 w-5" />
      </Button>
    </div>
  </div>
  
  <ChatList channels={filteredChannels} />

  <!-- New Chat Dialog -->
  <Dialog.Root open={isNewChatDialogOpen} onOpenChange={handleDialogClose}>
    <Dialog.Content class="rounded-xl max-w-md">
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
        {#if !selectedUser}
          <!-- User Search -->

          THE COMPONENT IN USERS/+PAGE.SVELTE WILL LIVE HERE
        {:else}
          <!-- Selected User & Message Compose -->
          <div class="space-y-6">
            <!-- Selected User Display -->
            <div class="flex items-center gap-3 p-4 bg-muted rounded-lg">
              {#if selectedUser.avatarUrl}
                <img
                  src={selectedUser.avatarUrl}
                  alt={selectedUser.userHandle}
                  class="h-12 w-12 rounded-full object-cover"
                />
              {:else}
                <div class="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                  <span class="text-lg font-semibold">
                    {selectedUser.userHandle?.charAt(0).toUpperCase()}
                  </span>
                </div>
              {/if}
              <div class="flex-1">
                <h3 class="font-semibold">@{selectedUser.userHandle}</h3>
                {#if selectedUser.userHandle && selectedUser.userHandle !== selectedUser.userHandle}
                  <p class="text-sm text-muted-foreground">{selectedUser.userHandle}</p>
                {/if}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onclick={() => selectedUser = null}
              >
                Change
              </Button>
            </div>

            <!-- Sample Message Preview -->
            <div class="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
              <div class="flex flex-col rounded-lg rounded-bl-none px-4 py-2 bg-background border">
                <span class="text-muted-foreground text-xs self-start">FirstSpark</span>
                <p class="mt-1 flex items-center justify-end gap-1 text-xs text-foreground">
                  {m['chat.compose_tip']({ userHandle: myUserContext.myUserHandle || 'friend' })}
                </p>
                <span class="text-muted-foreground text-xs self-end">a moment ago</span>
              </div>
            </div>

            <!-- Message Input -->
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        {/if}
      </div>
    </Dialog.Content>
  </Dialog.Root>
</div>
