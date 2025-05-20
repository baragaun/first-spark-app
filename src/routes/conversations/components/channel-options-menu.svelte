<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Archive, Trash2, ChevronDown } from 'lucide-svelte';

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

<div class="touch-action-none">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 dark:bg-primary-foreground/10"
      aria-label="Channel options"
    >
      <ChevronDown class="h-4 w-4" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item>
        <Archive class="mr-2 h-4 w-4" />
        Archive
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
