<script lang="ts">
  import ChannelProvider from '@/contexts/channels/channel-provider.svelte';
  import UsersProvider from '@/contexts/users/users-provider.svelte';
  let { children } = $props();
</script>

<UsersProvider>
  <ChannelProvider>
    {@render children?.()}
  </ChannelProvider>
</UsersProvider>
