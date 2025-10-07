import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';

const en_order_history_order = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Order`;
  }
);
const es_order_history_order = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Pedido`;
  }
);
const order_history_order = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("order_history_order", locale);
  if (locale === "en") return en_order_history_order();
  if (locale === "es") return es_order_history_order();
  return "order_history.order";
};

export { order_history_order as o };
//# sourceMappingURL=order_history_order-BtvDYkUW.js.map
