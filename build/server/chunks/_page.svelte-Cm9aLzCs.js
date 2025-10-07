import { q as push, B as escape_html, u as pop } from './index-d9yomiCc.js';
import './client-BNK9U2wL.js';
import './button-B_xSpjF_.js';
import './translate-DAfkGQ1n.js';
import './bg-node-client-CQb-2czA.js';
import '@baragaun/bg-node-client';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { o as order_history_order } from './order_history_order-BtvDYkUW.js';
import { p as page } from './index3-DMvwsHdR.js';
import { A as Arrow_left } from './arrow-left-ByyUiPBJ.js';
import './exports-J2AlltLs.js';
import './utils-CCkZTMVc.js';
import './client2-yWJSv2LX.js';
import './Icon-CCGd_g73.js';

const en_order_history_not_found = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Order not found.`;
  }
);
const es_order_history_not_found = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Pedido no encontrado.`;
  }
);
const order_history_not_found = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("order_history_not_found", locale);
  if (locale === "en") return en_order_history_not_found();
  if (locale === "es") return es_order_history_not_found();
  return "order_history.not_found";
};
function _page($$payload, $$props) {
  push();
  page.params.id;
  $$payload.out += `<div class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"><button class="flex items-center">`;
  Arrow_left($$payload, { class: "h-6 w-6" });
  $$payload.out += `<!----></button> <span class="flex-1 text-center text-lg font-bold">${escape_html(order_history_order())}</span></div> <div class="container mx-auto px-4 py-6">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="text-center text-muted-foreground">${escape_html(/* @__PURE__ */ order_history_not_found())}</div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Cm9aLzCs.js.map
