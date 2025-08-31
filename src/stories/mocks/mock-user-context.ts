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
  type MyUserChanges,
  type QueryResult,
  type SignInSignUpResponse,
} from '@baragaun/bg-node-client';

// Mock user data
const mockUser: MyUser = {
  id: '1234567890',
  email: 'test@example.com',
  userHandle: 'testuser',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isEmailVerified: false,
  isPhoneNumberVerified: false,
  spokenLanguagesTextIds: [],
  roles: [],
  trustLevel: 0,
};

// Create a mock context class that matches the real MyUserContext
export class MockMyUserContext {
  // State variables using $state in the real context
  private _isSignedIn = false;
  private _isOffline = false;
  private _isLoading = false;
  private _myUser: MyUser | undefined = undefined;
  private _isInitializing = false;

  // Client property
  client = {
    isInitialized: true,
    isSignedIn: false,
    myUserId: '',
    operations: {
      myUser: {
        signInUser: this.signInUser.bind(this),
        signUpUser: this.signUpUser.bind(this),
        signInWithToken: this.signMeInWithToken.bind(this),
        updateMyUser: this.updateMyUser.bind(this),
        updateMyPassword: this.updateMyPassword.bind(this),
        verifyMyEmail: this.verifyMyEmail.bind(this),
        verifyMyPassword: this.verifyMyPassword.bind(this),
        findAvailableUserHandle: this.findAvailableUserHandle.bind(this),
      },
      multiStepAction: {
        verifyMultiStepActionToken: this.verifyMultiStepActionToken.bind(this),
      },
    },
    // init: async (options: ) => {
    //   this.client.isInitialized = true;
    //   if (options.listener) {
    //     // Store the listener for later use (always as an array)
    //     if (!this._listeners[options.listener.id]) {
    //       this._listeners[options.listener.id] = [];
    //     }
    //     this._listeners[options.listener.id].push(options.listener);
    //   }
    //   return Promise.resolve();
    // },
  };

  isInitialized = false;

  // Add the listeners property
  private _listeners: Record<string, MultiStepActionListener[]> = {};
  myUser: MyUser | undefined;
  // myUserId: string;

  constructor() {
    // Initialize with no user by default
    this._myUser = undefined;
    this._isSignedIn = false;

    // Pre-initialize the client for Storybook
    this.client.isInitialized = true;
    this.isInitialized = true;
  }

  public async initialize({ isSignedIn = false } = {}): Promise<void> {
    console.log('MockMyUserContext.initialize called.');

    console.log('MockMyUserContext.initialize: this._isSignedIn:', isSignedIn);

    if (isSignedIn) {
      this._myUser = mockUser;
      this._isSignedIn = isSignedIn;
    }

    if (this.client.isInitialized || this._isInitializing) {
      console.warn('MockMyUserContext.initialize: already initialized.');
      return;
    }

    this._isInitializing = true;

    try {
      // Simulate a short delay for initialization
      await new Promise((resolve) => setTimeout(resolve, 100));

      this.client.isInitialized = true;
      this.isInitialized = true;

      // Call any listeners that might be waiting
      if (this._listeners) {
        Object.values(this._listeners).forEach((listeners) => {
          listeners.forEach((listener) => {
            // Removed call to listener.onMyUserUpdated as it does not exist on MultiStepActionListener
            // You may want to trigger a different event or callback here if needed
          });
        });
      }
    } catch (error) {
      console.error('MockMyUserContext: Error initializing:', { error });
      throw error;
    } finally {
      this._isInitializing = false;
    }
  }

  async signInUser(
    userIdent: string,
    identType: UserIdentType,
    password: string,
  ): Promise<QueryResult<SignInSignUpResponse>> {
    this._isLoading = true;

    console.log('mocked signInUser called with:', { userIdent, identType, password });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful sign in
    if (userIdent === 'test@example.com' || userIdent === 'testuser') {
      console.log('Username matched');
      if (password === '123456789') {
        console.log('Password matched - sign in successful');
        this._myUser = mockUser;
        this._isSignedIn = true;
        this.client.isSignedIn = true;
        this.client.myUserId = mockUser.id;
        this._isLoading = false;
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
    this._isLoading = false;
    return {
      operation: MutationType.update,
      error: 'Invalid credentials',
    };
  }

  async signMeInWithToken(
    userIdent: string,
    options?: { polling?: { enabled: boolean; interval: number; timeout: number } },
  ): Promise<QueryResult<MultiStepActionProgressResult>> {
    if (!this.client.isInitialized) {
      console.error('MockMyUserContext.signMeInWithToken: not initialized.');
      return { error: 'Client not initialized' };
    }

    this._isLoading = true;

    if (userIdent === 'test@example.com' || userIdent === 'testuser') {
      console.log('Username matched for token sign-in');
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return a mock action ID for the verification flow
      this._isLoading = false;

      // Simulate notification sent event after a short delay
      setTimeout(() => {
        if (this._listeners['tokenSignIn']) {
          this._listeners['tokenSignIn'].forEach((l: MultiStepActionListener) => {
            l.onEvent(MultiStepActionEventType.notificationSent, {
              actionId: 'mock-token-signin-action-123456',
              notificationResult: MultiStepActionSendNotificationResult.ok,
              userId: 'mock-user-id',
              actionType: MultiStepActionType.tokenSignIn,
              result: MultiStepActionResult.ok,
              attemptCount: 0,
              createdAt: new Date().toISOString(),
            });
          });
        }
      }, 500);

      return {
        object: {
          actionProgress: {
            actionId: 'mock-token-signin-action-123456',
            notificationResult: MultiStepActionSendNotificationResult.ok,
            userId: '',
            actionType: MultiStepActionType.tokenSignIn,
            result: MultiStepActionResult.ok,
            attemptCount: 0,
            createdAt: '',
          },
          run: {
            addListener: (listener: MultiStepActionListener) => {
              if (!this._listeners['tokenSignIn']) {
                this._listeners['tokenSignIn'] = [];
              }
              this._listeners['tokenSignIn'].push(listener);
              return 'mock-listener-id';
            },
            removeListener: () => {},
            actionId: 'mock-token-signin-action-123456',
            listeners: new Map(),
            pollingOptions: options?.polling || { enabled: true, interval: 1000, timeout: 10000 },
            onEventReceived: function (eventType: MultiStepActionEventType): void {},
            notifyListeners: function (event: MultiStepActionEventType): void {},
            abort: function (): void {},
            isStopped: function (): boolean {
              return false;
            },
          },
          id: 'signInWithToken-mock-id',
          createdAt: Date.now().toString(),
        },
      };
    }

    console.log('Username did not match for token sign-in:', userIdent);
    this._isLoading = false;
    return {
      error: 'Invalid credentials',
    };
  }

  async verifyMultiStepActionToken(
    actionId: string,
    token: string,
    newPassword?: string,
  ): Promise<true | string> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if this is a reset password action
    if (actionId.includes('reset-password')) {
      // Trigger success event for reset password listeners
      if (this._listeners['resetPassword']) {
        this._listeners['resetPassword'].forEach((l: MultiStepActionListener) => {
          l.onEvent(MultiStepActionEventType.success, {
            actionId: actionId,
            notificationResult: MultiStepActionSendNotificationResult.ok,
            userId: 'mock-user-id',
            actionType: MultiStepActionType.resetPassword,
            result: MultiStepActionResult.ok,
            attemptCount: 0,
            createdAt: new Date().toISOString(),
          });
        });
      }

      // If a new password was provided, update the user's password
      if (newPassword) {
        console.log('Password reset successful with new password:', newPassword);
      }

      this._isLoading = false;
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
          this._listeners['tokenSignIn'].forEach((l: MultiStepActionListener) => {
            l.onEvent(MultiStepActionEventType.success, {
              actionId: actionId,
              notificationResult: MultiStepActionSendNotificationResult.ok,
              userId: 'mock-user-id',
              actionType: MultiStepActionType.tokenSignIn,
              result: MultiStepActionResult.ok,
              attemptCount: 0,
              createdAt: new Date().toISOString(),
            });
          });
        }
      } else {
        // Trigger success event for email verification listeners
        if (this._listeners['verifyEmail']) {
          this._listeners['verifyEmail'].forEach((l: MultiStepActionListener) => {
            l.onEvent(MultiStepActionEventType.success, {
              actionId: actionId,
              notificationResult: MultiStepActionSendNotificationResult.ok,
              userId: 'mock-user-id',
              actionType: MultiStepActionType.verifyEmail,
              result: MultiStepActionResult.ok,
              attemptCount: 0,
                createdAt: new Date().toISOString(),
            });
          });
        }
      }

      // Set the user as signed in
      this._myUser = mockUser;
      this._isSignedIn = true;
      this.client.isSignedIn = true;
      this.client.myUserId = mockUser.id;
      this._isLoading = false;

      return true;
    }

    // Mock failed verification
    console.log('Token verification failed:', token);
    this._isLoading = false;
    return 'Invalid verification code';
  }

  async signUpUser(email: string): Promise<QueryResult<SignInSignUpResponse>> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful sign up
    this._myUser = {
      ...mockUser,
      email,
      userHandle: '',
    };
    this._isSignedIn = true;
    this.client.isSignedIn = true;
    this.client.myUserId = mockUser.id;
    this._isLoading = false;

    return {
      operation: MutationType.create,
      object: {
        userAuthResponse: {
          userId: mockUser.id,
          firstName: '',
          lastName: '',
          authType: AuthType.token,
          authToken: 'auth-token',
          foundUser: true,
          onboardingStage: '',
        },
        myUser: {
          ...mockUser,
          email,
          userHandle: '',
        },
      },
    };
  }

  async verifyMyEmail(email: string): Promise<QueryResult<MultiStepActionProgressResult>> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Always return a valid response with required properties
    this._isLoading = false;

    // Simulate notification sent event after a short delay
    setTimeout(() => {
      if (this._listeners['verifyEmail']) {
        this._listeners['verifyEmail'].forEach((l: MultiStepActionListener) => {
          l.onEvent(MultiStepActionEventType.notificationSent, {
            actionId: 'mock-verify-email-action-123456',
            notificationResult: MultiStepActionSendNotificationResult.ok,
            userId: 'mock-user-id',
            actionType: MultiStepActionType.verifyEmail,
            result: MultiStepActionResult.ok,
            attemptCount: 0,
            createdAt: new Date().toISOString(),
          });
        });
      }
    }, 500);

    return {
      object: {
        actionProgress: {
          actionId: 'mock-verify-email-action-123456',
          notificationResult: MultiStepActionSendNotificationResult.ok,
          userId: 'mock-user-id',
          actionType: MultiStepActionType.verifyEmail,
          result: MultiStepActionResult.ok,
          attemptCount: 0,
          createdAt: new Date().toISOString(),
        },
        run: {
          addListener: (listener: MultiStepActionListener) => {
            if (!this._listeners['verifyEmail']) {
              this._listeners['verifyEmail'] = [];
            }
            this._listeners['verifyEmail'].push(listener);

            // Simulate success event after a longer delay (after user enters code)
            setTimeout(() => {
              if (this._listeners['verifyEmail']) {
                this._listeners['verifyEmail'].forEach((l: MultiStepActionListener) => {
                  l.onEvent(MultiStepActionEventType.success, {
                    actionId: 'mock-verify-email-action-123456',
                    notificationResult: MultiStepActionSendNotificationResult.ok,
                    userId: 'mock-user-id',
                    actionType: MultiStepActionType.verifyEmail,
                    result: MultiStepActionResult.ok,
                    attemptCount: 0,
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
          onEventReceived: function (eventType: MultiStepActionEventType): void {},
          notifyListeners: function (event: MultiStepActionEventType): void {},
          abort: function (): void {},
          isStopped: function (): boolean {
            return false;
          },
        },
        id: 'verifyEmail-mock-id',
        createdAt: Date.now().toString(),
      },
    };
  }

  async verifyMyPassword(password: string): Promise<QueryResult<boolean>> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful verification if password is '123456789'
    const isValid = password === '123456789';
    this._isLoading = false;

    return {
      object: isValid,
    };
  }

  async updateMyUser(changes: Partial<MyUserChanges>): Promise<QueryResult<MyUser>> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the mock user
    const updatedUser = {
      ...mockUser,
      ...changes,
    };

    this._myUser = updatedUser;
    this._isLoading = false;

    return { object: updatedUser };
  }

  async updateMyPassword(currentPassword: string, newPassword: string): Promise<true | string> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify current password
    if (currentPassword !== '123456789') {
      this._isLoading = false;
      return 'Current password is incorrect';
    }

    // Update password successful
    this._isLoading = false;
    return true;
  }

  async signMeOut(): Promise<boolean> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this._myUser = undefined;
    this._isSignedIn = false;
    this.client.isSignedIn = false;
    this.client.myUserId = '';
    this._isLoading = false;

    return true;
  }

  async isUserIdentAvailable(
    ident: string,
    identType: UserIdentType,
  ): Promise<QueryResult<boolean>> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock implementation logic
    if (!this.isInitialized) {
      this._isLoading = false;
      return { error: 'Client not initialized' };
    }

    try {
      // Special case for testing - make 'taken@example.com' and 'takenuserhandle' unavailable
      if (
        (identType === UserIdentType.email && ident === 'taken@example.com') ||
        (identType === UserIdentType.userHandle && ident === 'takenuserhandle')
      ) {
        this._isLoading = false;
        return { object: false };
      }

      // Default case - most identifiers should be available in mock
      this._isLoading = false;
      return { object: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to check identity availability';
      this._isLoading = false;
      return { error: errorMsg };
    }
  }

  async findAvailableUserHandle(email: string): Promise<QueryResult<string>> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock implementation logic
    if (!this.isInitialized) {
      this._isLoading = false;
      return { error: 'Client not initialized' };
    }

    try {
      // Generate a username based on the email
      const username = email.split('@')[0];

      // Add some random numbers to make it unique
      const randomNum = Math.floor(Math.random() * 1000);
      const suggestedHandle = `${username}${randomNum}`;

      this._isLoading = false;
      return { object: suggestedHandle };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to find available handle';
      this._isLoading = false;
      return { error: errorMsg };
    }
  }

  async resetMyPassword(email: string): Promise<QueryResult<MultiStepActionProgressResult>> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Always return a valid response with required properties
    this._isLoading = false;
    return {
      object: {
        actionProgress: {
          actionId: 'mock-reset-password-action-123456',
          notificationResult: MultiStepActionSendNotificationResult.ok,
          userId: 'mock-user-id',
          actionType: MultiStepActionType.resetPassword,
          result: MultiStepActionResult.ok,
          attemptCount: 0,
          createdAt: new Date().toISOString(),
        },
        run: {
          addListener: (listener: MultiStepActionListener) => {
            // Store the listener to trigger events later
            if (!this._listeners['resetPassword']) {
              this._listeners['resetPassword'] = [];
            }
            this._listeners['resetPassword'].push(listener);

            // Simulate notification sent event after a short delay
            setTimeout(() => {
              if (this._listeners['resetPassword']) {
                this._listeners['resetPassword'].forEach((l: MultiStepActionListener) => {
                  l.onEvent(MultiStepActionEventType.notificationSent, {
                    actionId: 'mock-reset-password-action-123456',
                    notificationResult: MultiStepActionSendNotificationResult.ok,
                    userId: 'mock-user-id',
                    actionType: MultiStepActionType.resetPassword,
                    result: MultiStepActionResult.ok,
                    attemptCount: 0,
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
          onEventReceived: function (eventType: MultiStepActionEventType): void {},
          notifyListeners: function (event: MultiStepActionEventType): void {},
          abort: function (): void {},
          isStopped: function (): boolean {
            return false;
          },
        },
        id: 'resetMyPassword-mock-id',
        createdAt: Date.now().toString(),
      },
    };
  }

  async sendMultiStepActionNotification(actionId: string, email?: string): Promise<boolean> {
    this._isLoading = true;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate notification sent event for any active listeners
    const actionTypes = ['resetPassword', 'verifyEmail', 'tokenSignIn'];

    actionTypes.forEach((type) => {
      if (this._listeners[type]) {
        this._listeners[type].forEach((l: MultiStepActionListener) => {
          l.onEvent(MultiStepActionEventType.notificationSent, {
            actionId: `mock-${type}-action-123456`,
            notificationResult: MultiStepActionSendNotificationResult.ok,
            userId: 'mock-user-id',
            actionType: MultiStepActionType[type as keyof typeof MultiStepActionType],
            result: MultiStepActionResult.ok,
            attemptCount: 0,
            createdAt: new Date().toISOString(),
          });
        });
      }
    });

    this._isLoading = false;
    return true;
  }

  public get isSignedIn(): boolean {
    return this._isSignedIn;
  }

  public get myUserHandle(): string | null | undefined {
    return this._myUser?.userHandle;
  }

  public get myEmail(): string | null | undefined {
    return this._myUser?.email;
  }
}

// Create and export a singleton instance
export const mockMyUserContext = new MockMyUserContext();
