<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import ChatHeader from '../components/chat-header.svelte';
  import MessageList from '../components/message-list.svelte';
  import MessageInput from '../components/message-input.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';

  interface Contact {
    id: string;
    name: string;
    avatar: string;
  }

  interface Message {
    id: string;
    sender: 'me' | 'other';
    text: string;
    timestamp: Date;
  }

  const chatId = page.params.chatId;

  let contact = $state<Contact | null>(null);
  let messages = $state<Message[]>([]);
  let isLoading = $state(true);

  onMount(async () => {
    // Mock data - would be replaced with actual API call
    isLoading = true;
    setTimeout(() => {
      // Get contact info


      const contacts: Record<string, Contact> = {
        '1': { id: '1', name: 'Alice Smith', avatar: '' },
        '2': { id: '2', name: 'Bob Johnson', avatar: '' },
        '3': { id: '3', name: 'Carol Williams', avatar: '' },
      };

      contact = contacts[chatId] || null;

      // Get messages
      messages = [
        { id: '1', sender: 'other', text: 'Hey there!', timestamp: new Date(Date.now() - 3600000) },
        { id: '2', sender: 'me', text: 'Hi! How are you?', timestamp: new Date(Date.now() - 3500000) },
        { id: '3', sender: 'other', text: 'I\'m good, thanks for asking 😊', timestamp: new Date(Date.now() - 3400000) },
        { id: '4', sender: 'me', text: 'Great to hear! What have you been up to?', timestamp: new Date(Date.now() - 3300000) },
      ] as Message[];

      isLoading = false;
    }, 500);
  });

  const handleSendMessage = (text: string) => {
    const newMessage : Message = {
      id: Date.now().toString(),
      sender: 'me',
      text,
      timestamp: new Date()
    };

    messages = [...messages, newMessage];

    // Here you would also send the message to your backend
  };
</script>

<div class="flex h-[calc(100vh-4rem)] flex-col">
  {#if isLoading}
    <div class="flex flex-1 items-center justify-center">
      <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  {:else if !contact}
    <div class="flex flex-1 items-center justify-center">
      <p>Chat not found</p>
    </div>
  {:else}
    <ChatHeader {contact} />
    <MessageList {messages} />
    <MessageInput onSendMessage={handleSendMessage} />
  {/if}
</div>
