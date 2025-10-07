import { q as push, B as escape_html, u as pop } from './index-d9yomiCc.js';
import './translate-DAfkGQ1n.js';
import './bg-node-client-CQb-2czA.js';
import '@baragaun/bg-node-client';
import { S as Spin_load_indicator } from './spin-load-indicator-CKSC_Q6z.js';
import './client-BNK9U2wL.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { I as IsMobile } from './is-mobile.svelte-C1SEZM9M.js';
import './Icon-CCGd_g73.js';
import './exports-J2AlltLs.js';
import './index-server2-_G0R5Qhl.js';

const en_order_history_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Order History`;
  }
);
const es_order_history_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Historial de pedidos`;
  }
);
const order_history_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("order_history_title", locale);
  if (locale === "en") return en_order_history_title();
  if (locale === "es") return es_order_history_title();
  return "order_history.title";
};
function _page($$payload, $$props) {
  push();
  const isMobile = new IsMobile();
  $$payload.out += `<div class="container mx-auto px-4 py-2">`;
  if (!isMobile.current) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<header class="mb-6"><h1 class="text-3xl font-bold text-foreground">${escape_html(/* @__PURE__ */ order_history_title())}</h1></header>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <main class="flex-1 overflow-y-auto dark:bg-gray-900"><div class="space-y-1 bg-white p-4 dark:bg-background">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center py-8">`;
    Spin_load_indicator($$payload, {});
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]--></div></main></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DBeCUGhx.js.map
