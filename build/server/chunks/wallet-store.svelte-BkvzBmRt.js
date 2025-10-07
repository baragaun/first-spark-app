import './translate-DAfkGQ1n.js';
import './bg-node-client-CQb-2czA.js';
import '@baragaun/bg-node-client';

let walletItemsStore = [];
function updateWalletItem(walletItem) {
  const itemIndex = walletItemsStore.findIndex((item) => item.id === walletItem.id);
  if (itemIndex !== -1) {
    walletItemsStore[itemIndex] = walletItem;
  }
}
const getWalletItemsStore = () => {
  return walletItemsStore;
};

export { getWalletItemsStore as g, updateWalletItem as u };
//# sourceMappingURL=wallet-store.svelte-BkvzBmRt.js.map
