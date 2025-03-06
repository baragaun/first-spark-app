<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';
  import type { ComponentProps } from 'svelte';
  import { useSidebar } from './context.svelte.js';
  import { Menu } from 'lucide-svelte';

  let {
    ref = $bindable(null),
    class: className,
    onclick,
  }: ComponentProps<typeof Button> & {
    onclick?: (e: MouseEvent) => void;
  } = $props();

  const sidebar = useSidebar();
</script>

<Menu
  onclick={(e) => {
    onclick?.(e);
    sidebar.toggle();
  }}
  data-sidebar="trigger"
  class={cn(
    'flex h-10 w-10 rounded-md p-2 hover:bg-accent hover:text-accent-foreground',
    className,
  )}
/>

<!-- <Button
  type="button"
  onclick={(e) => {
    onclick?.(e);
    sidebar.toggle();
  }}
  data-sidebar="trigger"
  variant="ghost"
  size="icon"
  class={cn('h-10 w-10', className)}
  {...restProps}
>
  <Menu />
  <span class="sr-only">Toggle Sidebar</span>
</Button> -->
