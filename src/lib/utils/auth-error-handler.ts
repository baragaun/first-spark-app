import { goto } from '$app/navigation';

// Error patterns that indicate an unauthorized/session issue
const UNAUTHORIZED_ERROR_PATTERNS = [
  'unauthorized',
  'not-authorized',
  'user-not-found',
  'session-expired',
  'invalid-token',
  'auth-required',
  'not-authenticated',
];

/**
 * Check if an error indicates an unauthorized/session issue and redirect to signin
 * @param error The error string to check
 * @param options Optional configuration
 * @returns true if it was an unauthorized error and redirect was triggered
 */
export function handleUnauthorizedError(
  error: string | undefined,
  options?: {
    redirectPath?: string;
    onUnauthorized?: () => void;
  },
): boolean {
  if (!error) return false;

  const lowerError = error.toLowerCase();
  const isUnauthorized = UNAUTHORIZED_ERROR_PATTERNS.some((pattern) =>
    lowerError.includes(pattern),
  );

  if (isUnauthorized) {
    console.warn('Unauthorized error detected, redirecting to signin.', { error });

    // Call optional callback (e.g., to reset state)
    options?.onUnauthorized?.();

    // Redirect to signin page (or custom path)
    goto(options?.redirectPath ?? '/signin');
    return true;
  }

  return false;
}

/**
 * Check if an error string matches unauthorized patterns (without redirecting)
 * @param error The error string to check
 * @returns true if it matches an unauthorized error pattern
 */
export function isUnauthorizedError(error: string | undefined): boolean {
  if (!error) return false;

  const lowerError = error.toLowerCase();
  return UNAUTHORIZED_ERROR_PATTERNS.some((pattern) => lowerError.includes(pattern));
}
