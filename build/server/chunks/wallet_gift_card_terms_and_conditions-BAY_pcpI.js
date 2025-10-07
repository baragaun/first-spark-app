import { M as sanitize_props, I as spread_props, T as slot } from './index-d9yomiCc.js';
import { I as Icon } from './Icon-CCGd_g73.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';

function Archive($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "20",
        "height": "5",
        "x": "2",
        "y": "3",
        "rx": "1"
      }
    ],
    [
      "path",
      {
        "d": "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"
      }
    ],
    ["path", { "d": "M10 12h4" }]
  ];
  Icon($$payload, spread_props([
    { name: "archive" },
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
function External_link($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M15 3h6v6" }],
    ["path", { "d": "M10 14 21 3" }],
    [
      "path",
      {
        "d": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "external-link" },
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
const en_wallet_gift_card_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Gift Card`;
  }
);
const es_wallet_gift_card_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Tarjeta de regalo`;
  }
);
const wallet_gift_card_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_title", locale);
  if (locale === "en") return en_wallet_gift_card_title();
  if (locale === "es") return es_wallet_gift_card_title();
  return "wallet.gift-card.title";
};
const en_wallet_gift_card_brand = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Brand`;
  }
);
const es_wallet_gift_card_brand = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Marca`;
  }
);
const wallet_gift_card_brand = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_brand", locale);
  if (locale === "en") return en_wallet_gift_card_brand();
  if (locale === "es") return es_wallet_gift_card_brand();
  return "wallet.gift-card.brand";
};
const en_wallet_gift_card_archive = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Archive`;
  }
);
const es_wallet_gift_card_archive = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Archivado`;
  }
);
const wallet_gift_card_archive = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_archive", locale);
  if (locale === "en") return en_wallet_gift_card_archive();
  if (locale === "es") return es_wallet_gift_card_archive();
  return "wallet.gift-card.archive";
};
const en_wallet_gift_card_unarchive = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Unarchive`;
  }
);
const es_wallet_gift_card_unarchive = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Desarchivar`;
  }
);
const wallet_gift_card_unarchive = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_unarchive", locale);
  if (locale === "en") return en_wallet_gift_card_unarchive();
  if (locale === "es") return es_wallet_gift_card_unarchive();
  return "wallet.gift-card.unarchive";
};
const en_wallet_gift_card_how_to_redeem = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `How To Redeem`;
  }
);
const es_wallet_gift_card_how_to_redeem = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cómo canjear`;
  }
);
const wallet_gift_card_how_to_redeem = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_how_to_redeem", locale);
  if (locale === "en") return en_wallet_gift_card_how_to_redeem();
  if (locale === "es") return es_wallet_gift_card_how_to_redeem();
  return "wallet.gift-card.how_to_redeem";
};
const en_wallet_gift_card_terms_and_conditions = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Terms And Conditions`;
  }
);
const es_wallet_gift_card_terms_and_conditions = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Términos y condiciones`;
  }
);
const wallet_gift_card_terms_and_conditions = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("wallet_gift_card_terms_and_conditions", locale);
  if (locale === "en") return en_wallet_gift_card_terms_and_conditions();
  if (locale === "es") return es_wallet_gift_card_terms_and_conditions();
  return "wallet.gift-card.terms_and_conditions";
};

export { Archive as A, External_link as E, wallet_gift_card_archive as a, wallet_gift_card_title as b, wallet_gift_card_brand as c, wallet_gift_card_how_to_redeem as d, wallet_gift_card_terms_and_conditions as e, wallet_gift_card_unarchive as w };
//# sourceMappingURL=wallet_gift_card_terms_and_conditions-BAY_pcpI.js.map
