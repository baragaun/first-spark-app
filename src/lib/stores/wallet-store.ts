import type { WalletItem } from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

export const walletItemsStore = writable<WalletItem[]>([]);
