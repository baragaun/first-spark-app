import type { PurchaseOrder } from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

export const orderHistoryStore = writable<PurchaseOrder[] | null>(null);
export const orderHistoryLoaded = writable(false);
