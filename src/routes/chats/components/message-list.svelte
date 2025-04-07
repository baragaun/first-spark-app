<script lang="ts">
  import { format } from 'date-fns';
  import { ChevronDown, Pencil, Trash2, Check, X } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import type { ChannelMessage, Channel } from '@baragaun/bg-node-client';
  import { page } from '$app/state';

  let {
    messages,
    onEditMessage,
    onDeleteMessage,
    channelId,
  }: {
    messages: ChannelMessage[];
    onEditMessage?: (id: string, newText: string) => void;
    onDeleteMessage?: (id: string) => void;
    channelId?: string;
  } = $props();

  let messagesContainer: HTMLDivElement;
  let editingMessageId = $state<string | null>(null);
  let editText = $state<string | null | undefined>(null);
  let searchQuery = $state<string>('');
  let filteredMessages = $derived(() => {
    if (!searchQuery) return messages;
    return messages.filter((msg) =>
      msg.messageText?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) as ChannelMessage[];
  });

  // Listen for search events
  $effect(() => {
    const handleSearch = (e: CustomEvent<{ query: string }>) => {
      searchQuery = e.detail.query;
      // Reset filtered messages when search is cleared
      if (!e.detail.query) {
        searchQuery = '';
      }
    };

    document.addEventListener('messageSearch', handleSearch as EventListener);

    return () => {
      document.removeEventListener('messageSearch', handleSearch as EventListener);
    };
  });

  let channel = $derived(() => {
    return page.data.channels.find((c: Channel) => c.id === channelId);
  });

  // Get sender info for avatar display
  const getSenderInfo = (userId: string) => {
    const user = page.data.users.find((u: { id: string }) => u.id === userId);
    return {
      name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      initial: user ? user.firstName.charAt(0) : '?',
    };
  };

  // Check if channel has more than two participants
  const isGroupChat = $derived(() => {
    return channel()?.participants && channel().participants.length > 2;
  });

  // Auto-scroll to bottom when new messages arrive or when component mounts
  $effect(() => {
    if (messagesContainer && messages.length > 0) {
      // Scroll to bottom immediately when messages load or change
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    }
  });

  // Create a separate effect that watches specifically for changes in messages length
  $effect(() => {
    const messageCount = messages.length;
    if (messagesContainer && messageCount > 0) {
      // Scroll to bottom when new messages are added
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    }
  });

  // Add a function to handle input focus events
  const scrollToBottom = () => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

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
</script>

<div class="flex-1 overflow-y-auto p-4" bind:this={messagesContainer}>
  <div class="space-y-4">
    {#each filteredMessages() as message (message.id)}
      <div
        class="flex {message.createdBy === page.data.currentMockUserId
          ? 'justify-end'
          : 'justify-start'}"
      >
        {#if message.createdBy !== page.data.currentMockUserId && isGroupChat()}
          <Avatar.Root class="mb-1 mr-2 h-8 w-8 self-end">
            <Avatar.Fallback>
              {getSenderInfo(message.createdBy ?? '').initial}
            </Avatar.Fallback>
          </Avatar.Root>
        {/if}
        <div
          class="group relative max-w-[80%] rounded-lg px-4 py-2 {message.createdBy ===
          page.data.currentMockUserId
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'}"
        >
          {#if editingMessageId !== message.id}
            <div
              class="touch-action-none absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <DropdownMenu.Root>
                <DropdownMenu.Trigger
                  class="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/30 dark:bg-primary-foreground/20 dark:hover:bg-primary-foreground/30"
                >
                  <ChevronDown class="h-4 w-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  {#if message.createdBy === page.data.currentMockUserId}
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
            <p class="break-words">{message.messageText}</p>
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
            class="mt-1 text-right text-xs {message.createdBy === page.data.currentMockUserId
              ? 'text-primary-foreground/70'
              : 'text-muted-foreground'}"
          >
            {formatMessageTime(new Date(message.createdAt))}
          </p>
        </div>
      </div>
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
