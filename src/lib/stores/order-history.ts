import type { PurchaseOrder } from '@baragaun/bg-node-client';

let purchaseOrders = $state<PurchaseOrder[]>([]);
let isLoaded = $state(false);

export const getPurchaseOrdersStore = () => ({
  get purchaseOrders() { return purchaseOrders },
  get isLoaded() { return isLoaded },
  setPurchaseOrders: (orders: PurchaseOrder[]) => {
    purchaseOrders = orders;
    isLoaded = true;
  },
  reset: () => {
    purchaseOrders = [];
    isLoaded = false;
  }
});


// Claude Sonnet 4 says to the old, commented out code below:
// That's not best practice - especially for a new Svelte 5 app.
// Problems with this approach:
//
// Mixing paradigms - Using Svelte 4 stores (writable) in a Svelte 5 app
// Imperative access - get() breaks reactivity and is generally discouraged
// Missing reactivity - Components won't automatically update when the value changes
