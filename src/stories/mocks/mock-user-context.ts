import {
  AuthType,
  CachePolicy,
  MultiStepActionEventType,
  MultiStepActionResult,
  MultiStepActionSendNotificationResult,
  MultiStepActionType,
  MutationType,
  UserIdentType,
  type MultiStepActionProgressResult,
  type MutationResult,
  type MyUser,
  type QueryResult,
  type SignInSignUpResponse,
} from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

// Mock user data
const mockUser: MyUser = {
  id: '1234567890',
  email: 'test@example.com',
  userHandle: 'testuser',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isEmailVerified: false,
  spokenLanguagesTextIds: [],
  roles: [],
  trustLevel: 0,
};

// Create a mock context class
export class MockMyUserContext {
  myUser = writable<MyUser | null>(null);
  isLoading = writable(false);
  error = writable<string | null>(null);
  isInitialized = true;
  myUserId = '';
  // Add the missing _listeners property
  private _listeners: Record<string, Array<any>> = {};

  constructor() {
    // Initialize with no user by default
    this.myUser.set(null);
  }

  async initialize() {
    return Promise.resolve();
  }

  get isSignedIn() {
    let signedIn = false;
    this.myUser.subscribe((user) => {
      signedIn = !!user;
    })();
    return signedIn;
  }

  async signInUser(
    userIdent: string,
    identType: UserIdentType,
    password: string,
  ): Promise<MutationResult<SignInSignUpResponse>> {
    this.isLoading.set(true);

    console.log('mocked signInUser called with:', { userIdent, identType, password });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful sign in
    if (userIdent === 'test@example.com' || userIdent === 'testuser') {
      console.log('Username matched');
      if (password === '123456789') {
        console.log('Password matched - sign in successful');
        this.myUser.set(mockUser);
        this.myUserId = mockUser.id;
        this.isLoading.set(false);
        return {
          operation: MutationType.update,
          object: {
            userAuthResponse: {
              userId: mockUser.id,
              firstName: 'Test',
              lastName: 'User',
              authType: AuthType.token,
              email: 'test@example.com',
              authToken: 'auth-token',
              foundUser: true,
              onboardingStage: '',
              phoneNumber: '',
              roles: [],
              userHandle: 'testuser',
            },
            myUser: mockUser,
          },
        };
      } else {
        console.log('Password did not match:', password);
      }
    } else {
      console.log('Username did not match:', userIdent);
    }

    // If we reach here, authentication failed
    console.log('mocked signInUser failed');
    this.isLoading.set(false);
    return {
      operation: MutationType.update,
      error: 'Invalid credentials',
    };
  }

  async signInWithToken(userIdent: string): Promise<QueryResult<MultiStepActionProgressResult>> {
    this.isLoading.set(true);
    if (userIdent === 'test@example.com' || userIdent === 'testuser') {
      console.log('Username matched');
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return a mock action ID for the verification flow
      this.isLoading.set(false);
      return {
        object: {
          actionProgress: {
            actionId: 'mock-token-signin-action-123456',
            notificationResult: MultiStepActionSendNotificationResult.ok,
            userId: '',
            actionType: MultiStepActionType.tokenSignIn,
            result: MultiStepActionResult.ok,
            attemptCount: 0,
            id: '',
            createdAt: '',
          },
          run: {
            addListener: (listener) => {
              // Simulate successful token verification after a delay
              setTimeout(() => {
                // First simulate notification sent
                listener.onEvent(MultiStepActionEventType.notificationSent, {
                  actionId: 'mock-token-signin-action-123456',
                  notificationResult: MultiStepActionSendNotificationResult.ok,
                  userId: mockUser.id,
                  actionType: MultiStepActionType.tokenSignIn,
                  result: MultiStepActionResult.ok,
                  attemptCount: 1,
                  id: 'mock-progress-id',
                  createdAt: new Date().toISOString(),
                });

                // Then simulate success when token is verified
                if (listener.onEvent) {
                  setTimeout(() => {
                    this.myUser.set(mockUser);
                    this.myUserId = mockUser.id;

                    listener.onEvent(MultiStepActionEventType.success, {
                      actionId: 'mock-token-signin-action-123456',
                      notificationResult: MultiStepActionSendNotificationResult.ok,
                      userId: mockUser.id,
                      actionType: MultiStepActionType.tokenSignIn,
                      result: MultiStepActionResult.ok,
                      attemptCount: 1,
                      id: 'mock-progress-id',
                      createdAt: new Date().toISOString(),
                    });
                  }, 2000); // Simulate delay between notification and verification
                }
              }, 1000);

              return 'mock-listener-id';
            },
            removeListener: () => {},
            actionId: 'mock-token-signin-action-123456',
            listeners: new Map(),
            pollingOptions: { enabled: true, interval: 1000, timeout: 10000 },
            onEventReceived: function (eventType: MultiStepActionEventType): void {
              // Implementation not needed for mock
            },
            notifyListeners: function (event: MultiStepActionEventType): void {
              // Implementation not needed for mock
            },
            abort: function (): void {
              // Implementation not needed for mock
            },
            isStopped: function (): boolean {
              return false;
            },
          },
          id: 'signInWithToken-mock-id',
          createdAt: Date.now().toString(),
        },
      };
    }
    console.log('Username did not match:', userIdent);
    return {
      error: 'Invalid credentials',
    };
  }

  async verifyMultiStepActionToken(actionId: string, token: string): Promise<boolean> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful verification if token is '123456'
    if (token === '123456') {
      console.log('Token verification successful:', token);

      // Set a timeout to simulate the success event after verification
      setTimeout(() => {
        // Find any listeners for this action and notify them of success
        if (this._listeners && this._listeners[actionId]) {
          this._listeners[actionId].forEach((listener) => {
            listener.onEvent(MultiStepActionEventType.success, {
              actionId: actionId,
              notificationResult: MultiStepActionSendNotificationResult.ok,
              userId: mockUser.id,
              actionType: MultiStepActionType.tokenSignIn,
              result: MultiStepActionResult.ok,
              attemptCount: 1,
              id: 'mock-progress-id',
              createdAt: new Date().toISOString(),
            });
          });
        }
      }, 1500);

      this.myUser.set(mockUser);
      this.myUserId = mockUser.id;
      this.isLoading.set(false);
      return true;
    }

    // Mock failed verification
    console.log('Token verification failed:', token);
    this.isLoading.set(false);
    return false;
  }

  async signUpUser(email: string): Promise<{ myUser?: MyUser; error?: string }> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful sign up
    this.myUser.set({
      ...mockUser,
      email,
      userHandle: '',
    });
    this.myUserId = mockUser.id;
    this.isLoading.set(false);

    return {
      myUser: {
        ...mockUser,
        email,
        userHandle: '',
      },
    };
  }

  async verifyMyEmail(email: string): Promise<QueryResult<MultiStepActionProgressResult>> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store the action ID for later reference
    const actionId = 'mock-email-verification-action-123456';

    // Initialize listeners array for this action if it doesn't exist
    if (!this._listeners) {
      this._listeners = {};
    }
    if (!this._listeners[actionId]) {
      this._listeners[actionId] = [];
    }

    this.isLoading.set(false);
    return {
      object: {
        actionProgress: {
          actionId: actionId,
          notificationResult: MultiStepActionSendNotificationResult.ok,
          userId: mockUser.id,
          actionType: MultiStepActionType.verifyEmail,
          result: MultiStepActionResult.ok,
          attemptCount: 0,
          id: 'mock-progress-id',
          createdAt: new Date().toISOString(),
        },
        run: {
          addListener: (listener) => {
            // Store the listener for later use
            if (this._listeners && this._listeners[actionId]) {
              this._listeners[actionId].push(listener);
            }

            // Simulate notification sent event after a short delay
            setTimeout(() => {
              if (listener.onEvent) {
                listener.onEvent(MultiStepActionEventType.notificationSent, {
                  actionId: actionId,
                  notificationResult: MultiStepActionSendNotificationResult.ok,
                  userId: mockUser.id,
                  actionType: MultiStepActionType.verifyEmail,
                  result: MultiStepActionResult.ok,
                  attemptCount: 1,
                  id: 'mock-progress-id',
                  createdAt: new Date().toISOString(),
                });
              }
            }, 1000);

            return 'mock-listener-id';
          },
          removeListener: (listenerId: string) => {
            // Implementation to remove a listener if needed
            if (this._listeners && this._listeners[actionId]) {
              this._listeners[actionId] = this._listeners[actionId].filter(
                (l) => l.id !== listenerId,
              );
            }
          },
          actionId: actionId,
          listeners: new Map(),
          pollingOptions: { enabled: true, interval: 1000, timeout: 10000 },
          onEventReceived: function (eventType: MultiStepActionEventType): void {
            // Not needed for mock
          },
          notifyListeners: function (event: MultiStepActionEventType): void {
            // Not needed for mock
          },
          abort: function (): void {
            // Not needed for mock
          },
          isStopped: function (): boolean {
            return false;
          },
        },
        id: 'verifyMyEmail-mock-id',
        createdAt: Date.now().toString(),
      },
    };
  }

  async updateMyUser(userData: {
    id: string;
    userHandle: string;
  }): Promise<MutationResult<MyUser>> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the mock user
    const updatedUser = {
      ...mockUser,
      userHandle: userData.userHandle,
    };

    this.myUser.set(updatedUser);
    this.isLoading.set(false);

    return {
      operation: MutationType.update,
      object: updatedUser,
    };
  }

  async updateMyPassword(oldPassword: string, newPassword: string): Promise<MutationResult<void>> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.isLoading.set(false);

    return {
      operation: MutationType.update,
    };
  }

  async signMeOut(): Promise<boolean> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.myUser.set(null);
    this.myUserId = '';
    this.isLoading.set(false);

    return true;
  }

  async loadMyUser(options?: { cachePolicy: CachePolicy }): Promise<void> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (this.myUserId) {
      this.myUser.set(mockUser);
    }

    this.isLoading.set(false);
  }

  async isUserIdentAvailable(
    ident: string,
    identType: UserIdentType,
  ): Promise<{ isAvailable?: boolean; error?: string }> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock implementation logic
    if (!this.isInitialized) {
      this.isLoading.set(false);
      return { error: 'Client not initialized' };
    }

    try {
      // For email type, check if it matches the mock user's email
      if (identType === UserIdentType.email) {
        const isAvailable = ident.toLowerCase() !== mockUser.email?.toLowerCase();
        this.isLoading.set(false);
        return { isAvailable };
      }

      // For userHandle type, check if it matches the mock user's handle
      if (identType === UserIdentType.userHandle) {
        const isAvailable = ident.toLowerCase() !== mockUser.userHandle?.toLowerCase();
        this.isLoading.set(false);
        return { isAvailable };
      }

      // Default case - most identifiers should be available in mock
      this.isLoading.set(false);
      return { isAvailable: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to check identity availability';
      this.error.set(errorMsg);
      console.error('Error checking identity availability:', err);
      this.isLoading.set(false);
      return { isAvailable: false, error: errorMsg };
    }
  }
}

// Create and export a singleton instance
export const mockMyUserContext = new MockMyUserContext();
