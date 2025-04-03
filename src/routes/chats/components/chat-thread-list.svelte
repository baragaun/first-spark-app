<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { formatDistanceToNow } from 'date-fns';
  
  interface ChatThread {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: Date;
    unread: number;
  }
  
  let { threads }: { threads: ChatThread[] } = $props();
  
  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
</script>

<div class="space-y-2">
  {#if threads.length === 0}
    <div class="rounded-lg border p-8 text-center">
      <p class="text-muted-foreground">No conversations yet</p>
    </div>
  {:else}
    {#each threads as thread}
      <a 
        href={`/chats/${thread.id}`}
        class="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
      >
        <Avatar.Root class="h-12 w-12">
          <Avatar.Fallback>{thread.name.charAt(0)}</Avatar.Fallback>
        </Avatar.Root>
        
        <div class="flex-1 overflow-hidden">
          <div class="flex items-center justify-between">
            <h3 class="font-medium">{thread.name}</h3>
            <span class="text-xs text-muted-foreground">{formatTime(thread.timestamp)}</span>
          </div>
          <p class="truncate text-sm text-muted-foreground">{thread.lastMessage}</p>
        </div>
        
        {#if thread.unread > 0}
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {thread.unread}
          </div>
        {/if}
      </a>
    {/each}
  {/if}
</div>