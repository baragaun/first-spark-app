import { myUserContext } from '@/contexts/my-user-context.svelte';
import {
  MultiStepActionResult,
  MultiStepActionType,
  UserIdentType,
} from '@baragaun/bg-node-client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the entire context
vi.mock('@/contexts/my-user-context.svelte', () => ({
  myUserContext: {
    isUserIdentAvailable: vi.fn(),
    signUpUser: vi.fn(),
    verifyMyEmail: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('Signup Flow Test', () => {
  it('isUserIdentAvailable check', async () => {
    const mockResponse = {
      isAvailable: true,
    };

    // Mock successful email availability check
    vi.mocked(myUserContext.isUserIdentAvailable).mockResolvedValueOnce(mockResponse);

    // Call the function and assert the result
    const data = await myUserContext.isUserIdentAvailable('test@example.com', UserIdentType.email);
    expect(data).toEqual(mockResponse);
  });

  it('signUpUser check', async () => {
    // Mock successful signup user check
    vi.mocked(myUserContext.signUpUser).mockResolvedValueOnce(true);

    // Call the function and assert the result
    const data = await myUserContext.signUpUser('test@example.com');
    expect(data).toEqual(true);
  });

  it('verifyMyEmail check', async () => {
    const mockResponse = {
      object: {
        actionProgress: {
          actionId: 'test-action-id',
          result: MultiStepActionResult.ok,
          userId: 'test-user-id',
          actionType: MultiStepActionType.verifyEmail,
          attemptCount: 0,
          id: 'test-progress-id',
          createdAt: new Date().toISOString(),
        },
        run: {
          actionId: 'test-action-id',
          pollingOptions: { enabled: true },
          addListener: vi.fn(),
          removeListener: vi.fn(),
          onEventReceived: vi.fn(),
          notifyListeners: vi.fn(),
          abort: vi.fn(),
          isStopped: vi.fn().mockReturnValue(false),
          listeners: new Map(),
        },
        id: 'test-object-id',
        createdAt: new Date().toISOString(),
      },
    };

    // Mock successful verify email check
    vi.mocked(myUserContext.verifyMyEmail).mockResolvedValueOnce(mockResponse);

    // Call the function and assert the result
    const data = await myUserContext.verifyMyEmail('test@example.com');
    expect(data).toEqual(mockResponse);
  });
});
