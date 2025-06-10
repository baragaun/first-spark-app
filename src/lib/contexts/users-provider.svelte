<script lang="ts">
  import { getContext, onMount, setContext, type Snippet } from 'svelte';
  import type { MyUserContext } from './my-user-context.svelte';
  import { usersContext } from './users-context.svelte';
  
  const myUserContext = getContext<MyUserContext>('myUserContext');
  
  setContext('usersContext', usersContext);

  onMount(() => {
    if (myUserContext.isSignedIn) {
      usersContext.findUsers();
    }
  });

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
