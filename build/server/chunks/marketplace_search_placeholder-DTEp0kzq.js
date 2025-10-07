import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';

const en_marketplace_search_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Search marketplace`;
  }
);
const es_marketplace_search_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Buscar en el mercado`;
  }
);
const marketplace_search_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_search_placeholder", locale);
  if (locale === "en") return en_marketplace_search_placeholder();
  if (locale === "es") return es_marketplace_search_placeholder();
  return "marketplace.search_placeholder";
};

export { marketplace_search_placeholder as m };
//# sourceMappingURL=marketplace_search_placeholder-DTEp0kzq.js.map
