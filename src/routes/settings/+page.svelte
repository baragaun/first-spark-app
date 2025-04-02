<script lang="ts">
  import { goto } from '$app/navigation';
  import { isSignedIn } from '@/contexts/my-user-context.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!isSignedIn) {
      goto('/signin', { replaceState: true });
    }
    goto('/settings/account', { replaceState: true });
  });
</script>
