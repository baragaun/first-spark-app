<script lang="ts">
  import { format } from 'date-fns';

  interface Message {
    id: string;
    sender: 'me' | 'other';
    text: string;
    timestamp: Date;
  }

  let { messages }: { messages: Message[] } = $props();
  let messagesContainer: HTMLDivElement;

  // Auto-scroll to bottom when new messages arrive
  $effect(() => {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });

  const formatMessageTime = (date: Date) => {
    return format(date, 'h:mm a');
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
          class="max-w-[80%] rounded-lg px-4 py-2 {
            message.sender === 'me'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }"
        >
          <p class="break-words">{message.text}</p>
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
