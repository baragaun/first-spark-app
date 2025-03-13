<script lang="ts">
  import { cn } from '$lib/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type DialogFooterProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    class?: string;
    children?: Snippet;
  };

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: DialogFooterProps = $props();
</script>

<div
  bind:this={ref}
  class={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
  {...restProps}
>
  {@render children?.()}
</div>
