<script lang="ts">
  import { format, isToday, isYesterday } from 'date-fns';
  import {
    ChevronDown,
    Pencil,
    Trash2,
    Check,
    X,
    Reply,
    Copy,
    CheckCircle,
    Clock,
    Edit,
    CheckCheck,
    ArrowDown,
  } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import type { ChannelMessage, Channel } from '@baragaun/bg-node-client';
  import { channelContext } from '@/contexts/channels/channel-context.svelte';
  import { myUserContext } from '@/contexts/users/my-user-context.svelte';
  import { MessageStatus } from '@/helpers/types';
  import { createEventDispatcher, onMount } from 'svelte';

  // For demo purposes, let's assume messages have a status property
  // In a real app, this would come from your message data
  const getMessageStatus = (message: ChannelMessage): MessageStatus => {
    const messageStatus = message.statuses?.find((s) => s.userId !== myUserContext.myUserId);
    if (messageStatus) {
      if (messageStatus.seenAt) {
        return MessageStatus.seen;
      } else if (messageStatus.receivedAt) {
        return MessageStatus.delivered;
      }
    }
    // Default to SEEN for demo purposes
    return MessageStatus.sent;
  };

  let {
    messages,
    onEditMessage,
    onDeleteMessage,
    onStartReply,
  }: {
    messages: ChannelMessage[];
    onEditMessage?: (id: string, newText: string) => void;
    onDeleteMessage?: (id: string) => void;
    onStartReply?: (message: ChannelMessage) => void;
  } = $props();

  let messagesContainer: HTMLDivElement;
  let editingMessageId = $state<string | null>(null);
  let editText = $state<string | null | undefined>(null);
  let replyingToMessage = $state<ChannelMessage | null>(null);
  let copiedMessageId = $state<string | null>(null);
  let showScrollButton = $state(false);
  let isFetchingMoreMessages = $state(false); // Flag to prevent multiple API calls
  let isAllMessagesFetched = $state(false);

  const selectedChannel = $derived(() => {
    return channelContext.selectedChannel;
  });

  const getSenderInfo = async (userId: string) => {
    // const user = await channelContext.findUserInfoById(userId);
    const user = selectedChannel()?.participants?.find((p) => p.userId === userId);
    if (!user) return { name: 'Unknown', initial: '?' };
    if (user.userInfo?.firstName) {
      return {
        name: `${user.userInfo?.firstName} ${user.userInfo?.firstName}`,
        initial: user.userInfo?.firstName.charAt(0),
      };
    }
    return {
      name: user.userInfo?.userHandle,
      initial: user.userInfo?.userHandle?.charAt(0),
    };
  };

  // Check if channel has more than two participants
  const isGroupChat = $derived(() => {
    const channel = selectedChannel();
    return channel?.userIds?.length ?? 0 > 2;
  });

  const formatMessageTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const startEditing = (message: ChannelMessage) => {
    editingMessageId = message.id;
    editText = message.messageText;
  };

  const cancelEditing = () => {
    editingMessageId = null;
    editText = '';
  };

  const saveEdit = (id: string) => {
    if (editText?.trim() && onEditMessage) {
      onEditMessage(id, editText.trim());
      editingMessageId = null;
    }
  };

  const startReplying = (message: ChannelMessage) => {
    replyingToMessage = message;
    if (onStartReply) {
      onStartReply(message);
    }
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      copiedMessageId = messageId;
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        copiedMessageId = null;
      }, 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: ChannelMessage[]) => {
    const groups: { date: Date; messages: ChannelMessage[] }[] = [];

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const dateString = format(messageDate, 'yyyy-MM-dd');

      const existingGroup = groups.find((group) => format(group.date, 'yyyy-MM-dd') === dateString);

      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({
          date: messageDate,
          messages: [message],
        });
      }
    });

    return groups.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  // Add a function to check if a message has been edited
  const isMessageEdited = (message: ChannelMessage): boolean => {
    // Check if editedAt exists and is not null
    return message.editedAt != null;
  };

  // Add state to track expanded messages
  let expandedMessages = $state<Record<string, boolean>>({});

  // Function to toggle message expansion
  const toggleMessageExpansion = (messageId: string) => {
    expandedMessages[messageId] = !expandedMessages[messageId];
  };

  // Function to check if message is long (more than 150 words)
  const isLongMessage = (text: string): boolean => {
    return text.split(/\s+/).length > 150;
  };

  // Function to get preview of long message (first 150 words)
  const getMessagePreview = (text: string): string => {
    const words = text.split(/\s+/);
    return words.slice(0, 150).join(' ') + '...';
  };

  const fetchMoreMessages = async () => {
    if (isFetchingMoreMessages && !isAllMessagesFetched) return; // Prevent multiple API calls
    isFetchingMoreMessages = true;

    // Capture the current scroll height and scroll position
    const oldScrollHeight = messagesContainer?.scrollHeight || 0;
    const previousScrollTop = messagesContainer?.scrollTop || 0;

    const response = await channelContext.findChannelMessages(
      selectedChannel()!.id,
      messages.length,
      20,
    );
    if (!response || !Array.isArray(response)) {
      console.error('FindChannelMessages: received error.', { response });
      isFetchingMoreMessages = false;
      return;
    }

    if (response.length === 0) {
      isAllMessagesFetched = true;
    } else {
      // Prepend new messages to the existing list
      messages = [...response.reverse(), ...messages];

      // Calculate the difference in scroll height and adjust scrollTop
      const newScrollHeight = messagesContainer?.scrollHeight || 0;
      const scrollHeightDifference = newScrollHeight - oldScrollHeight;
      messagesContainer.scrollTop = scrollHeightDifference + previousScrollTop;
    }

    isFetchingMoreMessages = false;
  };

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    }
  };

  const dispatch = createEventDispatcher();

  // Check scroll position to show/hide button
  const handleScroll = () => {
    if (!messagesContainer) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
    showScrollButton = scrollHeight - scrollTop - clientHeight > 100;
    // Check if the user has scrolled to the top
    if (messagesContainer.scrollTop === 0) {
      fetchMoreMessages();
    }
  };

  onMount(() => {
    scrollToBottom();
    dispatch('scrollToBottom', scrollToBottom);
  });
</script>

<div class="h-full overflow-y-auto p-4" bind:this={messagesContainer} onscroll={handleScroll}>
  {#if showScrollButton}
    <button
      class="fixed right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-opacity hover:bg-primary/90"
      onclick={scrollToBottom}
    >
      <ArrowDown class="h-5 w-5" />
    </button>
  {/if}
  <div class="space-y-4">
    {#each groupMessagesByDate(messages) as group}
      <div class="relative my-6 flex items-center justify-center">
        <!-- TODO: Add the "Conversation started <firstMessage.createdAt>" if i === 1 -->
        <!-- <Separator class="flex w-1/3" /> -->
        <span class="px-6 text-xs font-medium text-muted-foreground">
          {getDateDisplay(group.date)}
        </span>
        <!-- <Separator class="flex w-1/3" /> -->
      </div>

      {#each group.messages as message (message.id)}
        <div
          class="flex {message.createdBy === myUserContext.myUserId
            ? 'justify-end'
            : 'justify-start'}"
        >
          {#if message.createdBy !== myUserContext.myUserId && isGroupChat()}
            {@const senderInfoPromise = getSenderInfo(message.createdBy ?? '')}
            {#await senderInfoPromise then senderInfo}
              <Avatar.Root class="mb-1 mr-2 h-8 w-8 self-end">
                <Avatar.Fallback>
                  {senderInfo.initial}
                </Avatar.Fallback>
              </Avatar.Root>
            {/await}
          {/if}
          <div
            class="group relative max-w-[80%] rounded-lg px-4 py-2 {message.createdBy ===
            myUserContext.myUserId
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'}"
          >
            {#if message.replyToMessageId}
              <div class="mb-2 rounded bg-black/10 p-2 text-xs dark:bg-white/10">
                {#if messages.find((m) => m.id === message.replyToMessageId)}
                  {@const senderInfoPromise = getSenderInfo(
                    messages.find((m) => m.id === message.replyToMessageId)?.createdBy ?? '',
                  )}
                  {#await senderInfoPromise then senderInfo}
                    <p class="font-semibold">
                      {senderInfo.name}
                    </p>
                  {/await}

                  <p class="line-clamp-2">
                    {messages.find((m) => m.id === message.replyToMessageId)?.messageText}
                  </p>
                {:else}
                  <p class="italic">Original message not available</p>
                {/if}
              </div>
            {/if}
            {#if editingMessageId !== message.id}
              <div
                class="touch-action-none absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/30 dark:bg-primary-foreground/20 dark:hover:bg-primary-foreground/30"
                    aria-label="Message options"
                  >
                    <ChevronDown class="h-4 w-4" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end">
                    <DropdownMenu.Item
                      onclick={() => copyToClipboard(message.messageText || '', message.id)}
                    >
                      {#if copiedMessageId === message.id}
                        <CheckCircle class="mr-2 h-4 w-4 text-green-500" />
                        Copied!
                      {:else}
                        <Copy class="mr-2 h-4 w-4" />
                        Copy
                      {/if}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onclick={() => startReplying(message)}>
                      <Reply class="mr-2 h-4 w-4" />
                      Reply
                    </DropdownMenu.Item>
                    {#if message.createdBy === myUserContext.myUserId}
                      <DropdownMenu.Item onclick={() => startEditing(message)}>
                        <Pencil class="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenu.Item>
                    {/if}
                    <DropdownMenu.Item
                      onclick={() => onDeleteMessage?.(message.id)}
                      class="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
              {#if isLongMessage(message.messageText || '') && !expandedMessages[message.id]}
                <p class="break-words">{getMessagePreview(message.messageText || '')}</p>
                <button
                  class="mt-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                  onclick={() => toggleMessageExpansion(message.id)}
                >
                  Show more
                </button>
              {:else if isLongMessage(message.messageText || '') && expandedMessages[message.id]}
                <p class="break-words">{message.messageText}</p>
                <button
                  class="mt-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                  onclick={() => toggleMessageExpansion(message.id)}
                >
                  Show less
                </button>
              {:else}
                <p class="break-words">{message.messageText}</p>
              {/if}
            {:else}
              <div class="flex flex-col gap-2">
                <Input
                  type="text"
                  bind:value={editText}
                  class="border-primary-foreground/30 bg-transparent"
                  autofocus
                />
                <div class="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" class="h-8 px-2" onclick={cancelEditing}>
                    <X class="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    class="h-8 px-2"
                    onclick={() => saveEdit(message.id)}
                  >
                    <Check class="mr-1 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            {/if}
            <p
              class="mt-1 flex items-center justify-end gap-1 text-xs {message.createdBy ===
              myUserContext.myUserId
                ? 'text-primary-foreground/70'
                : 'text-muted-foreground'}"
            >
              <span>{formatMessageTime(new Date(message.createdAt))}</span>

              {#if isMessageEdited(message)}
                <span class="flex items-center gap-0.5">
                  <Edit class="h-3 w-3" />
                  <span>edited</span>
                </span>
              {/if}

              {#if message.createdBy === myUserContext.myUserId}
                {#if getMessageStatus(message) === MessageStatus.sending}
                  <Clock class="h-3 w-3" />
                {:else if getMessageStatus(message) === MessageStatus.sent}
                  <Check class="h-3 w-3" />
                {:else if getMessageStatus(message) === MessageStatus.seen}
                  <CheckCheck class="h-3 w-3" />
                {/if}
              {/if}
            </p>
          </div>
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>
  /* Add support for long press on mobile */
  @media (pointer: coarse) {
    .group:active .touch-action-none {
      opacity: 1;
    }
  }
</style>
