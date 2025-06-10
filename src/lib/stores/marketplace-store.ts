import type { GiftCardProduct, ProductCategory, Vendor } from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

// Create stores to cache marketplace data
export const giftCardProductsStore = writable<GiftCardProduct[]>([]);
export const vendorsStore = writable<Vendor[]>([]);
export const productCategoriesStore = writable<ProductCategory[]>([]);

// Flag to track if data has been loaded
export const dataLoaded = writable(false);
