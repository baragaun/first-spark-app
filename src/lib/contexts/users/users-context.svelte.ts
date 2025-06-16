import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import { CachePolicy, User, UserListFilter, UserListItem } from '@baragaun/bg-node-client';

let isUserLoading = $state(false);

export class UsersContext {
  public users = $state<UserListItem[]>([]);
  public searchText = $state('');
  private client = client;
  private hasLoadedUsers = false;

  async findUserInfoById(recipientId: string): Promise<User | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('UsersContext.findUserInfoById: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isUserLoading = true;
      const response = await this.client.operations.user.findUserById(recipientId);
      if (!response || response.error) {
        console.error('findUserInfoById: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error('findUserInfoById: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isUserLoading = false;
    }
  }

  async getAllUsers(
    excludeIds?: string[],
    skip: number = 0,
    limit: number = 5, // TODO we should change it according to the requirement
    searchText?: string,
  ): Promise<UserListItem[] | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('UsersContext.getAllUsers: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isUserLoading = true;

      const filter: UserListFilter = {
        excludeIds,
        searchText,
      };

      const response = await this.client.operations.user.findUsers(
        filter,
        {},
        {},
        { skip, limit },
        { cachePolicy: CachePolicy.network },
      );
      if (!response || response.error || !response.objects) {
        console.error('getAllUsers: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }

      if (skip === 0) {
        this.users = response.objects;
      } else {
        this.users = [...this.users, ...response.objects];
      }

      this.hasLoadedUsers = true;
      return response.objects;
    } catch (error) {
      console.error('getAllUsers: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isUserLoading = false;
    }
  }

  async searchUsers(
    searchText: string,
    excludeIds?: string[],
    skip: number = 0,
    limit: number = 5, // TODO we should change it according to the requirement
  ): Promise<UserListItem[] | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('UsersContext.searchUsers: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isUserLoading = true;

      this.searchText = searchText;

      const filter: UserListFilter = {
        searchText,
        excludeIds,
      };

      const response = await this.client.operations.user.findUsers(
        filter,
        {},
        {},
        { skip, limit },
        { cachePolicy: CachePolicy.network },
      );
      if (!response || response.error || !response.objects) {
        console.error('searchUsers: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }

      if (skip === 0) {
        this.users = response.objects;
      } else {
        this.users = [...this.users, ...response.objects];
      }

      return response.objects;
    } catch (error) {
      console.error('searchUsers: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isUserLoading = false;
    }
  }

  async ensureUsersLoaded(excludeIds?: string[]): Promise<void> {
    if (!this.hasLoadedUsers) {
      await this.getAllUsers(excludeIds);
    }
  }

  async clearSearch(excludeIds?: string[]): Promise<void> {
    this.searchText = '';
    await this.getAllUsers(excludeIds);
  }

  public get isUserLoading(): boolean {
    return isUserLoading;
  }

  public get hasUsers(): boolean {
    return this.hasLoadedUsers;
  }
}

// Create a singleton instance
export const usersContext = new UsersContext();
