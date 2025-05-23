<script lang="ts">
  import { onMount, setContext, type Snippet } from 'svelte';
  import { myUserContext } from './my-user-context.svelte';

  setContext('myUserContext', myUserContext);

  onMount(() => {
    myUserContext.initialize();
  });

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
