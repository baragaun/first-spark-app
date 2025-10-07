import { q as push, V as copy_payload, W as assign_payload, u as pop, B as escape_html } from './index-d9yomiCc.js';
import { R as Root, D as Dialog_content, a as Dialog_header, b as Dialog_title } from './index6-BjPfDKpj.js';
import { I as Input } from './input-BHwyyuIe.js';
import { B as Button } from './button-B_xSpjF_.js';
import { p as page } from './index3-DMvwsHdR.js';
import { m as marketplaceContext } from './marketplace-context.svelte-kqZeQ73y.js';
import '@baragaun/bg-node-client';
import 'jspdf';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import './client-BNK9U2wL.js';
import './translate-DAfkGQ1n.js';
import { a as toast } from './Toaster.svelte_svelte_type_style_lang-s80CJFld.js';
import './bg-node-client-CQb-2czA.js';
import './dialog-content-C9LiXPSH.js';
import './noop-kcrjqjA1.js';
import './index-server2-_G0R5Qhl.js';
import './dialog-overlay-D99JmK3L.js';
import './kbd-constants-tqlk3Es5.js';
import './scroll-lock-BMUvnJ8g.js';
import './events-CdTAYaIN.js';
import './index-server-DeHLhTK0.js';
import './is--6Wd6KIW.js';
import './utils-CCkZTMVc.js';
import './x-CT7gPnZT.js';
import './Icon-CCGd_g73.js';
import './dialog-title-BAVtkHhB.js';
import './client2-yWJSv2LX.js';
import './my-user-context.svelte-C7pZorxo.js';
import './shared-server-i79vVjEm.js';
import './exports-J2AlltLs.js';

const en_send_gift_card_received_gift_card = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Received Gift Card`;
  }
);
const es_send_gift_card_received_gift_card = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Tarjeta de regalo recibida`;
  }
);
const send_gift_card_received_gift_card = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_received_gift_card", locale);
  if (locale === "en") return en_send_gift_card_received_gift_card();
  if (locale === "es") return es_send_gift_card_received_gift_card();
  return "send_gift_card.received_gift_card";
};
const en_gifted_card_accept = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Accept`;
  }
);
const es_gifted_card_accept = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Aceptar`;
  }
);
const gifted_card_accept = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("gifted_card_accept", locale);
  if (locale === "en") return en_gifted_card_accept();
  if (locale === "es") return es_gifted_card_accept();
  return "gifted_card.accept";
};
const en_gifted_card_decline = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Decline`;
  }
);
const es_gifted_card_decline = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Rechazar`;
  }
);
const gifted_card_decline = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("gifted_card_decline", locale);
  if (locale === "en") return en_gifted_card_decline();
  if (locale === "es") return es_gifted_card_decline();
  return "gifted_card.decline";
};
const en_gifted_card_decline_success = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `You have declined the gift-card!`;
  }
);
const es_gifted_card_decline_success = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¡Has rechazado la tarjeta de regalo!`;
  }
);
const gifted_card_decline_success = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("gifted_card_decline_success", locale);
  if (locale === "en") return en_gifted_card_decline_success();
  if (locale === "es") return es_gifted_card_decline_success();
  return "gifted_card.decline_success";
};
const en_gifted_card_modal_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Please enter your pin to accept it.`;
  }
);
const es_gifted_card_modal_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa tu PIN para aceptarla.`;
  }
);
const gifted_card_modal_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("gifted_card_modal_title", locale);
  if (locale === "en") return en_gifted_card_modal_title();
  if (locale === "es") return es_gifted_card_modal_title();
  return "gifted_card.modal_title";
};
const en_gifted_card_pin_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter PIN/secret`;
  }
);
const es_gifted_card_pin_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa PIN/código secreto`;
  }
);
const gifted_card_pin_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("gifted_card_pin_placeholder", locale);
  if (locale === "en") return en_gifted_card_pin_placeholder();
  if (locale === "es") return es_gifted_card_pin_placeholder();
  return "gifted_card.pin_placeholder";
};
const en_gifted_card_submit = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Submit`;
  }
);
const es_gifted_card_submit = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enviar`;
  }
);
const gifted_card_submit = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("gifted_card_submit", locale);
  if (locale === "en") return en_gifted_card_submit();
  if (locale === "es") return es_gifted_card_submit();
  return "gifted_card.submit";
};
function logToConsole(level, message, payload) {
  const args = payload !== void 0 ? [message, payload] : [message];
  switch (level) {
    case "debug":
      console.debug(...args);
      break;
    case "info":
      console.info(...args);
      break;
    case "warn":
      console.warn(...args);
      break;
    case "error":
      console.error(...args);
      break;
  }
}
async function logToRemote(_level, _message, _payload) {
  return Promise.resolve();
}
const isProd = typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production";
const logger = {
  debug(message, payload) {
    logToConsole("debug", message, payload);
    if (isProd) void logToRemote();
  },
  info(message, payload) {
    logToConsole("info", message, payload);
    if (isProd) void logToRemote();
  },
  warn(message, payload) {
    logToConsole("warn", message, payload);
    if (isProd) void logToRemote();
  },
  error(message, payload) {
    logToConsole("error", message, payload);
    if (isProd) void logToRemote();
  }
};
function _page($$payload, $$props) {
  push();
  let open = false;
  let showPasswordModal = false;
  let password = "";
  let showCongratsModal = false;
  let showDeleteWarning = false;
  let pin = "";
  const transferSlug = page.params.id;
  async function declineWalletItemTransfer() {
    const response = await marketplaceContext.declineWalletItemTransfer(transferSlug);
    if (response.error) {
      logger.error("Error verifying wallet item transfer", response.error);
      return;
    }
    toast.success(/* @__PURE__ */ gifted_card_decline_success());
  }
  function handlePrintPdf() {
    return;
  }
  async function deletePage() {
    showDeleteWarning = false;
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    {
      $$payload2.out += "<!--[!-->";
      $$payload2.out += `<div class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"><span class="text-lg font-bold">${escape_html(/* @__PURE__ */ send_gift_card_received_gift_card())}</span> `;
      {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div class="flex gap-2">`;
        Button($$payload2, {
          variant: "outline",
          size: "sm",
          class: "rounded-full hover:bg-background hover:text-nav-foreground/70",
          onclick: () => {
            open = true;
          },
          children: ($$payload3) => {
            $$payload3.out += `<!---->${escape_html(/* @__PURE__ */ gifted_card_accept())}`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!----> `;
        Button($$payload2, {
          variant: "outline",
          size: "sm",
          class: "rounded-full border-red-600 text-red-700 hover:bg-background hover:text-red-500",
          onclick: () => {
            declineWalletItemTransfer();
          },
          children: ($$payload3) => {
            $$payload3.out += `<!---->${escape_html(/* @__PURE__ */ gifted_card_decline())}`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!----></div>`;
      }
      $$payload2.out += `<!--]--></div> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      Root($$payload2, {
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          Dialog_content($$payload3, {
            children: ($$payload4) => {
              Dialog_header($$payload4, {
                children: ($$payload5) => {
                  Dialog_title($$payload5, {
                    children: ($$payload6) => {
                      $$payload6.out += `<!---->${escape_html(/* @__PURE__ */ gifted_card_modal_title())}`;
                    },
                    $$slots: { default: true }
                  });
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <form class="space-y-4">`;
              Input($$payload4, {
                type: "password",
                class: "focus-visible:outline-none  focus-visible:ring-white",
                placeholder: /* @__PURE__ */ gifted_card_pin_placeholder(),
                get value() {
                  return pin;
                },
                set value($$value) {
                  pin = $$value;
                  $$settled = false;
                }
              });
              $$payload4.out += `<!----> `;
              Button($$payload4, {
                type: "submit",
                class: "w-full",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ gifted_card_submit())}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----></form>`;
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Root($$payload2, {
        open: showCongratsModal,
        onOpenChange: (e) => showCongratsModal = e,
        children: ($$payload3) => {
          Dialog_content($$payload3, {
            children: ($$payload4) => {
              Dialog_header($$payload4, {
                children: ($$payload5) => {
                  Dialog_title($$payload5, {
                    children: ($$payload6) => {
                      $$payload6.out += `<!---->Congratulations!`;
                    },
                    $$slots: { default: true }
                  });
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <div class="space-y-2"><div class="text-lg font-semibold">This is your card now. You can print it out, or you can come back here to use it.</div> <div class="mt-4 text-base font-bold">Secure Your Card!</div> <div class="text-sm text-muted-foreground">This card is now like cash at the store and anyone with this link can use it. You can
          protect this page with a password, or first print the card, then delete this page.</div></div> <div class="mt-6 flex flex-col gap-2">`;
              Button($$payload4, {
                class: "w-full",
                onclick: handlePrintPdf,
                children: ($$payload5) => {
                  $$payload5.out += `<!---->Print Card`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              Button($$payload4, {
                class: "w-full",
                variant: "outline",
                onclick: () => {
                  showPasswordModal = true;
                },
                children: ($$payload5) => {
                  $$payload5.out += `<!---->Enter Password`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              Button($$payload4, {
                class: "w-full",
                variant: "destructive",
                onclick: () => showDeleteWarning = true,
                children: ($$payload5) => {
                  $$payload5.out += `<!---->Delete Page`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----></div>`;
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Root($$payload2, {
        open: showPasswordModal,
        onOpenChange: (e) => showPasswordModal = e,
        children: ($$payload3) => {
          Dialog_content($$payload3, {
            children: ($$payload4) => {
              Dialog_header($$payload4, {
                children: ($$payload5) => {
                  Dialog_title($$payload5, {
                    children: ($$payload6) => {
                      $$payload6.out += `<!---->Protect Your Card`;
                    },
                    $$slots: { default: true }
                  });
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <form class="space-y-4">`;
              Input($$payload4, {
                type: "password",
                class: "focus-visible:outline-none focus-visible:ring-white",
                placeholder: "Enter a password to protect this page",
                get value() {
                  return password;
                },
                set value($$value) {
                  password = $$value;
                  $$settled = false;
                }
              });
              $$payload4.out += `<!----> `;
              Button($$payload4, {
                type: "submit",
                class: "w-full",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->Set Password`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----></form>`;
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Root($$payload2, {
        open: showDeleteWarning,
        onOpenChange: (e) => showDeleteWarning = e,
        children: ($$payload3) => {
          Dialog_content($$payload3, {
            children: ($$payload4) => {
              Dialog_header($$payload4, {
                children: ($$payload5) => {
                  Dialog_title($$payload5, {
                    children: ($$payload6) => {
                      $$payload6.out += `<!---->Delete Page?`;
                    },
                    $$slots: { default: true }
                  });
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <div class="space-y-2"><div class="text-base">Did you already print out or copy this card? Once you delete this page, the card will no
          longer be available at this location.</div></div> <div class="mt-6 flex flex-col gap-2">`;
              Button($$payload4, {
                class: "w-full",
                variant: "outline",
                onclick: () => showDeleteWarning = false,
                children: ($$payload5) => {
                  $$payload5.out += `<!---->Cancel`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              Button($$payload4, {
                class: "w-full",
                variant: "destructive",
                onclick: deletePage,
                children: ($$payload5) => {
                  $$payload5.out += `<!---->Delete Page`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----></div>`;
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    }
    $$payload2.out += `<!--]-->`;
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
//# sourceMappingURL=_page.svelte-fvkVDL5U.js.map
