<script lang="ts">
  import { onMount, setContext, type Snippet } from 'svelte';
  import { channelContext } from './channel-context.svelte';

  // Set the user context for child components to consume
  setContext('channelContext', channelContext);

  onMount(() => {
    channelContext.findMyChannels();
  });

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
