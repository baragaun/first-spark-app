<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft, MoreVertical, Search, Archive, BellOff, Ban } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import SearchBar from '@/components/ui/search-bar.svelte';

  interface Contact {
    id: string;
    name: string;
    avatar: string;
  }

  let { contact: channelDetails }: { contact: Contact } = $props();

  const handleBack = () => {
    goto('/chats');
  };

  function handleMessageSearch(e: CustomEvent<string>): void {
    const searchQuery = e.detail.toLowerCase().trim();
    if (searchQuery) {
      // Dispatch a custom event to parent component to filter messages
      const searchEvent = new CustomEvent('messageSearch', {
        detail: { query: searchQuery },
        bubbles: true,
      });
      document.dispatchEvent(searchEvent);
    }
  }
</script>

<div class="flex items-center justify-between border-b p-4">
  <div class="flex items-center gap-4">
    <Button variant="ghost" size="icon" onclick={handleBack}>
      <ArrowLeft class="h-5 w-5" />
    </Button>

    <Avatar.Root class="h-10 w-10">
      <Avatar.Fallback>{channelDetails.name.charAt(0)}</Avatar.Fallback>
    </Avatar.Root>

    <div>
      <h2 class="font-medium">{channelDetails.name}</h2>
      <p class="text-xs text-muted-foreground">Online</p>
    </div>
  </div>

  <div class="flex items-end gap-2">
    <SearchBar
      placeholder="Search messages..."
      iconSize="h-4 w-4"
      on:search={handleMessageSearch}
    />
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost" size="icon">
          <MoreVertical class="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item>
          <Search class="mr-2 h-4 w-4" />
          Search
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Archive class="mr-2 h-4 w-4" />
          Archive
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <BellOff class="mr-2 h-4 w-4" />
          Mute
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Ban class="mr-2 h-4 w-4" />
          Block
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</div>
