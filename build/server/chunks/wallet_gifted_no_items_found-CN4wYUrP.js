import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';

const en_wallet_gifted_no_items_found = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `No items found`;
  }
);
const es_wallet_gifted_no_items_found = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `No se encontraron elementos`;
  }
);
const wallet_gifted_no_items_found = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gifted_no_items_found", locale);
  if (locale === "en") return en_wallet_gifted_no_items_found();
  if (locale === "es") return es_wallet_gifted_no_items_found();
  return "wallet.gifted.no_items_found";
};

export { wallet_gifted_no_items_found as w };
//# sourceMappingURL=wallet_gifted_no_items_found-CN4wYUrP.js.map
