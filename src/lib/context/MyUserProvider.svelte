<script lang="ts">
  import { setContext } from 'svelte';
  import { myUserContext } from './myUserContext.svelte';
  import { onMount } from 'svelte';

  // Set the user context for child components to consume
  setContext('myUserContext', myUserContext);

  // Refresh user data on mount
  onMount(() => {
    myUserContext.loadMyUser();
  });
</script>

<slot />
