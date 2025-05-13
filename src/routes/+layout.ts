import { myUserContext } from '@/contexts/my-user-context.svelte';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// Only initialize in browser environment
export const ssr = false;

export const load: LayoutLoad = async ({ url }) => {
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
    } finally {
      if (url.pathname === '/settings/notifications') {
        redirect(302, '/settings');
        // Redirect to the Account tab or main Settings page
      }
    }
  }

  return {
    userInitialized: false,
  };
};
