<script lang="ts">
  import { setContext, type Snippet } from 'svelte';
  import { myUserContext } from './my-user-context.svelte';

  // Set the user context for child components to consume
  setContext('myUserContext', myUserContext);

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
