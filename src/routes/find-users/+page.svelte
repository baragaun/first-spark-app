<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { channelContext } from '@/contexts/channel-context.svelte';
  import SearchBar from '@/components/ui/search-bar.svelte';
  import type { UserListItem, ChannelMessage } from '@baragaun/bg-node-client';
  import { selectedUser } from '@/stores/user-store';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import * as Dialog from '$lib/components/ui/dialog';

  let searchQuery = $state(''); // State for search query
  let users = $state<UserListItem[]>([]);

  let isDialogOpen = $state(false);
  let dialogUser: UserListItem | null = $state(null);
  let dialogMessage = $state<string>('');

  const openSendMessageDialog = (user: UserListItem) => {
    dialogUser = user;
    dialogMessage = '';
    isDialogOpen = true;
  };

  const closeSendMessageDialog = () => {
    isDialogOpen = false;
    dialogUser = null;
    dialogMessage = '';
  };

  const handleSendMessage = async () => {
    if (!dialogUser) return;
    const messageText = dialogMessage;

    let channelId: string;
    const existingChannel = channelContext.myChannels.find((channel) =>
      channel.userIds?.includes(dialogUser?.id ?? ''),
    );
    const isChannelCreated = existingChannel !== undefined;
    channelId = existingChannel?.id ?? '';

    if (!isChannelCreated) {
      const channel = await channelContext.createChannel({
        userIds: [dialogUser.id],
      });

      if (!channel || typeof channel === 'string') {
        console.error('CreateChannel: received error.', { channel });
        return;
      }
      channelId = channel.id;
    }

    const newMessage: Partial<ChannelMessage> = {
      channelId: channelId,
      messageText,
    };
    // todo create channel first
    const response = await channelContext.createChannelMessage(newMessage);
    if (!response || typeof response === 'string') {
      console.error('CreateChannelMessage: received error.', { response });
      return;
    }

    closeSendMessageDialog();
  };

  // Navigate to the send message page
  const sendMessage = async (user: UserListItem) => {
    selectedUser.set(user);
    const channel = channelContext.myChannels.find((channel) => channel.userIds?.includes(user.id));
    if (channel !== undefined) {
      goto(`/conversations/${channel.id}`);
    } else {
      openSendMessageDialog(user);
    }
  };

  const isChannelCreated = (user: UserListItem) => {
    const channel = channelContext.myChannels.find((channel) => channel.userIds?.includes(user.id));
    return channel !== undefined;
  };

  onMount(async () => {
    await channelContext.findMyChannels();
    await channelContext.findUsers();
    users = channelContext.users.filter(
      (user) =>
        user.userHandle?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        user.id !== myUserContext.myUser?.id,
    );
  });
</script>

<Dialog.Root open={isDialogOpen} onOpenChange={(v) => (isDialogOpen = v)}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Send Message</Dialog.Title>
      <Dialog.Description>
        {#if dialogUser}
          Send a message to <span class="font-semibold">{dialogUser.userHandle}</span>
        {/if}
      </Dialog.Description>
    </Dialog.Header>
    <div class="py-4">
      <textarea
        class="min-h-[80px] w-full resize-y rounded border p-2"
        placeholder="Type your message..."
        bind:value={dialogMessage}
      ></textarea>
    </div>
    <Dialog.Footer class="flex justify-end gap-2">
      <Button variant="outline" onclick={closeSendMessageDialog}>Cancel</Button>
      <Button variant="default" onclick={handleSendMessage} disabled={!dialogMessage.trim()}
        >Send</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<div class="container mx-auto max-w-4xl py-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Find Users</h1>
    <div class="flex items-center gap-2">
      <SearchBar on:search={(event) => (searchQuery = event.detail)} />
    </div>
  </div>

  {#if users.length === 0}
    <div class="rounded-lg border p-8 text-center">
      <p class="text-muted-foreground">No users found</p>
    </div>
  {:else}
    <div class="user-grid">
      {#each users as user}
        <Card>
          <CardHeader class="flex items-center gap-4">
            <img
              src={user.avatarUrl || 'src/assets/icon.svg'}
              alt={user.userHandle}
              class="user-avatar"
            />
            <CardTitle>{user.userHandle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              Connect with {user.userHandle} by viewing their profile or sending a message.
            </p>
          </CardContent>
          <CardFooter class="flex gap-2">
            <Button variant="secondary" onclick={() => sendMessage(user)}
              >{isChannelCreated(user) === true ? 'Send Message' : 'Create Channel'}</Button
            >
          </CardFooter>
        </Card>
      {/each}
    </div>
  {/if}
</div>

<style>
  .user-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Max 3 users per row */
    gap: 2rem; /* Increased gap between cards */
  }

  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
</style>
