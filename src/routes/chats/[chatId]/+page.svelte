<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import ChatHeader from '../components/chat-header.svelte';
  import MessageList from '../components/message-list.svelte';
  import MessageInput from '../components/message-input.svelte';
  import { Channel, ChannelMessage } from '@baragaun/bg-node-client';

  const chatId = page.params.chatId;

  interface ContactDetails {
    id: string;
    name: string;
    avatar: string;
    discription?: string;
  }

  let channelDetails = $state<ContactDetails | null>(null);
  let messages = $state<ChannelMessage[]>([]);
  let isLoading = $state(true);
  let messageListRef: HTMLDivElement;

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    if (messageListRef) {
      setTimeout(() => {
        messageListRef.scrollTop = messageListRef.scrollHeight;
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
      const channel = page.data.channels.find((c: Channel) => c.id === chatId);
      if (channel) {
        setContactInfo(channel);
        messages = page.data.messages[chatId] || [];
      }
      isLoading = false;
      // Scroll to bottom after messages load
      scrollToBottom();
    }, 500);
  });

  const handleSendMessage = (messageText: string) => {
    const newMessage: ChannelMessage = {
      id: Date.now().toString(),
      channelId: chatId,
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
      message.id === id ? { ...message, messageText: newText } : message,
    );

    // Here you would also update the message in your backend
  };

  const handleDeleteMessage = (id: string) => {
    // Implement delete functionality
    messages = messages.filter((message) => message.id !== id);

    // Here you would also delete the message from your backend
  };
</script>

<div class="flex h-screen flex-col overflow-hidden">
  {#if isLoading}
    <div class="flex flex-1 items-center justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  {:else if !channelDetails}
    <div class="flex flex-1 items-center justify-center">
      <p>Chat not found</p>
    </div>
  {:else}
    <div class="sticky top-0 z-30 bg-background shadow-sm">
      <ChatHeader contact={channelDetails} />
    </div>

    <div class="relative flex-1 overflow-hidden">
      <div class="absolute inset-0 overflow-y-auto" bind:this={messageListRef}>
        <MessageList
          {messages}
          channelId={chatId}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>
    </div>

    <div class="shadow-t sticky bottom-0 z-20 bg-background">
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  {/if}
</div>

<style>
  /* Add shadow to top of input area */
  .shadow-t {
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  }
</style>
