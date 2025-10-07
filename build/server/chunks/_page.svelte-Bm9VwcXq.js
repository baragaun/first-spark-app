import { q as push, V as copy_payload, W as assign_payload, u as pop, z as ensure_array_like, B as escape_html, A as attr } from './index-d9yomiCc.js';
import './translate-DAfkGQ1n.js';
import './bg-node-client-CQb-2czA.js';
import '@baragaun/bg-node-client';
import './client-BNK9U2wL.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { m as marketplace_search_placeholder } from './marketplace_search_placeholder-DTEp0kzq.js';
import { I as Input } from './input-BHwyyuIe.js';
import { g as giftCardImageDomain } from './constants-BjqueA94.js';
import { A as Arrow_left } from './arrow-left-ByyUiPBJ.js';
import { S as Search } from './search-DqGMDEmc.js';
import './exports-J2AlltLs.js';
import './utils-CCkZTMVc.js';
import './Icon-CCGd_g73.js';

const en_upload_card_select_brand = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Select a brand`;
  }
);
const es_upload_card_select_brand = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Selecciona una marca`;
  }
);
const upload_card_select_brand = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("upload_card_select_brand", locale);
  if (locale === "en") return en_upload_card_select_brand();
  if (locale === "es") return es_upload_card_select_brand();
  return "upload_card.select_brand";
};
function _page($$payload, $$props) {
  push();
  let brands = [];
  let products = [];
  let searchText = "";
  const filteredProducts = products.filter((product) => {
    if (!brands.some((brand) => brand.id === product.brandId)) {
      return false;
    }
    if (searchText.trim()) {
      const cleanSearchText = searchText.trim().toLowerCase();
      const productBrand = brands.find((brand) => brand.id === product.brandId);
      if (!productBrand || !productBrand.name.toLowerCase().includes(cleanSearchText)) {
        return false;
      }
    }
    return true;
  });
  const getBrandForGiftCard = (giftCardProduct) => brands.find((brand) => brand.id === giftCardProduct.brandId);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    const each_array = ensure_array_like(filteredProducts);
    $$payload2.out += `<div class="sticky top-0 z-10 flex items-center justify-between bg-nav px-4 py-3 text-nav-foreground shadow"><button class="flex items-center">`;
    Arrow_left($$payload2, { class: "h-6 w-6" });
    $$payload2.out += `<!----></button> <span class="flex-1 text-center text-lg font-bold">${escape_html(/* @__PURE__ */ upload_card_select_brand())}</span></div> <div class="sticky top-[56px] z-20 bg-background px-4 py-4"><div class="relative rounded-full bg-gradient-to-r from-kcu-glacier via-kcu-juniper to-kcu-lime p-[2px]">`;
    Search($$payload2, {
      class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
    });
    $$payload2.out += `<!----> `;
    Input($$payload2, {
      type: "search",
      placeholder: marketplace_search_placeholder(),
      class: "search-input-override w-full rounded-full border-0 bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      get value() {
        return searchText;
      },
      set value($$value) {
        searchText = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div></div> <div class="flex h-full flex-col"><div class="flex-1 overflow-y-auto"><div class="mx-auto w-full max-w-5xl px-4 pb-8" style="height: calc(100vh - 120px);"><div class="grid h-full grid-cols-3 items-start gap-x-2 gap-y-6 overflow-y-auto sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let product = each_array[$$index];
      const brand = getBrandForGiftCard(product);
      if (brand) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<button class="group flex flex-col items-center justify-center focus:outline-none"><img${attr("src", giftCardImageDomain + "/vendors/" + brand.logoImageSource)}${attr("alt", brand.name)} class="mb-2 h-10 w-16 object-contain transition-transform group-hover:scale-105" onload="this.__e=event" onerror="this.__e=event"/> <span class="max-w-[5.5rem] break-words text-center text-xs leading-tight text-gray-500 group-hover:text-primary" style="word-break:break-word;">${escape_html(brand.name)}</span></button>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]-->`;
    }
    $$payload2.out += `<!--]--></div></div></div></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Bm9VwcXq.js.map
