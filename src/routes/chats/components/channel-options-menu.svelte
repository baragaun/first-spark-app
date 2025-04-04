<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Archive, Trash2, BellOff, Pin, ChevronDown } from 'lucide-svelte';

  let {
    channelId,
    onDeleteChannel,
  }: {
    channelId: string;
    onDeleteChannel: (id: string) => void;
  } = $props();

  const handleDelete = () => {
    onDeleteChannel(channelId);
  };
</script>

<div
  class="touch-action-none absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 hover:bg-black/30 dark:bg-primary-foreground/20 dark:hover:bg-primary-foreground/30"
    >
      <ChevronDown class="h-4 w-4" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="start">
      <DropdownMenu.Item>
        <Archive class="mr-2 h-4 w-4" />
        Archive
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        <Pin class="mr-2 h-4 w-4" />
        Pin
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        <BellOff class="mr-2 h-4 w-4" />
        Mute
      </DropdownMenu.Item>
      <DropdownMenu.Item
        class="text-destructive focus:bg-destructive focus:text-destructive-foreground"
        onclick={handleDelete}
      >
        <Trash2 class="mr-2 h-4 w-4" />
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>

<style>
  /* Add support for long press on mobile */
  @media (pointer: coarse) {
    :global(.group:active) .touch-action-none {
      opacity: 1;
    }
  }
</style>
