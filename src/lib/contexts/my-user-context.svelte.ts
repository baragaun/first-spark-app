import translate from '@/helpers/language/translate';
import { AppUiMessage } from '@/types/enums';
import {
  AppEnvironment,
  BgListenerTopic,
  BgNodeClient,
  ClientInfoStoreType,
  HttpHeaderName,
  MyUserChanges,
  NotificationMethod,
  UserIdentType,
  type BgNodeClientConfig,
  type MultiStepActionProgressResult,
  type MyUser,
  type MyUserListener,
  type QueryResult,
  type SignInUserInput,
  type SignUpUserInput,
} from '@baragaun/bg-node-client';

let isSignedIn = $state(false);
let isLoading = $state(false);
let myUser = $state<MyUser | undefined>(undefined);

export class MyUserContext {
  private client: BgNodeClient = new BgNodeClient();
  private _isInitializing = false;

  public async initialize(): Promise<void> {
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

      const listener: MyUserListener = {
        id: 'MyUserContext',
        topic: BgListenerTopic.myUser,
        onSignedIn: () => {
          isSignedIn = true;
        },
        onSignedOut: () => {
          isSignedIn = false;
        },
        onMyUserUpdated: (updatedMyUser) => {
          myUser = updatedMyUser;
        },
      };
      await this.client.init({
        config,
        isOnline: true,
        startSession: true,
        listener,
      });

      isSignedIn = this.client.isSignedIn;
    } catch (error) {
      console.error('MyUserContext: Error initializing BgNodeClient:', { error });
      this._isInitializing = false;
      return;
    }

    // if (import.meta.env.MOCK_DATA === 'true') {
    //   config.useMockData = true;
    // }

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
      isLoading = true;
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
      isLoading = false;
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
      isLoading = true;
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
      isLoading = false;
    }
  }

  async signMeInWithToken(userIdent: string): Promise<QueryResult<MultiStepActionProgressResult>> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.signMeInWithToken: not initialized.');
      return { error: AppUiMessage.systemError }; // <-- where should we translate this?
    }

    if (this.client.isSignedIn) {
      console.error('MyUserContext.signMeInWithToken: already signed in');
      return { error: AppUiMessage.systemError }; // <-- where should we translate this?
    }

    try {
      isLoading = true;
      return this.client.operations.myUser.signInWithToken(userIdent, {
        polling: {
          enabled: true,
          interval: 2000, // 2 seconds
          timeout: 15 * 60 * 1000, // 15 minutes
        },
      });
    } catch (error) {
      console.error('MyUserContext.signMeInWithToken: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: AppUiMessage.systemError }; // <-- where should we translate this?
    } finally {
      isLoading = false;
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
      isLoading = true;
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
      isLoading = false;
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
      isLoading = true;

      const response = await this.client.operations.myUser.updateMyUser(changes);

      if (response.error) {
        console.error('MyUserContext.updateMyUser: received error.', { response });
        return { error: translate(response.error, AppUiMessage.systemError) };
      }

      return { myUser: response.object };
    } catch (error) {
      console.error('MyUserContext.updateMyUser: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate((error as Error).message, AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async updateMyPassword(currentPassword: string, newPassword: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.updateMyPassword: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    if (!this.client.isSignedIn) {
      console.error('MyUserContext.updateMyPassword: not signed in');
      return translate(AppUiMessage.systemError);
    }

    try {
      isLoading = true;
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
      isLoading = false;
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

  async resetMyPassword(ident: string): Promise<QueryResult<MultiStepActionProgressResult>> {
    if (!this.client.isInitialized) {
      return { error: 'Client not initialized' };
    }
    try {
      isLoading = true;
      return this.client.operations.myUser.resetMyPassword(ident, {
        polling: {
          enabled: true,
          interval: 2000, // 2 seconds
          timeout: 15 * 60 * 1000, // 15 minutes
        },
      });
    } catch (error) {
      console.error('resetMyPassword: error', { error });
      return { error: (error as Error).message };
    } finally {
      isLoading = false;
    }
  }

  async verifyMyEmail(email: string): Promise<QueryResult<MultiStepActionProgressResult>> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.verifyMyEmail: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading = true;
      return this.client.operations.myUser.verifyMyEmail(email, {
        polling: {
          enabled: true,
          interval: 2000, // 2 seconds
          timeout: 15 * 60 * 1000, // 15 minutes
        },
      });
    } catch (error) {
      console.error('MyUserContext.verifyMyEmail: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate((error as Error).message, AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async verifyMyPassword(password: string): Promise<QueryResult<boolean>> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.verifyMyPassword: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.myUser.verifyMyPassword(password);
    } catch (error) {
      console.error('MyUserContext.verifyMyPassword: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate((error as Error).message, AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async verifyMyPassword(password: string): Promise<QueryResult<boolean>> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.verifyMyPassword: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.myUser.verifyMyPassword(password);
    } catch (error) {
      console.error('MyUserContext.verifyMyPassword: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate((error as Error).message, AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  async verifyMultiStepActionToken(
    actionId: string,
    token: string,
    newPassword?: string,
  ): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.verifyMultiStepActionToken: no client');
      return 'system-error';
    }

    try {
      isLoading = true;
      const response = await this.client.operations.multiStepAction.verifyMultiStepActionToken(
        actionId,
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
      isLoading = false;
    }
  }

  async sendMultiStepActionNotification(actionId: string, email?: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.sendMultiStepActionNotification: not initialized.');
      return 'system-error';
    }

    try {
      isLoading = true;
      const response = await this.client.operations.multiStepAction.sendMultiStepActionNotification(
        actionId,
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
      isLoading = false;
    }
  }

  public get isInitialized(): boolean {
    return this.client.isInitialized;
  }

  public get isLoading(): boolean {
    return isLoading;
  }

  public get isSignedIn(): boolean {
    return isSignedIn;
  }

  public get myUser(): MyUser | undefined {
    return myUser;
  }

  public get myUserId(): string | undefined {
    return this.client.myUserId;
  }

  public get myUserHandle(): string | null | undefined {
    return myUser?.userHandle;
  }

  public get myEmail(): string | null | undefined {
    return myUser?.email;
  }
}

// Create a singleton instance
export const myUserContext = new MyUserContext();
