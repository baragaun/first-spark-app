<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="flex h-full w-full items-center bg-background">
  <div class="flex rotate-90 flex-col items-center">
    {@render children?.()}
    <span class="mt-4 text-xs text-gray-500">Scan or show at checkout</span>
  </div>
</div>
