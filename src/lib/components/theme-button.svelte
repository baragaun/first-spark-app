<script lang="ts">
  import Sun from '@lucide/svelte/icons/sun';
  import Moon from '@lucide/svelte/icons/moon';
  import { toggleMode } from 'mode-watcher';
  import { Button } from '$lib/components/ui/button/index.js';

  const { iconButton = true, class: className = '' } = $props();
</script>

<Button
  onclick={toggleMode}
  variant="ghost"
  size={iconButton ? 'icon' : 'sm'}
  class={`${className} text-muted-foreground`}
>
  <div class={'flex items-center'}>
    <Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    {#if !iconButton}
      <span class="ml-2">Toggle theme</span>
    {/if}
  </div>
  <span class="sr-only">Toggle theme</span>
</Button>
