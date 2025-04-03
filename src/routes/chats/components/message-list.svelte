<script lang="ts">
  import { format } from 'date-fns';
  import { ChevronDown, Pencil, Trash2, Check, X } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';

  interface Message {
    id: string;
    sender: 'me' | 'other';
    text: string;
    timestamp: Date;
  }

  let { messages, onEditMessage, onDeleteMessage }: {
    messages: Message[],
    onEditMessage?: (id: string, newText: string) => void,
    onDeleteMessage?: (id: string) => void
  } = $props();
  let messagesContainer: HTMLDivElement;
  let editingMessageId = $state<string | null>(null);
  let editText = $state('');

  // Auto-scroll to bottom when new messages arrive
  $effect(() => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });

  const formatMessageTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const startEditing = (message: Message) => {
    editingMessageId = message.id;
    editText = message.text;
  };

  const cancelEditing = () => {
    editingMessageId = null;
    editText = '';
  };

  const saveEdit = (id: string) => {
    if (editText.trim() && onEditMessage) {
      onEditMessage(id, editText.trim());
      editingMessageId = null;
    }
  };
</script>

<div
  class="flex-1 overflow-y-auto p-4"
  bind:this={messagesContainer}
>
  <div class="space-y-4">
    {#each messages as message (message.id)}
      <div class="flex {message.sender === 'me' ? 'justify-end' : 'justify-start'}">
        <div
          class="relative max-w-[80%] rounded-lg px-4 py-2 group {
            message.sender === 'me'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }"
        >
          {#if editingMessageId !== message.id}
            <div class="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity touch-action-none">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger class="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/30 dark:bg-primary-foreground/20 dark:hover:bg-primary-foreground/30">
                  <ChevronDown class="h-4 w-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  {#if message.sender === 'me'}
                    <DropdownMenu.Item onclick={() => startEditing(message)}>
                      <Pencil class="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenu.Item>
                  {/if}
                  <DropdownMenu.Item onclick={() => onDeleteMessage?.(message.id)} class="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                    <Trash2 class="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
            <p class="break-words">{message.text}</p>
          {:else}
            <div class="flex flex-col gap-2">
              <Input
                type="text"
                bind:value={editText}
                class="bg-transparent border-primary-foreground/30"
                autofocus
              />
              <div class="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  class="h-8 px-2"
                  onclick={cancelEditing}
                >
                  <X class="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  class="h-8 px-2"
                  onclick={() => saveEdit(message.id)}
                >
                  <Check class="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          {/if}
          <p class="mt-1 text-right text-xs {
            message.sender === 'me'
              ? 'text-primary-foreground/70'
              : 'text-muted-foreground'
          }">
            {formatMessageTime(message.timestamp)}
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
