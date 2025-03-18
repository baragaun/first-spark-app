<script lang="ts">
  import { setContext } from 'svelte';
  import { userContext } from './userContext.svelte';
  import { onMount } from 'svelte';

  // Set the user context for child components to consume
  setContext('userContext', userContext);

  // Refresh user data on mount
  onMount(() => {
    userContext.loadUser();
  });
</script>

<slot />
