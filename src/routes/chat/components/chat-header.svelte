<script lang="ts">
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft, MoreVertical, Archive, BellOff, Ban } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import type { ContactDetails } from '@/helpers/types';

  let { contact: channelDetails }: { contact: ContactDetails | undefined } = $props();

  const handleBack = () => {
    goto('/chat');
  };
</script>

<div class="flex items-center justify-between border-b p-4">
  <div class="flex items-center gap-4">
    <Button variant="ghost" size="icon" onclick={handleBack}>
      <ArrowLeft class="h-5 w-5" />
    </Button>

    <Avatar.Root class="h-10 w-10">
      <Avatar.Fallback>{channelDetails?.name?.charAt(0) || '?'}</Avatar.Fallback>
    </Avatar.Root>

    <div>
      <h2 class="font-medium">{channelDetails?.name}</h2>
      <p class="text-xs text-muted-foreground">Online</p>
    </div>
  </div>

  <div class="flex items-end gap-2">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger aria-label="More chat options">
        <Button variant="ghost" size="icon">
          <MoreVertical class="h-5 w-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
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
