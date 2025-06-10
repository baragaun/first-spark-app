<script lang="ts">
  import { getContext, setContext, type Snippet } from 'svelte';
  import type { MyUserContext } from '../users/my-user-context.svelte';
  import { channelContext } from './channel-context.svelte';

  const myUserContext = getContext<MyUserContext>('myUserContext');

  if (myUserContext.isSignedIn) {
    setContext('channelContext', channelContext);
  }

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
