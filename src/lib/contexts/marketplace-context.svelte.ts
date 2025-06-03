import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import {
  CachePolicy,
  Vendor,
  type QueryOptions,
} from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';
let isLoading = $state(false);
const vendorsList = writable<Vendor[]>([]);

export class MarketplaceContext {
  private client = client;

  async findVendors(): Promise<Vendor[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findVendors: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const input = {
        filter: {},
        match: {},
        options: { cachePolicy: CachePolicy.network },
        queryOptions: {},
      };
      const response = await this.client.operations.vendor.findVendors(
        null,
        null,
        null,
        input.queryOptions,
        input.options,
      );
      if (!response || response.error || !response.objects) {
        console.error('findVendors: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }

      vendorsList.set(response.objects);

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
}

// Create a singleton instance
export const marketplaceContext = new MarketplaceContext();