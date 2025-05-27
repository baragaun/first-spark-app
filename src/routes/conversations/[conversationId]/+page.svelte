<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import ChatHeader from '../components/chat-header.svelte';
  import MessageList from '../components/message-list.svelte';
  import MessageInput from '../components/message-input.svelte';
  import { Channel, ChannelMessage } from '@baragaun/bg-node-client';
  import { X } from 'lucide-svelte';
  import Button from '@/components/ui/button/button.svelte';
  import { isChannelLoading, selectedChannel } from '@/stores/channel-store';
  import { channelContext } from '@/contexts/channel-context.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import type { ContactDetails } from '@/helpers/types';

  const channelId = page.params.conversationId;

  let channelDetails = $state<ContactDetails | undefined>(undefined);
  let messages = $state<ChannelMessage[]>([]);
  let messageListRef = $state<HTMLDivElement>();
  let replyingTo = $state<ChannelMessage | null>(null);
  let isLoading = $state(false);

  const currentUserId = myUserContext.myUserId;

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    if (messageListRef) {
      setTimeout(() => {
        if (messageListRef) {
          messageListRef.scrollTop = messageListRef.scrollHeight;
        }
      }, 0);
    }
  };

  // Effect to scroll down when messages change
  $effect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  });

  // Function to determine contact info based on channel participants
  const setContactInfo = async (channel: Channel) => {
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
      const recipientId = channel.userIds.find((userId) => userId !== currentUserId);

      if (!recipientId) return null;

      const recipientUser = await channelContext.findRecipientInfo(recipientId);

      if (!recipientUser || typeof recipientUser === 'string') return null;

      const receipientName = recipientUser.firstName
        ? `${recipientUser.firstName} ${recipientUser.lastName}`
        : recipientUser.userHandle;

      channelDetails = {
        id: recipientUser.id,
        name: receipientName || 'Unknown',
        avatar: receipientName || '?'.charAt(0),
      };
    }
  };

  const initializeChannel = async () => {
    isLoading = true;
    const response = await channelContext.findChannelMessages(channelId);
    if (!response || !Array.isArray(response)) {
      console.error('FindChannelMessages: received error.', { response });
      messages = [];
      return;
    }
    messages = response;
    isLoading = false;
    scrollToBottom();
  };

  onMount(async () => {
    if ($selectedChannel) {
      setContactInfo($selectedChannel);
      initializeChannel();
    } else {
      // todo if page refreshed then I need to call findChannelById
      // selectedChannel.set(await channelContext.findChannel(channelId));
    }
  });

  const handleSendMessage = async (messageText: string) => {
    const newMessage: Partial<ChannelMessage> = {
      channelId: channelId,
      messageText,
    };
    const response = await channelContext.createChannelMessage(newMessage);
    if (!response || typeof response === 'string') {
      console.error('CreateChannelMessage: received error.', { response });
      return;
    }
    messages = [...messages, response];
    scrollToBottom();
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
    console.log('DeleteChannelMessage: response:', response);
    if (!response) {
      console.error('DeleteChannelMessage: received error.', { response });
      return;
    }

    messages = messages.filter((message) => message.id !== id);

    // Here you would also delete the message from your backend
  };

  const handleReplyMessage = async (replyToMessageId: string, messageText: string) => {
    const newMessage: Partial<ChannelMessage> = {
      channelId: channelId,
      messageText,
      replyToMessageId: replyToMessageId,
    };

    const response = await channelContext.createChannelMessage(newMessage);

    if (!response || typeof response === 'string') {
      console.error('CreateChannelMessage: received error.', { response });
      return;
    }

    // messages = [...messages, newMessage];
    // Reset reply state
    replyingTo = null;
    // Scroll to bottom after sending a message
    scrollToBottom();
  };
</script>

<div class="flex h-screen flex-col overflow-hidden">
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
      <div class="overflo w-y-auto absolute inset-0" bind:this={messageListRef}>
        <MessageList
          {messages}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onReplyMessage={handleReplyMessage}
          onStartReply={(message) => (replyingTo = message)}
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
        onSendMessage={(text) =>
          replyingTo ? handleReplyMessage(replyingTo.id, text) : handleSendMessage(text)}
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
