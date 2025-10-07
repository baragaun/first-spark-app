import { q as push, B as escape_html, u as pop, J as store_get, A as attr, K as unsubscribe_stores } from './index-d9yomiCc.js';
import { e as emailSchema, s as superForm, z as zod, F as Form_ident_input, a as Form_button } from './superForm-DTuNRgSU.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { z } from 'zod';
import { UserIdentType } from '@baragaun/bg-node-client';
import { debounce } from 'throttle-debounce';
import { g as goto } from './client-BNK9U2wL.js';
import './app-7kTdB7Wo.js';
import { R as Root, A as Alert_dialog_content, a as Alert_dialog_header, c as Alert_dialog_title, d as Alert_dialog_description, b as Alert_dialog_footer, e as Alert_dialog_action, f as cart_okay } from './index5-DCZzZTQV.js';
import { m as myUserContext } from './my-user-context.svelte-C7pZorxo.js';
import { m as marketplaceContext } from './marketplace-context.svelte-kqZeQ73y.js';
import { g as getWalletItemsStore } from './wallet-store.svelte-BkvzBmRt.js';
import { p as page } from './index3-DMvwsHdR.js';
import { A as Arrow_left } from './arrow-left-ByyUiPBJ.js';
import './button-B_xSpjF_.js';
import './utils-CCkZTMVc.js';
import './spin-load-indicator-CKSC_Q6z.js';
import './Icon-CCGd_g73.js';
import './noop-kcrjqjA1.js';
import './index-server2-_G0R5Qhl.js';
import './exports-J2AlltLs.js';
import './input-BHwyyuIe.js';
import './check-B2yEnkD1.js';
import './index-server-DeHLhTK0.js';
import './dialog-overlay-D99JmK3L.js';
import './kbd-constants-tqlk3Es5.js';
import './scroll-lock-BMUvnJ8g.js';
import './events-CdTAYaIN.js';
import './is--6Wd6KIW.js';
import './dialog-description-Da_0L4ko.js';
import './dialog-title-BAVtkHhB.js';
import './shared-server-i79vVjEm.js';
import './translate-DAfkGQ1n.js';
import './bg-node-client-CQb-2czA.js';
import './client2-yWJSv2LX.js';

const en_send_gift_card_error_sender_name_max_length = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sender name must contain at most 30 character(s)`;
  }
);
const es_send_gift_card_error_sender_name_max_length = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `El nombre del remitente debe tener como máximo 30 caracteres`;
  }
);
const send_gift_card_error_sender_name_max_length = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_error_sender_name_max_length", locale);
  if (locale === "en") return en_send_gift_card_error_sender_name_max_length();
  if (locale === "es") return es_send_gift_card_error_sender_name_max_length();
  return "send_gift_card.error.sender_name_max_length";
};
const en_send_gift_card_error_message_max_length = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Message must contain at most 500 character(s)`;
  }
);
const es_send_gift_card_error_message_max_length = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `El mensaje debe tener como máximo 500 caracteres`;
  }
);
const send_gift_card_error_message_max_length = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_error_message_max_length", locale);
  if (locale === "en") return en_send_gift_card_error_message_max_length();
  if (locale === "es") return es_send_gift_card_error_message_max_length();
  return "send_gift_card.error.message_max_length";
};
const sendGiftCardSchema = z.object({
  recipientFullName: z.string().max(30, /* @__PURE__ */ send_gift_card_error_sender_name_max_length()),
  recipientEmail: emailSchema.default("").transform((val) => val ? val.trim() : val),
  message: z.string().max(500, /* @__PURE__ */ send_gift_card_error_message_max_length())
});

const en_send_gift_card_sender_name = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Recipient Name`;
  }
);
const es_send_gift_card_sender_name = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Nombre del destinatario`;
  }
);
const send_gift_card_sender_name = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_sender_name", locale);
  if (locale === "en") return en_send_gift_card_sender_name();
  if (locale === "es") return es_send_gift_card_sender_name();
  return "send_gift_card.sender_name";
};
const en_send_gift_card_sender_name_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter name`;
  }
);
const es_send_gift_card_sender_name_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingrese el nombre`;
  }
);
const send_gift_card_sender_name_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_sender_name_placeholder", locale);
  if (locale === "en") return en_send_gift_card_sender_name_placeholder();
  if (locale === "es") return es_send_gift_card_sender_name_placeholder();
  return "send_gift_card.sender_name_placeholder";
};
const en_send_gift_card_sender_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Recipient Email`;
  }
);
const es_send_gift_card_sender_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Correo electrónico del destinatario`;
  }
);
const send_gift_card_sender_email = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_sender_email", locale);
  if (locale === "en") return en_send_gift_card_sender_email();
  if (locale === "es") return es_send_gift_card_sender_email();
  return "send_gift_card.sender_email";
};
const en_send_gift_card_sender_email_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter email`;
  }
);
const es_send_gift_card_sender_email_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingrese el correo electrónico`;
  }
);
const send_gift_card_sender_email_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_sender_email_placeholder", locale);
  if (locale === "en") return en_send_gift_card_sender_email_placeholder();
  if (locale === "es") return es_send_gift_card_sender_email_placeholder();
  return "send_gift_card.sender_email_placeholder";
};
const en_send_gift_card_message = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Your Message`;
  }
);
const es_send_gift_card_message = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Tu mensaje`;
  }
);
const send_gift_card_message = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_message", locale);
  if (locale === "en") return en_send_gift_card_message();
  if (locale === "es") return es_send_gift_card_message();
  return "send_gift_card.message";
};
const en_send_gift_card_message_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Write a message`;
  }
);
const es_send_gift_card_message_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Escribe un mensaje`;
  }
);
const send_gift_card_message_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_message_placeholder", locale);
  if (locale === "en") return en_send_gift_card_message_placeholder();
  if (locale === "es") return es_send_gift_card_message_placeholder();
  return "send_gift_card.message_placeholder";
};
const en_send_gift_card_send_gift = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Send Gift`;
  }
);
const es_send_gift_card_send_gift = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enviar regalo`;
  }
);
const send_gift_card_send_gift = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_send_gift", locale);
  if (locale === "en") return en_send_gift_card_send_gift();
  if (locale === "es") return es_send_gift_card_send_gift();
  return "send_gift_card.send_gift";
};
const en_send_gift_card_sent_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Gift card sent!`;
  }
);
const es_send_gift_card_sent_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¡Tarjeta de regalo enviada!`;
  }
);
const send_gift_card_sent_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_sent_title", locale);
  if (locale === "en") return en_send_gift_card_sent_title();
  if (locale === "es") return es_send_gift_card_sent_title();
  return "send_gift_card.sent_title";
};
const en_send_gift_card_sent_success = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Your gift has been sent successfully.`;
  }
);
const es_send_gift_card_sent_success = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Tu regalo ha sido enviado exitosamente.`;
  }
);
const send_gift_card_sent_success = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("send_gift_card_sent_success", locale);
  if (locale === "en") return en_send_gift_card_sent_success();
  if (locale === "es") return es_send_gift_card_sent_success();
  return "send_gift_card.sent_success";
};
function Send_gift_card_form($$payload, $$props) {
  push();
  var $$store_subs;
  const DEBOUNCE_DELAY = 350;
  let { data } = $$props;
  const form = superForm(data.form, {
    dataType: "json",
    validators: zod(sendGiftCardSchema),
    resetForm: false,
    validationMethod: "submit-only",
    async onChange() {
      debouncedValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      await handleFormSubmit();
    }
  });
  const {
    form: formData,
    errors,
    delayed,
    enhance,
    validateForm
  } = form;
  let formState = { isLoading: false, hasError: false };
  const buttonState = (() => ({
    isDisabled: !isFormValid || formState.isLoading || formState.hasError,
    isLoading: (store_get($$store_subs ??= {}, "$delayed", delayed) || formState.isLoading) && !formState.hasError
  }))();
  const isFormValid = (() => {
    return store_get($$store_subs ??= {}, "$formData", formData).recipientFullName && store_get($$store_subs ??= {}, "$formData", formData).recipientEmail && store_get($$store_subs ??= {}, "$formData", formData).message;
  })();
  let showDialog = false;
  let walletItem = getWalletItemsStore().find((p) => p.id === data.walletItemId) || null;
  const sendEmail = async (transferSlug, secretCode, recipientEmail, recipientFullName, message) => {
    const attachmentLink = `${page.url.origin}/gifted-card/${transferSlug}`;
    const subject = encodeURIComponent(`${myUserContext.myUser?.userHandle} sent you a gift card`);
    const balance = walletItem?.balance ? (walletItem?.balance / 1e3).toFixed(0) : 0;
    const body = encodeURIComponent(`${message}

------------------------------------
Details:
Gift Card Value: ${balance}
Accept gift at: ${attachmentLink}
Unlock code: ${secretCode}
------------------------------------`);
    const mailto = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  };
  function getSecureCode() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return (array[0] % 1e6).toString().padStart(6, "0");
  }
  const handleFormSubmit = async () => {
    const result = await validateForm({ update: true, focusOnError: true });
    if (!result.valid) {
      formState.hasError = true;
      return;
    }
    const transferSecret = getSecureCode();
    const response = await marketplaceContext.createWalletItemTransfer({
      transferSecret,
      walletItemId: data.walletItemId,
      recipientFullName: store_get($$store_subs ??= {}, "$formData", formData).recipientFullName,
      recipientEmail: store_get($$store_subs ??= {}, "$formData", formData).recipientEmail,
      messageText: store_get($$store_subs ??= {}, "$formData", formData).message
    });
    if (response.error || !response.object?.transferSlug) {
      return;
    }
    sendEmail(response.object.transferSlug, transferSecret, store_get($$store_subs ??= {}, "$formData", formData).recipientEmail, store_get($$store_subs ??= {}, "$formData", formData).recipientFullName, store_get($$store_subs ??= {}, "$formData", formData).message);
    showDialog = true;
  };
  const debouncedValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      const result = await validateForm({ update: true, focusOnError: false });
      formState.hasError = !result.valid;
    } catch (error) {
      console.error("Error validating form:", error);
    } finally {
      formState.isLoading = false;
    }
  });
  $$payload.out += `<form method="POST" class="mx-auto max-w-md space-y-4 rounded-xl bg-white p-6 shadow dark:bg-background">`;
  Form_ident_input($$payload, {
    form,
    fieldName: "recipientFullName",
    label: /* @__PURE__ */ send_gift_card_sender_name(),
    placeholder: /* @__PURE__ */ send_gift_card_sender_name_placeholder(),
    identType: UserIdentType.userHandle
  });
  $$payload.out += `<!----> `;
  Form_ident_input($$payload, {
    form,
    fieldName: "recipientEmail",
    label: /* @__PURE__ */ send_gift_card_sender_email(),
    placeholder: /* @__PURE__ */ send_gift_card_sender_email_placeholder(),
    identType: UserIdentType.email
  });
  $$payload.out += `<!----> <div><label class="mb-1 block text-sm font-medium" for="message">${escape_html(/* @__PURE__ */ send_gift_card_message())}</label> <textarea id="message" name="message" rows="5" class="min-h-[120px] w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"${attr("placeholder", /* @__PURE__ */ send_gift_card_message_placeholder())}>`;
  const $$body = escape_html(store_get($$store_subs ??= {}, "$formData", formData).message);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> `;
  if (store_get($$store_subs ??= {}, "$errors", errors).message) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="mt-1 text-xs text-red-500">${escape_html(store_get($$store_subs ??= {}, "$errors", errors).message[0])}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> `;
  Form_button($$payload, {
    disabled: buttonState.isDisabled,
    isLoading: buttonState.isLoading,
    buttonText: /* @__PURE__ */ send_gift_card_send_gift(),
    loadingText: "sending"
  });
  $$payload.out += `<!----></form> `;
  Root($$payload, {
    open: showDialog,
    children: ($$payload2) => {
      Alert_dialog_content($$payload2, {
        children: ($$payload3) => {
          Alert_dialog_header($$payload3, {
            children: ($$payload4) => {
              Alert_dialog_title($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ send_gift_card_sent_title())}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> `;
              Alert_dialog_description($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ send_gift_card_sent_success())}`;
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
                  showDialog = false;
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
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  $$payload.out += `<div class="flex items-center justify-between rounded-b-lg bg-nav px-4 py-3 text-nav-foreground shadow"><button class="flex items-center">`;
  Arrow_left($$payload, { class: "h-6 w-6" });
  $$payload.out += `<!----></button> <span class="flex-1 text-center text-lg font-bold">${escape_html(/* @__PURE__ */ send_gift_card_send_gift())}</span></div> <div class="flex h-full w-full items-center justify-center px-4"><div class="w-full max-w-md">`;
  Send_gift_card_form($$payload, {
    data: {
      form: data.form,
      walletItemId: data.walletItemId ?? ""
    }
  });
  $$payload.out += `<!----></div></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-ByjxtRUR.js.map
