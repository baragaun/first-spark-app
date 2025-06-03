<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import SearchBar from '@/components/ui/search-bar.svelte';
  import { onMount } from 'svelte';
  import { channelContext } from '@/contexts/channel-context.svelte';

  let searchQuery = $state(''); // State for search query

  // Navigate to the user's profile
  const viewProfile = (userId: string) => {
    goto(`/profile/${userId}`);
  };

  // Navigate to the send message page
  const sendMessage = async (userId: string) => {
    console.log('sendMessage', { userId });
    const channel = await channelContext.createChannel({ userIds: [userId] });

    if (typeof channel !== 'string' && channel?.id) {
      console.log('Created channel', channel.id);
      goto(`/conversations/${channel.id}`);
    }
  };

  onMount(async () => {
    await channelContext.findUsers();
  });
</script>

<div class="container mx-auto max-w-4xl py-6">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold">Find Users</h1>
    <div class="flex items-center gap-2">
      <SearchBar on:search={(event) => (searchQuery = event.detail)} />
    </div>
  </div>

  <div class="user-grid">
    {#each channelContext.users as user}
      <Card>
        <CardHeader class="flex items-center gap-4">
          <img
            src={user.avatarUrl || 'src/assets/icon.svg'}
            alt={user.userHandle}
            class="user-avatar"
          />
          <CardTitle>{user.firstName} {user.lastName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Connect with {user.userHandle} by viewing their profile or sending a message.
          </p>
        </CardContent>
        <CardFooter class="flex gap-2">
          <Button onclick={() => viewProfile(user.id ?? '')}>View Profile</Button>
          <Button variant="secondary" onclick={() => sendMessage(user.id ?? '')}
            >Send Message</Button
          >
        </CardFooter>
      </Card>
    {/each}
  </div>
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
