import { writable } from 'svelte/store';
import type { GiftCardProduct, Vendor, ProductCategory } from '@baragaun/bg-node-client';

// Create stores to cache marketplace data
export const giftCardProductsStore = writable<GiftCardProduct[]>([]);
export const vendorsStore = writable<Vendor[]>([]);
export const productCategoriesStore = writable<ProductCategory[]>([]);

// Flag to track if data has been loaded
export const dataLoaded = writable(false);