import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import {
  Brand,
  CachePolicy,
  GiftCardProduct,
  ProductCategory,
  PurchaseOrder,
  ServiceRequest,
  ShoppingCart,
  ShoppingCartItem,
  WalletItem,
  type QueryResult,
} from '@baragaun/bg-node-client';

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

  async findBrands(): Promise<Brand[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('ConversationContext.findBrands: not initialized.');
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
      const response = await this.client.operations.brand.findBrands(
        null,
        null,
        null,
        input.queryOptions,
        input.options,
      );
      if (!response || response.error || !response.objects) {
        console.error('findBrands: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error('findBrands: error', {
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

  async createShoppingCartItem(
    props: Partial<ShoppingCartItem>,
  ): Promise<QueryResult<ShoppingCartItem>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.createShoppingCartItem: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.shoppingCartItem.createShoppingCartItem(
        props as ShoppingCartItem, // Cast to ShoppingCartItem, as Partial is not accepted by the backend operation
      );
      if (!response || response.error) {
        console.error('createShoppingCartItem: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('createShoppingCartItem: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async updateShoppingCartItem(props: ShoppingCartItem): Promise<QueryResult<ServiceRequest>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.updateShoppingCartItem: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.shoppingCartItem.updateShoppingCartItem(props);
      if (!response || response.error) {
        console.error('updateShoppingCartItem: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('updateShoppingCartItem: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async deleteShoppingCartItem(id: string): Promise<QueryResult<ServiceRequest>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.deleteShoppingCartItem: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.shoppingCartItem.deleteShoppingCartItem(
        id,
        true,
      );
      if (!response || response.error) {
        console.error('deleteShoppingCartItem: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('deleteShoppingCartItem: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async findMyShoppingCart(): Promise<ShoppingCart | null | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.findShoppingCartItems: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.shoppingCart.findMyShoppingCart();
      if (!response || response.error || !response.object) {
        console.error('findShoppingCartItems: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error('findShoppingCartItems: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }

  async emptyMyShoppingCart(): Promise<QueryResult<void>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.emptyMyShoppingCart: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.shoppingCart.emptyMyShoppingCart();
      if (!response || response.error) {
        console.error('emptyMyShoppingCart: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('emptyMyShoppingCart: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async createPurchaseOrder(
    props: Partial<PurchaseOrder>, // Replace 'any' with the correct type if available
  ): Promise<QueryResult<PurchaseOrder>> {
    // Replace 'any' with PurchaseOrder if you have the type
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.createPurchaseOrder: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.purchaseOrder.createPurchaseOrder(props);
      if (!response || response.error) {
        console.error('createPurchaseOrder: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('createPurchaseOrder: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async findPurchaseOrders(): Promise<PurchaseOrder[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.findPurchaseOrders: not initialized.');
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
      const response = await this.client.operations.purchaseOrder.findPurchaseOrders(
        null,
        null,
        null,
        input.queryOptions,
        input.options,
      );
      if (!response || response.error || !response.objects) {
        console.error('findPurchaseOrders: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error('findPurchaseOrders: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }

  async findWalletItems(): Promise<WalletItem[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.findWalletItems: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    let args = {
      filter: {},
      match: {},
      options: { cachePolicy: CachePolicy.network },
      queryOptions: {},
    };
    try {
      isLoading = true;
      const response = await this.client.operations.walletItem.findWalletItems(
        null,
        null,
        null,
        args.queryOptions,
        args.options,
      );
      if (!response || response.error || !response.objects) {
        console.error('findWalletItems: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error('findWalletItems: error', {
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
