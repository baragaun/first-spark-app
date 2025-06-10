<script lang="ts">
  import UsersProvider from '@/contexts/users/users-provider.svelte';
  let { children } = $props();
</script>

<UsersProvider>
  {@render children?.()}
</UsersProvider>
