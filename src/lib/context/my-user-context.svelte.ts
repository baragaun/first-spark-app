import {
  AppEnvironment,
  BgNodeClient,
  type BgNodeClientConfig,
  CachePolicy,
  HttpHeaderName,
  type MyUser,
  type QueryOptions,
  type SidMultiStepActionProgress,
  type SignInUserInput,
  type SignUpUserInput,
  UserIdentType,
} from '@baragaun/bg-node-client';

export class MyUserContext {
  private myUser = $state<MyUser | null>(null);
  private isLoading = $state(false);
  private error = $state<string | null>(null);
  private client: BgNodeClient | undefined;

  // Derived state
  isAuthenticated = $derived(!!this.myUser);

  public async initialize(): Promise<void> {
    console.log('MyUserContext.init called.');

    if (this.client) {
      console.log('MyUserContext.init: client already exists.');
      return;
    }

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

    // if (import.meta.env.MOCK_DATA === 'true') {
    //   config.useMockData = true;
    // }

    this.client = await new BgNodeClient().init(config);

    if (!this.client) {
      throw new Error('MyUserContext.init: Error initializing BgNodeClient');
    }

    // todo: Only fetch a fresh copy of the user if this code is not called too often
    // Ideally, this code is only called once per session. We may have to set a timer
    // and make sure we don't fetch the user too often.
    if (this.client.operations.myUser.isSignedIn()) {
      await this.client.operations.myUser.findMyUser({ cachePolicy: CachePolicy.networkFirst });
    }
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
      this.myUser = await this.client.operations.myUser.findMyUser();
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
  ): Promise<{ myUser?: MyUser; error?: string }> {
    if (!this.client || this.client.operations.myUser.isSignedIn()) {
      this.myUser = null;

      return { error: 'Client not initialized or already signed in' };
    }

    try {
      this.isLoading = true;
      this.error = null;

      if (!identType) {
        identType = userIdent.startsWith('@') ? UserIdentType.email : UserIdentType.userHandle;
      }

      const input: SignInUserInput = {
        ident: userIdent,
        identType,
        password,
      };

      const response = await this.client.operations.myUser.signInUser(input);

      if (!response || response.error || !response.object?.userAuthResponse?.userId) {
        this.error = response.error || 'Failed to sign in';

        return { error: this.error };
      }

      await this.loadMyUser({ cachePolicy: CachePolicy.cache });

      if (!this.myUser) {
        this.error = 'Failed to load user after sign in';
        return { error: this.error };
      }

      return { myUser: this.myUser };
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Sign in failed';
      console.error('Error signing in:', err);
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  async signUpUser(email: string): Promise<{ myUser?: MyUser; error?: string }> {
    if (!this.client) {
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
    if (!this.client) {
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
    if (!this.client) {
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

  // todo
  async findAvailableUserHandle(email: string) {
    if (!this.client) {
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
  async isUserIdentAvailable(ident: string, identType: UserIdentType) {
    if (!this.client) {
      return { error: 'Client not initialized' };
    }

    try {
      return await this.client.operations.myUser.isUserIdentAvailable(ident, identType);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to check identity availability';
      console.error('Error checking identity availability:', err);
      return null;
    }
  }

  // // todo
  async resetMyPassword(
    email: string,
  ): Promise<{ actionProgress?: SidMultiStepActionProgress; error?: string }> {
    if (!this.client) {
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

  // todo
  async signInWithToken(
    userIdent: string,
  ): Promise<{ response?: SidMultiStepActionProgress; error?: string }> {
    if (!this.client) {
      return { error: 'Client not initialized' };
    }
    try {
      this.isLoading = true;
      this.error = null;
      const response = await this.client.operations.myUser.signInWithToken(userIdent, {
        polling: { enabled: true, interval: 1000, timeout: 10000 },
      });
      return { response: response.object?.actionProgress };
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to sign in with token';
      console.error('Error signing in with token:', err);
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  // // todo
  async verifyMultiStepActionToken(actionId: string, token: string, newPassword?: string) {
    if (!this.client) {
      return { error: 'Client not initialized' };
    }

    try {
      this.isLoading = true;
      this.error = null;
      return await this.client.operations.multiStepAction.verifyMultiStepActionToken(
        actionId,
        token,
        newPassword,
      );
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to verify token';
      console.error('Error verifying token:', err);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  // // todo
  async verifyMyEmail(
    email: string,
  ): Promise<{ response?: SidMultiStepActionProgress; error?: string }> {
    if (!this.client) {
      return { error: 'Client not initialized' };
    }

    try {
      this.isLoading = true;
      this.error = null;
      const response = await this.client.operations.myUser.verifyMyEmail(email, {
        polling: { enabled: true, interval: 1000, timeout: 10000 },
      });
      return { response: response.object?.actionProgress };
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to verify email';
      console.error('Error verifying email:', err);
      return { error: this.error };
    } finally {
      this.isLoading = false;
    }
  }

  public async getClient(): Promise<BgNodeClient> {
    if (!this.client) {
      await this.initialize();
    }

    if (!this.client) {
      throw new Error('Failed to initialize BgNodeClient');
    }

    return this.client;
  }
}

// Create a singleton instance
export const myUserContext = new MyUserContext();
