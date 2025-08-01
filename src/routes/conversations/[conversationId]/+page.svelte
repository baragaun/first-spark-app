<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import ChatHeader from '../components/chat-header.svelte';
  import MessageList from '../components/message-list.svelte';
  import MessageInput from '../components/message-input.svelte';
  import { ChannelListItem, ChannelMessage } from '@baragaun/bg-node-client';
  import { X } from 'lucide-svelte';
  import Button from '@/components/ui/button/button.svelte';
  import { channelContext } from '@/contexts/channel-context.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import type { ContactDetails } from '@/helpers/types';

  const channelId = page.params.conversationId;

  let channelDetails = $state<ContactDetails | undefined>(undefined);
  let messages = $state<ChannelMessage[]>([]);
  let replyingTo = $state<ChannelMessage | null>(null);
  let isLoading = $state(false);
  let scrollToBottomFn: () => void;

  const currentUserId = myUserContext.myUserId;

  // Function to determine contact info based on channel participants
  const setContactInfo = async (channel: ChannelListItem) => {
    channelDetails = undefined;
    if (!channel || !channel.userIds) return null;

    if (channel.userIds.length > 2) {
      // Group chat - use channel info
      channelDetails = {
        id: channel.id,
        name: channel.name || 'Group Chat',
        avatar: channel.name?.charAt(0) || 'G',
      };
    } else {
      // Direct message - use recipient info
      const recipientUser = channel.participants?.find(
        (participant) => participant.userId !== currentUserId,
      );

      console.log('jahanvi, recipientUser', recipientUser);

      if (!recipientUser) return null;

      const receipientName = recipientUser.userInfo?.firstName
        ? `${recipientUser.userInfo?.firstName} ${recipientUser.userInfo?.lastName}`
        : recipientUser.userInfo?.userHandle;

      console.log('jahanvi, receipientName', receipientName);

      channelDetails = {
        id: recipientUser.id,
        name: receipientName || 'Unknown',
        avatar: (receipientName || '?').charAt(0).toUpperCase(),
      };
    }
  };

  const initializeChannel = async () => {
    isLoading = true;
    const response = await channelContext.findChannelMessages(channelId, messages.length, 20);
    if (!response || !Array.isArray(response)) {
      console.error('FindChannelMessages: received error.', { response });
      messages = [];
      return;
    }
    messages = response.reverse();
    isLoading = false;
  };

  onMount(async () => {
    console.log('jahanvi, onMount');
    if (channelContext.selectedChannel) {
      console.log('jahanvi, selectedChannel is there');
      console.log('jahanvi, selectedChannel', channelContext.selectedChannel);
      setContactInfo(channelContext.selectedChannel);
      initializeChannel();
    } else {
      console.log('jahanvi, findChannelById');
      const response = await channelContext.findChannelById(channelId);
      console.log('FindChannelById: response:', response);
      if (response && typeof response !== 'string') {
        channelContext.selectChannel(response);
        setContactInfo(response);
        initializeChannel();
      }
    }
  });

  const handleScrollToBottomEvent = (event: CustomEvent<() => void>) => {
    scrollToBottomFn = event.detail;
  };

  const handleSendMessage = async (messageText: string, replyToMessageId?: string) => {
    const newMessage: Partial<ChannelMessage> = {
      channelId: channelId,
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
      <p>Conversation not found</p>
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
