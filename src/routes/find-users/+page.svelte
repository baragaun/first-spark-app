<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import SearchBar from '@/components/ui/search-bar.svelte';
  import type { User } from '@baragaun/bg-node-client';
  import { onMount } from 'svelte';
  import { channelContext } from '@/contexts/channel-context.svelte';

  let userList = $state<Partial<User>[]>([
    { id: '1', firstName: 'Alice Johnson', avatarUrl: 'https://randomuser.me/api/portraits/men/61.jpg' },
    { id: '2', firstName: 'Bob Smith', avatarUrl: 'https://randomuser.me/api/portraits/men/62.jpg' },
    { id: '3', firstName: 'Charlie Brown', avatarUrl: 'https://randomuser.me/api/portraits/men/63.jpg' },
    { id: '4', firstName: 'Diana Prince', avatarUrl: 'https://randomuser.me/api/portraits/men/64.jpg' },
    { id: '5', firstName: 'Ethan Hunt', avatarUrl: 'https://randomuser.me/api/portraits/men/66.jpg' },
    { id: '6', firstName: 'Fiona Gallagher', avatarUrl: 'https://randomuser.me/api/portraits/men/69.jpg' },
  ]);
  let searchQuery = $state(''); // State for search query
  let filteredUsers = $state<Partial<User>[]>([]); // State for filtered users

  // Filter users based on the search query
  $effect(() => {
    filteredUsers = userList.filter((user) =>
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  });

  // Navigate to the user's profile
  const viewProfile = (userId: string) => {
    goto(`/profile/${userId}`);
  };

  // Navigate to the send message page
  const sendMessage = (userId: string) => {
    goto(`/conversations/${userId}`);
  };
  onMount(async () => {
    filteredUsers = userList;
    const users = await channelContext.findUsers();
    if (!users || !Array.isArray(users)) {
      console.error('FindUsers: received error.', { users });
      return;
    }
    userList = users;
  });
</script>

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

<div class="container mx-auto max-w-4xl py-6">
    <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Find Users</h1>
    <div class="flex items-center gap-2">
      <SearchBar on:search={(event) => (searchQuery = event.detail)} />
    </div>
  </div>

  <div class="user-grid">
    {#each filteredUsers as user}
      <Card>
        <CardHeader class="flex items-center gap-4">
          <img src={user.avatarUrl} alt={user.userHandle} class="user-avatar" />
          <CardTitle>{user.firstName} {user.lastName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">Connect with {user.userHandle} by viewing their profile or sending a message.</p>
        </CardContent>
        <CardFooter class="flex gap-2">
          <Button onclick={() => viewProfile(user.id??'')}>View Profile</Button>
          <Button variant="secondary" onclick={() => sendMessage(user.id??''
        )}>Send Message</Button>
        </CardFooter>
      </Card>
    {/each}
  </div>
</div>