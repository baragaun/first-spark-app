import { env } from '$env/dynamic/public';
import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import {
  BgListenerTopic,
  MyUserChanges,
  NotificationMethod,
  UserIdentType,
  type MultiStepActionProgressResult,
  type MyUser,
  type MyUserListener,
  type QueryResult,
  type SignInUserInput,
  type SignUpUserInput,
} from '@baragaun/bg-node-client';

let isSignedIn = $state(false);
let isOffline = $state(false); // TODO: The client does not yet support toggling the connectivity state
let isLoading = $state(false);
let myUser = $state<MyUser | undefined>(undefined);

export class MyUserContext {
  private client = client;

  public async initialize(): Promise<void> {
    if (this.client.isInitialized || this._isInitializing) {
      console.warn('MyUserContext.initialize: already initialized.');
      return;
    }
    this._isInitializing = true;

    const config: BgNodeClientConfig = {
      enableGroupChannels: false,
      inBrowser: true,
      fsdata: {
        url: env.PUBLIC_FSDATA_URL || 'http://localhost:8092/fsdata/api/graphql',
        headers: {
          [HttpHeaderName.consumer]: 'first-spark-app',
        },
      },
      clientInfoStoreType: ClientInfoStoreType.db,
      logLevel: env.PUBLIC_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error' | 'silent' | undefined,
    };

    if (env.PUBLIC_APP_ENVIRONMENT) {
      config.appEnvironment = env.PUBLIC_APP_ENVIRONMENT as AppEnvironment;
    }

    try {
      this.client.addListener(listener);
      isSignedIn = this.client.isSignedIn;
    } catch (error) {
      console.error('MyUserContext: Error initializing BgNodeClient:', { error });
    } finally {
    }

    // if (env.PUBLIC_MOCK_DATA === 'true') {
    //    config.enableMockMode = true;
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

      if (env.PUBLIC_APP_ENVIRONMENT === 'development') {
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
      isLoading = true;
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

  async deleteMyUser(
    cause: string | undefined,
    description: string | undefined,
  ): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('MyUserContext.deleteMyUser: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    try {
      isLoading = true;
      const response = await this.client.operations.myUser.deleteMyUser(cause, description);
      if (response.error) {
        console.error('MyUserContext.deleteMyUser: received error.', { response });
        return translate(response.error, AppUiMessage.systemError);
      }

      return true;
    } catch (error) {
      console.error('MyUserContext.deleteMyUser: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate((error as Error).message, AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }

  public get isInitialized(): boolean {
    return this.client.isInitialized;
  }

  public get isOffline(): boolean {
    return isOffline;
  }

  public set isOffline(value: boolean) {
    isOffline = value;
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

  public get myUserInitials(): string {
    if (!this.myUserHandle) return '';

    const parts = this.myUserHandle.split(/[^a-zA-Z]/).filter(Boolean);
    if (parts.length === 0) return '';

    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).substring(0, 2);
    }

    const word = parts[0];
    const firstChar = word[0];
    const firstUpperAfterStart = word.slice(1).match(/[A-Z]/)?.[0] || '';

    return (firstChar + firstUpperAfterStart).substring(0, 2);
  }

  public get myUserOnboardingCompletion(): number {
    if (!this.myUser) return 0;

    if (!this.myUser.isEmailVerified) {
      return 2;
    } else if (!this.myUser.passwordUpdatedAt) {
      return 3;
    }

    return 1;
  }
}

// Create a singleton instance
export const myUserContext = new MyUserContext();
