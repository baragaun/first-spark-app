<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import ChatHeader from '../components/chat-header.svelte';
  import MessageList from '../components/message-list.svelte';
  import MessageInput from '../components/message-input.svelte';
  import { Channel, ChannelMessage } from '@baragaun/bg-node-client';
  import { X } from 'lucide-svelte';
  import Button from '@/components/ui/button/button.svelte';
  import { selectedChannel } from '@/stores/channel-store';
  import { channelContext } from '@/contexts/channel-context.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  const conversationId = page.params.conversationId;

  interface ContactDetails {
    id: string;
    name: string;
    avatar: string;
    description?: string;
  }

  let channelDetails = $state<ContactDetails | null>(null);
  let messages = $state<ChannelMessage[]>([]);
  let isLoading = $state(true);
  let messageListRef = $state<HTMLDivElement>();
  let replyingTo = $state<ChannelMessage | null>(null);

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
  const setContactInfo = (channel: Channel) => {
    if (!channel || !channel.participants) return null;

    if (channel.participants.length > 2) {
      // Group chat - use channel info
      channelDetails = {
        id: channel.id,
        name: channel.name || 'Group Chat',
        avatar: channel.name?.charAt(0) || 'G',
      };
    } else {
      // Direct message - use recipient info
      const recipientParticipant = channel.participants.find((p) => p.userId !== currentUserId);

      if (!recipientParticipant) return null;

      const recipientUser = page.data.users.find(
        (user: { id: string }) => user.id === recipientParticipant.userId,
      );

      if (!recipientUser) return null;

      channelDetails = {
        id: recipientUser.id,
        name: `${recipientUser.firstName} ${recipientUser.lastName}`,
        avatar: recipientUser.firstName.charAt(0),
      };
    }
  };

  onMount(async () => {
    // Mock data - would be replaced with actual API call
    isLoading = true;
    if ($selectedChannel) {
      setContactInfo($selectedChannel);
      const response = await channelContext.findChannelMessages(conversationId);

      if (!response || !Array.isArray(response)) {
        console.error('FindChannelMessages: received error.', { response });
        messages = [];
        isLoading = false;
        return;
      }

      messages = response;
      isLoading = false;
      // Scroll to bottom after messages load
      scrollToBottom();
    }
  });

  const handleSendMessage = async (messageText: string) => {
    const newMessage: ChannelMessage = {
      id: Date.now().toString(),
      channelId: conversationId,
      createdBy: currentUserId,
      messageText,
      createdAt: new Date().toISOString(),
    };

    const response = await channelContext.createChannelMessage(newMessage);

    if (!response || typeof response === 'string') {
      console.error('CreateChannelMessage: received error.', { response });
      return;
    }

    messages = [...messages, newMessage];
    // Scroll to bottom after sending a message
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
      editedAt: new Date().toISOString(),
    });

    if (!response || typeof response === 'string') {
      console.error('UpdateChannelMessage: received error.', { response });
      return;
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const response = await channelContext.deleteChannelMessage(id);

    if (response !== true) {
      console.error('DeleteChannelMessage: received error.', { response });
      return;
    }

    messages = messages.filter((message) => message.id !== id);

    // Here you would also delete the message from your backend
  };

  const handleReplyMessage = async (replyToMessageId: string, messageText: string) => {
    const newMessage: ChannelMessage = {
      id: Date.now().toString(),
      channelId: conversationId,
      createdBy: currentUserId,
      messageText,
      createdAt: new Date().toISOString(),
      replyToMessageId: replyToMessageId,
    };

    const response = await channelContext.createChannelMessage(newMessage);

    if (!response || typeof response === 'string') {
      console.error('CreateChannelMessage: received error.', { response });
      return;
    }

    messages = [...messages, newMessage];
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
    <!-- {:else if !channelDetails}
    <div class="flex flex-1 items-center justify-center">
      <p>Conversation not found</p>
    </div> -->
  {:else}
    <div class="sticky top-0 z-30 bg-background shadow-sm">
      <!-- <ChatHeader contact={channelDetails} /> -->
    </div>

    <div class="relative flex-1 overflow-hidden">
      <div class="absolute inset-0 overflow-y-auto" bind:this={messageListRef}>
        <MessageList
          {messages}
          channelId={conversationId}
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
