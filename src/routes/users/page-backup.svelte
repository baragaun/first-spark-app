<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import * as Card from '@/components/ui/card';
  import * as Dialog from '@/components/ui/dialog';
  import { Button, buttonVariants } from '@/components/ui/button';
  import type { ChannelContext } from '@/contexts/channels/channel-context.svelte';
  import type { MyUserContext } from '@/contexts/users/my-user-context.svelte';
  import SearchBar from '@/components/ui/search-bar.svelte';
  import type { UserListItem, ChannelMessage } from '@baragaun/bg-node-client';
  import { getContext, onMount } from 'svelte';
  import { BadgeInfo, Edit, Ellipsis, Send } from 'lucide-svelte';
  import MessageInput from '../chat/components/message-input.svelte';
  import MessageList from '../chat/components/message-list.svelte';
  import { format } from 'date-fns';
  import type { UsersContext } from '@/contexts/users/users-context.svelte';
  import { m } from '@/paraglide/messages';

  const channelContext = getContext<ChannelContext>('channelContext');
  const myUserContext = getContext<MyUserContext>('myUserContext');
  const usersContext = getContext<UsersContext>('usersContext');

  const channelId = $derived(page.params.channelId);
  let openDialogUserId = $state<string | null>(null);

  let userList = $derived.by(() => {
    if (!usersContext?.users) return [];

    if (usersContext.searchText) {
      const filtered = usersContext.users.filter((user) =>
        user.userHandle?.toLowerCase().includes(usersContext.searchText.toLowerCase()),
      );
      return filtered;
    }

    return usersContext.users;
  });

  const handleSearch = async (searchText: string) => {
    if (!usersContext) return;

    if (searchText.trim()) {
      await usersContext.searchUsers(searchText, [myUserContext.myUserId || '']);
    } else {
      await usersContext.clearSearch([myUserContext.myUserId || '']);
    }
  };

  const handleSendMessage = async (user: UserListItem, messageText: string) => {
    try {
      const channel = await channelContext.createChannel({
        userIds: [user.id],
      });

      if (!channel || typeof channel === 'string') {
        console.error('CreateChannel: received error.', { channel });
        return;
      }

      const newMessage: Partial<ChannelMessage> = {
        channelId: channel.id,
        messageText,
      };

      const response = await channelContext.createChannelMessage(newMessage);
      if (!response || typeof response === 'string') {
        console.error('CreateChannelMessage: received error.', { response });
        return;
      }

      openDialogUserId = null;
      goto(`/chat/${channel.id}`);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  onMount(async () => {
    if (usersContext && myUserContext.myUserId) {
      try {
        await usersContext.ensureUsersLoaded([myUserContext.myUserId]);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    }
  });
</script>

<div class="p-8">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Find Users</h1>
    <div class="flex items-center gap-2">
      <SearchBar on:search={(event) => handleSearch(event.detail)} />
    </div>
  </div>

  {#if usersContext?.isUserLoading}
    <div class="py-8 text-center">Loading users...</div>
  {:else if userList.length === 0}
    <div class="py-8 text-center text-muted-foreground">
      {usersContext?.searchText ? 'No users found matching your search.' : ' No users available.'}
    </div>
  {:else}
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {#each userList as user}
        <Card.Root class="relative">
          <Card.Header class="flex items-center gap-2">
            <img
              src={user.avatarUrl || 'src/assets/icon.svg'}
              alt={user.userHandle}
              class="aspect-ratio-square max-h-24"
            />
            <Button disabled variant="ghost" size="icon" class="absolute right-2 top-0">
              <Ellipsis class="h-5 w-5" />
            </Button>
          </Card.Header>
          <Card.Content class="flex max-h-48 flex-grow flex-col items-center justify-center gap-4">
            <Card.Title>{user.userHandle}</Card.Title>
            <Card.Description>
              <p class="text-ellipsis">
                Connect with {user.userHandle} by viewing their profile or sending a message.
              </p>
            </Card.Description>
          </Card.Content>
          <Card.Footer class="flex justify-end">
            <Dialog.Root
              open={openDialogUserId === user.id}
              onOpenChange={(open) => (openDialogUserId = open ? user.id : null)}
            >
              <Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'sm' })}>
                <Send class="h-5 w-5" />
                Chat
              </Dialog.Trigger>
              <Dialog.Content class="rounded-xl">
                <Dialog.Header>
                  <Dialog.Title class="flex items-center gap-2">
                    <Edit class="h-5 w-5" />
                    {m['chat.compose']()}
                  </Dialog.Title>
                </Dialog.Header>
                <div class="flex flex-col items-center justify-center gap-4 py-6">
                  <img
                    src={user.avatarUrl || 'src/assets/icon.svg'}
                    alt={user.userHandle}
                    class="aspect-ratio-square max-h-24"
                  />
                  <div class="flex flex-col items-center justify-center gap-4">
                    <Dialog.Title>
                      <span class="text-muted-foreground">@</span>{user.userHandle}
                    </Dialog.Title>
                    <div class="flex flex-col gap-6 p-6">
                      <div class="flex flex-col rounded-lg rounded-bl-none bg-muted px-4 py-2">
                        <span class="self-start text-xs text-muted-foreground">FirstSpark</span>
                        <p class="mt-1 flex items-center justify-end gap-1 text-xs text-foreground">
                          {m['chat.compose_tip']({
                            userHandle: myUserContext.myUserHandle || 'friend',
                          })}
                        </p>
                        <span class="self-end text-xs text-muted-foreground">a moment ago</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Dialog.Footer>
                  <MessageInput
                    onSendMessage={(messageText) => handleSendMessage(user, messageText)}
                  />
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </Card.Footer>
        </Card.Root>
      {/each}
    </div>
  {/if}
</div>
