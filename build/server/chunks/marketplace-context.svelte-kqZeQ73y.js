import { t as translate, A as AppUiMessage } from './translate-DAfkGQ1n.js';
import { c as client } from './bg-node-client-CQb-2czA.js';
import { CachePolicy } from '@baragaun/bg-node-client';
import { m as myUserContext } from './my-user-context.svelte-C7pZorxo.js';

let isLoading = false;
class MarketplaceContext {
  client = client;
  async acceptWalletItemTransfer(transferSlug, secretCode) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.acceptWalletItemTransfer: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItemTransfer.acceptWalletItemTransfer(transferSlug, secretCode);
      if (!response || response.error) {
        console.error("acceptWalletItemTransfer: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("acceptWalletItemTransfer: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async archiveWalletItem(id, archived) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.archiveWalletItem: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItem.updateWalletItem({
        id,
        archivedAt: archived ? /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString() : null
      });
      if (!response || response.error) {
        console.error("archiveWalletItem: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("archiveWalletItem: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async createPurchaseOrder(props) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.createPurchaseOrder: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.purchaseOrder.createPurchaseOrder(props);
      if (!response || response.error) {
        console.error("createPurchaseOrder: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("createPurchaseOrder: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async createShoppingCartItem(props) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.createShoppingCartItem: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.shoppingCartItem.createShoppingCartItem(props);
      if (!response || response.error) {
        console.error("createShoppingCartItem: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("createShoppingCartItem: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async createWalletItem(props) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.createWalletItem: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItem.createWalletItem(props);
      if (!response || response.error) {
        console.error("createWalletItem: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("createWalletItem: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async createWalletItemTransfer(props) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.createWalletItemTransfer: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItemTransfer.createWalletItemTransfer(props);
      if (!response || response.error) {
        console.error("createWalletItemTransfer: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("createWalletItemTransfer: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async declineWalletItemTransfer(transferSlug) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.declineWalletItemTransfer: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItemTransfer.declineWalletItemTransfer(transferSlug);
      if (!response || response.error) {
        console.error("declineWalletItemTransfer: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("declineWalletItemTransfer: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async deleteShoppingCartItem(id) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.deleteShoppingCartItem: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.shoppingCartItem.deleteShoppingCartItem(id, true);
      if (!response || response.error) {
        console.error("deleteShoppingCartItem: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("deleteShoppingCartItem: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async findBrand(id) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findBrand: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.brand.findBrandById(id, {}, { cachePolicy: CachePolicy.cacheFirst });
      if (!response || response.error || !response.object) {
        console.error("findBrand: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error("findBrand: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async findBrands() {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findBrands: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.brand.findBrands(void 0, void 0, void 0, {}, { cachePolicy: CachePolicy.cacheFirst });
      if (!response || response.error || !response.objects) {
        console.error("findBrands: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error("findBrands: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async findGiftCardProducts() {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findGiftCardProducts: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.giftCardProduct.findGiftCardProducts(void 0, void 0, void 0, {}, { cachePolicy: CachePolicy.network });
      if (!response || response.error || !response.objects) {
        console.error("findGiftCardProducts: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error("findGiftCardProducts: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async findMyShoppingCart() {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findShoppingCartItems: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.shoppingCart.findMyShoppingCart();
      if (!response || response.error || !response.object) {
        console.error("findShoppingCartItems: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error("findShoppingCartItems: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async findProductCategories() {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findProductCategories: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.productCategory.findProductCategories(void 0, void 0, void 0, {}, { cachePolicy: CachePolicy.network });
      if (!response || response.error || !response.objects) {
        console.error("findProductCategories: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error("findProductCategories: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async findPurchaseOrders() {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findPurchaseOrders: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.purchaseOrder.findPurchaseOrders(void 0, { createdBy: myUserContext.myUserId }, null, {}, { cachePolicy: CachePolicy.network });
      if (!response || response.error || !response.objects) {
        console.error("findPurchaseOrders: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error("findPurchaseOrders: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async findWalletItemByTransferSlug(transferSlug) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findWalletItemByTransferSlug: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItem.findWalletItemByTransferSlug(transferSlug, {});
      if (!response || response.error || !response.object) {
        console.error("findWalletItemByTransferSlug: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error("findWalletItemByTransferSlug: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async findWalletItemTransferRecipientInfoByTransferSlug(transferSlug) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findWalletItemTransferRecipientInfoByTransferSlug: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItemTransfer.findWalletItemTransferRecipientInfoByTransferSlug(transferSlug);
      if (!response || response.error || !response.object) {
        console.error("findWalletItemTransferRecipientInfoByTransferSlug: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.object;
    } catch (error) {
      console.error("findWalletItemTransferRecipientInfoByTransferSlug: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async findWalletItems() {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findWalletItems: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    const args = {
      filter: {},
      match: { walletId: myUserContext.myUserId },
      options: { cachePolicy: CachePolicy.network },
      queryOptions: {}
    };
    try {
      isLoading = true;
      const response = await this.client.operations.walletItem.findWalletItems(args.filter, args.match, null, args.queryOptions, args.options);
      if (!response || response.error || !response.objects) {
        console.error("findWalletItems: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error("findWalletItems: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async updateShoppingCartItem(props) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.updateShoppingCartItem: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.shoppingCartItem.updateShoppingCartItem(props);
      if (!response || response.error) {
        console.error("updateShoppingCartItem: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("updateShoppingCartItem: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async findWalletItemTransfers() {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.findWalletItemTransfers: not initialized.");
      return translate(AppUiMessage.systemError);
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItemTransfer.findWalletItemTransfers(void 0, { createdBy: myUserContext.myUserId }, void 0, {}, { cachePolicy: CachePolicy.network });
      if (!response || response.error || !response.objects) {
        console.error("findWalletItemTransfers: received error.", { response });
        return response.error || translate(AppUiMessage.systemError);
      }
      return response.objects;
    } catch (error) {
      console.error("findWalletItemTransfers: error", { error: error.message, stack: error.stack });
      return translate(AppUiMessage.systemError);
    } finally {
      isLoading = false;
    }
  }
  async updateWalletItemTransfer(props) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.updateWalletItemTransfer: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItemTransfer.updateWalletItemTransfer(props);
      if (!response || response.error) {
        console.error("updateWalletItemTransfer: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("updateWalletItemTransfer: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async updateWalletItemTransferPassword(transferSlug, transferSecret, password) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.UpdateWalletItemTransferPassword: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItemTransfer.updateWalletItemTransferPassword(transferSlug, transferSecret, password);
      if (!response || response.error) {
        console.error("UpdateWalletItemTransferPassword: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("UpdateWalletItemTransferPassword: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
  async verifyWalletItemTransferPassword(transferSlug, password) {
    if (!this.client.isInitialized) {
      console.error("MarketplaceContext.verifyWalletItemTransferPassword: not initialized.");
      return { error: translate(AppUiMessage.systemError) };
    }
    try {
      isLoading = true;
      const response = await this.client.operations.walletItemTransfer.verifyWalletItemTransferPassword(transferSlug, password);
      if (!response || response.error) {
        console.error("verifyWalletItemTransferPassword: received error.", { response });
        return {
          error: response.error || translate(AppUiMessage.systemError)
        };
      }
      return response;
    } catch (error) {
      console.error("verifyWalletItemTransferPassword: error", { error: error.message, stack: error.stack });
      return { error: translate(AppUiMessage.systemError) };
    } finally {
      isLoading = false;
    }
  }
}
const marketplaceContext = new MarketplaceContext();

export { marketplaceContext as m };
//# sourceMappingURL=marketplace-context.svelte-kqZeQ73y.js.map
