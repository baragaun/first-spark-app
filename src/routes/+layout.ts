// import { myUserContext } from '$lib/context/my-user-context.svelte';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const ssr = false;

export const load: LayoutLoad = async () => {
  try {
    if (!browser) {
      console.log('Layout.load: not running in browser, skipping initialization');
      return {
        initialized: false,
        error: null,
      };
    }

    console.log('Layout.load called');

    // if (!myUserContext.isInitialized) {
    //   console.log('Layout.load: Initializing MyUserContext');
    //   await myUserContext.initialize();
    //   console.log('Layout.load initialized successfully');
    // }

    return {
      initialized: true,
      error: null,
    };
  } catch (error) {
    console.error('Layout.load: Failed to initialize:', error);

    return {
      initialized: false,
      error: (error as Error).message,
    };
  }
};
