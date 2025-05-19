<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import ChatHeader from '../components/chat-header.svelte';
  import MessageList from '../components/message-list.svelte';
  import MessageInput from '../components/message-input.svelte';
  import { Channel, ChannelMessage } from '@baragaun/bg-node-client';
  import { X } from 'lucide-svelte';
  import Button from '@/components/ui/button/button.svelte';

  const conversationId = page.params.conversationId;

  interface ContactDetails {
    id: string;
    name: string;
    avatar: string;
    discription?: string;
  }

  let channelDetails = $state<ContactDetails | null>(null);
  let messages = $state<ChannelMessage[]>([]);
  let isLoading = $state(true);
  let messageListRef = $state<HTMLDivElement>();
  let replyingTo = $state<ChannelMessage | null>(null);

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
      const recipientParticipant = channel.participants.find(
        (p) => p.userId !== page.data.currentMockUserId,
      );

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
    setTimeout(() => {
      // Find the channel from the data
      const channel = page.data.channels.find((c: Channel) => c.id === conversationId);
      if (channel) {
        setContactInfo(channel);
        messages = page.data.messages[conversationId] || [];
      }
      isLoading = false;
      // Scroll to bottom after messages load
      scrollToBottom();
    }, 500);
  });

  const handleSendMessage = (messageText: string) => {
    const newMessage: ChannelMessage = {
      id: Date.now().toString(),
      channelId: conversationId,
      createdBy: page.data.currentMockUserId,
      messageText,
      createdAt: new Date().toISOString(),
    };

    messages = [...messages, newMessage];
    // Scroll to bottom after sending a message
    scrollToBottom();

    // Here you would also send the message to your backend
  };

  const handleEditMessage = (id: string, newText: string) => {
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

    // Here you would also update the message in your backend
  };

  const handleDeleteMessage = (id: string) => {
    // Implement delete functionality
    messages = messages.filter((message) => message.id !== id);

    // Here you would also delete the message from your backend
  };

  const handleReplyMessage = (replyToMessageId: string, messageText: string) => {
    const newMessage: ChannelMessage = {
      id: Date.now().toString(),
      channelId: conversationId,
      createdBy: page.data.currentMockUserId,
      messageText,
      createdAt: new Date().toISOString(),
      replyToMessageId: replyToMessageId,
    };

    messages = [...messages, newMessage];
    // Reset reply state
    replyingTo = null;
    // Scroll to bottom after sending a message
    scrollToBottom();

    // Here you would also send the message to your backend
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
