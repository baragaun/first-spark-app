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
  WalletItemTransfer,
  WalletItemTransferRecipientInfo,
  type QueryResult,
} from '@baragaun/bg-node-client';
import { myUserContext } from './my-user-context.svelte';

let isLoading = $state(false);

export class MarketplaceContext {
  private client = client;

  async acceptWalletItemTransfer(
    transferSlug: string,
    secretCode: string,
  ): Promise<QueryResult<WalletItem>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.acceptWalletItemTransfer: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItemTransfer.acceptWalletItemTransfer(
        transferSlug,
        secretCode,
      );
      if (!response || response.error) {
        console.error('acceptWalletItemTransfer: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('acceptWalletItemTransfer: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async archiveWalletItem(id: string, archived: boolean): Promise<QueryResult<WalletItem>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.archiveWalletItem: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItem.updateWalletItem({
        id,
        archivedAt: archived ? new Date().toISOString() : null,
      });

      if (!response || response.error) {
        console.error('archiveWalletItem: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('archiveWalletItem: error', {
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

  async createWalletItem(props: Partial<WalletItem>): Promise<QueryResult<WalletItem>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.createWalletItem: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItem.createWalletItem(props);
      if (!response || response.error) {
        console.error('createWalletItem: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('createWalletItem: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async createWalletItemTransfer(
    props: Partial<WalletItemTransfer>,
  ): Promise<QueryResult<WalletItemTransfer>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.createWalletItemTransfer: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response =
        await this.client.operations.walletItemTransfer.createWalletItemTransfer(props);
      if (!response || response.error) {
        console.error('createWalletItemTransfer: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('createWalletItemTransfer: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async declineWalletItemTransfer(transferSlug: string): Promise<QueryResult<WalletItem>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.declineWalletItemTransfer: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response =
        await this.client.operations.walletItemTransfer.declineWalletItemTransfer(transferSlug);
      if (!response || response.error) {
        console.error('declineWalletItemTransfer: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('declineWalletItemTransfer: error', {
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

  async findBrand(id: string): Promise<Brand | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.findBrand: not initialized.');
      return translate(AppUiMessage.systemError);
    }

    try {
      isLoading = true;

      const response = await this.client.operations.brand.findBrandById(
        id,
        {},
        { cachePolicy: CachePolicy.cacheFirst },
      );

      if (!response || response.error || !response.object) {
        console.error('findBrand: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }

      return response.object;
    } catch (error) {
      console.error('findBrand: error', {
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
      console.error('MarketplaceContext.findBrands: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;

      const response = await this.client.operations.brand.findBrands(
        undefined,
        undefined,
        undefined,
        {},
        { cachePolicy: CachePolicy.cacheFirst },
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

  async findGiftCardProducts(): Promise<GiftCardProduct[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.findGiftCardProducts: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;

      const response = await this.client.operations.giftCardProduct.findGiftCardProducts(
        undefined,
        undefined,
        undefined,
        {},
        { cachePolicy: CachePolicy.network },
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

  async findProductCategories(): Promise<ProductCategory[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.findProductCategories: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;

      const response = await this.client.operations.productCategory.findProductCategories(
        undefined,
        undefined,
        undefined,
        {},
        { cachePolicy: CachePolicy.network },
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

  async findPurchaseOrders(): Promise<PurchaseOrder[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.findPurchaseOrders: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;

      const response = await this.client.operations.purchaseOrder.findPurchaseOrders(
        undefined,
        { createdBy: myUserContext.myUserId },
        null,
        {},
        { cachePolicy: CachePolicy.network },
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

  async findWalletItemByTransferSlug(
    transferSlug: string,
  ): Promise<WalletItem | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.findWalletItemByTransferSlug: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItem.findWalletItemByTransferSlug(
        transferSlug,
        {},
      );
      if (!response || response.error || !response.object) {
        console.error('findWalletItemByTransferSlug: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error('findWalletItemByTransferSlug: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }

  async findWalletItemTransferRecipientInfoByTransferSlug(
    transferSlug: string,
  ): Promise<WalletItemTransferRecipientInfo | string> {
    if (!this.client.isInitialized) {
      console.error(
        'MarketplaceContext.findWalletItemTransferRecipientInfoByTransferSlug: not initialized.',
      );
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response =
        await this.client.operations.walletItemTransfer.findWalletItemTransferRecipientInfoByTransferSlug(
          transferSlug,
        );
      if (!response || response.error || !response.object) {
        console.error('findWalletItemTransferRecipientInfoByTransferSlug: received error.', {
          response,
        });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error('findWalletItemTransferRecipientInfoByTransferSlug: error', {
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

    const args = {
      filter: {},
      match: { walletId: myUserContext.myUserId },
      options: { cachePolicy: CachePolicy.network },
      queryOptions: {},
    };
    try {
      isLoading = true;
      const response = await this.client.operations.walletItem.findWalletItems(
        args.filter,
        args.match,
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

  async findWalletItemTransfers(): Promise<WalletItemTransfer[] | string | undefined> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.findWalletItemTransfers: not initialized.');
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;

      const response = await this.client.operations.walletItemTransfer.findWalletItemTransfers(
        undefined,
        { createdBy: myUserContext.myUserId },
        undefined,
        {},
        { cachePolicy: CachePolicy.network },
      );

      if (!response || response.error || !response.objects) {
        console.error('findWalletItemTransfers: received error.', { response });
        return response.error || translate(AppUiMessage.systemError);
      }

      return response.objects;
    } catch (error) {
      console.error('findWalletItemTransfers: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }

  async updateWalletItemTransfer(
    props: Partial<WalletItemTransfer>,
  ): Promise<QueryResult<WalletItemTransfer>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.updateWalletItemTransfer: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response =
        await this.client.operations.walletItemTransfer.updateWalletItemTransfer(props);
      if (!response || response.error) {
        console.error('updateWalletItemTransfer: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('updateWalletItemTransfer: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async updateWalletItemTransferPassword(
    transferSlug: string,
    transferSecret: string,
    password: string,
  ): Promise<QueryResult<void>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.UpdateWalletItemTransferPassword: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response =
        await this.client.operations.walletItemTransfer.updateWalletItemTransferPassword(
          transferSlug,
          transferSecret,
          password,
        );
      if (!response || response.error) {
        console.error('UpdateWalletItemTransferPassword: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('UpdateWalletItemTransferPassword: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }

  async verifyWalletItemTransferPassword(
    transferSlug: string,
    password: string,
  ): Promise<QueryResult<boolean>> {
    if (!this.client.isInitialized) {
      console.error('MarketplaceContext.verifyWalletItemTransferPassword: not initialized.');
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response =
        await this.client.operations.walletItemTransfer.verifyWalletItemTransferPassword(
          transferSlug,
          password,
        );
      if (!response || response.error) {
        console.error('verifyWalletItemTransferPassword: received error.', { response });
        return { error: response.error || translate(AppUiMessage.systemError) };
      }
      return response;
    } catch (error) {
      console.error('verifyWalletItemTransferPassword: error', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
}

// Create a singleton instance
export const marketplaceContext = new MarketplaceContext();
