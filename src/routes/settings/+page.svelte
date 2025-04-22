<script lang="ts">
  import { goto } from '$app/navigation';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { onMount } from 'svelte';

  const isSignedIn = $derived(myUserContext.isSignedIn);

  onMount(() => {
    if (!isSignedIn) {
      goto('/signin', { replaceState: true });
    }
    goto('/settings/account', { replaceState: true });
  });
</script>
