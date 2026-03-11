<script lang="ts">
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';
  import { cn } from '$lib/utils.js';

  type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

  type Props = WithElementRef<
    Omit<HTMLInputAttributes, 'type'> &
      ({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
  >;

  let {
    ref = $bindable(null),
    value = $bindable(),
    type,
    files = $bindable(),
    class: className,
    ...restProps
  }: Props = $props();
</script>

{#if type === 'file'}
  <input
    bind:this={ref}
    class={cn(
      'flex h-11 w-full max-w-xl rounded-xl border border-input bg-background px-4 py-2.5 text-base ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      className,
    )}
    type="file"
    bind:files
    bind:value
    {...restProps}
  />
{:else}
  <input
    bind:this={ref}
    class={cn(
      'flex h-11 w-full max-w-xl rounded-xl border border-input bg-background px-4 py-2.5 text-base ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      className,
    )}
    {type}
    bind:value
    {...restProps}
  />
{/if}
