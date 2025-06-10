import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import { CachePolicy, GiftCardProduct, ProductCategory, Vendor } from '@baragaun/bg-node-client';
let isLoading = $state(false);

export class MarketplaceContext {
  private client = client;

  async findGiftCardProducts(): Promise<GiftCardProduct[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findGiftCardProducts: not initialized.');
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
      const response = await this.client.operations.giftCardProduct.findGiftCardProducts(
        null,
        null,
        null,
        input.queryOptions,
        input.options,
      );
      if (!response || response.error || !response.objects) {
        console.error('findGiftCardProducts: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error('findGiftCardProducts: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }

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
      return response.objects;
    } catch (error) {
      console.error('findVendors: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }

  async findProductCategories(): Promise<ProductCategory[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findProductCategories: not initialized.');
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
      const response = await this.client.operations.productCategory.findProductCategories(
        null,
        null,
        null,
        input.queryOptions,
        input.options,
      );
      if (!response || response.error || !response.objects) {
        console.error('findProductCategories: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error('findProductCategories: error', {
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
