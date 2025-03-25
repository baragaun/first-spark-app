<script lang="ts">
  import { setContext } from 'svelte';
  import { myUserContext } from './my-user-context.svelte';
  import { onMount } from 'svelte';

  // Set the user context for child components to consume
  setContext('myUserContext', myUserContext);

  onMount(() => {
    console.log('UserProvider.onMount called.');
    if (!myUserContext.isInitialized) {
      console.log('UserProvider.onMount: Initializing MyUserContext');
      myUserContext.initialize().catch((error) => {
        console.error('UserProvider.onMount: Error initializing MyUserContext:', error);
      });
      console.log('UserProvider.onMount: initialized successfully');
    }
  });
</script>

<slot />
// todo change to render
