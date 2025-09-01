import { marketplaceContext } from '@/contexts/marketplace-context.svelte';
import type { WalletItem, WalletItemTransfer } from '@baragaun/bg-node-client';

let walletItemsStore = $state<WalletItem[]>([]);
let walletItemTransfersStore = $state<WalletItemTransfer[]>([]);
let isLoading = $state(false);

export async function loadWalletItems() {
  isLoading = true;
  const response = await marketplaceContext.findWalletItems();
  if (typeof response === 'string') {
    console.error('Failed to load wallet items:', response);
    return;
  }
  if (!response) return;

  walletItemsStore = response;
  isLoading = false;
}

export async function loadWalletItemTransfers() {
  isLoading = true;
  const response = await marketplaceContext.findWalletItemTransfers();
  if (typeof response === 'string') {
    console.error('Failed to load wallet item transfers:', response);
    return;
  }
  if (!response) return;
  walletItemTransfersStore = response;
  isLoading = false;
}

export function updateWalletItem(walletItem: WalletItem) {
  const itemIndex = walletItemsStore.findIndex((item) => item.id === walletItem.id);
  if (itemIndex !== -1) {
    walletItemsStore[itemIndex] = walletItem;
  }
}

export function getWalletItemsStore() {
  return walletItemsStore;
}

export function getWalletItemTransfersStore() {
  return walletItemTransfersStore;
}

export function getIsLoading() {
  return isLoading;
}
