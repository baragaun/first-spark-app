<script lang="ts">
  import { goto } from '$app/navigation';
  import { myUserContext } from '@/contexts/my-user-context.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!myUserContext.isAuthenticated) {
      goto('/signin', { replaceState: true });
    }
    goto('/settings/account', { replaceState: true });
  });
</script>
