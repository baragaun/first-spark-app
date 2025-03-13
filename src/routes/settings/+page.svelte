<script lang="ts">
  import { goto } from '$app/navigation';

  // Redirect to account settings by default
  $effect(() => {
    goto('/settings/account');
  });
</script>
