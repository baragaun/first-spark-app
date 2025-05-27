import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { isChannelLoading, myChannels } from '@/stores/channel-store';
import { AppUiMessage } from '@/types/enums';
import {
  CachePolicy,
  Channel,
  ChannelMessage,
  User,
  type QueryOptions,
} from '@baragaun/bg-node-client';

export class ChannelContext {
  private client = client;

  async findMyChannels(): Promise<Channel[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findMyChannels: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const input = {
        filter: {},
        match: {},
        options: { cachePolicy: CachePolicy.network },
        queryOptions: {},
      };
      const response = await this.client.operations.channel.findMyChannels(
        null,
        null,
        null,
        input.queryOptions,
        input.options,
      );
      if (!response || response.error || !response.objects) {
        console.error('FindMyChannels: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }

      myChannels.set(response.objects);

      return response.objects;
    } catch (error) {
      console.error('FindMyChannels: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }

  async findChannels(
    filter = {},
    match = {},
    options = { cachePolicy: CachePolicy.network },
    queryOptions = {},
  ): Promise<Channel[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findChannels: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const response = await this.client.operations.channel.findChannels(
        filter,
        match,
        options,
        queryOptions,
      );
      if (!response || response.error) {
        console.error('FindChannels: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error('FindChannels: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }

  async createChannel(attributes: Partial<Channel>): Promise<Channel | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.createChannel: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const response = await this.client.operations.channel.createChannel(attributes);
      if (!response || response.error) {
        console.error('CreateChannel: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error('CreateChannel: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }

  async updateChannel(
    changes: Partial<Channel>,
    queryOptions: QueryOptions,
  ): Promise<Channel | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.updateChannel: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const response = await this.client.operations.channel.updateChannel(changes, queryOptions);
      if (!response || response.error) {
        console.error('UpdateChannel: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error('UpdateChannel: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }

  async deleteChannel(id: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.deleteChannel: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const response = await this.client.operations.channel.deleteChannel(id);
      if (!response || response.error) {
        console.error('DeleteChannel: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return true;
    } catch (error) {
      console.error('DeleteChannel: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }

  async findChannelMessages(channelId: string): Promise<ChannelMessage[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findChannelMessages: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const response = await this.client.operations.channelMessage.findChannelMessages(
        {},
        { channelId },
        {},
        {},
        { cachePolicy: CachePolicy.network },
      );
      if (!response || response.error) {
        console.error('FindChannelMessages: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error('FindChannelMessages: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }

  async createChannelMessage(
    attributes: Partial<ChannelMessage>,
  ): Promise<ChannelMessage | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.createChannelMessage: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const response = await this.client.operations.channelMessage.createChannelMessage(attributes);
      if (!response || response.error) {
        console.error('CreateChannelMessage: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error('CreateChannelMessage: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }

  async updateChannelMessage(
    changes: Partial<ChannelMessage>,
  ): Promise<ChannelMessage | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.updateChannelMessage: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const response = await this.client.operations.channelMessage.updateChannelMessage(
        changes,
        {},
      );
      if (!response || response.error) {
        console.error('UpdateChannelMessage: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error('UpdateChannelMessage: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }

  async deleteChannelMessage(id: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.deleteChannelMessage: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const response = await this.client.operations.channelMessage.deleteChannelMessage(id);
      if (!response || response.error) {
        console.error('DeleteChannelMessage: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return true;
    } catch (error) {
      console.error('DeleteChannelMessage: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }

  async findRecipientInfo(recipientId: string): Promise<User | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findRecipientInfo: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading.set(true);
      const response = await this.client.operations.user.findUserById(recipientId);
      if (!response || response.error) {
        console.error('FindRecipientInfo: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error('FindRecipientInfo: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading.set(false);
    }
  }
}

// Create a singleton instance
export const channelContext = new ChannelContext();
