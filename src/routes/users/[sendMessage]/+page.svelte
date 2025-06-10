<script lang="ts">
  import { page } from '$app/stores';
  import { getContext, onMount } from 'svelte';
  import ChatHeader from '../../chat/components/chat-header.svelte';
  import MessageList from '../../chat/components/message-list.svelte';
  import MessageInput from '../../chat/components/message-input.svelte';
  import { ChannelMessage, UserListItem } from '@baragaun/bg-node-client';
  import { X } from 'lucide-svelte';
  import Button from '@/components/ui/button/button.svelte';
  import type { ContactDetails } from '@/helpers/types';
  import type { ChannelContext } from '@/contexts/channels/channel-context.svelte';
  import type { UsersContext } from '@/contexts/users/users-context.svelte';

  const channelContext = getContext<ChannelContext>('channelContext');
  const usersContext = getContext<UsersContext>('usersContext');

  let selectedUser: UserListItem | null = null;
  let channelDetails = $state<ContactDetails | undefined>(undefined);
  let messages = $state<ChannelMessage[]>([]);
  let replyingTo = $state<ChannelMessage | null>(null);
  let isLoading = $state(false);
  let scrollToBottomFn: () => void;

  const setContactInfo = async (recipientUser: UserListItem) => {
    channelDetails = undefined;

    const receipientName = recipientUser.firstName
      ? `${recipientUser.firstName} ${recipientUser.lastName}`
      : recipientUser.userHandle;

    channelDetails = {
      id: recipientUser.id,
      name: receipientName || 'Unknown',
      avatar: (receipientName || '?').charAt(0).toUpperCase(),
    };
  };

  onMount(async () => {
    // Get user ID from URL params
    const userId = $page.params.userId;
    
    if (!userId) {
      console.error('No user ID provided in URL');
      return;
    }

    // Find the user from the channelContext users list
    selectedUser = usersContext.users.find(user => user.id === userId) || null;
    
    if (!selectedUser) {
      console.error('User not found with ID:', userId);
      return;
    }

    setContactInfo(selectedUser);
  });

  const handleScrollToBottomEvent = (event: CustomEvent<() => void>) => {
    scrollToBottomFn = event.detail;
  };

  const handleSendMessage = async (messageText: string, replyToMessageId?: string) => {
    if (!selectedUser) return;
    const channel = await channelContext.createChannel({
      userIds: [selectedUser.id],
    });

    if (!channel || typeof channel === 'string') {
      console.error('CreateChannel: received error.', { channel });
      return;
    }

    const newMessage: Partial<ChannelMessage> = {
      channelId: channel.id,
      messageText,
      replyToMessageId,
    };
    
    const response = await channelContext.createChannelMessage(newMessage);
    if (!response || typeof response === 'string') {
      console.error('CreateChannelMessage: received error.', { response });
      return;
    }
    messages = [...messages, response];
    replyingTo = null;
    scrollToBottomFn?.();
  };

  const handleEditMessage = async (id: string, newText: string) => {
    // Find and update the message
    messages = messages.map((message) =>
      message.id === id
        ? {
            ...message,
            messageText: newText,
            editedAt: new Date().toISOString(), // Set editedAt timestamp
          }
        : message,
    );

    const response = await channelContext.updateChannelMessage({
      id,
      messageText: newText,
    });

    if (!response || typeof response === 'string') {
      console.error('UpdateChannelMessage: received error.', { response });
      return;
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const response = await channelContext.deleteChannelMessage(id);
    if (!response || typeof response === 'string') {
      console.error('DeleteChannelMessage: received error.', { response });
      return;
    }
    messages = messages.filter((message) => message.id !== id);
  };
</script>

<div class="flex h-full flex-col overflow-hidden">
  {#if isLoading}
    <div class="flex flex-1 items-center justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  {:else if !channelDetails}
    <div class="flex flex-1 items-center justify-center">
      <p>User not found</p>
    </div>
  {:else}
    <div class="sticky top-0 z-30 bg-background shadow-sm">
      <ChatHeader contact={channelDetails} />
    </div>

    <div class="relative flex-1 overflow-hidden">
      <div class="absolute inset-0 overflow-y-auto">
        <MessageList
          {messages}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onStartReply={(message) => (replyingTo = message)}
          on:scrollToBottom={handleScrollToBottomEvent}
        />
      </div>
    </div>

    <div class="shadow-t sticky bottom-0 z-20 bg-background">
      {#if replyingTo}
        <div class="flex items-center justify-between border-b border-t bg-muted/50 p-2">
          <div class="flex-1">
            <p class="text-xs text-muted-foreground">Replying to</p>
            <p class="line-clamp-1 text-sm">{replyingTo.messageText}</p>
          </div>
          <Button variant="ghost" size="sm" onclick={() => (replyingTo = null)}>
            <X class="h-4 w-4" />
          </Button>
        </div>
      {/if}
      <MessageInput
        onSendMessage={(text) => handleSendMessage(text, replyingTo?.id)}
        placeholder={replyingTo ? 'Type your reply...' : 'Type a message...'}
      />
    </div>
  {/if}
</div>

<style>
  /* Add shadow to top of input area */
  .shadow-t {
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  }
</style>
