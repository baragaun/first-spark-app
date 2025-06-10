<script lang="ts">
  import { getContext, setContext, type Snippet } from 'svelte';
  import type { MyUserContext } from './my-user-context.svelte';
  import { usersContext } from './users-context.svelte';
  
  const myUserContext = getContext<MyUserContext>('myUserContext');

  if (myUserContext.isSignedIn) {
    setContext('usersContext', usersContext);
  }
  
  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
