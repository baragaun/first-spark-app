<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { MockMyUserContext } from './mock-user-context';

  let { children, isSignedIn = false } = $props();

  // Create a mock user context instance
  const myUserContext = new MockMyUserContext();

  // Set the mock user context for child components to consume
  setContext('myUserContext', myUserContext);

  let isInitialized = $state(false);
  let error = $state<string | null>(null);

  // Initialize the context immediately
  const initContext = async () => {
    try {
      await myUserContext.initialize();
      isInitialized = true;
    } catch (err) {
      console.error('MockUserProvider: Error initializing MockMyUserContext:', err);
      error = err instanceof Error ? err.message : 'Unknown error initializing context';
    }
  };

  onMount(() => {
    // Ensure the context is initialized
    initContext();
  });
</script>

{#if error}
  <div style="color: red; padding: 20px; border: 1px solid red; margin: 20px;">
    Error initializing mock user context: {error}
  </div>
{:else if isInitialized}
  {#if children}
    {@render children()}
  {/if}
{:else}
  <div style="padding: 20px; text-align: center;">Initializing mock user context...</div>
{/if}
