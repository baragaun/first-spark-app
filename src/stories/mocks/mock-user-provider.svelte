<script lang="ts">
  import { setContext, type Snippet } from 'svelte';
  import { mockMyUserContext as myUserContext } from './mock-user-context';
  import { onMount } from 'svelte';

  // Set the mock user context for child components to consume
  setContext('myUserContext', myUserContext);

  onMount(() => {
    if (!myUserContext.isInitialized) {
      myUserContext.initialize().catch((error) => {
        console.error('MockUserProvider.onMount: Error initializing MockMyUserContext:', error);
      });
    }
  });
  interface Props {
    children?: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
