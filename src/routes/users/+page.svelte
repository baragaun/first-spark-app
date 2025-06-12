<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Card from '@/components/ui/card';
  import * as Dialog from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  import type { ChannelContext } from '@/contexts/channels/channel-context.svelte';
  import type { MyUserContext } from '@/contexts/users/my-user-context.svelte';
  import type { UserListItem, ChannelMessage } from '@baragaun/bg-node-client';
  import { getContext, onMount } from 'svelte';
  import { Edit, Ellipsis, X } from 'lucide-svelte';
  import MessageInput from '../chat/components/message-input.svelte';
  import type { UsersContext } from '@/contexts/users/users-context.svelte';
  import { m } from '@/paraglide/messages';
  import { Input } from '@/components/ui/input';
  import { debounce } from 'throttle-debounce';

  const channelContext = getContext<ChannelContext>('channelContext');
  const myUserContext = getContext<MyUserContext>('myUserContext');
  const usersContext = getContext<UsersContext>('usersContext');

  let openDialogUserId = $state<string | null>(null);
  let inputRef = $state<HTMLInputElement | null>(null);

  let searchText = $derived(usersContext.searchText);

  let userList = $derived.by(() => {
    if (!usersContext?.users) return [];

    if (searchText) {
      const filtered = usersContext.users.filter((user) =>
        user.userHandle?.toLowerCase().includes(searchText.toLowerCase()),
      );
      return filtered;
    }

    return usersContext.users;
  });

  let skip = $derived.by(() => userList.length);

  const handleScroll = async (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 100) {
      if (usersContext && myUserContext.myUserId) {
        await usersContext.getAllUsers([myUserContext.myUserId], skip);
      }
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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

  const debouncedSearch = debounce(300, async (searchQuery: string) => {
    if (!usersContext) return;

    if (searchQuery.trim()) {
      await usersContext.searchUsers(searchQuery, [myUserContext.myUserId || '']);
    } else {
      await usersContext.clearSearch([myUserContext.myUserId || '']);
    }
  });

  const handleInput = async () => {
    const currentSearchText = usersContext.searchText;
    debouncedSearch(currentSearchText);
  };

  const handleClearSearch = async () => {
    searchText = '';
    if (usersContext) {
      await usersContext.clearSearch([myUserContext.myUserId || '']);
    }
    inputRef?.focus();
  };
</script>

<!-- THIS IS BEING REFACTORED INTO A COMPONENT - the original "Find Users" will become "Contacts" later -->

<div class="flex flex-col gap-6 p-8">
  <div class="relative flex items-center justify-center">
    <Input
      bind:ref={inputRef}
      type="text"
      placeholder={m['users.search']()}
      bind:value={usersContext.searchText}
      onkeydown={handleKeyDown}
      oninput={handleInput}
      class="pr-16"
    />
    <div class="absolute right-0 flex">
      <Button
        variant="ghost"
        class="h-8 w-8"
        onclick={searchText ? handleClearSearch : null}
        aria-label={searchText ? 'Clear search' : 'Close search'}
      >
        <X class="h-4 w-4" />
      </Button>
    </div>
  </div>
  {#if usersContext?.isUserLoading && usersContext.searchText}
    <div class="py-8 text-center">Loading users...</div>
  {:else if userList.length === 0}
    <div class="py-8 text-center text-muted-foreground">
      {usersContext?.searchText ? 'No users found matching your search.' : ' No users available.'}
    </div>
  {:else}
    <div
      class="flex max-h-[calc(100vh-280px)] flex-col space-y-2 overflow-auto py-4"
      onscroll={handleScroll}
    >
      {#each userList as user (user.id)}
        <Dialog.Root
          open={openDialogUserId === user.id}
          onOpenChange={(open) => (openDialogUserId = open ? user.id : null)}
        >
          <Dialog.Trigger>
            <Card.Root class="relative max-h-36">
              <Card.Content class="flex flex-grow items-center justify-between p-4">
                <div class="flex items-center gap-4">
                  <img
                    src={user.avatarUrl || 'src/assets/icon.svg'}
                    alt={user.userHandle}
                    class="aspect-ratio-square max-h-12"
                  />
                  <div class="flex flex-col items-start gap-1">
                    <Card.Title>{user.userHandle}</Card.Title>
                    <Card.Description>
                      <p class="text-ellipsis">
                        Connect with {user.userHandle} by sending a message.
                      </p>
                    </Card.Description>
                  </div>
                </div>
                <Button disabled variant="ghost" size="icon" class="">
                  <Ellipsis class="h-5 w-5" />
                </Button>
              </Card.Content>
            </Card.Root>
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
              <MessageInput onSendMessage={(messageText) => handleSendMessage(user, messageText)} />
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      {/each}
    </div>
  {/if}
</div>
