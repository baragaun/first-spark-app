import {
  AuthType,
  MultiStepActionEventType,
  MultiStepActionResult,
  MultiStepActionSendNotificationResult,
  MultiStepActionType,
  MutationType,
  UserIdentType,
  type MultiStepActionListener,
  type MultiStepActionProgressResult,
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
  private _listeners: Record<string, Array<MultiStepActionListener>> = {};

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
  ): Promise<QueryResult<SignInSignUpResponse>> {
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
              authToken: 'auth-token',
              foundUser: true,
              onboardingStage: '',
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

  async verifyMultiStepActionToken(
    actionId: string,
    token: string,
    newPassword?: string,
  ): Promise<boolean> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if this is a reset password action
    if (actionId.includes('reset-password')) {
      // Trigger success event for reset password listeners
      if (this._listeners['resetPassword']) {
        this._listeners['resetPassword'].forEach((l) => {
          l.onEvent(MultiStepActionEventType.success, {
            actionId: actionId,
            notificationResult: MultiStepActionSendNotificationResult.ok,
            userId: 'mock-user-id',
            actionType: MultiStepActionType.resetPassword,
            result: MultiStepActionResult.ok,
            attemptCount: 0,
            id: 'mock-progress-id',
            createdAt: new Date().toISOString(),
          });
        });
      }

      // If a new password was provided, update the user's password
      if (newPassword) {
        console.log('Password reset successful with new password:', newPassword);
      }

      this.isLoading.set(false);
      return true;
    }

    // Handle other action types (existing code)
    // Mock successful verification if token is '123456'
    if (token === '123456') {
      console.log('Token verification successful:', token);

      // Check if this is a token sign-in or email verification
      if (actionId.includes('token-signin')) {
        // Trigger success event for token sign-in listeners
        if (this._listeners['tokenSignIn']) {
          this._listeners['tokenSignIn'].forEach((l) => {
            l.onEvent(MultiStepActionEventType.success, {
              actionId: actionId,
              notificationResult: MultiStepActionSendNotificationResult.ok,
              userId: 'mock-user-id',
              actionType: MultiStepActionType.tokenSignIn,
              result: MultiStepActionResult.ok,
              attemptCount: 0,
              id: 'mock-token-signin-id',
              createdAt: new Date().toISOString(),
            });
          });
        }
      } else {
        // Trigger success event for email verification listeners
        if (this._listeners['verifyEmail']) {
          this._listeners['verifyEmail'].forEach((l) => {
            l.onEvent(MultiStepActionEventType.success, {
              actionId: actionId,
              notificationResult: MultiStepActionSendNotificationResult.ok,
              userId: 'mock-user-id',
              actionType: MultiStepActionType.verifyEmail,
              result: MultiStepActionResult.ok,
              attemptCount: 0,
              id: 'mock-progress-id',
              createdAt: new Date().toISOString(),
            });
          });
        }
      }

      // Set the user as signed in
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

    // Always return a valid response with required properties
    this.isLoading.set(false);
    return {
      object: {
        actionProgress: {
          actionId: 'mock-verify-email-action-123456',
          notificationResult: MultiStepActionSendNotificationResult.ok,
          userId: 'mock-user-id',
          actionType: MultiStepActionType.verifyEmail,
          result: MultiStepActionResult.ok,
          attemptCount: 0,
          id: 'mock-progress-id',
          createdAt: new Date().toISOString(),
        },
        run: {
          addListener: (listener) => {
            // Store the listener to trigger events later
            if (!this._listeners['verifyEmail']) {
              this._listeners['verifyEmail'] = [];
            }
            this._listeners['verifyEmail'].push(listener);

            // Simulate notification sent event after a short delay
            setTimeout(() => {
              if (this._listeners['verifyEmail']) {
                this._listeners['verifyEmail'].forEach((l) => {
                  l.onEvent(MultiStepActionEventType.notificationSent, {
                    actionId: 'mock-verify-email-action-123456',
                    notificationResult: MultiStepActionSendNotificationResult.ok,
                    userId: 'mock-user-id',
                    actionType: MultiStepActionType.verifyEmail,
                    result: MultiStepActionResult.ok,
                    attemptCount: 0,
                    id: 'mock-progress-id',
                    createdAt: new Date().toISOString(),
                  });
                });
              }
            }, 500);

            // Simulate success event after a longer delay (after user enters code)
            setTimeout(() => {
              if (this._listeners['verifyEmail']) {
                this._listeners['verifyEmail'].forEach((l) => {
                  l.onEvent(MultiStepActionEventType.success, {
                    actionId: 'mock-verify-email-action-123456',
                    notificationResult: MultiStepActionSendNotificationResult.ok,
                    userId: 'mock-user-id',
                    actionType: MultiStepActionType.verifyEmail,
                    result: MultiStepActionResult.ok,
                    attemptCount: 0,
                    id: 'mock-progress-id',
                    createdAt: new Date().toISOString(),
                  });
                });
              }
            }, 3000); // Longer delay to allow time for code entry

            return 'mock-listener-id';
          },
          removeListener: () => {},
          actionId: 'mock-verify-email-action-123456',
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
        id: 'verifyMyEmail-mock-id',
        createdAt: Date.now().toString(),
      },
    };
  }

  async updateMyUser(userData: { id: string; userHandle: string }): Promise<QueryResult<MyUser>> {
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

    return { object: updatedUser };
  }

  async updateMyPassword(currentPassword: string, newPassword: string): Promise<QueryResult<void>> {
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

  async findAvailableUserHandle(email: string): Promise<string | { error: string } | null> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock implementation logic
    if (!this.isInitialized) {
      this.isLoading.set(false);
      return { error: 'Client not initialized' };
    }

    try {
      // Generate a username based on the email
      const username = email.split('@')[0];

      // Add some random numbers to make it unique
      const randomNum = Math.floor(Math.random() * 1000);
      const suggestedHandle = `${username}${randomNum}`;

      this.isLoading.set(false);
      return suggestedHandle;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to find available handle';
      this.error.set(errorMsg);
      console.error('Error finding available handle:', err);
      this.isLoading.set(false);
      return null;
    }
  }

  async resetMyPassword(email: string): Promise<QueryResult<MultiStepActionProgressResult>> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Always return a valid response with required properties
    this.isLoading.set(false);
    return {
      object: {
        actionProgress: {
          actionId: 'mock-reset-password-action-123456',
          notificationResult: MultiStepActionSendNotificationResult.ok,
          userId: 'mock-user-id',
          actionType: MultiStepActionType.resetPassword,
          result: MultiStepActionResult.ok,
          attemptCount: 0,
          id: 'mock-progress-id',
          createdAt: new Date().toISOString(),
        },
        run: {
          addListener: (listener) => {
            // Store the listener to trigger events later
            if (!this._listeners['resetPassword']) {
              this._listeners['resetPassword'] = [];
            }
            this._listeners['resetPassword'].push(listener);

            // Simulate notification sent event after a short delay
            setTimeout(() => {
              if (this._listeners['resetPassword']) {
                this._listeners['resetPassword'].forEach((l) => {
                  l.onEvent(MultiStepActionEventType.notificationSent, {
                    actionId: 'mock-reset-password-action-123456',
                    notificationResult: MultiStepActionSendNotificationResult.ok,
                    userId: 'mock-user-id',
                    actionType: MultiStepActionType.resetPassword,
                    result: MultiStepActionResult.ok,
                    attemptCount: 0,
                    id: 'mock-progress-id',
                    createdAt: new Date().toISOString(),
                  });
                });
              }
            }, 500);

            return 'mock-listener-id';
          },
          removeListener: () => {},
          actionId: 'mock-reset-password-action-123456',
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
        id: 'resetMyPassword-mock-id',
        createdAt: Date.now().toString(),
      },
    };
  }

  async sendMultiStepActionNotification(email: string): Promise<boolean> {
    this.isLoading.set(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate notification sent event for any active listeners
    const actionTypes = ['resetPassword', 'verifyEmail', 'tokenSignIn'];

    actionTypes.forEach((type) => {
      if (this._listeners[type]) {
        this._listeners[type].forEach((l) => {
          l.onEvent(MultiStepActionEventType.notificationSent, {
            actionId: `mock-${type}-action-123456`,
            notificationResult: MultiStepActionSendNotificationResult.ok,
            userId: 'mock-user-id',
            actionType: MultiStepActionType[type as keyof typeof MultiStepActionType],
            result: MultiStepActionResult.ok,
            attemptCount: 0,
            id: 'mock-progress-id',
            createdAt: new Date().toISOString(),
          });
        });
      }
    });

    this.isLoading.set(false);
    return true;
  }
}

// Create and export a singleton instance
export const mockMyUserContext = new MockMyUserContext();
