<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { formatDistanceToNow } from 'date-fns';
  import type { Channel } from '@baragaun/bg-node-client';
  import { createEventDispatcher } from 'svelte';
  import { page } from '$app/state';
  import ChannelOptionsMenu from './channel-options-menu.svelte';

  const dispatch = createEventDispatcher<{
    deleteChannel: { channelId: string };
  }>();

  //todo update the dispatcher

  let { channels }: { channels: Channel[] } = $props();

  // Get users and currentUserId directly from page data
  const users = page.data.users;
  const currentUserId = page.data.currentMockUserId; // This should match the variable name in +layout.ts

  const formatTime = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getRecipientName = (channel: Channel) => {
    if (!channel.participants || channel.participants.length === 0) {
      return null;
    }

    // Find the participant that is not the current user
    const recipientParticipant = channel.participants.find(
      (participant) => participant.userId !== currentUserId,
    );

    if (!recipientParticipant) {
      return null;
    }

    // Find the user details from the users array
    const recipientUser = users.find(
      (user: { id: string }) => user.id === recipientParticipant.userId,
    );

    if (!recipientUser) {
      return null;
    }

    // Return the user's name with null checks
    return `${recipientUser.firstName || ''} ${recipientUser.lastName || ''}`;
  };

  const handleDeleteChannel = (channelId: string) => {
    dispatch('deleteChannel', { channelId });
    // Remove from local state to update UI immediately
    channels = channels.filter((channel) => channel.id !== channelId);
  };
</script>

<div class="space-y-2">
  {#if channels.length === 0}
    <div class="rounded-lg border p-8 text-center">
      <p class="text-muted-foreground">No conversations yet</p>
    </div>
  {:else}
    {#each channels as channel}
      <div
        class="group relative rounded-lg border p-4 transition-colors hover:bg-muted/50"
        data-channel-id={channel.id}
      >
        <a href={`/conversations/${channel.id}`} class="flex items-center gap-4">
          <Avatar.Root class="h-12 w-12">
            <Avatar.Fallback>
              {#if channel.participants && channel.participants.length > 2}
                {channel.name?.charAt(0) || '?'}
              {:else}
                {getRecipientName(channel)?.charAt(0) || '?'}
              {/if}
            </Avatar.Fallback>
          </Avatar.Root>

          <div class="flex-1 overflow-hidden">
            <div class="flex items-center justify-between">
              <h3 class="font-medium">
                {#if channel.participants && channel.participants.length > 2}
                  {channel.name || 'Group Chat'}
                {:else}
                  {getRecipientName(channel) || 'Unknown User'}
                {/if}
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground"
                  >{formatTime(channel.updatedAt || channel.createdAt)}</span
                >
                <ChannelOptionsMenu channelId={channel.id} onDeleteChannel={handleDeleteChannel} />
              </div>
            </div>
            <p class="truncate text-sm text-muted-foreground">
              {channel.description || 'No description'}
            </p>
          </div>

          <!-- {#if channel.metadata?.unseenMessageInfo && channel.metadata.unreadCount > 0}
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {channel.unreadCount}
            </div>
          {/if} -->
        </a>
      </div>
    {/each}
  {/if}
</div>
