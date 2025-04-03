import translate from '@/helpers/language/translate';
import { AppUiMessage } from '@/types/enums';
import {
  AppEnvironment,
  BgListenerTopic,
  BgNodeClient,
  ClientInfoStoreType,
  HttpHeaderName,
  NotificationMethod,
  User,
  type BgNodeClientConfig,
  type Channel,
  type ChannelInvitation,
  type ChannelInvitationListFilter,
  type ChannelListFilter,
  type ChannelMessage,
  type ChannelMessageListFilter,
  type ChannelParticipant,
  type ChannelParticipantListFilter,
  type QueryOptions,
  type QueryResult,
} from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

// Ques:
// Could I made a seperate context for initialization?
// Jonah mentioned to use mock data for chat functionality, so I found a data client function that creates MockChannel.
//  Should I use that?
// I would like to proceed step by step process. If we go like this I think it will be best:
// - Find Users and sent invites
// - Find Invites and accept them
// - Then channel feature inmplementations.

// One most important ques for retrive user data on refresh.

export const isLoading = writable(false);

export class MyChannelContext {
  private client: BgNodeClient = new BgNodeClient();
  private _isInitializing = false;

  public async initialize(): Promise<void> {
    console.log('MyChannelContext.initialize called.');

    if (this.client.isInitialized || this._isInitializing) {
      console.warn('MyChannelContext.initialize: already initialized.');
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
      clientInfoStoreType: ClientInfoStoreType.db,
      logLevel: 'debug',
    };

    if (import.meta.env.VITE_APP_ENVIRONMENT) {
      config.appEnvironment = import.meta.env.VITE_APP_ENVIRONMENT as AppEnvironment;
    }

    try {
      if (typeof window === 'undefined') {
        console.error('MyChannelContext.initialize: not running in the browser.');
        this._isInitializing = false;
        return;
      }

      if (!('indexedDB' in window)) {
        console.error('MyChannelContext.initialize: indexedDB is not supported in this browser.');
        this._isInitializing = false;
        return;
      }

      await this.client.init(config);
    } catch (error) {
      console.error('MyChannelContext: Error initializing BgNodeClient:', { error });
      this._isInitializing = false;
      return;
    }

    this._isInitializing = false;
  }

  /**
   * Find channels based on filter criteria
   * @param filter Filter criteria for channels
   * @param match Additional match criteria
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @param queryOptions Additional query options
   * @returns Promise with query result containing channels
   */
  async findChannels(
    filter: ChannelListFilter,
    match: Partial<Channel>,
    skip: number,
    limit: number,
    queryOptions?: QueryOptions,
  ): Promise<QueryResult<Channel>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.findChannels: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channel.findChannels(
        filter,
        match,
        skip,
        limit,
        queryOptions,
      );
    } catch (error) {
      console.error('MyChannelContext.findChannels: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Create a new channel
   * @param attributes Channel attributes
   * @returns Promise with query result containing the created channel
   */
  async createChannel(attributes: Partial<Channel>): Promise<QueryResult<Channel>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.createChannel: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channel.createChannel(attributes);
    } catch (error) {
      console.error('MyChannelContext.createChannel: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Create a mock channel with users and messages
   * @param attributes Channel attributes
   * @param userCount Number of users to create
   * @param messageCount Number of messages to create
   * @param users Optional list of users to include
   * @param messages Optional list of messages to include
   * @returns Object containing the created channel, messages, and users
   */
  createMockChannel(
    attributes: Partial<Channel>,
    userCount: number,
    messageCount: number,
    users?: User[],
    messages?: ChannelMessage[],
  ) {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.createMockChannel: not initialized.');
      throw new Error(translate(AppUiMessage.systemError));
    }

    try {
      return this.client.operations.channel.createMockChannel(
        attributes,
        userCount,
        messageCount,
        users,
        messages,
      );
    } catch (error) {
      console.error('MyChannelContext.createMockChannel: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw new Error(translate(AppUiMessage.systemError));
    }
  }

  /**
   * Create a channel invitation
   * @param attributes Invitation attributes
   * @returns Promise with query result containing the created invitation
   */
  async createChannelInvitation(
    attributes: Partial<ChannelInvitation>,
  ): Promise<QueryResult<ChannelInvitation>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.createChannelInvitation: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channelInvitation.createChannelInvitation(attributes);
    } catch (error) {
      console.error('MyChannelContext.createChannelInvitation: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Update a channel invitation
   * @param changes Changes to apply to the invitation
   * @returns Promise with query result containing the updated invitation
   */
  async updateChannelInvitation(
    changes: Partial<ChannelInvitation>,
  ): Promise<QueryResult<ChannelInvitation>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.updateChannelInvitation: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channelInvitation.updateChannelInvitation(changes);
    } catch (error) {
      console.error('MyChannelContext.updateChannelInvitation: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Find channel invitations based on filter criteria
   * @param filter Filter criteria for invitations
   * @param match Additional match criteria
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @param queryOptions Additional query options
   * @returns Promise with query result containing invitations
   */
  async findChannelInvitations(
    filter: ChannelInvitationListFilter,
    match: Partial<ChannelInvitation>,
    skip: number,
    limit: number,
    queryOptions?: QueryOptions,
  ): Promise<QueryResult<ChannelInvitation>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.findChannelInvitations: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channelInvitation.findChannelInvitations(
        filter,
        match,
        skip,
        limit,
        queryOptions,
      );
    } catch (error) {
      console.error('MyChannelContext.findChannelInvitations: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Delete a channel invitation
   * @param id ID of the invitation to delete
   * @returns Promise with query result containing the deleted invitation
   */
  async deleteChannelInvitation(id: string): Promise<QueryResult<ChannelInvitation>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.deleteChannelInvitation: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channelInvitation.deleteChannelInvitation(id);
    } catch (error) {
      console.error('MyChannelContext.deleteChannelInvitation: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Create a channel message
   * @param attributes Message attributes
   * @returns Promise with query result containing the created message
   */
  async createChannelMessage(
    attributes: Partial<ChannelMessage>,
  ): Promise<QueryResult<ChannelMessage>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.createChannelMessage: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channelMessage.createChannelMessage(attributes);
    } catch (error) {
      console.error('MyChannelContext.createChannelMessage: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Find channel messages based on filter criteria
   * @param filter Filter criteria for messages
   * @param match Additional match criteria
   * @param skip Number of records to skip
   * @param limit Maximum number of records to return
   * @param queryOptions Additional query options
   * @returns Promise with query result containing messages
   */
  async findChannelMessages(
    filter: ChannelMessageListFilter,
    match: Partial<ChannelMessage>,
    skip: number,
    limit: number,
    queryOptions?: QueryOptions,
  ): Promise<QueryResult<ChannelMessage>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.findChannelMessages: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channelMessage.findChannelMessages(
        filter,
        match,
        skip,
        limit,
        queryOptions,
      );
    } catch (error) {
      console.error('MyChannelContext.findChannelMessages: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Update a channel message
   * @param changes Changes to apply to the message
   * @returns Promise with query result containing the updated message
   */
  async updateChannelMessage(
    changes: Partial<ChannelMessage>,
  ): Promise<QueryResult<ChannelMessage>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.updateChannelMessage: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channelMessage.updateChannelMessage(changes);
    } catch (error) {
      console.error('MyChannelContext.updateChannelMessage: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Delete a channel message
   * @param id ID of the message to delete
   * @returns Promise with query result containing the deleted message
   */
  async deleteChannelMessage(id: string): Promise<QueryResult<ChannelMessage>> {
    if (!this.client.isInitialized) {
      console.error('MyChannelContext.deleteChannelMessage: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }

    try {
      isLoading.set(true);
      return await this.client.operations.channelMessage.deleteChannelMessage(id);
    } catch (error) {
      console.error('MyChannelContext.deleteChannelMessage: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading.set(false);
    }
  }

  public get isInitialized(): boolean {
    return this.client.isInitialized;
  }
}

// Create a singleton instance
export const myChannelContext = new MyChannelContext();