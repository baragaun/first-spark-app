import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import { CachePolicy, Channel, ChannelMessage } from '@baragaun/bg-node-client';

let isLoading = $state(false);
let channels = $state<Channel[]>([]);
let channelMessages = $state<ChannelMessage[]>([]);

export class ChannelContext {
  private client = client;

  async findMyChannels(): Promise<Channel[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findMyChannels: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const input = {
        filter: {},
        match: {},
        options: {},
      };
      const response = await this.client.operations.channel.findMyChannels(
        input.filter,
        input.match,
        input.options,
        { cachePolicy: CachePolicy.network },
      );
      if (!response || response.error) {
        console.error('FindMyChannels: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      console.log('FindMyChannels: received response.', { response });
      return response.objects;
    } catch (error) {
      console.error('FindMyChannels: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }

  async findChannels(
    filter = {},
    match = {},
    options = {},
  ): Promise<Channel[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findChannels: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.channel.findChannels(filter, match, options, {
        cachePolicy: CachePolicy.network,
      });
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
      isLoading = false;
    }
  }

  async createChannel(input: any): Promise<Channel | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.createChannel: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.channel.createChannel(input);
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
      isLoading = false;
    }
  }

  async updateChannel(
    changes: Partial<Channel>,
    input: any,
  ): Promise<Channel | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.updateChannel: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.channel.updateChannel(changes, input);
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
      isLoading = false;
    }
  }

  async deleteChannel(id: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.deleteChannel: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
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
      isLoading = false;
    }
  }

  async findChannelMessages(
    filter = {},
    match = {},
    options = {},
  ): Promise<ChannelMessage[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findChannelMessages: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.channelMessage.findChannelMessages(
        filter,
        match,
        options,
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
      isLoading = false;
    }
  }

  async createChannelMessage(input: any): Promise<ChannelMessage | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.createChannelMessage: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.channelMessage.createChannelMessage(input);
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
      isLoading = false;
    }
  }

  async updateChannelMessage(
    changes: Partial<ChannelMessage>,
    input: any,
  ): Promise<ChannelMessage | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.updateChannelMessage: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.channelMessage.updateChannelMessage(
        changes,
        input,
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
      isLoading = false;
    }
  }

  async deleteChannelMessage(id: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.deleteChannelMessage: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
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
      isLoading = false;
    }
  }

  public get isLoading(): boolean {
    return isLoading;
  }

  public get channels(): Channel[] {
    return channels;
  }

  public get channelMessages(): ChannelMessage[] {
    return channelMessages;
  }
}

// Create a singleton instance
export const channelContext = new ChannelContext();
