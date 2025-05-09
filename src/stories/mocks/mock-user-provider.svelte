<script lang="ts">
  import { setContext, type Snippet } from 'svelte';
  import { MockMyUserContext } from './mock-user-context';
  import { onMount } from 'svelte';

  interface Props {
    children?: Snippet;
    signedIn?: boolean;
  }

  const { children, signedIn = false }: Props = $props();

  // Create a new instance of the mock context
  const myUserContext = new MockMyUserContext();

  // Initialize the context immediately
  myUserContext.isInitialized = true;

  // Set the user's signed-in state based on the prop
  if (signedIn) {
    // Set the mock user
    myUserContext.myUser.set({
      id: '1234567890',
      email: 'test@example.com',
      userHandle: 'testuser',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEmailVerified: true,
      spokenLanguagesTextIds: [],
      roles: [],
      trustLevel: 0,
      isPhoneNumberVerified: false,
    });
    myUserContext.myUser.id = '1234567890';
  } else {
    // Clear the user
    myUserContext.myUser.set(null);
    myUserContext.myUser.id = '';
  }

  // Set the mock user context for child components to consume
  setContext('myUserContext', myUserContext);

  onMount(() => {
    // Ensure the context is initialized
    myUserContext.initialize().catch((error) => {
      console.error('MockUserProvider.onMount: Error initializing MockMyUserContext:', error);
    });
  });
</script>

{@render children?.()}
