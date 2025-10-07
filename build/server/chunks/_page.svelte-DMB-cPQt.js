import { q as push, B as escape_html, A as attr, u as pop, M as sanitize_props, I as spread_props, T as slot } from './index-d9yomiCc.js';
import { p as page } from './index3-DMvwsHdR.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { s as setting_buttons_cancel } from './setting_buttons_cancel-Cp1uCP5H.js';
import { w as wallet_gift_card_unarchive, a as wallet_gift_card_archive, b as wallet_gift_card_title, E as External_link, c as wallet_gift_card_brand, A as Archive, d as wallet_gift_card_how_to_redeem, e as wallet_gift_card_terms_and_conditions } from './wallet_gift_card_terms_and_conditions-BAY_pcpI.js';
import { w as wallet_gifted_no_items_found } from './wallet_gifted_no_items_found-CN4wYUrP.js';
import { o as order_history_order } from './order_history_order-BtvDYkUW.js';
import { B as Button } from './button-B_xSpjF_.js';
import { g as giftCardImageDomain } from './constants-BjqueA94.js';
import { m as marketplaceContext } from './marketplace-context.svelte-kqZeQ73y.js';
import { g as getWalletItemsStore, u as updateWalletItem } from './wallet-store.svelte-BkvzBmRt.js';
import { A as Arrow_left } from './arrow-left-ByyUiPBJ.js';
import { X } from './x-CT7gPnZT.js';
import { I as Icon } from './Icon-CCGd_g73.js';
import './client2-yWJSv2LX.js';
import './client-BNK9U2wL.js';
import './exports-J2AlltLs.js';
import './utils-CCkZTMVc.js';
import './translate-DAfkGQ1n.js';
import '@baragaun/bg-node-client';
import './bg-node-client-CQb-2czA.js';
import './my-user-context.svelte-C7pZorxo.js';
import './shared-server-i79vVjEm.js';

function Shopping_bag($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
      }
    ],
    ["path", { "d": "M3 6h18" }],
    ["path", { "d": "M16 10a4 4 0 0 1-8 0" }]
  ];
  Icon($$payload, spread_props([
    { name: "shopping-bag" },
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
function User($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      }
    ],
    ["circle", { "cx": "12", "cy": "7", "r": "4" }]
  ];
  Icon($$payload, spread_props([
    { name: "user" },
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
const en_wallet_gifted_recipient_details = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Recipient Details`;
  }
);
const es_wallet_gifted_recipient_details = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Detalles del destinatario`;
  }
);
const wallet_gifted_recipient_details = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gifted_recipient_details", locale);
  if (locale === "en") return en_wallet_gifted_recipient_details();
  if (locale === "es") return es_wallet_gifted_recipient_details();
  return "wallet.gifted.recipient_details";
};
const en_wallet_gifted_name = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Name`;
  }
);
const es_wallet_gifted_name = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Nombre`;
  }
);
const wallet_gifted_name = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gifted_name", locale);
  if (locale === "en") return en_wallet_gifted_name();
  if (locale === "es") return es_wallet_gifted_name();
  return "wallet.gifted.name";
};
const en_wallet_gifted_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Email`;
  }
);
const es_wallet_gifted_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Correo electrónico`;
  }
);
const wallet_gifted_email = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gifted_email", locale);
  if (locale === "en") return en_wallet_gifted_email();
  if (locale === "es") return es_wallet_gifted_email();
  return "wallet.gifted.email";
};
const en_wallet_gifted_message = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Message`;
  }
);
const es_wallet_gifted_message = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Mensaje`;
  }
);
const wallet_gifted_message = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gifted_message", locale);
  if (locale === "en") return en_wallet_gifted_message();
  if (locale === "es") return es_wallet_gifted_message();
  return "wallet.gifted.message";
};
const en_wallet_gifted_date_sent = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Date sent`;
  }
);
const es_wallet_gifted_date_sent = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Fecha de envío`;
  }
);
const wallet_gifted_date_sent = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gifted_date_sent", locale);
  if (locale === "en") return en_wallet_gifted_date_sent();
  if (locale === "es") return es_wallet_gifted_date_sent();
  return "wallet.gifted.date_sent";
};
const en_wallet_gifted_active = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `active`;
  }
);
const es_wallet_gifted_active = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `activo`;
  }
);
const wallet_gifted_active = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gifted_active", locale);
  if (locale === "en") return en_wallet_gifted_active();
  if (locale === "es") return es_wallet_gifted_active();
  return "wallet.gifted.active";
};
const en_wallet_gifted_gifted = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `gifted`;
  }
);
const es_wallet_gifted_gifted = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `dotada`;
  }
);
const wallet_gifted_gifted = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gifted_gifted", locale);
  if (locale === "en") return en_wallet_gifted_gifted();
  if (locale === "es") return es_wallet_gifted_gifted();
  return "wallet.gifted.gifted";
};
const en_order_history_processing = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Processing`;
  }
);
const es_order_history_processing = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Procesando`;
  }
);
const order_history_processing = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("order_history_processing", locale);
  if (locale === "en") return en_order_history_processing();
  if (locale === "es") return es_order_history_processing();
  return "order_history.processing";
};
const en_order_history_reference_id = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Reference ID`;
  }
);
const es_order_history_reference_id = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `ID de referencia`;
  }
);
const order_history_reference_id = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("order_history_reference_id", locale);
  if (locale === "en") return en_order_history_reference_id();
  if (locale === "es") return es_order_history_reference_id();
  return "order_history.reference_id";
};
const en_order_history_purchase_date = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Purchase Date`;
  }
);
const es_order_history_purchase_date = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Fecha de compra`;
  }
);
const order_history_purchase_date = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("order_history_purchase_date", locale);
  if (locale === "en") return en_order_history_purchase_date();
  if (locale === "es") return es_order_history_purchase_date();
  return "order_history.purchase_date";
};
function _page($$payload, $$props) {
  push();
  const walletItemId = page.params.id;
  let walletItem = getWalletItemsStore().find((p) => p.id === walletItemId);
  let walletItemTransfer = null;
  function formatDateTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  async function archiveWalletItem() {
    if (!walletItem) {
      console.error("No wallet item found to archive.");
      return;
    }
    try {
      await marketplaceContext.archiveWalletItem(walletItemId, !walletItem?.archivedAt);
      updateWalletItem(walletItem);
    } catch (error) {
      console.error("Error archiving wallet item:", error);
    }
  }
  async function declineWalletItemTransfer() {
    {
      console.error("No wallet item found to decline.");
      return;
    }
  }
  $$payload.out += `<div class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"><button class="flex items-center">`;
  Arrow_left($$payload, { class: "h-6 w-6" });
  $$payload.out += `<!----></button> <span class="flex-1 text-center text-lg font-semibold">${escape_html(wallet_gift_card_title())}</span></div> `;
  if (!walletItem) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex h-[60vh] items-center justify-center"><div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>`;
  } else if (walletItem) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="mx-auto max-w-2xl px-4 py-6"><div class="my-2 flex justify-center"><img${attr("src", giftCardImageDomain + "/giftcards/" + walletItem.imageSourceFront)}${attr("alt", walletItem.name)} class="aspect-[16/9] w-full max-w-md rounded-2xl object-contain shadow-lg" onload="this.__e=event" onerror="this.__e=event"/></div> <div class="flex items-center gap-2 border-b bg-gray-50 px-4 py-1"><div class="flex flex-col items-center">`;
    Button($$payload, {
      variant: "ghost",
      size: "icon",
      href: walletItem.termsUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      children: ($$payload2) => {
        External_link($$payload2, { "aria-label": "Brand" });
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!----> <span class="text-xs text-gray-500">${escape_html(wallet_gift_card_brand())}</span></div> <div class="flex flex-col items-center">`;
    Button($$payload, {
      variant: "ghost",
      size: "icon",
      onclick: archiveWalletItem,
      children: ($$payload2) => {
        Archive($$payload2, { "aria-label": "Archive" });
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!----> <span class="text-xs text-gray-500">${escape_html(walletItem.archivedAt ? wallet_gift_card_unarchive() : wallet_gift_card_archive())}</span></div> `;
    if (!walletItem?.transferAcceptedAt) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex flex-col items-center">`;
      Button($$payload, {
        variant: "ghost",
        size: "icon",
        onclick: declineWalletItemTransfer,
        children: ($$payload2) => {
          X($$payload2, { "aria-label": "Close" });
        },
        $$slots: { default: true }
      });
      $$payload.out += `<!----> <span class="text-xs text-gray-500">${escape_html(setting_buttons_cancel())}</span></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <span class="ml-2 flex flex-grow items-center justify-end gap-2"><span class="rounded border px-2 py-0.5 text-xs text-gray-600">${escape_html(/* @__PURE__ */ wallet_gifted_active())}</span> <span class="rounded border bg-gray-100 px-2 py-0.5 text-xs text-gray-600">${escape_html(walletItem?.transferAcceptedAt ? /* @__PURE__ */ wallet_gifted_gifted() : /* @__PURE__ */ order_history_processing())}</span></span></div> <br/> <div class="mb-8"><div class="mb-2 flex items-center">`;
    User($$payload, { size: 24, color: "#005f61" });
    $$payload.out += `<!----> <span class="pl-2 text-lg font-semibold text-muted-foreground">${escape_html(/* @__PURE__ */ wallet_gifted_recipient_details())}</span></div> <div class="text-sm text-muted-foreground">${escape_html(/* @__PURE__ */ wallet_gifted_name())}</div> <div class="mb-2 font-bold">${escape_html(walletItemTransfer?.recipientFullName)}</div> <div class="text-sm text-muted-foreground">${escape_html(/* @__PURE__ */ wallet_gifted_email())}</div> <div class="mb-2 break-all font-bold">${escape_html(walletItemTransfer?.recipientEmail)}</div> <div class="text-sm text-muted-foreground">${escape_html(/* @__PURE__ */ wallet_gifted_message())}</div> <div class="mb-2 break-all font-bold">${escape_html(walletItemTransfer?.messageText)}</div> <div class="text-sm text-muted-foreground">${escape_html(/* @__PURE__ */ wallet_gifted_date_sent())}</div> <div class="mb-2 break-all font-bold">${escape_html(formatDateTime(walletItem.transferStartedAt ?? ""))}</div></div> <div class="mb-2 mt-6 text-lg font-semibold text-gray-700">${escape_html(wallet_gift_card_how_to_redeem())}</div> <div class="mb-4 text-sm text-gray-600">${escape_html(walletItem.instructionsEn)}</div> <div class="mb-2 text-lg font-semibold text-gray-700">${escape_html(wallet_gift_card_terms_and_conditions())}</div> <div class="mb-4 text-sm text-gray-600">${escape_html(walletItem.termsEn)}</div> <div class="mb-8"><div class="mb-2 flex items-center">`;
    Shopping_bag($$payload, { size: 24, color: "#005f61" });
    $$payload.out += `<!----> <span class="pl-2 text-lg font-semibold text-muted-foreground">${escape_html(order_history_order())}</span></div> <div class="mb-1 text-lg font-semibold">${escape_html(walletItem.purchaseOrderItemId)}</div> <div class="text-sm text-muted-foreground">${escape_html(/* @__PURE__ */ order_history_purchase_date())}</div> <div class="mb-2 font-bold">${escape_html(formatDateTime(walletItem.createdAt))}</div> <div class="text-sm text-muted-foreground">${escape_html(/* @__PURE__ */ order_history_reference_id())}</div> <div class="mb-2 break-all font-bold">${escape_html(walletItem.id)}</div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="py-12 text-center text-muted-foreground">${escape_html(wallet_gifted_no_items_found())}</div>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DMB-cPQt.js.map
