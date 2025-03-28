<script lang="ts">
  import { setContext, type Snippet } from 'svelte';
  import { myUserContext } from './my-user-context.svelte';
  import { onMount } from 'svelte';

  // Set the user context for child components to consume
  setContext('myUserContext', myUserContext);

  onMount(() => {
    if (!myUserContext.isInitialized) {
      myUserContext.initialize().catch((error) => {
        console.error('UserProvider.onMount: Error initializing MyUserContext:', error);
      });
    }
  });

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
