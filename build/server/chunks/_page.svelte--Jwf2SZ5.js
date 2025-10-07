import { q as push, B as escape_html, A as attr, u as pop } from './index-d9yomiCc.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { R as Root, A as Alert_dialog_content, a as Alert_dialog_header, c as Alert_dialog_title, d as Alert_dialog_description, b as Alert_dialog_footer, e as Alert_dialog_action, f as cart_okay } from './index5-DCZzZTQV.js';
import { B as Button } from './button-B_xSpjF_.js';
import { g as goto } from './client-BNK9U2wL.js';
import { m as marketplaceContext } from './marketplace-context.svelte-kqZeQ73y.js';
import { WalletItem, ProductType } from '@baragaun/bg-node-client';
import { a as toast } from './Toaster.svelte_svelte_type_style_lang-s80CJFld.js';
import { m as myUserContext } from './my-user-context.svelte-C7pZorxo.js';
import { A as Arrow_left } from './arrow-left-ByyUiPBJ.js';
import './utils-CCkZTMVc.js';
import './noop-kcrjqjA1.js';
import './index-server2-_G0R5Qhl.js';
import './dialog-overlay-D99JmK3L.js';
import './kbd-constants-tqlk3Es5.js';
import './scroll-lock-BMUvnJ8g.js';
import './events-CdTAYaIN.js';
import './index-server-DeHLhTK0.js';
import './is--6Wd6KIW.js';
import './dialog-description-Da_0L4ko.js';
import './dialog-title-BAVtkHhB.js';
import './exports-J2AlltLs.js';
import './translate-DAfkGQ1n.js';
import './bg-node-client-CQb-2czA.js';
import './shared-server-i79vVjEm.js';
import './Icon-CCGd_g73.js';

const en_upload_card_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Upload Gift Card`;
  }
);
const es_upload_card_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Subir tarjeta de regalo`;
  }
);
const upload_card_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("upload_card_title", locale);
  if (locale === "en") return en_upload_card_title();
  if (locale === "es") return es_upload_card_title();
  return "upload_card.title";
};
const en_upload_card_brand = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Brand`;
  }
);
const es_upload_card_brand = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Marca`;
  }
);
const upload_card_brand = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("upload_card_brand", locale);
  if (locale === "en") return en_upload_card_brand();
  if (locale === "es") return es_upload_card_brand();
  return "upload_card.brand";
};
const en_upload_card_balance = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Balance`;
  }
);
const es_upload_card_balance = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Saldo`;
  }
);
const upload_card_balance = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("upload_card_balance", locale);
  if (locale === "en") return en_upload_card_balance();
  if (locale === "es") return es_upload_card_balance();
  return "upload_card.balance";
};
const en_upload_card_barcode = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Barcode`;
  }
);
const es_upload_card_barcode = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Código de barras`;
  }
);
const upload_card_barcode = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("upload_card_barcode", locale);
  if (locale === "en") return en_upload_card_barcode();
  if (locale === "es") return es_upload_card_barcode();
  return "upload_card.barcode";
};
const en_upload_card_pin = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Pin`;
  }
);
const es_upload_card_pin = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `PIN`;
  }
);
const upload_card_pin = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("upload_card_pin", locale);
  if (locale === "en") return en_upload_card_pin();
  if (locale === "es") return es_upload_card_pin();
  return "upload_card.pin";
};
const en_upload_card_submit = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `SUBMIT`;
  }
);
const es_upload_card_submit = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `ENVIAR`;
  }
);
const upload_card_submit = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("upload_card_submit", locale);
  if (locale === "en") return en_upload_card_submit();
  if (locale === "es") return es_upload_card_submit();
  return "upload_card.submit";
};
const en_upload_card_upload_success_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Gift card uploaded`;
  }
);
const es_upload_card_upload_success_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Tarjeta de regalo subida`;
  }
);
const upload_card_upload_success_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("upload_card_upload_success_title", locale);
  if (locale === "en") return en_upload_card_upload_success_title();
  if (locale === "es") return es_upload_card_upload_success_title();
  return "upload_card.upload_success_title";
};
const en_upload_card_upload_success_message = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Your gift card has been submitted successfully!`;
  }
);
const es_upload_card_upload_success_message = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¡Tu tarjeta de regalo ha sido enviada con éxito!`;
  }
);
const upload_card_upload_success_message = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("upload_card_upload_success_message", locale);
  if (locale === "en") return en_upload_card_upload_success_message();
  if (locale === "es") return es_upload_card_upload_success_message();
  return "upload_card.upload_success_message";
};
let brandName = "";
let balance = "";
let barcode = "";
let pin = "";
let imageUrl = "";
let loading = false;
let uploadedBrand = null;
let uploadedProduct = null;
const uploadedCardGetValues = () => {
  return {
    get brandName() {
      return brandName;
    },
    get balance() {
      return balance;
    },
    get barcode() {
      return barcode;
    },
    get pin() {
      return pin;
    },
    get imageUrl() {
      return imageUrl;
    },
    get loading() {
      return loading;
    },
    get uploadedBrand() {
      return uploadedBrand;
    },
    get uploadedProduct() {
      return uploadedProduct;
    }
  };
};
function _page($$payload, $$props) {
  push();
  let tmp = uploadedCardGetValues(), brandName2 = tmp.brandName, balance2 = tmp.balance, barcode2 = tmp.barcode, pin2 = tmp.pin, uploadedProduct2 = tmp.uploadedProduct;
  let showSuccessDialog = false;
  function formatBarcodeInput(value) {
    return value.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
  }
  let formattedBarcode = formatBarcodeInput(barcode2);
  async function handleSubmit(event) {
    event.preventDefault();
    const balanceInDollar = +balance2 * 1e3;
    const newWalletItem = new WalletItem();
    newWalletItem.name = "";
    newWalletItem.pin = pin2;
    newWalletItem.balance = balanceInDollar;
    newWalletItem.initialBalance = balanceInDollar;
    newWalletItem.price = balanceInDollar;
    newWalletItem.hasBarcode = true;
    newWalletItem.imageSourceFront = uploadedProduct2?.imageSourceFront;
    newWalletItem.brandId = "";
    newWalletItem.productId = "";
    newWalletItem.walletId = myUserContext.myUserId ?? "";
    newWalletItem.productType = ProductType.giftCard;
    newWalletItem.instructionsEn = uploadedProduct2?.instructionsEn;
    newWalletItem.instructionsUrl = uploadedProduct2?.instructionsUrl;
    newWalletItem.termsEn = uploadedProduct2?.termsEn;
    newWalletItem.termsUrl = uploadedProduct2?.termsUrl;
    const response = await marketplaceContext.createWalletItem(newWalletItem);
    if (response.error) {
      console.error("Error updating giftcard", response.error);
      toast.error(`Failed to update giftcard: ${response.error}`);
      return;
    }
    showSuccessDialog = true;
  }
  $$payload.out += `<div class="flex min-h-screen flex-col bg-background svelte-iwg81j"><div class="sticky top-0 z-10 flex items-center justify-between bg-nav px-4 py-3 text-nav-foreground shadow svelte-iwg81j"><button class="flex items-center svelte-iwg81j">`;
  Arrow_left($$payload, { class: "h-6 w-6" });
  $$payload.out += `<!----></button> <span class="flex-1 text-center text-lg font-bold svelte-iwg81j">${escape_html(/* @__PURE__ */ upload_card_title())}</span></div> <form class="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-8 svelte-iwg81j">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="mb-6 flex h-40 w-64 items-center justify-center rounded-xl bg-gray-100 text-4xl text-gray-400 svelte-iwg81j">?</div>`;
  }
  $$payload.out += `<!--]--> <div class="mb-4 w-full svelte-iwg81j"><label for="brand" class="mb-1 block text-sm text-gray-500 svelte-iwg81j">${escape_html(/* @__PURE__ */ upload_card_brand())}</label> <label for="brand" class="mb-1 block text-sm text-foreground svelte-iwg81j">${escape_html(brandName2)}</label></div> <div class="mb-4 w-full svelte-iwg81j"><label for="balance" class="mb-1 block text-sm text-gray-500 svelte-iwg81j">${escape_html(/* @__PURE__ */ upload_card_balance())}</label> <input id="balance" class="w-full rounded border px-3 py-2 svelte-iwg81j"${attr("value", balance2)} placeholder="Balance" inputmode="decimal"/></div> <div class="mb-6 w-full svelte-iwg81j"><label for="code" class="mb-1 block text-sm text-gray-500 svelte-iwg81j">${escape_html(/* @__PURE__ */ upload_card_barcode())}</label> <input id="code" class="w-full rounded border px-3 py-2 font-mono tracking-widest svelte-iwg81j"${attr("value", formattedBarcode)} placeholder="Barcode"/></div> <div class="mb-6 w-full svelte-iwg81j"><label for="code" class="mb-1 block text-sm text-gray-500 svelte-iwg81j">${escape_html(/* @__PURE__ */ upload_card_pin())}</label> <input id="code" class="w-full rounded border px-3 py-2 svelte-iwg81j"${attr("value", pin2)} placeholder="Pin"/></div> `;
  Button($$payload, {
    variant: "default",
    class: "w-full rounded py-3 font-semibold shadow",
    onclick: handleSubmit,
    children: ($$payload2) => {
      $$payload2.out += `<!---->${escape_html(/* @__PURE__ */ upload_card_submit())}`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></form> `;
  Root($$payload, {
    open: showSuccessDialog,
    children: ($$payload2) => {
      Alert_dialog_content($$payload2, {
        children: ($$payload3) => {
          Alert_dialog_header($$payload3, {
            children: ($$payload4) => {
              Alert_dialog_title($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ upload_card_upload_success_title())}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              Alert_dialog_description($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ upload_card_upload_success_message())}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          Alert_dialog_footer($$payload3, {
            children: ($$payload4) => {
              Alert_dialog_action($$payload4, {
                onclick: () => {
                  showSuccessDialog = false;
                  goto();
                },
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(cart_okay())}`;
                },
                $$slots: { default: true }
              });
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte--Jwf2SZ5.js.map
