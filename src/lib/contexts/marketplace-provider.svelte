<script lang="ts">
  import { onMount, setContext, type Snippet } from 'svelte';
  import { marketplaceContext } from './marketplace-context.svelte';
  import { myUserContext } from './my-user-context.svelte';

  // Set the user context for child components to consume
  setContext('channelContext', marketplaceContext);

  onMount(() => {
    if (myUserContext.isSignedIn) {
    }
  });

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
