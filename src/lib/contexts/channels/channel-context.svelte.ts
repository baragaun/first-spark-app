import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import {
  CachePolicy,
  Channel,
  ChannelListItem,
  ChannelMessage,
  SortDirection,
  type QueryOptions,
} from '@baragaun/bg-node-client';

let isChannelLoading = $state(false);
let myChannels = $state<ChannelListItem[]>([]);
let selectedChannel = $state<ChannelListItem | null>(null);

export class ChannelContext {
  private client = client;

  async findMyChannels(
    skip: number,
    limit: number = 20, // TODO we should change it according to the requirement
  ): Promise<ChannelListItem[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.findMyChannels: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
      const input = {
        filter: {},
        match: {},
        queryOptions: { cachePolicy: CachePolicy.network },
        options: { skip, limit },
      };
      const participantLimit = 2;
      const response = await this.client.operations.channel.findMyChannels(
        participantLimit,
        true,
        input.options,
        input.queryOptions,
      );
      if (!response || response.error || !response.objects) {
        console.error('FindMyChannels: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }

      if (skip === 0) {
        myChannels = response.objects;
      } else {
        myChannels = [...myChannels, ...response.objects];
      }

      return response.objects;
    } catch (error) {
      console.error('FindMyChannels: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading = false;
    }
  }

  async findChannels(
    filter = {},
    match = {},
    options = { cachePolicy: CachePolicy.network },
    queryOptions = {},
  ): Promise<ChannelListItem[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.findChannels: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
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
      isChannelLoading = false;
    }
  }

  async findChannelById(channelId: string): Promise<ChannelListItem | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.findChannelById: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
      const response = await this.client.operations.channel.findChannelById(
        channelId,
        { includeMessages: true, includeParticipants: true },
        { cachePolicy: CachePolicy.network },
      );
      if (!response || response.error) {
        console.error('FindChannelsById: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }

      // TODO: Later we expect to get a ChannelListItem so that we can use Participants
      if (response.channel && response.participants) {
        return {
          ...response.channel,
          participants: response.participants,
        } as ChannelListItem;
      }

      return response.channel;
    } catch (error) {
      console.error('FindChannelsById: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isChannelLoading = false;
    }
  }

  async createChannel(attributes: Partial<Channel>): Promise<Channel | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.createChannel: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
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
      isChannelLoading = false;
    }
  }

  async updateChannel(
    changes: Partial<Channel>,
    queryOptions: QueryOptions,
  ): Promise<Channel | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.updateChannel: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
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
      isChannelLoading = false;
    }
  }

  async deleteChannelParticipant(participantId: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.deleteChannel: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
      const response =
        await this.client.operations.channelParticipant.deleteChannelParticipant(participantId);
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
      isChannelLoading = false;
    }
  }

  async findChannelMessages(
    channelId: string,
    skip = 0,
    limit = 10,
  ): Promise<ChannelMessage[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.findChannelMessages: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
      const response = await this.client.operations.channelMessage.findChannelMessages(
        {},
        { channelId },
        undefined,
        { skip, limit, sort: [{ field: 'createdAt', direction: SortDirection.desc }] },
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
      isChannelLoading = false;
    }
  }

  async createChannelMessage(
    attributes: Partial<ChannelMessage>,
  ): Promise<ChannelMessage | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.createChannelMessage: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
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
      isChannelLoading = false;
    }
  }

  async updateChannelMessage(
    changes: Partial<ChannelMessage>,
  ): Promise<ChannelMessage | string | null | undefined> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.updateChannelMessage: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
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
      isChannelLoading = false;
    }
  }

  async deleteChannelMessage(id: string): Promise<true | string> {
    if (!this.client.isInitialized) {
      console.error('ChannelContext.deleteChannelMessage: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isChannelLoading = true;
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
      isChannelLoading = false;
    }
  }

  public selectChannel(channel: ChannelListItem) {
    selectedChannel = channel;
  }

  public get selectedChannel(): ChannelListItem | null {
    return selectedChannel;
  }

  public get myChannels(): ChannelListItem[] | [] {
    return myChannels;
  }

  public get isChannelLoading(): boolean {
    return isChannelLoading;
  }
}

// Create a singleton instance
export const channelContext = new ChannelContext();
