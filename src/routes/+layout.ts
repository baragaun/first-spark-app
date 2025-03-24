// import { myUserContext } from '$lib/context/my-user-context.svelte';
import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  try {
    // todo: I think this here is not run in the browser. We have to initialize
    //       the BgNodeClient in the browser, or it won't have access to IndexedDB.
    //       I moved the initialization code to the provider at src/lib/context/my-user-provider.svelte

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
