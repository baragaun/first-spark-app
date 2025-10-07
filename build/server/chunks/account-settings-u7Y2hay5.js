import { q as push, F as getContext, V as copy_payload, W as assign_payload, u as pop, B as escape_html, E as bind_props, M as sanitize_props, I as spread_props, T as slot, J as store_get, K as unsubscribe_stores, a9 as store_mutate, O as spread_attributes, P as clsx } from './index-d9yomiCc.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { s as setting_account } from './setting_account-BoTCKCEe.js';
import { g as goto } from './client-BNK9U2wL.js';
import { c as cn } from './utils-CCkZTMVc.js';
import { c as ce, B as Button } from './button-B_xSpjF_.js';
import { u as usernameSchema, e as emailSchema, o as otpSchema, p as passwordSchema, s as superForm, z as zod, F as Form_ident_input, a as Form_button, g as zodClient, b as Form_field, C as Control, c as Form_field_errors, d as Form_label } from './superForm-DTuNRgSU.js';
import { I as Input } from './input-BHwyyuIe.js';
import { t as translate, A as AppUiMessage } from './translate-DAfkGQ1n.js';
import { UserIdentType } from '@baragaun/bg-node-client';
import { s as setting_buttons_cancel } from './setting_buttons_cancel-Cp1uCP5H.js';
import { o as onDestroy } from './index-server-DeHLhTK0.js';
import './app-7kTdB7Wo.js';
import { debounce } from 'throttle-debounce';
import { z } from 'zod';
import { I as Icon } from './Icon-CCGd_g73.js';
import { R as Root, T as Trigger, D as Dialog_content, a as Dialog_header, b as Dialog_title } from './index6-BjPfDKpj.js';
import { D as Dialog_description$1 } from './dialog-description-Da_0L4ko.js';
import { M as MsaListenerHandler, a as Form_otp_input, v as verify_token_verification_code, F as Form_password_input } from './msa-listener-handler.svelte-Bv4sHlq9.js';

const en_setting_password_error_required = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Current password is required`;
  }
);
const es_setting_password_error_required = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Se requiere la contraseña actual`;
  }
);
const setting_password_error_required = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_password_error_required", locale);
  if (locale === "en") return en_setting_password_error_required();
  if (locale === "es") return es_setting_password_error_required();
  return "setting.password.error.required";
};
const currentPasswordSchema = z.string().min(8, {
  message: /* @__PURE__ */ setting_password_error_required()
});
const usernameFormSchema = z.object({
  username: usernameSchema.transform((val) => val.trim())
});
const emailFormSchemaFirstStep = z.object({
  email: emailSchema.transform((val) => val.trim())
});
const emailFormSchemaLastStep = emailFormSchemaFirstStep.extend({
  token: otpSchema.transform((val) => val.trim())
});
const passwordFormSchema = z.object({
  currentPassword: currentPasswordSchema.transform((val) => val.trim()),
  newPassword: passwordSchema.transform((val) => val.trim())
});
const deleteAccountFormSchema = z.object({
  confirmEmail: emailSchema.transform((val) => val.trim()),
  reason: z.string().optional().transform((val) => val?.trim()),
  description: z.string().optional().transform((val) => val?.trim())
});

function Chevron_right($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-right" },
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
function Log_out($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }
    ],
    ["polyline", { "points": "16 17 21 12 16 7" }],
    [
      "line",
      {
        "x1": "21",
        "x2": "9",
        "y1": "12",
        "y2": "12"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "log-out" },
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
function Triangle_alert($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
      }
    ],
    ["path", { "d": "M12 9v4" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  Icon($$payload, spread_props([
    { name: "triangle-alert" },
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
const en_nav_auth_sign_out = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign out`;
  }
);
const es_nav_auth_sign_out = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cerrar sesión`;
  }
);
const nav_auth_sign_out = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("nav_auth_sign_out", locale);
  if (locale === "en") return en_nav_auth_sign_out();
  if (locale === "es") return es_nav_auth_sign_out();
  return "nav.auth.sign_out";
};
const en_setting_username_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `My username`;
  }
);
const es_setting_username_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Mi nombre de usuario`;
  }
);
const setting_username_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_username_label", locale);
  if (locale === "en") return en_setting_username_label();
  if (locale === "es") return es_setting_username_label();
  return "setting.username.label";
};
const en_setting_username_change_username = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Change your username`;
  }
);
const es_setting_username_change_username = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cambiar tu nombre de usuario`;
  }
);
const setting_username_change_username = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_username_change_username", locale);
  if (locale === "en") return en_setting_username_change_username();
  if (locale === "es") return es_setting_username_change_username();
  return "setting.username.change_username";
};
const en_setting_username_change_username_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `You can change your username at anytime. Your previous username becomes immediately available for use.`;
  }
);
const es_setting_username_change_username_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Puedes cambiar tu nombre de usuario en cualquier momento. Tu nombre de usuario anterior queda inmediatamente disponible para su uso.`;
  }
);
const setting_username_change_username_description = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_username_change_username_description", locale);
  if (locale === "en") return en_setting_username_change_username_description();
  if (locale === "es") return es_setting_username_change_username_description();
  return "setting.username.change_username_description";
};
const en_setting_username_current_username = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Current username`;
  }
);
const es_setting_username_current_username = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Nombre de usuario actual`;
  }
);
const setting_username_current_username = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_username_current_username", locale);
  if (locale === "en") return en_setting_username_current_username();
  if (locale === "es") return es_setting_username_current_username();
  return "setting.username.current_username";
};
const en_setting_username_new_username = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `New username`;
  }
);
const es_setting_username_new_username = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Nuevo nombre de usuario`;
  }
);
const setting_username_new_username = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_username_new_username", locale);
  if (locale === "en") return en_setting_username_new_username();
  if (locale === "es") return es_setting_username_new_username();
  return "setting.username.new_username";
};
const en_setting_username_username_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `e.g. 'giraffe08'`;
  }
);
const es_setting_username_username_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `ej. 'jirafa08'`;
  }
);
const setting_username_username_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_username_username_placeholder", locale);
  if (locale === "en") return en_setting_username_username_placeholder();
  if (locale === "es") return es_setting_username_username_placeholder();
  return "setting.username.username_placeholder";
};
const en_setting_username_error_unavailable = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `This username is currently unavailable for use.`;
  }
);
const es_setting_username_error_unavailable = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Este nombre de usuario no está disponible actualmente para su uso.`;
  }
);
const setting_username_error_unavailable = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_username_error_unavailable", locale);
  if (locale === "en") return en_setting_username_error_unavailable();
  if (locale === "es") return es_setting_username_error_unavailable();
  return "setting.username.error.unavailable";
};
const en_setting_username_error_in_use = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `You already use this username. Please choose a different one.`;
  }
);
const es_setting_username_error_in_use = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ya usas este nombre de usuario. Por favor, elige uno diferente.`;
  }
);
const setting_username_error_in_use = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_username_error_in_use", locale);
  if (locale === "en") return en_setting_username_error_in_use();
  if (locale === "es") return es_setting_username_error_in_use();
  return "setting.username.error.in_use";
};
const en_setting_email_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `My email`;
  }
);
const es_setting_email_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Mi correo electrónico`;
  }
);
const setting_email_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_email_label", locale);
  if (locale === "en") return en_setting_email_label();
  if (locale === "es") return es_setting_email_label();
  return "setting.email.label";
};
const en_setting_email_change_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Change your registered email`;
  }
);
const es_setting_email_change_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cambiar tu correo electrónico registrado`;
  }
);
const setting_email_change_email = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_email_change_email", locale);
  if (locale === "en") return en_setting_email_change_email();
  if (locale === "es") return es_setting_email_change_email();
  return "setting.email.change_email";
};
const en_setting_email_change_email_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter and different email and a verification code to update your account.`;
  }
);
const es_setting_email_change_email_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa un correo electrónico diferente y un código de verificación para actualizar tu cuenta.`;
  }
);
const setting_email_change_email_description = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_email_change_email_description", locale);
  if (locale === "en") return en_setting_email_change_email_description();
  if (locale === "es") return es_setting_email_change_email_description();
  return "setting.email.change_email_description";
};
const en_setting_email_current_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Current email`;
  }
);
const es_setting_email_current_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Correo electrónico actual`;
  }
);
const setting_email_current_email = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_email_current_email", locale);
  if (locale === "en") return en_setting_email_current_email();
  if (locale === "es") return es_setting_email_current_email();
  return "setting.email.current_email";
};
const en_setting_email_new_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `New email`;
  }
);
const es_setting_email_new_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Nuevo correo electrónico`;
  }
);
const setting_email_new_email = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_email_new_email", locale);
  if (locale === "en") return en_setting_email_new_email();
  if (locale === "es") return es_setting_email_new_email();
  return "setting.email.new_email";
};
const en_setting_email_email_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `e.g. anne@example.com`;
  }
);
const es_setting_email_email_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `ej. ana@ejemplo.com`;
  }
);
const setting_email_email_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_email_email_placeholder", locale);
  if (locale === "en") return en_setting_email_email_placeholder();
  if (locale === "es") return es_setting_email_email_placeholder();
  return "setting.email.email_placeholder";
};
const en_setting_email_error_unavailable = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `This email is currently unavailable for use.`;
  }
);
const es_setting_email_error_unavailable = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Este correo electrónico no está disponible actualmente para su uso.`;
  }
);
const setting_email_error_unavailable = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_email_error_unavailable", locale);
  if (locale === "en") return en_setting_email_error_unavailable();
  if (locale === "es") return es_setting_email_error_unavailable();
  return "setting.email.error.unavailable";
};
const en_setting_email_error_existing = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Please provide a different email address.`;
  }
);
const es_setting_email_error_existing = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Por favor, proporciona una dirección de correo electrónico diferente.`;
  }
);
const setting_email_error_existing = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_email_error_existing", locale);
  if (locale === "en") return en_setting_email_error_existing();
  if (locale === "es") return es_setting_email_error_existing();
  return "setting.email.error.existing";
};
const en_setting_password_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `My password`;
  }
);
const es_setting_password_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Mi contraseña`;
  }
);
const setting_password_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_password_label", locale);
  if (locale === "en") return en_setting_password_label();
  if (locale === "es") return es_setting_password_label();
  return "setting.password.label";
};
const en_setting_password_change_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Change your password`;
  }
);
const es_setting_password_change_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cambiar tu contraseña`;
  }
);
const setting_password_change_password = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_password_change_password", locale);
  if (locale === "en") return en_setting_password_change_password();
  if (locale === "es") return es_setting_password_change_password();
  return "setting.password.change_password";
};
const en_setting_password_change_password_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Your password should be unique and updated regularly.`;
  }
);
const es_setting_password_change_password_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Tu contraseña debe ser única y actualizarse regularmente.`;
  }
);
const setting_password_change_password_description = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_password_change_password_description", locale);
  if (locale === "en") return en_setting_password_change_password_description();
  if (locale === "es") return es_setting_password_change_password_description();
  return "setting.password.change_password_description";
};
const en_setting_password_current_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Current password`;
  }
);
const es_setting_password_current_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Contraseña actual`;
  }
);
const setting_password_current_password = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_password_current_password", locale);
  if (locale === "en") return en_setting_password_current_password();
  if (locale === "es") return es_setting_password_current_password();
  return "setting.password.current_password";
};
const en_setting_password_new_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `New password`;
  }
);
const es_setting_password_new_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Nueva contraseña`;
  }
);
const setting_password_new_password = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_password_new_password", locale);
  if (locale === "en") return en_setting_password_new_password();
  if (locale === "es") return es_setting_password_new_password();
  return "setting.password.new_password";
};
const en_setting_password_current_password_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter your current password`;
  }
);
const es_setting_password_current_password_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa tu contraseña actual`;
  }
);
const setting_password_current_password_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_password_current_password_placeholder", locale);
  if (locale === "en") return en_setting_password_current_password_placeholder();
  if (locale === "es") return es_setting_password_current_password_placeholder();
  return "setting.password.current_password_placeholder";
};
const en_setting_password_new_password_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter your new password`;
  }
);
const es_setting_password_new_password_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa tu nueva contraseña`;
  }
);
const setting_password_new_password_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_password_new_password_placeholder", locale);
  if (locale === "en") return en_setting_password_new_password_placeholder();
  if (locale === "es") return es_setting_password_new_password_placeholder();
  return "setting.password.new_password_placeholder";
};
const en_setting_password_error_incorrect = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Incorrect password. Please verify and try again.`;
  }
);
const es_setting_password_error_incorrect = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Contraseña incorrecta. Por favor, verifica e inténtalo de nuevo.`;
  }
);
const setting_password_error_incorrect = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_password_error_incorrect", locale);
  if (locale === "en") return en_setting_password_error_incorrect();
  if (locale === "es") return es_setting_password_error_incorrect();
  return "setting.password.error.incorrect";
};
const en_setting_danger_zone = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Danger zone`;
  }
);
const es_setting_danger_zone = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Zona de peligro`;
  }
);
const setting_danger_zone = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_danger_zone", locale);
  if (locale === "en") return en_setting_danger_zone();
  if (locale === "es") return es_setting_danger_zone();
  return "setting.danger_zone";
};
const en_setting_delete_account_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Delete my account`;
  }
);
const es_setting_delete_account_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Eliminar mi cuenta`;
  }
);
const setting_delete_account_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_label", locale);
  if (locale === "en") return en_setting_delete_account_label();
  if (locale === "es") return es_setting_delete_account_label();
  return "setting.delete_account.label";
};
const en_setting_delete_account_sublabel = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Permanently delete your account and any associated data`;
  }
);
const es_setting_delete_account_sublabel = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Eliminar permanentemente tu cuenta y cualquier dato asociado`;
  }
);
const setting_delete_account_sublabel = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_sublabel", locale);
  if (locale === "en") return en_setting_delete_account_sublabel();
  if (locale === "es") return es_setting_delete_account_sublabel();
  return "setting.delete_account.sublabel";
};
const en_setting_delete_account_your_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Delete your account`;
  }
);
const es_setting_delete_account_your_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Eliminar tu cuenta`;
  }
);
const setting_delete_account_your_account = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_your_account", locale);
  if (locale === "en") return en_setting_delete_account_your_account();
  if (locale === "es") return es_setting_delete_account_your_account();
  return "setting.delete_account.your_account";
};
const en_setting_delete_account_delete_account_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `We're sorry to see you go! Please provide any feedback you may have before departing so that we can better improve.`;
  }
);
const es_setting_delete_account_delete_account_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¡Lamentamos verte partir! Por favor, proporciona cualquier comentario que puedas tener antes de irte para que podamos mejorar.`;
  }
);
const setting_delete_account_delete_account_description = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_delete_account_description", locale);
  if (locale === "en") return en_setting_delete_account_delete_account_description();
  if (locale === "es") return es_setting_delete_account_delete_account_description();
  return "setting.delete_account.delete_account_description";
};
const en_setting_delete_account_alert_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Are you sure you want to proceed?`;
  }
);
const es_setting_delete_account_alert_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¿Estás seguro de que quieres continuar?`;
  }
);
const setting_delete_account_alert_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_alert_title", locale);
  if (locale === "en") return en_setting_delete_account_alert_title();
  if (locale === "es") return es_setting_delete_account_alert_title();
  return "setting.delete_account.alert_title";
};
const en_setting_delete_account_alert_subtitle = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Your profile and all of your data will be permanently deleted. This action cannot be recovered from.`;
  }
);
const es_setting_delete_account_alert_subtitle = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Tu perfil y todos tus datos serán eliminados permanentemente. Esta acción no se puede recuperar.`;
  }
);
const setting_delete_account_alert_subtitle = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_alert_subtitle", locale);
  if (locale === "en") return en_setting_delete_account_alert_subtitle();
  if (locale === "es") return es_setting_delete_account_alert_subtitle();
  return "setting.delete_account.alert_subtitle";
};
const en_setting_delete_account_reason = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Reason`;
  }
);
const es_setting_delete_account_reason = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Razón`;
  }
);
const setting_delete_account_reason = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_reason", locale);
  if (locale === "en") return en_setting_delete_account_reason();
  if (locale === "es") return es_setting_delete_account_reason();
  return "setting.delete_account.reason";
};
const en_setting_delete_account_reason_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Why are you deleting your account?`;
  }
);
const es_setting_delete_account_reason_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¿Por qué estás eliminando tu cuenta?`;
  }
);
const setting_delete_account_reason_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_reason_placeholder", locale);
  if (locale === "en") return en_setting_delete_account_reason_placeholder();
  if (locale === "es") return es_setting_delete_account_reason_placeholder();
  return "setting.delete_account.reason_placeholder";
};
const en_setting_delete_account_addition_details = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Additional details`;
  }
);
const es_setting_delete_account_addition_details = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Detalles adicionales`;
  }
);
const setting_delete_account_addition_details = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_addition_details", locale);
  if (locale === "en") return en_setting_delete_account_addition_details();
  if (locale === "es") return es_setting_delete_account_addition_details();
  return "setting.delete_account.addition_details";
};
const en_setting_delete_account_addition_details_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Do you have any additional feedback?`;
  }
);
const es_setting_delete_account_addition_details_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¿Tienes algún comentario adicional?`;
  }
);
const setting_delete_account_addition_details_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_addition_details_placeholder", locale);
  if (locale === "en") return en_setting_delete_account_addition_details_placeholder();
  if (locale === "es") return es_setting_delete_account_addition_details_placeholder();
  return "setting.delete_account.addition_details_placeholder";
};
const en_setting_delete_account_confirm_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Confirm your email`;
  }
);
const es_setting_delete_account_confirm_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Confirma tu correo electrónico`;
  }
);
const setting_delete_account_confirm_email = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_confirm_email", locale);
  if (locale === "en") return en_setting_delete_account_confirm_email();
  if (locale === "es") return es_setting_delete_account_confirm_email();
  return "setting.delete_account.confirm_email";
};
const en_setting_delete_account_error_not_found = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `The email entered doesn't match your account. Please check and try again.`;
  }
);
const es_setting_delete_account_error_not_found = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `El correo electrónico ingresado no coincide con tu cuenta. Por favor, verifica e inténtalo de nuevo.`;
  }
);
const setting_delete_account_error_not_found = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_delete_account_error_not_found", locale);
  if (locale === "en") return en_setting_delete_account_error_not_found();
  if (locale === "es") return es_setting_delete_account_error_not_found();
  return "setting.delete_account.error.not_found";
};
const en_setting_buttons_update = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Update`;
  }
);
const es_setting_buttons_update = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Actualizar`;
  }
);
const setting_buttons_update = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_buttons_update", locale);
  if (locale === "en") return en_setting_buttons_update();
  if (locale === "es") return es_setting_buttons_update();
  return "setting.buttons.update";
};
const en_setting_buttons_updating = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Updating...`;
  }
);
const es_setting_buttons_updating = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Actualizando...`;
  }
);
const setting_buttons_updating = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_buttons_updating", locale);
  if (locale === "en") return en_setting_buttons_updating();
  if (locale === "es") return es_setting_buttons_updating();
  return "setting.buttons.updating";
};
const en_setting_buttons_delete_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Delete my account`;
  }
);
const es_setting_buttons_delete_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Eliminar mi cuenta`;
  }
);
const setting_buttons_delete_account = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_buttons_delete_account", locale);
  if (locale === "en") return en_setting_buttons_delete_account();
  if (locale === "es") return es_setting_buttons_delete_account();
  return "setting.buttons.delete_account";
};
const en_setting_buttons_cleaning = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cleaning up...`;
  }
);
const es_setting_buttons_cleaning = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Limpiando...`;
  }
);
const setting_buttons_cleaning = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_buttons_cleaning", locale);
  if (locale === "en") return en_setting_buttons_cleaning();
  if (locale === "es") return es_setting_buttons_cleaning();
  return "setting.buttons.cleaning";
};
const en_setting_buttons_goodbuy = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Goodbye!`;
  }
);
const es_setting_buttons_goodbuy = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¡Adiós!`;
  }
);
const setting_buttons_goodbuy = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_buttons_goodbuy", locale);
  if (locale === "en") return en_setting_buttons_goodbuy();
  if (locale === "es") return es_setting_buttons_goodbuy();
  return "setting.buttons.goodbuy";
};
const en_setting_buttons_verify = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verify`;
  }
);
const es_setting_buttons_verify = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verificar`;
  }
);
const setting_buttons_verify = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_buttons_verify", locale);
  if (locale === "en") return en_setting_buttons_verify();
  if (locale === "es") return es_setting_buttons_verify();
  return "setting.buttons.verify";
};
const en_setting_buttons_verifying = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verifying...`;
  }
);
const es_setting_buttons_verifying = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verificando...`;
  }
);
const setting_buttons_verifying = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_buttons_verifying", locale);
  if (locale === "en") return en_setting_buttons_verifying();
  if (locale === "es") return es_setting_buttons_verifying();
  return "setting.buttons.verifying";
};
const en_setting_buttons_change_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Change email`;
  }
);
const es_setting_buttons_change_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cambiar correo electrónico`;
  }
);
const setting_buttons_change_email = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_buttons_change_email", locale);
  if (locale === "en") return en_setting_buttons_change_email();
  if (locale === "es") return es_setting_buttons_change_email();
  return "setting.buttons.change_email";
};
function Dialog_description($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Dialog_description$1($$payload2, spread_props([
      {
        class: cn("text-sm text-muted-foreground", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Alert_description($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes(
    {
      class: clsx(cn("text-sm [&_p]:leading-relaxed", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Alert_title($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    level = 5,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes(
    {
      role: "heading",
      "aria-level": level,
      class: clsx(cn("mb-1 font-medium leading-none tracking-tight", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
const alertVariants = ce({
  base: "[&>svg]:text-foreground relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
  variants: {
    variant: {
      default: "bg-background text-foreground",
      destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
    }
  },
  defaultVariants: { variant: "default" }
});
function Alert($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    variant = "default",
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes(
    {
      class: clsx(cn(alertVariants({ variant }), className)),
      ...restProps,
      role: "alert"
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Textarea($$payload, $$props) {
  push();
  let {
    ref = null,
    value = void 0,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<textarea${spread_attributes(
    {
      class: clsx(cn("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)),
      ...restProps
    },
    null
  )}>`;
  const $$body = escape_html(value);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea>`;
  bind_props($$props, { ref, value });
  pop();
}
function Delete_account_form($$payload, $$props) {
  push();
  var $$store_subs;
  let { preValidatedForm, onClose } = $$props;
  const userContext = getContext("myUserContext");
  const currentEmail = userContext.myEmail;
  let isLoading = false;
  let isSuccess = false;
  let hasStepError = true;
  const DEBOUNCE_DELAY = 500;
  const debounceFormValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      const result = await validateForm({ update: true, focusOnError: true });
      hasStepError = !result.valid;
      if (result.valid && store_get($$store_subs ??= {}, "$formData", formData).confirmEmail !== currentEmail) {
        hasStepError = true;
        updateFormErrors("confirmEmail", /* @__PURE__ */ setting_delete_account_error_not_found());
      }
    } catch (error) {
      console.error("Error validating form input:", error);
    }
  });
  const form = superForm(preValidatedForm, {
    validators: zodClient(deleteAccountFormSchema),
    validationMethod: "submit-only",
    dataType: "json",
    resetForm: true,
    async onChange() {
      if (!store_get($$store_subs ??= {}, "$formData", formData).confirmEmail) return;
      await debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      await deleteMyAccount();
    }
  });
  const {
    form: formData,
    delayed,
    enhance,
    errors,
    validateForm
  } = form;
  const updateFormErrors = (field, message) => {
    errors.update((errors2) => {
      const newErrors = { ...errors2, [field]: [message] };
      return newErrors;
    });
  };
  onDestroy(() => {
    debounceFormValidation.cancel();
  });
  const deleteMyAccount = async () => {
    try {
      isLoading = true;
      const response = await userContext.deleteMyUser(store_get($$store_subs ??= {}, "$formData", formData).reason, store_get($$store_subs ??= {}, "$formData", formData).description);
      if (response !== true) {
        console.error("DeleteAccountForm.deleteMyAccount: error deleting user account:", { result: response });
        updateFormErrors("confirmEmail", "Failed to delete account");
        return;
      }
      isSuccess = true;
      setTimeout(
        () => {
          goto("/");
        },
        1e3
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      updateFormErrors("confirmEmail", translate(AppUiMessage.systemError));
      return;
    } finally {
      isLoading = false;
    }
  };
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<form method="POST" class="flex flex-1 flex-col space-y-8 overflow-hidden px-2"><div class="space-y-4"><!---->`;
    Alert($$payload2, {
      variant: "destructive",
      class: "mb-4",
      children: ($$payload3) => {
        Triangle_alert($$payload3, { class: "h-4 w-4" });
        $$payload3.out += `<!----> <!---->`;
        Alert_title($$payload3, {
          children: ($$payload4) => {
            $$payload4.out += `<!---->${escape_html(/* @__PURE__ */ setting_delete_account_alert_title())}`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Alert_description($$payload3, {
          children: ($$payload4) => {
            $$payload4.out += `<!---->${escape_html(/* @__PURE__ */ setting_delete_account_alert_subtitle())}`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> <!---->`;
    Form_field($$payload2, {
      form,
      name: "reason",
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        {
          let children = function($$payload4, { props }) {
            $$payload4.out += `<!---->`;
            Form_label($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ setting_delete_account_reason())}`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            Input($$payload4, spread_props([
              props,
              {
                id: "reason",
                type: "text",
                placeholder: /* @__PURE__ */ setting_delete_account_reason_placeholder(),
                get value() {
                  return store_get($$store_subs ??= {}, "$formData", formData).reason;
                },
                set value($$value) {
                  store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).reason = $$value);
                  $$settled = false;
                }
              }
            ]));
            $$payload4.out += `<!---->`;
          };
          Control($$payload3, { children });
        }
        $$payload3.out += `<!----> <!---->`;
        Form_field_errors($$payload3, {});
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> <!---->`;
    Form_field($$payload2, {
      form,
      name: "description",
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        {
          let children = function($$payload4, { props }) {
            $$payload4.out += `<!---->`;
            Form_label($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->${escape_html(/* @__PURE__ */ setting_delete_account_addition_details())}`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            Textarea($$payload4, spread_props([
              props,
              {
                id: "description",
                placeholder: /* @__PURE__ */ setting_delete_account_addition_details_placeholder(),
                rows: 3,
                get value() {
                  return store_get($$store_subs ??= {}, "$formData", formData).description;
                },
                set value($$value) {
                  store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).description = $$value);
                  $$settled = false;
                }
              }
            ]));
            $$payload4.out += `<!---->`;
          };
          Control($$payload3, { children });
        }
        $$payload3.out += `<!----> <!---->`;
        Form_field_errors($$payload3, {});
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Form_ident_input($$payload2, {
      form,
      fieldName: "confirmEmail",
      label: /* @__PURE__ */ setting_delete_account_confirm_email(),
      placeholder: currentEmail || ""
    });
    $$payload2.out += `<!----></div> `;
    Form_button($$payload2, {
      variant: "destructive",
      disabled: isLoading || store_get($$store_subs ??= {}, "$delayed", delayed) || hasStepError,
      isLoading,
      isSuccess,
      buttonText: /* @__PURE__ */ setting_buttons_delete_account(),
      loadingText: /* @__PURE__ */ setting_buttons_cleaning(),
      successText: /* @__PURE__ */ setting_buttons_goodbuy()
    });
    $$payload2.out += `<!----> `;
    Button($$payload2, {
      variant: "outline",
      onclick: onClose,
      children: ($$payload3) => {
        $$payload3.out += `<!---->${escape_html(setting_buttons_cancel())}`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></form>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Settings_dialog($$payload, $$props) {
  push();
  let {
    label = "",
    sublabel = "",
    title = "",
    subtitle = "",
    dialogContentClass = "",
    destructive = false,
    showContent = false,
    onClose = void 0,
    children
  } = $$props;
  const hoverColor = destructive ? "bg-destructive/10" : "bg-muted/50";
  const textColor = destructive ? "text-destructive" : "";
  $$payload.out += `<!---->`;
  Root($$payload, {
    open: showContent,
    onOpenChange: (open) => {
      showContent = open;
    },
    children: ($$payload2) => {
      $$payload2.out += `<!---->`;
      Trigger($$payload2, {
        class: `group flex w-full items-center justify-between rounded-lg border-b border-muted-foreground/30 p-4 hover:${hoverColor} ${textColor}`,
        children: ($$payload3) => {
          $$payload3.out += `<div class="flex flex-col text-left sm:flex-row sm:items-center sm:gap-2"><p class="text-sm font-medium">${escape_html(label)}</p></div> <div class="flex items-center gap-2"><p class="text-right text-sm opacity-70 group-hover:opacity-100">${escape_html(sublabel)}</p> `;
          Chevron_right($$payload3, {
            class: "h-5 w-5 stroke-[2] opacity-70 transition-opacity group-hover:opacity-100"
          });
          $$payload3.out += `<!----></div>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> <!---->`;
      Dialog_content($$payload2, {
        class: `flex max-h-[80vh] w-[calc(100vw-2rem)] flex-col rounded-lg md:w-full ${dialogContentClass}`,
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Dialog_header($$payload3, {
            class: "space-y-2 px-2",
            children: ($$payload4) => {
              $$payload4.out += `<!---->`;
              Dialog_title($$payload4, {
                class: "text-xl font-semibold",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(title)}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!----> <!---->`;
              Dialog_description($$payload4, {
                class: "text-base text-muted-foreground",
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(subtitle)}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> <div class="flex-1 overflow-auto px-2 py-4">`;
          children?.($$payload3);
          $$payload3.out += `<!----></div>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!---->`;
  bind_props($$props, { showContent });
  pop();
}
function Update_email_form($$payload, $$props) {
  push();
  var $$store_subs;
  let { preValidatedForm, onClose } = $$props;
  const userContext = getContext("myUserContext");
  const currentEmail = userContext.myEmail;
  let step = 1;
  let isLoading = false;
  let awaitingTokenVerification = false;
  let isSuccess = false;
  let hasStepError = true;
  let canResend = false;
  let resendTimer = 30;
  let timerInterval;
  let otpHandler = void 0;
  let msaId = void 0;
  const RESEND_TIMER_DURATION = 30;
  const DEBOUNCE_DELAY = 500;
  const tokenFieldName = "token";
  const emailFieldName = "email";
  const steps = [
    zod(emailFormSchemaFirstStep),
    zod(emailFormSchemaLastStep)
  ];
  const getCurrentValidator = () => steps[step - 1];
  const debounceFormValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      const validationResult = await validateForm({ update: true, focusOnError: false });
      if (validationResult.valid && step === 1) {
        const available = await checkIdentAvailability();
        hasStepError = !available;
      } else {
        hasStepError = !validationResult.valid;
      }
    } catch (error) {
      console.error("Error validating form input:", error);
    }
  });
  const form = superForm(preValidatedForm, {
    dataType: "json",
    validators: getCurrentValidator(),
    resetForm: true,
    validationMethod: "submit-only",
    async onChange() {
      debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      if (step === 1) {
        await registerNewEmail();
      } else {
        await verifyEmailToken();
      }
    }
  });
  const {
    form: formData,
    enhance,
    errors,
    options,
    delayed,
    validateForm
  } = form;
  const buttonText = step === 1 ? /* @__PURE__ */ setting_buttons_update() : /* @__PURE__ */ setting_buttons_verify();
  const loadingText = step === 1 ? /* @__PURE__ */ setting_buttons_updating() : /* @__PURE__ */ setting_buttons_verifying();
  const disabled = isLoading || store_get($$store_subs ??= {}, "$delayed", delayed) || hasStepError;
  const updateFormErrors = (field, message) => {
    errors.update((errors2) => {
      const newErrors = { ...errors2, [field]: [message] };
      return newErrors;
    });
  };
  const checkIdentAvailability = async () => {
    if (!store_get($$store_subs ??= {}, "$formData", formData).email) return false;
    if (store_get($$store_subs ??= {}, "$formData", formData).email === currentEmail) {
      updateFormErrors(emailFieldName, /* @__PURE__ */ setting_email_error_existing());
      return false;
    }
    const message = /* @__PURE__ */ setting_email_error_unavailable();
    try {
      const response = await userContext.isUserIdentAvailable(store_get($$store_subs ??= {}, "$formData", formData).email, UserIdentType.email);
      if (response.error) {
        updateFormErrors(emailFieldName, response.error);
        return false;
      }
      if (!response.isAvailable) {
        updateFormErrors(emailFieldName, message);
        return false;
      }
      return response.isAvailable;
    } catch (error) {
      updateFormErrors(emailFieldName, translate(AppUiMessage.systemError));
      return false;
    }
  };
  const updateEmail = async (email) => {
    isLoading = true;
    try {
      const result = await userContext.updateMyUser({ email });
      if (result.error) {
        updateFormErrors(emailFieldName, result.error);
        return;
      }
      isSuccess = true;
      setTimeout(
        () => {
          return onClose && onClose();
        },
        1e3
      );
    } catch (error) {
      updateFormErrors(emailFieldName, error instanceof Error ? error.message : "Failed to update email");
      return;
    } finally {
      isLoading = false;
    }
  };
  const registerNewEmail = async () => {
    isLoading = true;
    try {
      const verificationResponse = await userContext.verifyMyEmail(store_get($$store_subs ??= {}, "$formData", formData).email);
      if (!verificationResponse || verificationResponse?.error || !verificationResponse.object || verificationResponse.object.error || !verificationResponse?.object.actionProgress?.actionId || !verificationResponse?.object.run) {
        console.error("UpdateEmailForm.registerNewEmail: verifyMyEmail failed.", { verificationResponse });
        updateFormErrors(emailFieldName, translate(AppUiMessage.systemError));
        return;
      }
      startResendTimer();
      msaId = verificationResponse.object.actionProgress.actionId;
      const onNotificationSent = () => {
        step = 2;
        hasStepError = true;
        isLoading = false;
      };
      const onFailure = () => {
        if (awaitingTokenVerification && otpHandler) {
          console.error("onFailure");
          updateFormErrors("token", otpHandler.getErrorMessage());
          hasStepError = true;
          awaitingTokenVerification = false;
          isLoading = false;
        }
      };
      const onSuccess = async () => {
        await updateEmail(store_get($$store_subs ??= {}, "$formData", formData).email);
      };
      otpHandler = new MsaListenerHandler("UpdateEmailForm", verificationResponse, onNotificationSent, onFailure, onSuccess);
    } catch (error) {
      console.error("UpdateEmailForm.registerNewEmail:", { error });
      updateFormErrors(emailFieldName, translate(AppUiMessage.systemError));
    } finally {
    }
  };
  const verifyEmailToken = async () => {
    try {
      if (!msaId) {
        console.error("SignInForm.handleVerifyOtp: actionId missing:");
        updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
        return;
      }
      isLoading = true;
      awaitingTokenVerification = true;
      const response = await userContext.verifyMultiStepActionToken(msaId, store_get($$store_subs ??= {}, "$formData", formData).token);
      if (response !== true) {
        console.error("UpdateEmailForm.handleVerifyOtp: invalid response:", { result: response });
        updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
        return;
      }
    } catch (error) {
      console.error("UpdateEmailForm.handleVerifyOtp: error:", { error });
      updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
    } finally {
    }
  };
  const resendToken = async () => {
    if (!msaId) {
      console.error("UpdateEmailDialog.handleResendOtp: actionId missing.");
      updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
      return;
    }
    try {
      isLoading = true;
      const response = await userContext.sendMultiStepActionNotification(msaId, store_get($$store_subs ??= {}, "$formData", formData).email);
      if (typeof response === "string") {
        console.error("UpdateEmailDialog.handleResendOtp: error:", { error: response });
        updateFormErrors(tokenFieldName, response);
        return;
      }
      startResendTimer();
    } catch (error) {
      console.error("UpdateEmailDialog.resendToken: error:", { error });
      updateFormErrors(tokenFieldName, translate(AppUiMessage.systemError));
    } finally {
      isLoading = false;
    }
  };
  const startResendTimer = () => {
    resendTimer = RESEND_TIMER_DURATION;
    canResend = false;
    clearInterval(timerInterval);
    timerInterval = setInterval(
      () => {
        resendTimer -= 1;
        if (resendTimer <= 0) {
          clearInterval(timerInterval);
          canResend = true;
        }
      },
      1e3
    );
  };
  onDestroy(() => {
    clearInterval(timerInterval);
    if (otpHandler) otpHandler.removeListener();
    debounceFormValidation.cancel();
  });
  $$payload.out += `<form method="POST" class="flex flex-1 flex-col space-y-8 overflow-hidden px-2">`;
  if (step === 1) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="space-y-4"><div class="space-y-2"><label for="current-email" class="text-sm font-medium leading-none">${escape_html(/* @__PURE__ */ setting_email_current_email())}</label> `;
    Input($$payload, {
      id: "current-email",
      value: currentEmail,
      disabled: true,
      class: "bg-muted"
    });
    $$payload.out += `<!----></div> `;
    Form_ident_input($$payload, {
      form,
      fieldName: "email",
      placeholder: /* @__PURE__ */ setting_email_email_placeholder(),
      label: /* @__PURE__ */ setting_email_new_email(),
      isLoading
    });
    $$payload.out += `<!----></div>`;
  } else if (step === 2) {
    $$payload.out += "<!--[1-->";
    Form_otp_input($$payload, {
      form,
      fieldName: "token",
      label: verify_token_verification_code(),
      length: 6,
      showResend: true,
      canResend,
      resendTimer,
      onResendClick: resendToken,
      showBackButton: true,
      backButtonLabel: /* @__PURE__ */ setting_buttons_change_email(),
      onBackButtonClick: () => {
        step = 1;
        hasStepError = false;
        formData.update((data) => {
          return { email: data.email, token: "" };
        });
      }
    });
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col space-y-2">`;
  Form_button($$payload, {
    disabled,
    isLoading,
    isSuccess,
    buttonText,
    loadingText
  });
  $$payload.out += `<!----> `;
  Button($$payload, {
    variant: "outline",
    onclick: onClose,
    children: ($$payload2) => {
      $$payload2.out += `<!---->${escape_html(setting_buttons_cancel())}`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></form>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Update_password_form($$payload, $$props) {
  push();
  var $$store_subs;
  let { preValidatedForm, onClose } = $$props;
  const userContext = getContext("myUserContext");
  let isLoading = false;
  let isSuccess = false;
  let hasStepError = true;
  const DEBOUNCE_DELAY = 500;
  const debounceFormValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      isLoading = true;
      const currentPasswordValidation = currentPasswordSchema.safeParse(store_get($$store_subs ??= {}, "$formData", formData).currentPassword);
      if (currentPasswordValidation.error) {
        hasStepError = true;
        updateFormErrors("currentPassword", currentPasswordValidation.error?.errors[0].message);
        return;
      }
      const formValidation = await validateForm({ update: true, focusOnError: false });
      hasStepError = !formValidation.valid;
    } catch (error) {
      console.error("Error validating form input:", error);
    } finally {
      isLoading = false;
    }
  });
  const form = superForm(preValidatedForm, {
    validators: zod(passwordFormSchema),
    validationMethod: "submit-only",
    dataType: "json",
    async onChange() {
      await debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      await updatePassword();
    }
  });
  const {
    form: formData,
    delayed,
    enhance,
    errors,
    validateForm
  } = form;
  const updateFormErrors = (field, message) => {
    errors.update((errors2) => {
      const newErrors = { ...errors2, [field]: [message] };
      return newErrors;
    });
  };
  onDestroy(() => {
    debounceFormValidation.cancel();
  });
  const verifyCurrentPassword = async () => {
    isLoading = true;
    try {
      const verifyMyPasswordResponse = await userContext.verifyMyPassword(store_get($$store_subs ??= {}, "$formData", formData).currentPassword);
      if (verifyMyPasswordResponse.object?.toString() === "false") {
        console.error("Incorrect password", { verifyMyPasswordResponse });
        updateFormErrors("currentPassword", /* @__PURE__ */ setting_password_error_incorrect());
        return false;
      }
      if (verifyMyPasswordResponse.error) {
        console.error("Failed to verify password:", { verifyMyPasswordResponse });
        updateFormErrors("currentPassword", verifyMyPasswordResponse.error || AppUiMessage.systemError);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error verifying password:", error);
      updateFormErrors("currentPassword", error instanceof Error ? error.message : "Failed to verify password");
      return false;
    } finally {
      isLoading = false;
    }
  };
  const updatePassword = async () => {
    try {
      isLoading = true;
      const currentPasswordValidation = await verifyCurrentPassword();
      if (!currentPasswordValidation) return;
      const result = await userContext.updateMyPassword(store_get($$store_subs ??= {}, "$formData", formData).currentPassword, store_get($$store_subs ??= {}, "$formData", formData).newPassword);
      if (typeof result === "string") {
        console.error("UpdatePasswordForm.updatePassword: error:", { error: result });
        updateFormErrors("newPassword", result);
        return false;
      }
      isSuccess = true;
      setTimeout(
        () => {
          return onClose && onClose();
        },
        1e3
      );
    } catch (error) {
      console.error("Error updating password:", error);
      updateFormErrors("newPassword", error instanceof Error ? error.message : "Failed to update password");
      return;
    } finally {
    }
  };
  $$payload.out += `<form method="POST" class="flex flex-1 flex-col space-y-8 overflow-hidden px-2"><div class="space-y-4">`;
  Form_password_input($$payload, {
    form,
    fieldName: "currentPassword",
    label: /* @__PURE__ */ setting_password_current_password(),
    placeholder: /* @__PURE__ */ setting_password_current_password_placeholder()
  });
  $$payload.out += `<!----> `;
  Form_password_input($$payload, {
    form,
    fieldName: "newPassword",
    label: /* @__PURE__ */ setting_password_new_password(),
    placeholder: /* @__PURE__ */ setting_password_new_password_placeholder()
  });
  $$payload.out += `<!----></div> <div class="flex flex-col space-y-2">`;
  Form_button($$payload, {
    disabled: isLoading || store_get($$store_subs ??= {}, "$delayed", delayed) || hasStepError,
    isLoading,
    isSuccess,
    buttonText: /* @__PURE__ */ setting_buttons_update(),
    loadingText: /* @__PURE__ */ setting_buttons_updating()
  });
  $$payload.out += `<!----> `;
  Button($$payload, {
    variant: "outline",
    onclick: onClose,
    children: ($$payload2) => {
      $$payload2.out += `<!---->${escape_html(setting_buttons_cancel())}`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></form>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Update_username_form($$payload, $$props) {
  push();
  var $$store_subs;
  let { preValidatedForm, onClose } = $$props;
  const userContext = getContext("myUserContext");
  const currentEmail = userContext.myEmail;
  const currentUsername = userContext.myUserHandle;
  let hasStepError = true;
  let isLoading = false;
  let isSuccess = false;
  let identType = UserIdentType.userHandle;
  const DEBOUNCE_DELAY = 350;
  const debounceFormValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      if (!store_get($$store_subs ??= {}, "$formData", formData).username) return;
      const result = await validateForm({ update: true, focusOnError: false });
      const availability = await checkUsernameAvailability();
      hasStepError = !availability || !result.valid;
    } catch (error) {
      console.error("Error debouncing the form input:", error);
    }
  });
  const form = superForm(preValidatedForm, {
    validators: zod(usernameFormSchema),
    resetForm: true,
    dataType: "json",
    validationMethod: "submit-only",
    async onChange() {
      await debounceFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      await saveUsername();
    }
  });
  const {
    form: formData,
    delayed,
    enhance,
    errors,
    validateForm
  } = form;
  const updateFormErrors = (field, message) => {
    errors.update((errors2) => {
      const newErrors = { ...errors2, [field]: [message] };
      return newErrors;
    });
  };
  const checkUsernameAvailability = async () => {
    isLoading = true;
    const fieldName = "username";
    if (store_get($$store_subs ??= {}, "$formData", formData).username === userContext.myUserHandle) {
      isLoading = false;
      updateFormErrors(fieldName, /* @__PURE__ */ setting_username_error_in_use());
      return false;
    }
    const validationResult = usernameFormSchema.safeParse(store_get($$store_subs ??= {}, "$formData", formData));
    if (!validationResult.success) {
      isLoading = false;
      return false;
    }
    let message = /* @__PURE__ */ setting_username_error_unavailable();
    try {
      const response = await userContext.isUserIdentAvailable(store_get($$store_subs ??= {}, "$formData", formData).username, identType);
      if (response.error) {
        updateFormErrors(fieldName, response.error);
        return false;
      }
      if (!response.isAvailable) {
        updateFormErrors(fieldName, message);
        return false;
      }
      return response.isAvailable;
    } catch (error) {
      console.error("UpdateEmailDialog.checkIdentAvailability:", { error });
      updateFormErrors(fieldName, translate(AppUiMessage.systemError));
      return false;
    } finally {
      isLoading = false;
    }
  };
  const getSuggestedUsername = async () => {
    if (!currentEmail) return;
    try {
      const result = await userContext.findAvailableUserHandle(currentEmail);
      if (result && typeof result === "object" && "object" in result) {
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).username = result.object ?? "");
      } else if (typeof result === "string") {
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).username = result);
      }
    } catch (error) {
      console.error("Error getting suggested handle:", error);
      updateFormErrors("username", error instanceof Error ? error.message : "Failed to find handle");
    }
  };
  const handleUsernameChange = async () => {
    try {
      isLoading = true;
      const result = await userContext.updateMyUser({
        userHandle: store_get($$store_subs ??= {}, "$formData", formData).username
      });
      if (result.error) {
        updateFormErrors("username", result.error);
        return false;
      }
      return true;
    } catch (error) {
      updateFormErrors("username", error instanceof Error ? error.message : "Failed to find handle");
      console.error("Error updating username:", error);
      return false;
    }
  };
  const saveUsername = async () => {
    try {
      isLoading = true;
      const success = await handleUsernameChange();
      if (success) {
        isSuccess = true;
        setTimeout(
          () => {
            return onClose && onClose();
          },
          1e3
        );
      }
    } catch (error) {
      console.error("Error saving username:", error);
      updateFormErrors("username", error instanceof Error ? error.message : "Failed to save username");
    } finally {
      isLoading = false;
    }
  };
  onDestroy(() => {
    debounceFormValidation.cancel();
  });
  $$payload.out += `<form method="POST" class="flex flex-1 flex-col space-y-8 overflow-hidden px-2"><div class="space-y-4"><div class="space-y-2"><label for="current-username" class="text-sm font-medium leading-none">${escape_html(/* @__PURE__ */ setting_username_current_username())}</label> `;
  Input($$payload, {
    id: "current-username",
    value: currentUsername,
    disabled: true,
    class: "bg-muted"
  });
  $$payload.out += `<!----></div> `;
  Form_ident_input($$payload, {
    form,
    fieldName: "username",
    placeholder: /* @__PURE__ */ setting_username_username_placeholder(),
    label: /* @__PURE__ */ setting_username_new_username(),
    identType,
    isLoading,
    suggestUsername: getSuggestedUsername
  });
  $$payload.out += `<!----></div> <div class="flex flex-col space-y-2">`;
  Form_button($$payload, {
    disabled: isLoading || store_get($$store_subs ??= {}, "$delayed", delayed) || hasStepError,
    isLoading,
    isSuccess,
    buttonText: /* @__PURE__ */ setting_buttons_update(),
    loadingText: /* @__PURE__ */ setting_buttons_updating()
  });
  $$payload.out += `<!----> `;
  Button($$payload, {
    variant: "outline",
    onclick: onClose,
    children: ($$payload2) => {
      $$payload2.out += `<!---->${escape_html(setting_buttons_cancel())}`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div></form>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Account_settings($$payload, $$props) {
  push();
  let { data } = $$props;
  const userContext = getContext("myUserContext");
  const myUser = userContext.myUser;
  let showUpdateUsernameDialog = false;
  let showUpdateEmailDialog = false;
  let showUpdatePasswordDialog = false;
  let showDeleteAccountDialog = false;
  const resetDialogStates = () => {
    showUpdateUsernameDialog = false;
    showUpdateEmailDialog = false;
    showUpdatePasswordDialog = false;
    showDeleteAccountDialog = false;
  };
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="space-y-8 py-8"><h4 class="font-lexend text-lg font-bold">${escape_html(setting_account())}</h4> <div class="space-y-4">`;
    Settings_dialog($$payload2, {
      label: /* @__PURE__ */ setting_username_label(),
      sublabel: myUser?.userHandle || "",
      title: /* @__PURE__ */ setting_username_change_username(),
      subtitle: /* @__PURE__ */ setting_username_change_username_description(),
      get showContent() {
        return showUpdateUsernameDialog;
      },
      set showContent($$value) {
        showUpdateUsernameDialog = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        Update_username_form($$payload3, {
          preValidatedForm: data.accountForms.usernameForm,
          onClose: resetDialogStates
        });
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Settings_dialog($$payload2, {
      label: /* @__PURE__ */ setting_email_label(),
      sublabel: myUser?.email || "",
      title: /* @__PURE__ */ setting_email_change_email(),
      subtitle: /* @__PURE__ */ setting_email_change_email_description(),
      get showContent() {
        return showUpdateEmailDialog;
      },
      set showContent($$value) {
        showUpdateEmailDialog = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        Update_email_form($$payload3, {
          preValidatedForm: data.accountForms.emailForm,
          onClose: resetDialogStates
        });
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> `;
    Settings_dialog($$payload2, {
      label: /* @__PURE__ */ setting_password_label(),
      sublabel: "********",
      title: /* @__PURE__ */ setting_password_change_password(),
      subtitle: /* @__PURE__ */ setting_password_change_password_description(),
      get showContent() {
        return showUpdatePasswordDialog;
      },
      set showContent($$value) {
        showUpdatePasswordDialog = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        Update_password_form($$payload3, {
          preValidatedForm: data.accountForms.passwordForm,
          onClose: resetDialogStates
        });
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div> <br/> <h4 class="font-lexend text-lg font-bold">${escape_html(/* @__PURE__ */ setting_danger_zone())}</h4> <div class="flex cursor-pointer items-center justify-between rounded-lg hover:bg-muted/50">`;
    Settings_dialog($$payload2, {
      label: /* @__PURE__ */ setting_delete_account_label(),
      sublabel: /* @__PURE__ */ setting_delete_account_sublabel(),
      title: /* @__PURE__ */ setting_delete_account_your_account(),
      subtitle: /* @__PURE__ */ setting_delete_account_delete_account_description(),
      destructive: true,
      get showContent() {
        return showDeleteAccountDialog;
      },
      set showContent($$value) {
        showDeleteAccountDialog = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        Delete_account_form($$payload3, {
          preValidatedForm: data.accountForms.deleteAccountForm,
          onClose: resetDialogStates
        });
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div> <button class="flex items-center gap-2 rounded bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600" aria-label="Logout">`;
    Log_out($$payload2, { class: "h-5 w-5" });
    $$payload2.out += `<!----> <span>${escape_html(/* @__PURE__ */ nav_auth_sign_out())}</span></button></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}

export { Account_settings as A };
//# sourceMappingURL=account-settings-u7Y2hay5.js.map
