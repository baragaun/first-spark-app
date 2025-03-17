<script lang="ts">
  import { cn } from '$lib/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';
  import type { Snippet } from 'svelte';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    children?: Snippet;
  } = $props();
</script>

<div
  bind:this={ref}
  class={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
  {...restProps}
>
  {@render children?.()}
</div>
