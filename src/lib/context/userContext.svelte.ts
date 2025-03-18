import dataProvider from '@/services/dataProvider/dataProvider';
import { CachePolicy, type MyUser, UserIdentType } from '@baragaun/bg-node-client';

export class UserContext {
  user = $state<MyUser | null>(null);
  isLoading = $state(false);
  error = $state<string | null>(null);

  // Derived state
  isAuthenticated = $derived(!!this.user);

  constructor() {
    this.loadUser();
  }

  async loadUser() {
    if (!dataProvider.isSignedIn()) {
      this.user = null;
      return null;
    }

    try {
      this.isLoading = true;
      this.error = null;
      this.user = await dataProvider.findMyUser(CachePolicy.networkFirst);
      return this.user;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to load user';
      console.error('Error loading user:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async signIn(identifier: string, password: string) {
    try {
      this.isLoading = true;
      this.error = null;

      const identType = identifier.includes('@') ? UserIdentType.email : UserIdentType.userHandle;
      // todo need to handle some complex situation for userHandle.

      const user = await dataProvider.signInUser(identifier, identType, password);

      if (user) {
        this.user = user;
        return user;
      } else {
        this.error = 'Invalid credentials';
        return null;
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Sign in failed';
      console.error('Error signing in:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async signUp(username: string | undefined, email: string, password: string | undefined) {
    try {
      this.isLoading = true;
      this.error = null;

      const user = await dataProvider.signUpUser(username, email, password);

      if (user) {
        this.user = user;
        return user;
      } else {
        this.error = 'Failed to create account';
        return null;
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Sign up failed';
      console.error('Error signing up:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async signOut() {
    try {
      this.isLoading = true;
      this.error = null;

      await dataProvider.signMeOut();
      this.user = null;

      return true;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Sign out failed';
      console.error('Error signing out:', err);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile(changes: Partial<MyUser>) {
    try {
      this.isLoading = true;
      this.error = null;

      const updatedUser = await dataProvider.updateMyUser(changes);

      if (updatedUser) {
        this.user = updatedUser;
        return updatedUser;
      } else {
        this.error = 'Failed to update profile';
        return null;
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Update failed';
      console.error('Error updating profile:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  // Additional methods to wrap dataProvider functionality

  isSignedIn() {
    return dataProvider.isSignedIn();
  }

  async findMyUser(cachePolicy = CachePolicy.networkFirst) {
    try {
      this.isLoading = true;
      this.error = null;
      const user = await dataProvider.findMyUser(cachePolicy);
      if (user) {
        this.user = user;
      }
      return user;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to find user';
      console.error('Error finding user:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async findAvailableUserHandle(email: string) {
    try {
      return await dataProvider.findAvailableUserHandle(email);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to find available handle';
      console.error('Error finding available handle:', err);
      return null;
    }
  }

  async isUserIdentAvailable(ident: string, identType: UserIdentType) {
    try {
      return await dataProvider.isUserIdentAvailable(ident, identType);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to check identity availability';
      console.error('Error checking identity availability:', err);
      return null;
    }
  }

  async resetMyPassword(email: string) {
    try {
      this.isLoading = true;
      this.error = null;
      return await dataProvider.resetMyPassword(email);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to reset password';
      console.error('Error resetting password:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithToken(userIdent: string) {
    try {
      this.isLoading = true;
      this.error = null;
      return await dataProvider.signInWithToken(userIdent);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to sign in with token';
      console.error('Error signing in with token:', err);
      return null;
    } finally {
      this.isLoading = false;
    }
  }

  async verifyMultiStepActionToken(actionId: string, token: string, newPassword?: string) {
    try {
      this.isLoading = true;
      this.error = null;
      return await dataProvider.verifyMultiStepActionToken(actionId, token, newPassword);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to verify token';
      console.error('Error verifying token:', err);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async verifyMyEmail(email: string) {
    try {
      this.isLoading = true;
      this.error = null;
      return await dataProvider.verifyMyEmail(email);
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
export const userContext = new UserContext();
