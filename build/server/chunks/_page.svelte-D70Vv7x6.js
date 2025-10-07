import { q as push, V as copy_payload, W as assign_payload, u as pop, B as escape_html, z as ensure_array_like, M as sanitize_props, I as spread_props, T as slot } from './index-d9yomiCc.js';
import { B as Button } from './button-B_xSpjF_.js';
import { I as Input } from './input-BHwyyuIe.js';
import { R as Root, T as Trigger, D as Dropdown_menu_content, a as Dropdown_menu_item, b as Dropdown_menu_shortcut } from './index4-j7NApTmy.js';
import './client-BNK9U2wL.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { m as marketplace_search_placeholder } from './marketplace_search_placeholder-DTEp0kzq.js';
import { g as getMarketplaceData } from './marketplace-store.svelte-BNG63Gai.js';
import { I as IsMobile } from './is-mobile.svelte-C1SEZM9M.js';
import { S as Spin_load_indicator } from './spin-load-indicator-CKSC_Q6z.js';
import { S as Search } from './search-DqGMDEmc.js';
import { I as Icon } from './Icon-CCGd_g73.js';
import './utils-CCkZTMVc.js';
import './scroll-lock-BMUvnJ8g.js';
import './noop-kcrjqjA1.js';
import './index-server2-_G0R5Qhl.js';
import './events-CdTAYaIN.js';
import './index-server-DeHLhTK0.js';
import './is--6Wd6KIW.js';
import './kbd-constants-tqlk3Es5.js';
import './use-roving-focus.svelte-D3HknXeD.js';
import './exports-J2AlltLs.js';
import './translate-DAfkGQ1n.js';
import '@baragaun/bg-node-client';
import './bg-node-client-CQb-2czA.js';

function Chevron_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-down" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
const en_marketplace_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Marketplace`;
  }
);
const es_marketplace_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Mercado`;
  }
);
const marketplace_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_title", locale);
  if (locale === "en") return en_marketplace_title();
  if (locale === "es") return es_marketplace_title();
  return "marketplace.title";
};
const en_marketplace_subtitle = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Discover and connect with our partner services`;
  }
);
const es_marketplace_subtitle = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Descubre y conecta con nuestros servicios asociados`;
  }
);
const marketplace_subtitle = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_subtitle", locale);
  if (locale === "en") return en_marketplace_subtitle();
  if (locale === "es") return es_marketplace_subtitle();
  return "marketplace.subtitle";
};
const en_marketplace_all = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `All`;
  }
);
const es_marketplace_all = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Todos`;
  }
);
const marketplace_all = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_all", locale);
  if (locale === "en") return en_marketplace_all();
  if (locale === "es") return es_marketplace_all();
  return "marketplace.all";
};
function _page($$payload, $$props) {
  push();
  let marketplaceData = getMarketplaceData();
  const isMobile = new IsMobile();
  let searchText = "";
  let selectedCategory = "All";
  marketplaceData.products.filter((product) => {
    if (!marketplaceData.brands.some((brand) => brand.id === product.brandId)) {
      return false;
    }
    if (selectedCategory !== "All" && !product.categories?.includes(selectedCategory.id)) {
      return false;
    }
    const hasDenominations = (product?.denominations?.length ?? 0) > 0 || product.genericGiftCardId != void 0;
    if (!hasDenominations) return false;
    if (searchText.trim()) {
      const cleanSearchText = searchText.trim().toLowerCase();
      const productBrand = marketplaceData.brands.find((brand) => brand.id === product.brandId);
      if (!productBrand || !productBrand.name.toLowerCase().includes(cleanSearchText)) {
        return false;
      }
    }
    return true;
  });
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="container mx-auto px-4 py-2"><header class="mb-6">`;
    if (!isMobile.current) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<h1 class="text-3xl font-bold text-foreground">${escape_html(/* @__PURE__ */ marketplace_title())}</h1>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <p class="mt-2 text-muted-foreground">${escape_html(/* @__PURE__ */ marketplace_subtitle())}</p></header> <div class="mb-6 flex items-center gap-4"><div class="relative flex-1"><div class="relative rounded-full bg-gradient-to-r from-kcu-glacier via-kcu-juniper to-kcu-lime p-[2px]">`;
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
    $$payload2.out += `<!----></div></div> <!---->`;
    Root($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Trigger($$payload3, {
          children: ($$payload4) => {
            Button($$payload4, {
              variant: "outline",
              class: "flex items-center gap-2",
              children: ($$payload5) => {
                $$payload5.out += `<!---->${escape_html(selectedCategory === "All" ? /* @__PURE__ */ marketplace_all() : selectedCategory.labelEn)} `;
                Chevron_down($$payload5, { class: "h-4 w-4" });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Dropdown_menu_content($$payload3, {
          class: "max-h-[300px] overflow-y-auto bg-background",
          children: ($$payload4) => {
            const each_array = ensure_array_like(marketplaceData.productCategories);
            $$payload4.out += `<!---->`;
            Dropdown_menu_item($$payload4, {
              onclick: () => selectedCategory = "All",
              class: "cursor-pointer",
              children: ($$payload5) => {
                $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ marketplace_all())} `;
                if (selectedCategory === "All") {
                  $$payload5.out += "<!--[-->";
                  $$payload5.out += `<!---->`;
                  Dropdown_menu_shortcut($$payload5, {
                    children: ($$payload6) => {
                      $$payload6.out += `<!---->✓`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!---->`;
                } else {
                  $$payload5.out += "<!--[!-->";
                }
                $$payload5.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!--[-->`;
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let category = each_array[$$index];
              $$payload4.out += `<!---->`;
              Dropdown_menu_item($$payload4, {
                onclick: () => selectedCategory = category,
                class: "cursor-pointer",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(category.labelEn)} `;
                  if (selectedCategory !== "All" && selectedCategory.name === category.name) {
                    $$payload5.out += "<!--[-->";
                    $$payload5.out += `<!---->`;
                    Dropdown_menu_shortcut($$payload5, {
                      children: ($$payload6) => {
                        $$payload6.out += `<!---->✓`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload5.out += `<!---->`;
                  } else {
                    $$payload5.out += "<!--[!-->";
                  }
                  $$payload5.out += `<!--]-->`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            }
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div> `;
    {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex items-center justify-center">`;
      Spin_load_indicator($$payload2, {});
      $$payload2.out += `<!----></div>`;
    }
    $$payload2.out += `<!--]--></div>`;
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
//# sourceMappingURL=_page.svelte-D70Vv7x6.js.map
