<script lang="ts">
  import { setContext, type Snippet } from 'svelte';
  import { channelContext } from './channel-context.svelte';

  // Set the user context for child components to consume
  setContext('channelContext', channelContext);

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
