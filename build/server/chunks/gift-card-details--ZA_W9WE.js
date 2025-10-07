import { q as push, B as escape_html, A as attr, R as attr_class, S as attr_style, z as ensure_array_like, E as bind_props, u as pop, M as sanitize_props, I as spread_props, T as slot, U as stringify } from './index-d9yomiCc.js';
import { B as Button } from './button-B_xSpjF_.js';
import { m as marketplaceContext } from './marketplace-context.svelte-kqZeQ73y.js';
import '@baragaun/bg-node-client';
import { u as updateWalletItem } from './wallet-store.svelte-BkvzBmRt.js';
import { g as giftCardImageDomain } from './constants-BjqueA94.js';
import { jsPDF } from 'jspdf';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { E as External_link, A as Archive, w as wallet_gift_card_unarchive, a as wallet_gift_card_archive, b as wallet_gift_card_title, c as wallet_gift_card_brand, d as wallet_gift_card_how_to_redeem, e as wallet_gift_card_terms_and_conditions } from './wallet_gift_card_terms_and_conditions-BAY_pcpI.js';
import { g as goto } from './client-BNK9U2wL.js';
import './translate-DAfkGQ1n.js';
import './Toaster.svelte_svelte_type_style_lang-s80CJFld.js';
import { p as page } from './index3-DMvwsHdR.js';
import { g as getMarketplaceData } from './marketplace-store.svelte-BNG63Gai.js';
import { A as Arrow_left } from './arrow-left-ByyUiPBJ.js';
import { G as Gift, h as html } from './gift-BIYfkpvh.js';
import { I as Icon } from './Icon-CCGd_g73.js';

function Printer($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
      }
    ],
    [
      "path",
      { "d": "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" }
    ],
    [
      "rect",
      {
        "x": "6",
        "y": "14",
        "width": "12",
        "height": "8",
        "rx": "1"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "printer" },
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
function Zoom_out($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "11", "cy": "11", "r": "8" }
    ],
    [
      "line",
      {
        "x1": "21",
        "x2": "16.65",
        "y1": "21",
        "y2": "16.65"
      }
    ],
    [
      "line",
      {
        "x1": "8",
        "x2": "14",
        "y1": "11",
        "y2": "11"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "zoom-out" },
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
const en_marketplace_buy_gift_card = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Buy Gift Card`;
  }
);
const es_marketplace_buy_gift_card = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Comprar tarjeta de regalo`;
  }
);
const marketplace_buy_gift_card = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_buy_gift_card", locale);
  if (locale === "en") return en_marketplace_buy_gift_card();
  if (locale === "es") return es_marketplace_buy_gift_card();
  return "marketplace.buy_gift_card";
};
const en_marketplace_tabs_buy = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Buy`;
  }
);
const es_marketplace_tabs_buy = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Comprar`;
  }
);
const marketplace_tabs_buy = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_tabs_buy", locale);
  if (locale === "en") return en_marketplace_tabs_buy();
  if (locale === "es") return es_marketplace_tabs_buy();
  return "marketplace.tabs.buy";
};
const en_marketplace_brand_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Brand`;
  }
);
const es_marketplace_brand_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Marca`;
  }
);
const marketplace_brand_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_brand_label", locale);
  if (locale === "en") return en_marketplace_brand_label();
  if (locale === "es") return es_marketplace_brand_label();
  return "marketplace.brand_label";
};
const en_marketplace_gift_card_amount_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Gift Card Amount`;
  }
);
const es_marketplace_gift_card_amount_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Monto de la tarjeta de regalo`;
  }
);
const marketplace_gift_card_amount_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_gift_card_amount_label", locale);
  if (locale === "en") return en_marketplace_gift_card_amount_label();
  if (locale === "es") return es_marketplace_gift_card_amount_label();
  return "marketplace.gift_card_amount_label";
};
const en_marketplace_usd = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `USD`;
  }
);
const es_marketplace_usd = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `USD`;
  }
);
const marketplace_usd = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_usd", locale);
  if (locale === "en") return en_marketplace_usd();
  if (locale === "es") return es_marketplace_usd();
  return "marketplace.usd";
};
const en_marketplace_visit_online = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `VISIT ONLINE`;
  }
);
const es_marketplace_visit_online = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `VISITAR EN LÍNEA`;
  }
);
const marketplace_visit_online = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("marketplace_visit_online", locale);
  if (locale === "en") return en_marketplace_visit_online();
  if (locale === "es") return es_marketplace_visit_online();
  return "marketplace.visit_online";
};
const en_wallet_gift_card_gift = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Gift`;
  }
);
const es_wallet_gift_card_gift = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Regalo`;
  }
);
const wallet_gift_card_gift = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_gift", locale);
  if (locale === "en") return en_wallet_gift_card_gift();
  if (locale === "es") return es_wallet_gift_card_gift();
  return "wallet.gift-card.gift";
};
const en_wallet_gift_card_print = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Print`;
  }
);
const es_wallet_gift_card_print = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Imprimir`;
  }
);
const wallet_gift_card_print = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_print", locale);
  if (locale === "en") return en_wallet_gift_card_print();
  if (locale === "es") return es_wallet_gift_card_print();
  return "wallet.gift-card.print";
};
const en_wallet_gift_card_use = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Use`;
  }
);
const es_wallet_gift_card_use = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Usar`;
  }
);
const wallet_gift_card_use = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_use", locale);
  if (locale === "en") return en_wallet_gift_card_use();
  if (locale === "es") return es_wallet_gift_card_use();
  return "wallet.gift-card.use";
};
const en_wallet_gift_card_info = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Info`;
  }
);
const es_wallet_gift_card_info = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Información`;
  }
);
const wallet_gift_card_info = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_info", locale);
  if (locale === "en") return en_wallet_gift_card_info();
  if (locale === "es") return es_wallet_gift_card_info();
  return "wallet.gift-card.info";
};
const en_wallet_gift_card_look_up_balance = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Look up balance`;
  }
);
const es_wallet_gift_card_look_up_balance = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Consultar saldo`;
  }
);
const wallet_gift_card_look_up_balance = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_look_up_balance", locale);
  if (locale === "en") return en_wallet_gift_card_look_up_balance();
  if (locale === "es") return es_wallet_gift_card_look_up_balance();
  return "wallet.gift-card.look_up_balance";
};
const en_wallet_gift_card_zoom = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Zoom`;
  }
);
const es_wallet_gift_card_zoom = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Zoom`;
  }
);
const wallet_gift_card_zoom = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_zoom", locale);
  if (locale === "en") return en_wallet_gift_card_zoom();
  if (locale === "es") return es_wallet_gift_card_zoom();
  return "wallet.gift-card.zoom";
};
const en_wallet_gift_card_copy = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Copy`;
  }
);
const es_wallet_gift_card_copy = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Copiar`;
  }
);
const wallet_gift_card_copy = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_copy", locale);
  if (locale === "en") return en_wallet_gift_card_copy();
  if (locale === "es") return es_wallet_gift_card_copy();
  return "wallet.gift-card.copy";
};
const en_wallet_gift_card_copy_pin = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Copy PIN`;
  }
);
const es_wallet_gift_card_copy_pin = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Copiar PIN`;
  }
);
const wallet_gift_card_copy_pin = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_copy_pin", locale);
  if (locale === "en") return en_wallet_gift_card_copy_pin();
  if (locale === "es") return es_wallet_gift_card_copy_pin();
  return "wallet.gift-card.copy_pin";
};
function Barcode_view($$payload, $$props) {
  let { children } = $$props;
  $$payload.out += `<div class="flex h-full w-full items-center bg-background"><div class="flex rotate-90 flex-col items-center">`;
  children?.($$payload);
  $$payload.out += `<!----> <span class="mt-4 text-xs text-gray-500">Scan or show at checkout</span></div></div>`;
}
async function fetchProxyImageAsDataUrl(imageUrl) {
  const resp = await fetch(`/api/image-proxy?imageUrl=${encodeURIComponent(imageUrl)}`);
  if (!resp.ok) throw new Error("Proxy fetch failed.");
  const blob = await resp.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(blob);
  });
}
function measureHtmlContentHeight(htmlString, widthPt) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.width = `${widthPt}px`;
  div.innerHTML = htmlString;
  document.body.appendChild(div);
  const { height: heightPx } = div.getBoundingClientRect();
  return heightPx;
}
async function downloadPdf(walletItemProduct, code = "5045 0794 5057 847", pin = "1234") {
  try {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth() - 40 * 2;
    let positionY = 30;
    const topPadding = 30;
    const leftPadding = 40;
    doc.setFontSize(16);
    doc.text(walletItemProduct.name || "Gift Card", pageWidth / 2, positionY, { align: "center" });
    positionY += topPadding;
    if (walletItemProduct.imageSourceFront) {
      try {
        const imgUrl = `${giftCardImageDomain}/giftcards/${walletItemProduct.imageSourceFront}`;
        const dataUrl = await fetchProxyImageAsDataUrl(imgUrl);
        doc.addImage(dataUrl, "JPEG", pageWidth / 2 - 100, positionY, 200, 120);
      } catch (imgError) {
        console.error("Error adding image to PDF:", imgError);
      }
    }
    positionY = positionY + 120 + topPadding;
    doc.setFontSize(14);
    doc.text(
      `Balance: $${(walletItemProduct.balance / 100).toFixed(2)}`,
      pageWidth / 2,
      positionY,
      { align: "center" }
    );
    positionY += topPadding;
    const barcodeFormat = walletItemProduct.barcodeFormat ?? "code128";
    const barcodeApiUrl = `https://barcodeapi.org/api/${barcodeFormat}/${encodeURIComponent(code)}`;
    const resp = await fetch(barcodeApiUrl);
    const blob = await resp.blob();
    const barcodeDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(blob);
    });
    let barcodeHeight = 200;
    let barcodeWidth = 200;
    if (walletItemProduct.barcodeFormat == null || walletItemProduct.barcodeFormat == void 0) {
      barcodeHeight = 80;
      barcodeWidth = 300;
    }
    doc.addImage(
      barcodeDataUrl,
      "PNG",
      pageWidth / 2 - barcodeWidth / 2,
      positionY,
      barcodeWidth,
      barcodeHeight
    );
    positionY = positionY + barcodeHeight + topPadding;
    const container = document.createElement("div");
    container.style.width = `${pageWidth.toString()}px`;
    container.style.fontSize = "12pt";
    container.style.lineHeight = "1.4";
    container.style.fontFamily = "Arial, sans-serif";
    doc.text(`Pin: ${pin}`, pageWidth / 2, positionY, { align: "center" });
    positionY += topPadding;
    if (walletItemProduct.instructionsEn) {
      doc.setFontSize(12);
      doc.text("How to Reedem", leftPadding, positionY);
      positionY += topPadding;
      doc.setFontSize(10);
      doc.setTextColor("#808080");
      const instructionLines = doc.splitTextToSize(walletItemProduct.instructionsEn, pageWidth);
      if (walletItemProduct.instructionsEn.startsWith("<")) {
        const heightPx = measureHtmlContentHeight(walletItemProduct.instructionsEn, pageWidth);
        container.innerHTML = walletItemProduct.instructionsEn;
        await doc.html(container, {
          x: leftPadding,
          y: positionY,
          width: pageWidth,
          autoPaging: "text",
          html2canvas: {
            scale: 0.8,
            letterRendering: true,
            logging: false
          }
        });
        positionY = positionY + heightPx + topPadding;
      } else {
        doc.text(instructionLines, leftPadding, positionY, { align: "left", maxWidth: pageWidth });
        positionY = positionY + instructionLines.length * 10 + topPadding;
      }
    }
    if (walletItemProduct.termsEn) {
      doc.setFontSize(12);
      doc.setTextColor("#000000");
      doc.text("Terms & Conditions", leftPadding, positionY);
      positionY += topPadding;
      doc.setFontSize(10);
      doc.setTextColor("#808080");
      const termsLines = doc.splitTextToSize(walletItemProduct.termsEn, pageWidth);
      if (walletItemProduct.termsEn.startsWith("<")) {
        const heightPx = measureHtmlContentHeight(walletItemProduct.termsEn, pageWidth);
        container.innerHTML = walletItemProduct.termsEn;
        await doc.html(container, {
          x: leftPadding,
          y: positionY,
          width: pageWidth,
          autoPaging: "text",
          html2canvas: {
            scale: 0.8,
            letterRendering: true,
            logging: false
          }
        });
        positionY = positionY + heightPx + topPadding;
      } else {
        doc.text(termsLines, leftPadding, positionY, { align: "left" });
      }
    }
    doc.save(`${walletItemProduct.name || "wallet-item"}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
const getGiftCardDenominations = (products, thisProduct) => {
  if (Array.isArray(thisProduct?.denominations) && thisProduct.denominations.length > 0) {
    return thisProduct.denominations.sort((a, b) => a.amount - b.amount);
  }
  if (!Array.isArray(products) || products.length < 1 || !thisProduct?.genericGiftCardId) {
    return [];
  }
  const genericProduct = products.find((product) => product.id === thisProduct.genericGiftCardId);
  if (!Array.isArray(genericProduct?.denominations) || genericProduct.denominations.length < 1) {
    return [];
  }
  genericProduct.denominations.sort((a, b) => a.amount - b.amount);
  return genericProduct.denominations;
};
function Gift_card_details($$payload, $$props) {
  push();
  let {
    productId,
    walletItem = void 0,
    showNavBar = true,
    hideActions = false,
    isVerified = true,
    product,
    brand
  } = $$props;
  const { products } = getMarketplaceData();
  let selectedTab = walletItem ? "use" : "buy";
  let isBarcodeViewOpen = false;
  let instructions = product?.instructionsEn ?? walletItem?.instructionsEn;
  let terms = product?.termsEn ?? walletItem?.termsEn;
  let imageSourceFront = product?.imageSourceFront ?? walletItem?.imageSourceFront;
  function getBarcodeApiUrl() {
    return `https://barcodeapi.org/api/${(walletItem?.barcodeFormat || "CODE39") === "QR_CODE" ? "qr" : "code39"}/${encodeURIComponent(walletItem?.code || "")}`;
  }
  async function archiveWalletItem() {
    if (!walletItem) {
      console.error("No wallet item found to archive.");
      return;
    }
    try {
      await marketplaceContext.archiveWalletItem(walletItem.id, !walletItem?.archivedAt);
      const updatedWalletItem = {
        ...walletItem,
        archivedAt: walletItem.archivedAt ? null : (/* @__PURE__ */ new Date()).toISOString()
      };
      updateWalletItem(updatedWalletItem);
      walletItem = { ...updatedWalletItem };
    } catch (error) {
      console.error("Error archiving wallet item:", error);
    }
  }
  function handlePrintPdf() {
    if (!walletItem || !walletItem.code || !walletItem.pin) return;
    downloadPdf(walletItem, walletItem.code, walletItem.pin);
  }
  function openExternal(url) {
    if (!url) return;
    const normalized = /^(https?:)?\/\//i.test(url) ? url : `https://${url}`;
    window.open(normalized, "_blank", "noopener,noreferrer");
  }
  let isMarketPlace = page.url.pathname.startsWith("/marketplace/");
  if (showNavBar) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"><button class="flex items-center">`;
    if (isBarcodeViewOpen) {
      $$payload.out += "<!--[-->";
      Zoom_out($$payload, { class: "h-6 w-6" });
    } else {
      $$payload.out += "<!--[!-->";
      Arrow_left($$payload, { class: "h-6 w-6" });
    }
    $$payload.out += `<!--]--></button> <span class="flex-1 text-center text-lg font-bold">${escape_html(isMarketPlace ? /* @__PURE__ */ marketplace_buy_gift_card() : wallet_gift_card_title())}</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (isBarcodeViewOpen) {
    $$payload.out += "<!--[2-->";
    Barcode_view($$payload, {
      children: ($$payload2) => {
        $$payload2.out += `<img${attr("src", getBarcodeApiUrl())} class="barcode" alt="Barcode"/>`;
      }
    });
  } else if (walletItem || product) {
    $$payload.out += "<!--[3-->";
    $$payload.out += `<div class="mx-auto max-w-lg px-4 py-6"><div class="my-2 flex justify-center"><img${attr("src", giftCardImageDomain + "/giftcards/" + imageSourceFront)}${attr("alt", product?.name)} class="object-scale aspect-[16/9] w-full max-w-md rounded-2xl shadow-lg" onload="this.__e=event" onerror="this.__e=event"/></div> `;
    if (walletItem && !hideActions) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex items-center border-b bg-gray-50 px-4 py-2"><div class="flex gap-2">`;
      if (walletItem.transferStartedAt == null || void 0) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="flex flex-col items-center">`;
        Button($$payload, {
          variant: "ghost",
          size: "icon",
          onclick: () => goto(`/wallet/send-gift-card?id=${walletItem?.id}`),
          children: ($$payload2) => {
            Gift($$payload2, { "aria-label": "Gift" });
          },
          $$slots: { default: true }
        });
        $$payload.out += `<!----> <span class="text-xs text-gray-500">${escape_html(/* @__PURE__ */ wallet_gift_card_gift())}</span></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (walletItem.termsUrl) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="flex flex-col items-center">`;
        Button($$payload, {
          variant: "ghost",
          size: "icon",
          onclick: () => openExternal(walletItem?.termsUrl),
          children: ($$payload2) => {
            External_link($$payload2, { "aria-label": "Brand" });
          },
          $$slots: { default: true }
        });
        $$payload.out += `<!----> <span class="text-xs text-gray-500">${escape_html(wallet_gift_card_brand())}</span></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (walletItem.transferStartedAt == null || void 0) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="flex flex-col items-center">`;
        Button($$payload, {
          variant: "ghost",
          size: "icon",
          onclick: handlePrintPdf,
          children: ($$payload2) => {
            Printer($$payload2, { "aria-label": "Print" });
          },
          $$slots: { default: true }
        });
        $$payload.out += `<!----> <span class="text-xs text-gray-500">${escape_html(/* @__PURE__ */ wallet_gift_card_print())}</span></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <div class="flex flex-col items-center">`;
      Button($$payload, {
        variant: "ghost",
        size: "icon",
        onclick: archiveWalletItem,
        children: ($$payload2) => {
          Archive($$payload2, { "aria-label": "Archive" });
        },
        $$slots: { default: true }
      });
      $$payload.out += `<!----> <span class="text-xs text-gray-500">${escape_html(walletItem.archivedAt ? wallet_gift_card_unarchive() : wallet_gift_card_archive())}</span></div></div> <span class="ml-2 flex flex-grow items-center justify-end"><span${attr_class(`mr-1 inline-block h-3 w-3 rounded-full ${walletItem.archivedAt ? "bg-red-500" : "bg-green-500"}`)}></span> <span class="text-xs text-gray-500">${escape_html(walletItem.archivedAt ? "Archived" : "Active")}</span></span></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="mb-4 flex border-b">`;
    if (walletItem) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button class="flex-1 border-b-2 py-2 font-medium"${attr_style(`color: ${stringify(selectedTab === "use" ? "var(--primary)" : "#888")}; border-color: ${stringify(selectedTab === "use" ? "var(--primary)" : "transparent")};`)}>${escape_html(/* @__PURE__ */ wallet_gift_card_use())}</button>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<button class="flex-1 border-b-2 py-2 font-medium"${attr_style(`color: ${stringify(selectedTab === "Buy" ? "var(--primary)" : "#888")}; border-color: ${stringify(selectedTab === "buy" ? "var(--primary)" : "transparent")};`)}>${escape_html(/* @__PURE__ */ marketplace_tabs_buy())}</button>`;
    }
    $$payload.out += `<!--]--> <button class="flex-1 border-b-2 py-2 font-medium"${attr_style(`color: ${stringify(selectedTab === "info" ? "var(--primary)" : "#888")}; border-color: ${stringify(selectedTab === "info" ? "var(--primary)" : "transparent")};`)}>${escape_html(/* @__PURE__ */ wallet_gift_card_info())}</button> <button class="flex-1 border-b-2 py-2 font-medium"${attr_style(`color: ${stringify(selectedTab === "brand" ? "var(--primary)" : "#888")}; border-color: ${stringify(selectedTab === "brand" ? "var(--primary)" : "transparent")};`)}>${escape_html(wallet_gift_card_brand())}</button></div> `;
    if (selectedTab === "use" && walletItem) {
      $$payload.out += "<!--[-->";
      if (isVerified) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="flex flex-col items-center justify-center px-2 py-4"><div class="flex items-end justify-center"><p class="mr-2 text-xl text-gray-400">USD</p> <span class="text-400 text-5xl font-semibold text-foreground">${escape_html((walletItem.balance / 1e3).toFixed(0))}</span> <span class="text-lg font-semibold text-foreground">.${escape_html((walletItem.balance / 1e3).toFixed(2).split(".")[1])}</span></div> <p class="text-sm text-gray-400">Balance as of ${escape_html(new Date(walletItem.createdAt).toLocaleDateString())}</p> `;
        if (brand?.balanceLookupUri) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<a${attr("href", brand.balanceLookupUri)} target="_blank" rel="noopener noreferrer" class="text-primary underline">${escape_html(/* @__PURE__ */ wallet_gift_card_look_up_balance())}</a>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--> `;
        if (walletItem.code) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="mt-4 flex flex-col items-center"><img${attr("src", getBarcodeApiUrl())} class="barcode" alt="Barcode"/></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--> <div class="mt-4 flex items-center gap-2">`;
        Button($$payload, {
          size: "sm",
          class: "h-8 rounded-full bg-primary text-primary-foreground",
          onclick: () => isBarcodeViewOpen = true,
          children: ($$payload2) => {
            $$payload2.out += `<!---->${escape_html(/* @__PURE__ */ wallet_gift_card_zoom())}`;
          },
          $$slots: { default: true }
        });
        $$payload.out += `<!----> `;
        Button($$payload, {
          size: "sm",
          class: "h-8 rounded-full bg-primary text-primary-foreground",
          children: ($$payload2) => {
            $$payload2.out += `<!---->${escape_html(/* @__PURE__ */ wallet_gift_card_copy())}`;
          },
          $$slots: { default: true }
        });
        $$payload.out += `<!----></div> <h class="mt-4 text-xl text-black">${escape_html(walletItem.pin)}</h> <p class="text-sm text-gray-400">Card PIN</p> `;
        Button($$payload, {
          size: "sm",
          class: "mt-2 h-8 rounded-full bg-primary text-primary-foreground",
          children: ($$payload2) => {
            $$payload2.out += `<!---->${escape_html(/* @__PURE__ */ wallet_gift_card_copy_pin())}`;
          },
          $$slots: { default: true }
        });
        $$payload.out += `<!----></div>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<div class="h-full w-full text-center text-muted-foreground">Please accept card to see all details</div>`;
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (selectedTab === "buy" && product && brand) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(getGiftCardDenominations(products, product));
      $$payload.out += `<div class="text-500 mb-2 text-sm text-secondary-foreground">${escape_html(/* @__PURE__ */ marketplace_brand_label())}</div> <div class="mb-4 text-xl font-bold">${escape_html(brand?.name)}</div> <div class="text-500 mb-2 text-sm text-secondary-foreground">${escape_html(/* @__PURE__ */ marketplace_gift_card_amount_label())}</div> <div class="space-y-4"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let denomination = each_array[$$index];
        $$payload.out += `<button type="button" class="flex w-full cursor-pointer flex-col items-center rounded-xl border px-6 py-4 text-2xl font-bold shadow-sm transition-colors hover:bg-gray-100"><span class="flex items-end gap-1"><span class="align-bottom text-base text-gray-400">${escape_html(/* @__PURE__ */ marketplace_usd())}</span> <span class="text-4xl">${escape_html(denomination.amount / 1e3)}</span></span></button>`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (selectedTab === "info") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="px-2 py-4">`;
      if (instructions) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="mb-6"><h2 class="text-400 mb-2 text-lg font-semibold text-secondary-foreground">${escape_html(wallet_gift_card_how_to_redeem())}</h2> `;
        if (instructions?.trim().startsWith("<")) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<p class="mb-2">${html(instructions)}</p>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<p class="mb-2">${escape_html(instructions)}</p>`;
        }
        $$payload.out += `<!--]--></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (terms) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div><h2 class="text-400 mb-2 text-lg font-semibold text-secondary-foreground">${escape_html(wallet_gift_card_terms_and_conditions())}</h2> `;
        if (terms?.trim().startsWith("<")) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<p class="mb-2">${html(terms)}</p>`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<p class="mb-2">${escape_html(terms)}</p>`;
        }
        $$payload.out += `<!--]--></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (selectedTab === "brand") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex flex-col items-center py-8"><p>${escape_html(brand?.name ?? "not found")}</p> <div class="mb-4 flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg"><img${attr("src", giftCardImageDomain + "/vendors/" + brand?.logoImageSource)}${attr("alt", brand?.name)} class="h-full w-full object-contain" onload="this.__e=event" onerror="this.__e=event"/></div> `;
      if (brand?.description) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="text-600 mb-8 max-w-xl text-center">${escape_html(brand.description)}</div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (brand?.url) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<a${attr("href", brand.url)} target="_blank" rel="noopener noreferrer" class="rounded-lg bg-nav-foreground px-8 py-2 font-semibold tracking-wide text-nav shadow transition hover:bg-nav-foreground/90" style="text-transform: uppercase; letter-spacing: 1px;">${escape_html(/* @__PURE__ */ marketplace_visit_online())}</a>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { walletItem });
  pop();
}

export { Gift_card_details as G };
//# sourceMappingURL=gift-card-details--ZA_W9WE.js.map
