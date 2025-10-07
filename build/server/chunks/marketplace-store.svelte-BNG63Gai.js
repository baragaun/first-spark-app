import './translate-DAfkGQ1n.js';
import './bg-node-client-CQb-2czA.js';
import '@baragaun/bg-node-client';

let brands = [];
let products = [];
let productCategories = [];
let loading = false;
let error = null;
let userErrorMessage = null;
const getMarketplaceData = () => {
  return {
    get brands() {
      return brands;
    },
    get products() {
      return products;
    },
    get productCategories() {
      return productCategories;
    },
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    get userErrorMessage() {
      return userErrorMessage;
    }
  };
};

export { getMarketplaceData as g };
//# sourceMappingURL=marketplace-store.svelte-BNG63Gai.js.map
