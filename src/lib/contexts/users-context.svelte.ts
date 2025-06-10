import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import {
  CachePolicy,
  User,
  UserListItem,
} from '@baragaun/bg-node-client';

let isUserLoading = $state(false);

export class UsersContext {
  public users = $state<UserListItem[]>([]);
  private client = client;

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

  async findUsers(searchText: string = ''): Promise<UserListItem[] | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('UsersContext.findUsers: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isUserLoading = true;
      const response = await this.client.operations.user.findUsers(
        { searchText },
        {},
        {},
        {},
        { cachePolicy: CachePolicy.network },
      );
      if (!response || response.error || !response.objects) {
        console.error('findUsers: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      this.users = response.objects;
      return response.objects;
    } catch (error) {
      console.error('findUsers: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isUserLoading = false;
    }
  }

  public get isUserLoading(): boolean {
    return isUserLoading;
  }
}

// Create a singleton instance
export const usersContext = new UsersContext();