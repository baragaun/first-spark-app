<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="flex h-full w-full items-center justify-center bg-background">
  <div class="flex origin-center rotate-90 flex-col items-center" style="max-width: 100vh; max-height: 100vw;">
    {@render children?.()}
    <span class="mt-4 text-xs text-muted-foreground">Scan or show at checkout</span>
  </div>
</div>
