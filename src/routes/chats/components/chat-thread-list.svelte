<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { formatDistanceToNow } from 'date-fns';
  import { ChevronDown, Archive, Trash2, BellOff, Pin } from 'lucide-svelte';
  import type { Channel } from '@baragaun/bg-node-client';

  let { threads }: { threads: Channel[] } = $props();

  const formatTime = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
</script>

<div class="space-y-2">
  {#if threads.length === 0}
    <div class="rounded-lg border p-8 text-center">
      <p class="text-muted-foreground">No conversations yet</p>
    </div>
  {:else}
    {#each threads as channel}
      <div class="relative group rounded-lg border p-4 transition-colors hover:bg-muted/50">
        <a
          href={`/chats/${channel.id}`}
          class="flex items-center gap-4"
        >
          <Avatar.Root class="h-12 w-12">
            <Avatar.Fallback>{channel.name?.charAt(0) || '?'}</Avatar.Fallback>
          </Avatar.Root>

          <div class="flex-1 overflow-hidden">
            <div class="flex items-center justify-between">
              <h3 class="font-medium">{channel.name || 'Unnamed Channel'}</h3>
              <span class="text-xs text-muted-foreground">{formatTime(channel.updatedAt || channel.createdAt)}</span>
            </div>
            <p class="truncate text-sm text-muted-foreground">{channel.description || 'No description'}</p>
          </div>

          <!-- {#if channel.metadata?.unseenMessageInfo && channel.metadata.unreadCount > 0}
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {channel.unreadCount}
            </div>
          {/if} -->
        </a>

        <div class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger class="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/30 dark:bg-primary-foreground/20 dark:hover:bg-primary-foreground/30">
              <ChevronDown class="h-4 w-4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item>
                <Archive class="mr-2 h-4 w-4" />
                Archive
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Pin class="mr-2 h-4 w-4" />
                Pin
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <BellOff class="mr-2 h-4 w-4" />
                Mute
              </DropdownMenu.Item>
              <DropdownMenu.Item class="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                <Trash2 class="mr-2 h-4 w-4" />
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    {/each}
  {/if}
</div>
