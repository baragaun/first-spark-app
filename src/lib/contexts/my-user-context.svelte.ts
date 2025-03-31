import translate from '@/helpers/language/translate';
import { AppUiMessage } from '@/types/enums';
import {
  AppEnvironment,
  BgListenerTopic,
  BgNodeClient,
  ClientInfoStoreType,
  HttpHeaderName,
  MultiStepActionEventType,
  MyUserChanges,
  NotificationMethod,
  SidMultiStepActionProgress,
  UserIdentType,
  type BgNodeClientConfig,
  type MultiStepActionProgressResult,
  type MyUser,
  type MyUserListener,
  type QueryPollingOptions,
  type QueryResult,
  type SignInUserInput,
  type SignUpUserInput,
} from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

// Add these new types and stores
export type UserContextEvent = {
  type: string;
  message?: string;
};

export const userContextEvents = writable<UserContextEvent | null>(null);
export const isSignedIn = writable(false);
export const isLoading = writable(false);

export class MyUserContext {
  private client: BgNodeClient = new BgNodeClient();
  private myUser: MyUser | undefined;
  private _isInitializing = false;
  private actionId: string | undefined;
  private eventListeners: Map<string, ((event: UserContextEvent) => void)[]> = new Map();
  private polling: QueryPollingOptions = {
    enabled: true,
    interval: 1000,
    timeout: 15 * 10 * 1000,
    // Timeout should parallel to token expiry time, for now it is 1.5 mins it enought to user to verify and send another token.
  };
  // Add these methods for event handling
  public addEventListener(eventType: string, callback: (event: UserContextEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)?.push(callback);
  }

  public removeEventListener(eventType: string, callback: (event: UserContextEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  protected emitEvent(type: string): void {
    const event: UserContextEvent = { type };
    userContextEvents.set(event);

    // Call direct listeners
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach((callback) => callback(event));
    }

    // Call wildcard listeners
    const wildcardListeners = this.eventListeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach((callback) => callback(event));
    }
  }

  protected emitError(type: string, message: string): void {
    const event: UserContextEvent = { type: `error:${type}`, message };
    userContextEvents.set(event);

    // Call direct error listeners
    const listeners = this.eventListeners.get(`error:${type}`);
    if (listeners) {
      listeners.forEach((callback) => callback(event));
    }

    // Call general error listeners
    const errorListeners = this.eventListeners.get('error');
    if (errorListeners) {
      errorListeners.forEach((callback) => callback(event));
    }

    // Call wildcard listeners
    const wildcardListeners = this.eventListeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach((callback) => callback(event));
    }
  }

  public async initialize(): Promise<void> {
    console.log('MyUserContext.initialize called.');

    if (this.client.isInitialized || this._isInitializing) {
      console.warn('MyUserContext.initialize: already initialized.');
      return;
    }

    this._isInitializing = true;

    const config: BgNodeClientConfig = {
      inBrowser: true,
      fsdata: {
        url: import.meta.env.VITE_FSDATA_URL || 'http://localhost:8092/fsdata/api/graphql',
        headers: {
          [HttpHeaderName.consumer]: 'first-spark-app',
        },
      },
      clientInfoStoreType: ClientInfoStoreType.db,
      logLevel: 'debug',
    };

    if (import.meta.env.VITE_APP_ENVIRONMENT) {
      config.appEnvironment = import.meta.env.VITE_APP_ENVIRONMENT as AppEnvironment;
    }

    try {
      if (typeof window === 'undefined') {
        console.error('MyUserContext.initialize: not running in the browser.');
        this._isInitializing = false;
        return;
      }

      if (!('indexedDB' in window)) {
        console.error('MyUserContext.initialize: indexedDB is not supported in this browser.');
        this._isInitializing = false;
        return;
      }

      await this.client.init(config);

      this.client.addListener({
        id: 'MyUserContext',
        topic: BgListenerTopic.myUser,
        onSignedIn: () => isSignedIn.set(true),
        onSignedOut: () => isSignedIn.set(false),
        onMyUserUpdated: (myUser) => {
          this.myUser = myUser;
        },
      } as MyUserListener);

      isSignedIn.set(this.client.isSignedIn);
    } catch (error) {
      console.error('MyUserContext: Error initializing BgNodeClient:', { error });
      this._isInitializing = false;
      return;
    }

    // if (import.meta.env.MOCK_DATA === 'true') {
    //   config.useMockData = true;
    // }
    // console.log('MyUserContext: BgNodeClient initialized:', { isSignedIn: this.client.isSignedIn });

    // After successful initialization, check if user is signed in and restore user data
    if (this.client.isSignedIn) {
      try {
        const userResponse = await this.client.operations.myUser.findMyUser();
        if (userResponse.object) {
          this.myUser = userResponse.object;
        }
      } catch (error) {
        console.error('Failed to restore user data:', error);
      }
    }

    this._isInitializing = false;
  }

  /**
   * Sign up a new user
   * @param email The user's email address
   * @return Promise<true | string> Returns true on success or an error message on failure
   */
  async signUpUser(email: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.signUpUser: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    if (this.client.isSignedIn) {
      console.error('MyUserContext.signUpUser: already signed in');
      return translate(AppUiMessage.systemError);
    }

    try {
      isLoading.set(true);
      const input: SignUpUserInput = { email };

      if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
        input.isTestUser = true;
        input.source = '{"msaToken":"666666"}';
      }

      const response = await this.client.operations.myUser.signUpUser(input);

      if (!response || response.error || !response.object?.userAuthResponse?.userId) {
        console.error('SignUpUser: received error.', { response });

        return response.error || translate(AppUiMessage.systemError);
      }

      return true;
    } catch (error) {
      console.error('signUpUser: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Sign in a user with email and password
   * @param userIdent The user's identifier (email or username)
   * @param identType The type of identifier (UserIdentType.email or UserIdentType.username)
   * @param password The user's password
   * @return Promise<true | string> Returns true on success or an error message on failure
   */
  public async signMeInWithPassword(
    userIdent: string,
    identType: UserIdentType | undefined,
    password: string,
  ): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.signMeInWithPassword: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    if (this.client.isSignedIn) {
      console.error('MyUserContext.signMeInWithPassword: already signed in');
      return translate(AppUiMessage.systemError);
    }

    try {
      isLoading.set(true);
      const input: SignInUserInput = {
        ident: userIdent,
        identType,
        password,
      };

      const response = await this.client.operations.myUser.signInUser(input);

      if (response.error) {
        console.error('MyUserContext.signMeInWithPassword: received error.', { response });
        return translate(response.error, AppUiMessage.systemError);
      }

      return true;
    } catch (error) {
      console.error('MyUserContext.signMeInWithPassword: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate((error as Error).message, AppUiMessage.systemError);
    } finally {
      isLoading.set(false);
    }
  }

  async signMeInWithToken(userIdent: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.signMeInWithToken: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    if (this.client.isSignedIn) {
      console.error('MyUserContext.signMeInWithToken: already signed in');
      return translate(AppUiMessage.systemError);
    }

    try {
      isLoading.set(true);
      const response = await this.client.operations.myUser.signInWithToken(userIdent, {
        polling: this.polling,
      });

      if (response.error) {
        console.error('MyUserContext.signMeInWithToken: received error.', { response });
        return translate(response.error, AppUiMessage.systemError);
      }

      this.actionId = response.object?.actionProgress?.actionId;
      if (response.object?.run) {
        response.object.run.addListener({
          id: 'SignInWithToken',
          onEvent: async (
            eventType: MultiStepActionEventType,
            action: SidMultiStepActionProgress,
          ): Promise<void> => {
            if (eventType === MultiStepActionEventType.notificationFailed) {
              console.error(
                'MyUserContext.signMeInWithToken: Notification failed.',
                action.notificationResult,
              );
              // Emit an event that consumers can subscribe to
              this.emitError(
                'notification-failed',
                'We could not send the verification token to your email.',
              );
            } else if (eventType === MultiStepActionEventType.notificationSent) {
              console.log(
                'MyUserContext.signMeInWithToken: Notification sent.',
                action.notificationResult,
              );
              // Emit a success event
              this.emitEvent('notification-sent');
            } else if (eventType === MultiStepActionEventType.tokenFailed) {
              console.error(
                'MyUserContext.signMeInWithToken: Token verification failed.',
                action.notificationResult,
              );
              this.emitError('token-failed', 'We could not verify the token you entered.');
            } else if (eventType === MultiStepActionEventType.timedOut) {
              console.error(
                'MyUserContext.signMeInWithToken: Action timed out.',
                action.notificationResult,
              );
              this.emitError('timeout', 'The verification token has expired.');
            } else if (eventType === MultiStepActionEventType.failed) {
              console.error(
                'MyUserContext.signMeInWithToken: Action failed.',
                action.notificationResult,
              );
              this.emitError('action-failed', 'A system error has occurred.');
            } else if (eventType === MultiStepActionEventType.success) {
              console.log(
                'MyUserContext.signMeInWithToken: Action succeeded.',
                action.notificationResult,
              );
              this.emitEvent('verification-success');
            }
          },
        });
      }

      return true;
    } catch (error) {
      console.error('MyUserContext.signMeInWithToken: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate((error as Error).message, AppUiMessage.systemError);
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Sign out the current user
   * @returns Promise<true | string> Returns true on successful sign out or an error message on failure
   */
  async signMeOut(): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.signMeOut: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    if (!this.client.isSignedIn) {
      console.error('MyUserContext.signMeOut: already signed out.');
      return translate(AppUiMessage.systemError);
    }

    try {
      isLoading.set(true);
      const response = await this.client.operations.myUser.signMeOut();
      if (response.error) {
        console.error('MyUserContext.signMeOut: received error.', { response });
        return translate(response.error, AppUiMessage.systemError);
      }

      return true;
    } catch (error) {
      console.error('MyUserContext.signMeOut: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate((error as Error).message, AppUiMessage.systemError);
    } finally {
      isLoading.set(false);
    }
  }

  async updateMyUser(
    changes: Partial<MyUserChanges>,
  ): Promise<{ myUser?: MyUser | null; error?: string }> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.updateMyUser: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    if (!this.client.isSignedIn) {
      console.error('MyUserContext.updateMyUser: not signed in.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      const response = await this.client.operations.myUser.updateMyUser(changes);

      if (response.error) {
        console.error('MyUserContext.updateMyUser: received error.', { response });
        return { error: translate(response.error, AppUiMessage.systemError) };
      }

      // Refresh the myUser object after successful update
      if (response.object) {
        this.myUser = response.object;
      }

      return { myUser: response.object };
    } catch (error) {
      console.error('MyUserContext.updateMyUser: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate((error as Error).message, AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  async updateMyPassword(currentPassword: string, newPassword: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.updateMyPassword: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    if (this.client.isSignedIn) {
      console.error('MyUserContext.updateMyPassword: already signed in');
      return translate(AppUiMessage.systemError);
    }

    try {
      isLoading.set(true);
      const response = await this.client.operations.myUser.updateMyPassword(
        currentPassword,
        newPassword,
      );

      if (response.error) {
        console.error('MyUserContext.updateMyPassword: received error.', { response });
        return translate(response.error, AppUiMessage.systemError);
      }

      return true;
    } catch (error) {
      console.error('MyUserContext.updateMyPassword: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate((error as Error).message, AppUiMessage.systemError);
    } finally {
      isLoading.set(false);
    }
  }

  async findAvailableUserHandle(email: string) {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.findAvailableUserHandle: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    try {
      return await this.client.operations.myUser.findAvailableUserHandle(email);
    } catch (error) {
      console.error('MyUserContext.updateMyPassword: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate((error as Error).message, AppUiMessage.systemError);
    }
  }

  async isUserIdentAvailable(
    ident: string,
    identType: UserIdentType,
  ): Promise<{ isAvailable?: boolean; error?: string }> {
    if (!this.client.isInitialized) {
      return { error: 'Client not initialized' };
    }

    try {
      const response = await this.client.operations.myUser.isUserIdentAvailable(ident, identType);

      if (response.error) {
        console.error('MyUserContext.isUserIdentAvailable: received error.', { response });
        return { error: response.error };
      }
      return { isAvailable: !!response.object };
    } catch (error) {
      console.error('isUserIdentAvailable: error:', { error });
      return { isAvailable: false, error: (error as Error).message };
    }
  }

  async resetMyPassword(email: string): Promise<QueryResult<MultiStepActionProgressResult>> {
    if (!this.client.isInitialized) {
      return { error: 'Client not initialized' };
    }
    try {
      isLoading.set(true);
      return this.client.operations.myUser.resetMyPassword(email, {
        polling: this.polling,
      });
    } catch (error) {
      console.error('resetMyPassword: error', { error });
      return { error: (error as Error).message };
    } finally {
      isLoading.set(false);
    }
  }

  async verifyMyEmail(email: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.verifyMyEmail: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    // if (this.client.isSignedIn) {
    //   console.error('MyUserContext.verifyMyEmail: already signed in');
    //   return translate(AppUiMessage.systemError);
    // }

    // It is understood that user would be signed in for verify email.

    try {
      isLoading.set(true);
      const response = await this.client.operations.myUser.verifyMyEmail(email, {
        polling: this.polling,
      });

      if (response.error) {
        console.error('MyUserContext.verifyMyEmail: received error.', { response });
        return translate(response.error, AppUiMessage.systemError);
      }

      this.actionId = response.object?.actionProgress?.actionId;

      if (response.object?.run) {
        response.object.run.addListener({
          id: 'VerifyMyEmail',
          onEvent: async (
            eventType: MultiStepActionEventType,
            action: SidMultiStepActionProgress,
          ): Promise<void> => {
            if (eventType === MultiStepActionEventType.notificationFailed) {
              console.error(
                'MyUserContext.verifyMyEmail: Notification failed.',
                action.notificationResult,
              );
              // Emit an event that consumers can subscribe to
              this.emitError(
                'notification-failed',
                'We could not send the verification token to your email.',
              );
            } else if (eventType === MultiStepActionEventType.notificationSent) {
              console.log(
                'MyUserContext.verifyMyEmail: Notification sent.',
                action.notificationResult,
              );
              // Emit a success event
              this.emitEvent('notification-sent');
            } else if (eventType === MultiStepActionEventType.tokenFailed) {
              console.error(
                'MyUserContext.verifyMyEmail: Token verification failed.',
                action.notificationResult,
              );
              this.emitError('token-failed', 'We could not verify the token you entered.');
            } else if (eventType === MultiStepActionEventType.timedOut) {
              console.error(
                'MyUserContext.verifyMyEmail: Action timed out.',
                action.notificationResult,
              );
              this.emitError('timeout', 'The verification token has expired.');
            } else if (eventType === MultiStepActionEventType.failed) {
              console.error(
                'MyUserContext.verifyMyEmail: Action failed.',
                action.notificationResult,
              );
              this.emitError('action-failed', 'A system error has occurred.');
            } else if (eventType === MultiStepActionEventType.success) {
              console.log(
                'MyUserContext.verifyMyEmail: Action succeeded.',
                action.notificationResult,
              );
              this.emitEvent('verification-success');
            }
          },
        });
      }

      return true;
    } catch (error) {
      console.error('MyUserContext.verifyMyEmail: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate((error as Error).message, AppUiMessage.systemError);
    } finally {
      isLoading.set(false);
    }
  }

  async verifyMultiStepActionToken(token: string, newPassword?: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.verifyMultiStepActionToken: no client');
      return 'system-error';
    }

    if (!this.actionId) {
      console.error('MyUserContext.verifyMultiStepActionToken: no actionId');
      return 'system-error';
    }

    try {
      isLoading.set(true);
      const response = await this.client.operations.multiStepAction.verifyMultiStepActionToken(
        this.actionId,
        token,
        newPassword,
      );

      if (response.error || !response.object) {
        console.error(
          'MyUserContext.verifyMultiStepActionToken: failed calling client.verifyMultiStepActionToken',
          { response },
        );
        return response.error || 'system-error';
      }

      return true;
    } catch (error) {
      console.error('verifyMultiStepActionToken: error', { error });
      return (error as Error).message;
    } finally {
      isLoading.set(false);
    }
  }

  async sendMultiStepActionNotification(email?: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.sendMultiStepActionNotification: not initialized.');
      return 'system-error';
    }

    if (!this.actionId) {
      console.error('MyUserContext.sendMultiStepActionNotification: no actionId');
      return 'system-error';
    }

    try {
      isLoading.set(true);
      const response = await this.client.operations.multiStepAction.sendMultiStepActionNotification(
        this.actionId,
        email,
        undefined,
        NotificationMethod.email,
      );

      if (response.error) {
        return response.error;
      }

      return true;
    } catch (error) {
      console.error('MyUserContext.sendMultiStepActionNotification: error', { error });
      return 'system-error';
    } finally {
      isLoading.set(false);
    }
  }

  public get isInitialized(): boolean {
    return this.client.isInitialized;
  }

  public get myUserId(): string | undefined {
    return this.client.myUserId;
  }

  public get myUserHandle(): string | null | undefined {
    return this.myUser?.userHandle;
  }

  public get myEmail(): string | null | undefined {
    return this.myUser?.email;
  }
}

// Create a singleton instance
export const myUserContext = new MyUserContext();
