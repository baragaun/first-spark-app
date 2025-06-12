<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { formatDistanceToNow } from 'date-fns';
  import type { ChannelListItem } from '@baragaun/bg-node-client';
  import ChannelOptionsMenu from './channel-options-menu.svelte';
  import { myUserContext } from '@/contexts/users/my-user-context.svelte';
  import { ChannelContext } from '@/contexts/channels/channel-context.svelte';
  import { getContext, onMount } from 'svelte';
  import SearchBar from '@/components/ui/search-bar.svelte';
  import { m } from '@/paraglide/messages';
  import Button from '@/components/ui/button/button.svelte';
  import { Plus } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let {
    handleNewChat,
  }: {
    handleNewChat: () => void;
  } = $props();

  const channelsContext = getContext<ChannelContext>('channelContext');
  const currentUserId = myUserContext.myUserId; // This should match the variable name in +layout.ts

  let skip = $derived.by(() => channels.length);
  let searchQuery = $state('');

  const handleSearch = (event: CustomEvent<string>) => {
    searchQuery = event.detail;
  };

  const handleScroll = async (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      await channelsContext.findMyChannels(skip);
    }
  };

  onMount(async () => {
    if (myUserContext.isSignedIn) {
      await channelsContext.findMyChannels(0);
    } else {
      goto('/signin');
    }
  });

  let channels = $derived(
    channelsContext.myChannels
      .filter((channel) => {
        if (!channel.latestMessage) return false;

        if (!searchQuery) return true;

        const query = searchQuery.toLowerCase();
        return (
          channel.name?.toLowerCase().includes(query) ||
          channel.description?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const aTimestamp = a.latestMessage?.updatedAt || a.latestMessage?.createdAt;
        const bTimestamp = b.latestMessage?.updatedAt || b.latestMessage?.createdAt;

        if (!aTimestamp || !bTimestamp) return 0;
        // Descending
        return new Date(bTimestamp).getTime() - new Date(aTimestamp).getTime();
      }),
  );

  const formatTime = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getRecipientName = async (channel: ChannelListItem) => {
    if (!channel.userIds || channel.userIds.length === 0) {
      return null;
    }

    const recipientUser = channel.participants?.find(
      (participant) => participant.userId !== currentUserId,
    );

    if (!recipientUser) {
      return null;
    }

    const receipientName = recipientUser.userInfo?.firstName
      ? `${recipientUser.userInfo?.firstName} ${recipientUser.userInfo?.lastName}`
      : recipientUser.userInfo?.userHandle;

    return receipientName;
  };

  const handleDeleteChannel = async (participantId: string, channelId: string) => {
    const response = await channelsContext.deleteChannelParticipant(participantId);
    if (!response) {
      console.error('DeleteChannel: received error.', { response });
      return;
    }
    channels = channels.filter((channel) => channel.id !== channelId);
  };

  function handleChannelClick(channel: ChannelListItem) {
    channelsContext.selectChannel(channel);
  }
</script>

<div class="container mx-auto">
  <!-- Header (fixed) -->
  <div
    class="sticky sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4"
  >
    <h1 class="text-2xl font-bold">{m['chat.list_title']()}</h1>
    <div class="flex items-center gap-2">
      <SearchBar on:search={handleSearch} />
      <Button variant="ghost" onclick={handleNewChat}>
        <Plus class="h-5 w-5" />
      </Button>
    </div>
  </div>

  <!-- Scrollable Chat List (only this div scrolls) -->
  <div class="max-h-[calc(100vh-220px)] space-y-2 overflow-y-auto p-2" onscroll={handleScroll}>
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
              href={`/chat/${channel.id}`}
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
                      >{formatTime(
                        channel.latestMessage?.updatedAt ??
                          channel.latestMessage?.createdAt ??
                          new Date(),
                      )}</span
                    >
                    <ChannelOptionsMenu {channel} onDeleteChannel={handleDeleteChannel} />
                  </div>
                </div>
                <p class="truncate text-sm text-muted-foreground">
                  {channel.latestMessage?.messageText || 'No latest messages'}
                </p>
              </div>
            </a>
          </div>
        {/await}
      {/each}
    {/if}
  </div>
</div>
