<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';

  let { ref = $bindable(null), open = $bindable(false), children, ...restProps } = $props();
</script>

<DialogPrimitive.Root bind:open {...restProps}>
  {@render children?.()}
</DialogPrimitive.Root>
