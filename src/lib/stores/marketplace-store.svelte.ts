import translate from '@/helpers/language/translate';
import { client } from '@/services/bg-node-client';
import { AppUiMessage } from '@/types/enums';
import {
  type Brand,
  CachePolicy,
  type GiftCardProduct,
  type ProductCategory,
} from '@baragaun/bg-node-client';

let brands = $state<Brand[]>([]);
let products = $state<GiftCardProduct[]>([]);
let productCategories = $state<ProductCategory[]>([]);
let loading = $state<boolean>(false);
let error = $state<Error | null>(null);
let userErrorMessage = $state<string | null>(null);

export const loadMarketplaceData = async (): Promise<void> => {
  if (brands.length < 1) {
    loading = true;
    error = null;
    userErrorMessage = null;

    try {
      const response = await client.operations.brand.findBrands(
        undefined,
        undefined,
        undefined,
        {},
        { cachePolicy: CachePolicy.cacheFirst },
      );

      if (!response || response.error || !response.objects) {
        console.error('loadMarketplaceData: received error.', { response });
        userErrorMessage = response.error || translate(AppUiMessage.systemError);
      }

      if (!Array.isArray(response.objects) || response.objects.length < 1) {
        userErrorMessage = translate(AppUiMessage.systemError);
        brands = [];
        return;
      }
      brands = response.objects;
    } catch (error) {
      const err = error instanceof Error
        ? error
        : new Error('Failed to load brands');
      userErrorMessage = 'Unable to load brands. Please try again later.';
      throw err;
    } finally {
      loading = false;
    }
  }

  if (products.length < 1) {
    loading = true;
    error = null;
    userErrorMessage = null;

    try {
      const response = await client.operations.giftCardProduct.findGiftCardProducts(
        undefined,
        undefined,
        undefined,
        {},
        { cachePolicy: CachePolicy.cacheFirst },
      );

      if (!response || response.error || !response.objects) {
        console.error('loadMarketplaceData: received error.', { response });
        userErrorMessage = response.error || translate(AppUiMessage.systemError);
      }

      if (!Array.isArray(response.objects) || response.objects.length < 1) {
        userErrorMessage = translate(AppUiMessage.systemError);
        products = [];
        return;
      }
      products = response.objects;
    } catch (error) {
      const err = error instanceof Error
        ? error
        : new Error('Failed to load products');
      userErrorMessage = 'Unable to load products. Please try again later.';
      throw err;
    } finally {
      loading = false;
    }
  }

  if (productCategories.length < 1) {
    loading = true;
    error = null;
    userErrorMessage = null;

    try {
      const response = await client.operations.productCategory.findProductCategories(
        undefined,
        undefined,
        undefined,
        {},
        { cachePolicy: CachePolicy.cacheFirst },
      );

      if (!response || response.error || !response.objects) {
        console.error('loadMarketplaceData: received error.', { response });
        userErrorMessage = response.error || translate(AppUiMessage.systemError);
      }

      if (!Array.isArray(response.objects) || response.objects.length < 1) {
        userErrorMessage = translate(AppUiMessage.systemError);
        productCategories = [];
        return;
      }
      productCategories = response.objects;
    } catch (error) {
      const err = error instanceof Error
        ? error
        : new Error('Failed to load productCategories');
      userErrorMessage = 'Unable to load product categories. Please try again later.';
      throw err;
    } finally {
      loading = false;
    }
  }
};

export const getMarketplaceData = () => {
  return {
    get brands(): Brand[] {
      return brands;
    },
    get products(): GiftCardProduct[] {
      return products;
    },
    get productCategories(): ProductCategory[] {
      return productCategories;
    },
    get loading(): boolean {
      return loading;
    },
    get error(): Error | null {
      return error;
    },
    get userErrorMessage(): string | null {
      return userErrorMessage;
    },
  };
};
