<script lang="ts">
  import { onMount } from 'svelte';
  import { createMyUserContext } from './my-user-context.svelte';
  
  const myUserContext = createMyUserContext();

  const myUser = $derived(myUserContext.getMyUser());
  const loading = $derived(myUserContext.getIsLoading());
  const error = $derived(myUserContext.getError());
  const isAuthenticated = $derived(myUserContext.isAuthenticated);
  
  let { children } = $props();

  // Refresh user data on mount
  onMount(async () => {
    if (!loading) {
      // myUserContext.loadMyUser();
      return
    }
  });
</script>

{@render children?.({ myUser, loading, error, isAuthenticated })}
