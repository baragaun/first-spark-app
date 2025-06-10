<script lang="ts">
  import { getContext, onMount, setContext, type Snippet } from 'svelte';
  import { channelContext } from './channel-context.svelte';
  import type { MyUserContext } from '../users/my-user-context.svelte';

  const myUserContext = getContext<MyUserContext>('myUserContext');
  
  setContext('channelContext', channelContext);

  onMount(() => {
    if (myUserContext.isSignedIn) {
      channelContext.findMyChannels();
    }
  });

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
