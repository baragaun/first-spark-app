import translate from '@/helpers/language/translate';
import { client, initializeBgNodeClient } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import {
  CachePolicy,
  Channel,
} from '@baragaun/bg-node-client';

let isLoading = $state(false);
let channels = $state<Channel[]>([]);

export class ConversationContext {
  private client = client;

  public async initialize(): Promise<void> {
   try {
      await initializeBgNodeClient();
    } catch (error) {
      console.error('ConversationContext: Error initializing BgNodeClient:', { error });
    }
  }

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
        options: {
          // todo we will implement pagination later
        },

      };

      const response = await this.client.operations.channel.findMyChannels(input.filter, input.match, input.options, {cachePolicy: CachePolicy.network},);

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

  public get isInitialized(): boolean {
    return this.client.isInitialized;
  }


  public get isLoading(): boolean {
    return isLoading;
  }

  public get channels(): Channel[] {
    return channels;
  }

  public get myUserId(): string | undefined {
    return this.client.myUserId;
  }
}

// Create a singleton instance
export const conversationContext = new ConversationContext();
