import type { Brand, GiftCardProduct } from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

export const uploadedCard = writable({
  brandName: '',
  balance: '',
  barcode: '',
  pin: '',
  imageUrl: '',
  isLoading: false,
});

export const uploadedBrand = writable<Brand>();
export const uploadedProduct = writable<GiftCardProduct>();
