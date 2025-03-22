import { myUserContext } from '$lib/context/my-user-context.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  try {
    if (!myUserContext.isInitialized) {
      console.log('LayoutLoad: Initializing MyUserContext');
      await myUserContext.initialize();
      console.log('LayoutLoad initialized successfully');
    }

    return {
      initialized: true,
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to initialize client');
    console.error('LayoutLoad: Failed to initialize:', error);

    return {
      initialized: false,
      error: error.message,
    };
  }
};
