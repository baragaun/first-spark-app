<script lang="ts">
  import ChannelProvider from '@/contexts/channels/channel-provider.svelte';
  import UsersProvider from '@/contexts/users/users-provider.svelte';
  let { children } = $props();
</script>

<ChannelProvider>
  <UsersProvider>
    {@render children?.()}
  </UsersProvider>
</ChannelProvider>
