import type { WalletItem, WalletItemTransfer } from '@baragaun/bg-node-client';
import { writable } from 'svelte/store';

export const walletItemsStore = writable<WalletItem[]>([]);
export const walletItemTransfersStore = writable<WalletItemTransfer[]>([]);
