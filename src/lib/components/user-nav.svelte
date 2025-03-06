<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { goto } from '$app/navigation';
  import { LogOut, Loader2 } from 'lucide-svelte';
  import { authStore } from './nav-bar.svelte';
  import fsdata from '$lib/services/fsdata/fsdata';
  import { onMount } from 'svelte';
  import { CachePolicy, type MyUser } from '@baragaun/bg-node-client';

  let isLoggingOut = $state(false);
  let currentUser = $state<MyUser | null>(null);
  let isLoading = $state(true);

  async function loadMyUser() {
    try {
      if (!fsdata.isSignedIn()) {
        currentUser = null;

        return;
      }

      isLoading = true;
      // todo: Periodically we need to refresh the user object and use CachePolicy.networkFirst
      currentUser = await fsdata.findMyUser(CachePolicy.cacheFirst);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      isLoading = false;
    }
  }

  // Create an effect that runs after initialization
  $effect(() => {
    // Wait a tick to ensure layout initialization completes
    setTimeout(loadMyUser, 0);
  });

  const handleLogout = async () => {
    try {
      isLoggingOut = true;
      await fsdata.signMeOut();
      authStore.set({ isAuthenticated: false });
      currentUser = null;
      await goto('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      isLoggingOut = false;
    }
  };

  function getInitials(firstName?: string, lastName?: string): string {
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    } else if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    } else if (lastName) {
      return lastName.slice(0, 2).toUpperCase();
    }
    return 'GU';
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <Button variant="ghost" class="relative h-8 w-8 rounded-full">
      <Avatar.Root class="h-9 w-9">
        {#if currentUser?.avatarUrl}
          <Avatar.Image src={currentUser.avatarUrl} alt={`@${currentUser.userHandle}`} />
        {:else if currentUser?.userHandle}
          <Avatar.Fallback>
            {getInitials(currentUser.firstName ?? undefined, currentUser.lastName ?? undefined)}
          </Avatar.Fallback>
        {:else}
          <Avatar.Fallback>GU</Avatar.Fallback>
        {/if}
      </Avatar.Root>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56" align="end">
    <DropdownMenu.Label class="font-normal">
      <div class="flex flex-col space-y-1">
        {#if isLoading}
          <p class="text-sm font-medium leading-none">Loading...</p>
        {:else if currentUser}
          <p class="text-sm font-medium leading-none">{currentUser.userHandle}</p>
          <p class="text-xs leading-none text-muted-foreground">
            {currentUser.email || 'No email'}
          </p>
        {:else}
          <p class="text-sm font-medium leading-none">Guest</p>
          <p class="text-xs leading-none text-muted-foreground">Not signed in</p>
        {/if}
      </div>
    </DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        Profile
        <DropdownMenu.Shortcut>⌘P</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        Inbox
        <DropdownMenu.Shortcut>⌘I</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        Settings
        <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      onclick={handleLogout}
      class="bg-destructive text-white focus:bg-destructive focus:text-white"
      disabled={isLoggingOut}
    >
      {#if isLoggingOut}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Signing out...
      {:else}
        <LogOut class="mr-2 h-4 w-4" />
        Log out
      {/if}
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
