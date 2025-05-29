<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { formatDistanceToNow } from 'date-fns';
  import type { Channel } from '@baragaun/bg-node-client';
  import { createEventDispatcher } from 'svelte';
  import ChannelOptionsMenu from './channel-options-menu.svelte';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { selectedChannel } from '@/stores/channel-store';
  import { channelContext } from '@/contexts/channel-context.svelte';

  const dispatch = createEventDispatcher<{
    deleteChannel: { channelId: string };
  }>();

  let { channels }: { channels: Channel[] } = $props();

  // todo change to fetch real user by id
  const currentUserId = myUserContext.myUserId; // This should match the variable name in +layout.ts

  const formatTime = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getRecipientName = async (channel: Channel) => {
    if (!channel.userIds || channel.userIds.length === 0) {
      return null;
    }

    // Find the participant that is not the current user
    const recipientParticipant = channel.userIds.find((userId) => userId !== currentUserId);

    if (!recipientParticipant) {
      return null;
    }

    // Find the user details
    const recipientUser = await channelContext.findUserInfoById(recipientParticipant);

    if (!recipientUser || typeof recipientUser === 'string') {
      return null;
    }

    if (recipientUser.firstName) {
      return `${recipientUser.firstName || ''} ${recipientUser.lastName || ''}`;
    }

    return `${recipientUser.userHandle || ''}`;
  };

  const handleDeleteChannel = (channelId: string) => {
    dispatch('deleteChannel', { channelId });
    // Remove from local state to update UI immediately
    channels = channels.filter((channel) => channel.id !== channelId);
  };

  function handleChannelClick(channel: Channel) {
    selectedChannel.set(channel);
  }
</script>

<div class="space-y-2">
  {#if channels.length === 0}
    <div class="rounded-lg border p-8 text-center">
      <p class="text-muted-foreground">No conversations yet</p>
    </div>
  {:else}
    {#each channels as channel}
      {@const recipientNamePromise = getRecipientName(channel)}
      {#await recipientNamePromise then recipientName}
        <div
          class="group relative rounded-lg border p-4 transition-colors hover:bg-muted/50"
          data-channel-id={channel.id}
        >
          <a
            href={`/conversations/${channel.id}`}
            class="flex items-center gap-4"
            onclick={() => handleChannelClick(channel)}
          >
            <Avatar.Root class="h-12 w-12">
              <Avatar.Fallback>
                {#if channel.userIds && channel.userIds.length > 2}
                  {channel.name?.charAt(0) || '?'}
                {:else}
                  {recipientName?.charAt(0) || '?'}
                {/if}
              </Avatar.Fallback>
            </Avatar.Root>

            <div class="flex-1 overflow-hidden">
              <div class="flex items-center justify-between">
                <h3 class="font-medium">
                  {#if channel.userIds && channel.userIds.length > 2}
                    {channel.name || 'Group Chat'}
                  {:else}
                    {recipientName || 'Unknown User'}
                  {/if}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-muted-foreground"
                    >{formatTime(channel.updatedAt || channel.createdAt)}</span
                  >
                  <ChannelOptionsMenu
                    channelId={channel.id}
                    onDeleteChannel={handleDeleteChannel}
                  />
                </div>
              </div>
              <p class="truncate text-sm text-muted-foreground">
                {channel.description || 'No latest messages'}
              </p>
            </div>

            <!-- {#if channel.metadata?.unseenMessageInfo && channel.metadata.unreadCount > 0}
              <div class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {channel.unreadCount}
              </div>
            {/if} -->
          </a>
        </div>
      {/await}
    {/each}
  {/if}
</div>
