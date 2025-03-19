import {
  AppEnvironment,
  BgNodeClient,
  type BgNodeClientConfig,
  CachePolicy, HttpHeaderName,
  type MyUser,
  type QueryOptions,
  type SignInUserInput,
  type SignUpUserInput,
  UserIdentType
} from '@baragaun/bg-node-client'

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
    if (!this.client || !this.isSignedIn()) {
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

  public async signIn(
    userIdent: string,
    password: string,
    identType?: UserIdentType,
  ): Promise<{ myUser?: MyUser, error?: string }> {
    if (!this.client || this.isSignedIn()) {
      this.myUser = null;

      return { error: 'Client not initialized or already signed in' };
    }

    try {
      this.isLoading = true;
      this.error = null;

      if (!identType) {
        identType = userIdent.startsWith('@')
          ? UserIdentType.email
          : UserIdentType.userHandle;
      }

      const input: SignInUserInput = {
        ident: userIdent,
        identType,
        password,
      }

      const response = await this.client.operations.myUser.signInUser(input);

      if (
        !response ||
        response.error ||
        !response.object?.userAuthResponse?.userId
      ) {
        this.error = response.error || 'Failed to sign in';

        return { error: this.error };
      }

      await this.loadMyUser({ cachePolicy: CachePolicy.network });

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

  async signUp(email: string) {
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

      if (
        !response ||
        response.error ||
        !response.object?.userAuthResponse?.userId
      ) {
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
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async signMeOut(): Promise<void> {
    if (!this.client) {
      this.myUser = null;

      return { error: 'Client not initialized' };
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

  async updateMyUser(changes: Partial<MyUser>): Promise<{ myUser?: MyUser, error?: string}> {
    if (!this.client) {
      return { error: 'Client not initialized' };
    }

    try {
      this.isLoading = true;
      this.error = null;

      const response = await this.client.operations.myUser.updateMyUser(changes);

      if (
        !response ||
        response.error ||
        !response.object?.id
      ) {
        console.error('MyUserContext.updateMyUser failed.', response.error);

        return { error: response.error };
      }

      this.myUser = response.object;

      return { myUser: this.myUser };
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Update failed';
      console.error('Error updating profile:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  // todo
  async findAvailableUserHandle(email: string) {
    try {
      return await MyUserContext.findAvailableUserHandle(email);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to find available handle';
      console.error('Error finding available handle:', err);
      return null;
    }
  }

  // todo
  async isUserIdentAvailable(ident: string, identType: UserIdentType) {
    try {
      return await MyUserContext.isUserIdentAvailable(ident, identType);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to check identity availability';
      console.error('Error checking identity availability:', err);
      return null;
    }
  }

  // todo
  async resetMyPassword(email: string) {
    try {
      this.isLoading = true;
      this.error = null;
      return await MyUserContext.resetMyPassword(email);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to reset password';
      console.error('Error resetting password:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  // todo
  async signInWithToken(userIdent: string) {
    try {
      this.isLoading = true;
      this.error = null;
      return await MyUserContext.signInWithToken(userIdent);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to sign in with token';
      console.error('Error signing in with token:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  // todo
  async verifyMultiStepActionToken(actionId: string, token: string, newPassword?: string) {
    try {
      this.isLoading = true;
      this.error = null;
      return await MyUserContext.verifyMultiStepActionToken(actionId, token, newPassword);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to verify token';
      console.error('Error verifying token:', err);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  // todo
  async verifyMyEmail(email: string) {
    try {
      this.isLoading = true;
      this.error = null;
      return await MyUserContext.verifyMyEmail(email);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to verify email';
      console.error('Error verifying email:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }
}

// Create a singleton instance
export const myUserContext = new MyUserContext();
