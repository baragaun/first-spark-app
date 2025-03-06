import { browser } from '$app/environment';
import init from '$lib/services/fsdata/init';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  // Only initialize in browser environment
  if (browser) {
    try {
      await init();
      console.log('BgNodeClient initialized successfully');

      return {
        initialized: true,
        error: null,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize client');
      console.error('Failed to initialize BgNodeClient:', error);

      return {
        initialized: false,
        error: error.message,
      };
    }
  }

  // Return default state for server-side rendering
  return {
    initialized: false,
    error: null,
  };
};