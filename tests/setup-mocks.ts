import { vi } from 'vitest';

// Mock navigation
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  beforeNavigate: vi.fn(),
  afterNavigate: vi.fn(),
  disableScrollHandling: vi.fn(),
  onNavigate: vi.fn(),
  invalidate: vi.fn(),
  invalidateAll: vi.fn(),
  preloadData: vi.fn(),
  preloadCode: vi.fn(),
}));

// Mock user context
vi.mock('@/contexts/my-user-context.svelte', () => {
  const mockMethods: Record<string, any> = {};
  const methods = [
    'signUpUser',
    'verifyMyEmail',
    'verifyMultiStepActionToken',
    'updateMyUser',
    'isUserIdentAvailable',
    'findAvailableUserHandle',
    'signMeInWithPassword',
    'signMeInWithToken',
  ];

  methods.forEach((method) => {
    mockMethods[method] = vi.fn();
  });

  return {
    myUserContext: mockMethods,
  };
});
