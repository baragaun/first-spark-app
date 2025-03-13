<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';
  import type { Snippet } from 'svelte';

  type DialogDescriptionProps = DialogPrimitive.DescriptionProps & {
    class?: string;
    children?: Snippet;
  };

  let { ref = $bindable(null), class: className, children }: DialogDescriptionProps = $props();

  let descriptionClasses = $derived.by(() => cn('text-sm text-muted-foreground', className));
</script>

<DialogPrimitive.Description bind:ref class={descriptionClasses}>
  {@render children?.()}
</DialogPrimitive.Description>
