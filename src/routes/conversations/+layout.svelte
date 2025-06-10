<script lang="ts">
  import ChannelProvider from '@/contexts/channel-provider.svelte';

  let { children } = $props();
</script>

<ChannelProvider>
  {@render children?.()}
</ChannelProvider>
