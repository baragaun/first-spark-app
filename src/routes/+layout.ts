import { myUserContext } from '@/contexts/my-user-context.svelte';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// Only initialize in browser environment
export const ssr = false;

export const load: LayoutLoad = async ({ url }) => {
  // Define public routes that don't require authentication
  const publicRoutes = ['/signin', '/signup', '/', '/about', '/contact', '/reset-password'];
  const isPublicRoute = publicRoutes.some(
    (route) => url.pathname === route || url.pathname.startsWith(route + '/'),
  );

  // Initialize user context in the browser
  if (typeof window !== 'undefined') {
    try {
      if (!myUserContext.isInitialized) {
        await myUserContext.initialize();
      }

      // Only redirect if not on a public route and user is not signed in
      if (!isPublicRoute && !myUserContext.isSignedIn) {
        throw redirect(302, '/signin');
      }

      return {
        userInitialized: true,
      };
    } catch (error) {
      // If it's a redirect error, re-throw it
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }

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
