import {
  AppEnvironment,
  BgNodeClient,
  CachePolicy,
  HttpHeaderName,
  MutationType,
  NotificationMethod,
  type BgNodeClientConfig,
  type MultiStepActionProgressResult,
  type MutationResult,
  type MyUser,
  type QueryOptions,
  type QueryResult,
  type SidMultiStepActionProgress,
  type SignInUserInput,
  type SignUpUserInput,
  UserIdentType,
  type SignInSignUpResponse,
} from '@baragaun/bg-node-client'
import { AppUiMessage } from '@/types/enums'
import translate from '@/helpers/language/translate'

export class MyUserContext {
  private myUser = $state<MyUser | null>(null);
  private isLoading = $state(false);
  private error = $state<string | null>(null);
  private client: BgNodeClient = new BgNodeClient();

  // Non-state variables:
  private _isInitialized = false;
  private _isInitializing = false;

  // Derived state
  isAuthenticated = $derived(!!this.myUser);

  public async initialize(): Promise<void> {
    console.log('MyUserContext.init called.');

    if (this._isInitialized || this._isInitializing) {
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
    };

    if (import.meta.env.VITE_APP_ENVIRONMENT) {
      config.appEnvironment = import.meta.env.VITE_APP_ENVIRONMENT as AppEnvironment;
    }

    try {
      await this.client.init(config);
    } catch (error) {
      console.error('MyUserContext: Error initializing BgNodeClient:', { error });
      this._isInitializing = false;
      return;
    }

    // if (import.meta.env.MOCK_DATA === 'true') {
    //   config.useMockData = true;
    // }


    this._isInitialized = true;

    // todo: Only fetch a fresh copy of the user if this code is not called too often
    // Ideally, this code is only called once per session. We may have to set a timer
    // and make sure we don't fetch the user too often.
    if (this.client.operations.myUser.isSignedIn()) {
      await this.client.operations.myUser.findMyUser({ cachePolicy: CachePolicy.networkFirst });
    }

    this._isInitializing = false;
  }

  public get isSignedIn(): boolean {
    return this.client?.operations.myUser.isSignedIn() || false;
  }

  public async loadMyUser(queryOptions?: QueryOptions): Promise<MyUser | null> {
    if (!this.client || !this.client.operations.myUser.isSignedIn()) {
      this.myUser = null;
      return null;
    }

    try {
      this.isLoading = true;
      this.error = null;
      this.myUser = await this.client.operations.myUser.findMyUser(queryOptions);
      return this.myUser;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load user';
      console.error('Error loading user:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  public async signInUser(
    userIdent: string,
    identType: UserIdentType | undefined,
    password: string,
  ): Promise<MutationResult<SignInSignUpResponse>> {
    if (!this.client || this.client.isInitialized) {
      this.error = translate(AppUiMessage.systemError)
      return { operation: MutationType.update, error: this.error };
    }

    if (!this.client || this.client.operations.myUser.isSignedIn()) {
      console.error('MyUserContext.signInUser: already signed in');
      this.error = translate(AppUiMessage.systemError)
      return { operation: MutationType.update, error: this.error };
    }

    try {
      this.isLoading = true;
      this.error = null;

      const input: SignInUserInput = {
        ident: userIdent,
        identType,
        password,
      };

      return this.client.operations.myUser.signInUser(input);
    } catch (error) {
      console.error('MyUserContext.signInUser: error', { error });
      this.error = translate(AppUiMessage.systemError)
      return { operation: MutationType.update, error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async signUpUser(email: string): Promise<{ myUser?: MyUser; error?: string }> {
    if (!this._isInitialized) {
      this.myUser = null;

      return { error: 'Client not initialized' };
    }

    try {
      this.isLoading = true;
      this.error = null;

      const input: SignUpUserInput = { email };

      if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
        input.isTestUser = true;
        input.source = 'testtoken=666666';
      }

      const response = await this.client.operations.myUser.signUpUser(input);

      if (!response || response.error || !response.object?.userAuthResponse?.userId) {
        console.error('SignUpUser failed.', response.error);

        return { error: response.error || 'Error signing up' };
      }

      await this.loadMyUser({ cachePolicy: CachePolicy.network });

      if (!this.myUser) {
        this.error = 'Failed to load user after sign in';
        return { error: this.error };
      }

      return { myUser: this.myUser };
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Sign up failed';
      console.error('Error signing up:', err);
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async signMeOut(): Promise<boolean> {
    if (!this._isInitialized) {
      this.myUser = null;
      console.log('Client not initialized');
      return false;
    }

    try {
      this.isLoading = true;
      this.error = null;

      await this.client.operations.myUser.signMeOut();
      this.myUser = null;

      return true;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Sign out failed';
      console.error('Error signing out:', err);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async updateMyUser(changes: Partial<MyUser>): Promise<{ myUser?: MyUser; error?: string }> {
    if (!this._isInitialized) {
      return { error: 'Client not initialized' };
    }

    try {
      this.isLoading = true;
      this.error = null;

      const response = await this.client.operations.myUser.updateMyUser(changes);

      if (!response || response.error || !response.object?.id) {
        console.error('MyUserContext.updateMyUser failed.', response.error);

        return { error: response.error };
      }

      this.myUser = response.object;

      return { myUser: this.myUser };
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Update failed';
      console.error('Error updating profile:', err);
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async updateMyPassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<{ myUser?: MyUser; error?: string }> {
    if (!this._isInitialized) {
      return { error: 'Client not initialized' };
    }

    try {
      this.isLoading = true;
      this.error = null;

      const response = await this.client.operations.myUser.updateMyPassword(
        oldPassword,
        newPassword,
        { cachePolicy: CachePolicy.network },
      );

      if (!response || response.error || !response.object?.id) {
        console.error('MyUserContext.updatePassword failed.', response.error);

        return { error: response.error };
      }

      this.myUser = response.object;

      return { myUser: this.myUser };
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Update failed';
      console.error('Error updating profile:', err);
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async findAvailableUserHandle(email: string) {
    if (!this._isInitialized) {
      return { error: 'Client not initialized' };
    }

    try {
      return await this.client.operations.myUser.findAvailableUserHandle(email);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to find available handle';
      console.error('Error finding available handle:', err);
      return null;
    }
  }

  // todo
  async isUserIdentAvailable(
    ident: string,
    identType: UserIdentType,
  ): Promise<{ isAvailable?: boolean; error?: string }> {
    if (!this._isInitialized) {
      return { error: 'Client not initialized' };
    }

    try {
      const response = await this.client.operations.myUser.isUserIdentAvailable(ident, identType);
      return { isAvailable: response };
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to check identity availability';
      console.error('Error checking identity availability:', err);
      return { isAvailable: false, error: this.error };
    }
  }

  // // todo
  async resetMyPassword(
    email: string,
  ): Promise<{ actionProgress?: SidMultiStepActionProgress; error?: string }> {
    if (!this._isInitialized) {
      return { error: 'Client not initialized' };
    }
    try {
      this.isLoading = true;
      this.error = null;
      const response = await this.client.operations.myUser.resetMyPassword(email, {
        polling: { enabled: true, interval: 1000, timeout: 10000 },
      });
      return { actionProgress: response.object?.actionProgress };
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to reset password';
      console.error('Error Reset password:', err);
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithToken(
    userIdent: string,
  ): Promise<QueryResult<MultiStepActionProgressResult>> {
    if (!this._isInitialized) {
      return { error: 'Client not initialized' };
    }

    try {
      this.isLoading = true;
      this.error = null;
      const response = await this.client.operations.myUser.signInWithToken(userIdent, {
        polling: { enabled: true, interval: 1000, timeout: 10000 },
      });
      return response;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to sign in with token';
      console.error('Error signing in with token:', err);
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async verifyMultiStepActionToken(actionId: string, token: string, newPassword?: string): Promise<{ error?: string }> {
    if (!this._isInitialized) {
      console.error('MyUserContext.verifyMultiStepActionToken: no client');
      return { error: 'system-error' };
    }

    try {
      this.isLoading = true;
      this.error = null;
      const response = await this.client.operations.multiStepAction.verifyMultiStepActionToken(
        actionId,
        token,
        newPassword,
      );

      if (response.error || !response.object) {
        console.error('MyUserContext.verifyMultiStepActionToken: failed calling client.verifyMultiStepActionToken',
          response.error);
        return { error: response.error || 'system-error' };
      }

      return {};
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to send verify token';
      console.error('MyUserContext.verifyMultiStepActionToken: error thrown.', { error });
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async verifyMyEmail(
    email: string,
  ): Promise<QueryResult<MultiStepActionProgressResult>> {
    if (!this._isInitialized) {
      return { error: 'Client not initialized' };
    }

    try {
      this.isLoading = true;
      this.error = null;
      const response = await this.client.operations.myUser.verifyMyEmail(email, {
        polling: { enabled: true, interval: 1000, timeout: 10000 },
      });
      return response;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to verify email';
      console.error('Error verifying email:', err);
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async sendMultiStepActionNotification(
    actionId: string,
    email?: string,
  ): Promise<MutationResult<string>> {
    const returnValue: MutationResult<string> = {
      operation: MutationType.update,
    }

    if (!this._isInitialized) {
      console.error('MyUserContext.sendMultiStepActionNotification: not initialized.');
      returnValue.error = 'system-error';
      return returnValue;
    }

    try {
      this.isLoading = true;
      return this.client.operations.multiStepAction.sendMultiStepActionNotification(
        actionId,
        email,
        undefined,
        NotificationMethod.email,
      );
    } catch (error) {
      console.error('MyUserContext.sendMultiStepActionNotification: error', { error });
      returnValue.error = 'system-error';
      return returnValue;
    } finally {
      this.isLoading = false;
    }
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public get myUserId(): string | undefined {
    return this.client.myUserId;
  }
}

// Create a singleton instance
export const myUserContext = new MyUserContext();
