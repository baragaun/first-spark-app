import { q as push, V as copy_payload, W as assign_payload, u as pop, z as ensure_array_like, B as escape_html, A as attr, M as sanitize_props, I as spread_props, T as slot } from './index-d9yomiCc.js';
import { I as Input } from './input-BHwyyuIe.js';
import { B as Button } from './button-B_xSpjF_.js';
import { g as goto } from './client-BNK9U2wL.js';
import { g as getWalletItemsStore } from './wallet-store.svelte-BkvzBmRt.js';
import 'quagga';
import 'tesseract.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { w as wallet_gifted_no_items_found } from './wallet_gifted_no_items_found-CN4wYUrP.js';
import { g as giftCardImageDomain } from './constants-BjqueA94.js';
import { I as IsMobile } from './is-mobile.svelte-C1SEZM9M.js';
import { T as Tabs, a as Tabs_list, b as Tabs_trigger } from './tabs-trigger-ACKEQyOu.js';
import { S as Search } from './search-DqGMDEmc.js';
import { I as Icon } from './Icon-CCGd_g73.js';
import './utils-CCkZTMVc.js';
import './exports-J2AlltLs.js';
import './translate-DAfkGQ1n.js';
import '@baragaun/bg-node-client';
import './bg-node-client-CQb-2czA.js';
import './index-server2-_G0R5Qhl.js';
import './noop-kcrjqjA1.js';
import './kbd-constants-tqlk3Es5.js';
import './use-roving-focus.svelte-D3HknXeD.js';
import './is--6Wd6KIW.js';

function Upload($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      }
    ],
    ["polyline", { "points": "17 8 12 3 7 8" }],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "3",
        "y2": "15"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "upload" },
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
const en_wallet_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Wallet`;
  }
);
const es_wallet_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Billetera`;
  }
);
const wallet_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_title", locale);
  if (locale === "en") return en_wallet_title();
  if (locale === "es") return es_wallet_title();
  return "wallet.title";
};
const en_wallet_empty = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Your wallet is empty`;
  }
);
const es_wallet_empty = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Tu billetera está vacía`;
  }
);
const wallet_empty = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_empty", locale);
  if (locale === "en") return en_wallet_empty();
  if (locale === "es") return es_wallet_empty();
  return "wallet.empty";
};
const en_wallet_upload_card = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Upload card`;
  }
);
const es_wallet_upload_card = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Subir tarjeta`;
  }
);
const wallet_upload_card = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_upload_card", locale);
  if (locale === "en") return en_wallet_upload_card();
  if (locale === "es") return es_wallet_upload_card();
  return "wallet.upload_card";
};
const en_wallet_tabs_active = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Active`;
  }
);
const es_wallet_tabs_active = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Activo`;
  }
);
const wallet_tabs_active = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_tabs_active", locale);
  if (locale === "en") return en_wallet_tabs_active();
  if (locale === "es") return es_wallet_tabs_active();
  return "wallet.tabs.active";
};
const en_wallet_tabs_gifted = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Gifted`;
  }
);
const es_wallet_tabs_gifted = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Regalado`;
  }
);
const wallet_tabs_gifted = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_tabs_gifted", locale);
  if (locale === "en") return en_wallet_tabs_gifted();
  if (locale === "es") return es_wallet_tabs_gifted();
  return "wallet.tabs.gifted";
};
const en_wallet_tabs_archived = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Archived`;
  }
);
const es_wallet_tabs_archived = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Archivado`;
  }
);
const wallet_tabs_archived = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_tabs_archived", locale);
  if (locale === "en") return en_wallet_tabs_archived();
  if (locale === "es") return es_wallet_tabs_archived();
  return "wallet.tabs.archived";
};
function _page($$payload, $$props) {
  push();
  const isMobile = new IsMobile();
  const TabId = {
    ACTIVE: "active",
    GIFTED: "gifted",
    ARCHIVED: "archived"
  };
  let currentTab = TabId.ACTIVE;
  let searchQuery = "";
  let displayedItems = (() => {
    if (currentTab === TabId.ACTIVE) {
      return getWalletItemsStore().filter((item) => item.archivedAt == null && item.transferStartedAt == null && item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (currentTab === TabId.GIFTED) {
      return getWalletItemsStore().filter((item) => item.transferStartedAt != null && item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return getWalletItemsStore().filter((item) => item.archivedAt != null && item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  })();
  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  }
  function uploadAction() {
    goto();
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    const each_array = ensure_array_like(displayedItems);
    $$payload2.out += `<div class="container mx-auto px-4 py-2">`;
    if (!isMobile.current) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex"><header class="mb-6"><h1 class="text-3xl font-bold text-foreground">${escape_html(/* @__PURE__ */ wallet_title())}</h1></header></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <div class="flex flex-col"><div class="flex-shrink-0"><!---->`;
    Tabs($$payload2, {
      get value() {
        return currentTab;
      },
      set value($$value) {
        currentTab = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Tabs_list($$payload3, {
          class: "flex h-10 w-full items-center justify-center rounded-2xl bg-muted p-1 text-muted-foreground ",
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Tabs_trigger($$payload4, {
              value: TabId.ACTIVE,
              class: "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
              children: ($$payload5) => {
                $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ wallet_tabs_active())}`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Tabs_trigger($$payload4, {
              value: TabId.GIFTED,
              class: "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
              children: ($$payload5) => {
                $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ wallet_tabs_gifted())}`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Tabs_trigger($$payload4, {
              value: TabId.ARCHIVED,
              class: "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
              children: ($$payload5) => {
                $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ wallet_tabs_archived())}`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> <div class="mb-3 mt-3 flex items-center gap-3">`;
    if (displayedItems.length > 10) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="relative flex-1 rounded-full bg-gradient-to-r from-kcu-lime via-kcu-glacier to-kcu-juniper p-[2px]">`;
      Search($$payload2, {
        class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      });
      $$payload2.out += `<!----> `;
      Input($$payload2, {
        type: "search",
        placeholder: "search",
        class: "search-input-override w-full rounded-full border-0 bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        get value() {
          return searchQuery;
        },
        set value($$value) {
          searchQuery = $$value;
          $$settled = false;
        }
      });
      $$payload2.out += `<!----></div> <div class="mt-3 flex flex-col items-center justify-center">`;
      Button($$payload2, {
        class: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-kcu-lime via-kcu-glacier to-kcu-juniper p-[2px]",
        onclick: uploadAction,
        "aria-label": "Upload",
        children: ($$payload3) => {
          $$payload3.out += `<div class="flex h-full w-full items-center justify-center rounded-full bg-background">`;
          Upload($$payload3, { class: "h-5 w-5 text-primary" });
          $$payload3.out += `<!----></div>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> <span class="ml-2 text-sm font-medium text-primary">${escape_html(/* @__PURE__ */ wallet_upload_card())}</span></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
      $$payload2.out += `<div class="mt-3 flex w-full flex-row items-center justify-end"><div class="flex-1"></div> `;
      Button($$payload2, {
        class: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-kcu-lime via-kcu-glacier to-kcu-juniper p-[2px]",
        onclick: uploadAction,
        "aria-label": "Upload",
        children: ($$payload3) => {
          $$payload3.out += `<div class="flex h-full w-full items-center justify-center rounded-full bg-background">`;
          Upload($$payload3, { class: "h-5 w-5 text-primary" });
          $$payload3.out += `<!----></div>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> <span class="mx-2 text-sm font-medium text-primary">${escape_html(/* @__PURE__ */ wallet_upload_card())}</span></div>`;
    }
    $$payload2.out += `<!--]--> <input type="file" class="hidden" accept="image/*"${attr("capture", isMobileDevice() ? "environment" : void 0)}/></div></div> <div class="relative flex-1 overflow-y-auto">`;
    if (displayedItems.length === 0) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="py-8 text-center text-muted-foreground">${escape_html(currentTab === TabId.ACTIVE ? /* @__PURE__ */ wallet_empty() : wallet_gifted_no_items_found())}</div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$payload2.out += `<button type="button" class="border-borde col-span-2 flex w-full items-start justify-between border-b text-left focus:outline-none md:col-span-3"><div class="my-2 flex flex-shrink-0"><img${attr("src", giftCardImageDomain + "/giftcards/" + item.imageSourceFront)}${attr("alt", item.imageSourceFront)} class="mr-4 w-32 rounded-xl object-cover shadow-lg" onload="this.__e=event" onerror="this.__e=event"/> <div class="flex flex-col"><span class="text-base font-medium text-foreground">${escape_html(item.name ? item.name : "")}</span> <span class="text-lg font-bold text-muted-foreground">$${escape_html((item.balance / 1e3).toFixed(2))}</span> <span class="text-sm text-muted-foreground">${escape_html(item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "")}</span></div></div></button>`;
    }
    $$payload2.out += `<!--]--></div></div></div>`;
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
//# sourceMappingURL=_page.svelte-DMPXBtkO.js.map
