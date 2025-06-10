<script lang="ts">
  import * as Card from '@/components/ui/card';
  import * as Dialog from '@/components/ui/dialog';
  import { Button, buttonVariants } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import type { ChannelContext } from '@/contexts/channel-context.svelte';
  import type { MyUserContext } from '@/contexts/my-user-context.svelte';
  import SearchBar from '@/components/ui/search-bar.svelte';
  import type { UserListItem, ChannelMessage } from '@baragaun/bg-node-client';
  import { getContext, onMount } from 'svelte';
  import { BadgeInfo, Edit, Ellipsis, Send } from 'lucide-svelte';
  import MessageInput from '../chat/components/message-input.svelte';
  import MessageList from '../chat/components/message-list.svelte';
  import { format } from 'date-fns';
  import { UsersContext } from '@/contexts/users-context.svelte';

  const channelContext = getContext<ChannelContext>('channelContext');
  const myUserContext = getContext<MyUserContext>('myUserContext');
  const usersContext = getContext<UsersContext>('usersContext');

  let searchQuery = $state('');
  let openDialogUserId = $state<string | null>(null);
  let userList = $derived(usersContext.users.filter((user) => user.userHandle
    ?.toLowerCase()
    .includes(searchQuery.toLowerCase())));

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
</script>

<div class="container mx-auto max-w-4xl py-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Find Users</h1>
    <div class="flex items-center gap-2">
      <SearchBar on:search={(event) => (searchQuery = event.detail)} />
    </div>
  </div>

  <div class="grid sm: grid-cols-2 gap-4">
    {#each userList as user}
      <Card.Root class='relative'>
        <Card.Header class="flex gap-2 items-center">
            <img
              src={user.avatarUrl || 'src/assets/icon.svg'}
              alt={user.userHandle}
              class="aspect-ratio-square max-h-24"
            />
          <Button disabled variant='ghost' size='icon' class='absolute top-0 right-2'>
            <Ellipsis class='h-5 w-5' />
          </Button> 
        </Card.Header>
        <Card.Content class='max-h-48 flex flex-col flex-grow items-center justify-center gap-4'>
          <Card.Title>{user.userHandle}</Card.Title>
          <Card.Description>
            <p class='text-ellipsis'>Connect with {user.userHandle} by viewing their profile or sending a message.</p>
          </Card.Description>
        </Card.Content>
        <Card.Footer class="flex justify-end">
          <Dialog.Root
            open={openDialogUserId === user.id} 
            onOpenChange={(open) => openDialogUserId = open ? user.id : null}
          >
            <Dialog.Trigger class={buttonVariants({variant: 'default', size: 'sm'})}>
              <Send class='h-5 w-5' />
              Chat
            </Dialog.Trigger>
            <Dialog.Content class='rounded-xl'>
              <Dialog.Header>
                <Dialog.Title class='flex items-center gap-2'>
                  <Edit class='h-5 w-5' />
                  New message
                </Dialog.Title>
              </Dialog.Header>
              <div class='flex flex-col items-center justify-center gap-4 py-6'>
                <img
                  src={user.avatarUrl || 'src/assets/icon.svg'}
                  alt={user.userHandle}
                  class="aspect-ratio-square max-h-24"
                />
                <div class='flex flex-col items-center justify-center gap-4'>
                  <Dialog.Title>
                    <span class='text-muted-foreground'>@</span>{user.userHandle}
                  </Dialog.Title>
                  <div class='flex flex-col gap-6 p-6'>
                    <div class="flex flex-col rounded-lg rounded-bl-none px-4 py-2 bg-muted">
                      <span class='text-muted-foreground text-xs self-start'>FirstSpark</span>
                      <p class="mt-1 flex items-center justify-end gap-1 text-xs text-foreground">
                        Hey, {myUserContext.myUserHandle}! 👋 The most productive conversations start with a brief introduction, the necessary context, and a simple, actionable request. Do you think you can take it from here?
                      </p>
                      <span class='text-muted-foreground text-xs self-end'>a moment ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <Dialog.Footer>
                <MessageInput onSendMessage={(messageText) => handleSendMessage(user, messageText)} />
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </Card.Footer>
      </Card.Root>
    {/each}
  </div>
</div>
