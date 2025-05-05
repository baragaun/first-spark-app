import { myUserContext } from '@contexts/my-user-context.svelte';
import type { LayoutLoad } from './$types';

// Only initialize in browser environment
export const ssr = false;

export const load: LayoutLoad = async () => {
  // Initialize user context in the browser
  if (typeof window !== 'undefined') {
    try {
      if (!myUserContext.isInitialized) {
        await myUserContext.initialize();
      }

      return {
        userInitialized: true,
      };
    } catch (error) {
      console.error('Error initializing user context:', error);
      return {
        userInitialized: false,
        userError: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  return {
    userInitialized: false,
  };
};
