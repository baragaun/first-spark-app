import type { Brand, GiftCardProduct } from '@baragaun/bg-node-client';

let brandName = $state('');
let balance = $state(0.0);
let barcode = $state('');
let pin = $state('');
let imageUrl = $state('');
let loading = $state(false);
let uploadedBrand = $state<Brand | null>(null);
let uploadedProduct = $state<GiftCardProduct | null>(null);

export const uploadedCardSetValues = ({
  brandNameValue = '',
  balanceValue = 0.0,
  barcodeValue = '',
  pinValue = '',
  imageUrlData = '',
  isLoading = false,
  brand = null,
  product = null,
}: {
  brandNameValue?: string;
  balanceValue?: number;
  barcodeValue?: string;
  pinValue?: string;
  imageUrlData?: string;
  isLoading?: boolean;
  brand?: Brand | null;
  product?: GiftCardProduct | null;
} = {}) => {
  brandName = brandNameValue;
  balance = balanceValue;
  barcode = barcodeValue;
  pin = pinValue;
  imageUrl = imageUrlData;
  loading = isLoading;
  uploadedBrand = brand;
  uploadedProduct = product;
};

export const uploadedCardGetValues = () => {
  return {
    get brandName(): string {
      return brandName;
    },
    get balance(): number {
      return balance;
    },
    get barcode(): string {
      return barcode;
    },
    get pin(): string {
      return pin;
    },
    get imageUrl(): string {
      return imageUrl;
    },
    get loading(): boolean {
      return loading;
    },
    get uploadedBrand(): Brand | null {
      return uploadedBrand;
    },
    get uploadedProduct(): GiftCardProduct | null {
      return uploadedProduct;
    },
  };
};
