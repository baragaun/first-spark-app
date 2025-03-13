<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';
  import type { HTMLAttributes } from 'svelte/elements';

  type DialogOverlayProps = DialogPrimitive.OverlayProps & {
    class?: string;
  };

  let { class: className, ...props }: DialogOverlayProps = $props();

  let mounted = $state(false);

  $effect(() => {
    mounted = true;
  });
</script>

{#if mounted}
  <DialogPrimitive.Overlay
    class={cn(
      'fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
{/if}
