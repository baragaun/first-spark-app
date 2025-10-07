import { q as push, F as getContext, u as pop, J as store_get, K as unsubscribe_stores, B as escape_html, a9 as store_mutate } from './index-d9yomiCc.js';
import { g as goto } from './client-BNK9U2wL.js';
import { t as translate, A as AppUiMessage } from './translate-DAfkGQ1n.js';
import { UserIdentType } from '@baragaun/bg-node-client';
import { A as Auth_card } from './auth-card-GdGcHEig.js';
import { o as otpSchema, p as passwordSchema, e as emailSchema, u as usernameSchema, z as zod, s as superForm, F as Form_ident_input, a as Form_button } from './superForm-DTuNRgSU.js';
import { M as MsaListenerHandler, F as Form_password_input, a as Form_otp_input, v as verify_token_verification_code } from './msa-listener-handler.svelte-Bv4sHlq9.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { o as onDestroy } from './index-server-DeHLhTK0.js';
import './app-7kTdB7Wo.js';
import { debounce } from 'throttle-debounce';
import { z } from 'zod';
import './exports-J2AlltLs.js';
import './utils-CCkZTMVc.js';
import './button-B_xSpjF_.js';
import './spin-load-indicator-CKSC_Q6z.js';
import './Icon-CCGd_g73.js';
import './noop-kcrjqjA1.js';
import './index-server2-_G0R5Qhl.js';
import './input-BHwyyuIe.js';
import './check-B2yEnkD1.js';
import './shared-server-i79vVjEm.js';

const en_reset_password_form_errors_valid_ident_required = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `A valid username or email is required`;
  }
);
const es_reset_password_form_errors_valid_ident_required = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Se requiere un nombre de usuario o correo electrónico válido`;
  }
);
const reset_password_form_errors_valid_ident_required = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_form_errors_valid_ident_required", locale);
  if (locale === "en") return en_reset_password_form_errors_valid_ident_required();
  if (locale === "es") return es_reset_password_form_errors_valid_ident_required();
  return "reset_password.form.errors.valid_ident_required";
};
const en_reset_password_new_password_form_otp_description = (
  /** @type {(inputs: { identifier: NonNullable<unknown> }) => string} */
  (i) => {
    return `Enter a new password and the verification code we sent to ${i.identifier} to update your password`;
  }
);
const es_reset_password_new_password_form_otp_description = (
  /** @type {(inputs: { identifier: NonNullable<unknown> }) => string} */
  (i) => {
    return `Ingresa una nueva contraseña y el código de verificación que enviamos a ${i.identifier} para actualizar tu contraseña`;
  }
);
const reset_password_new_password_form_otp_description = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_new_password_form_otp_description", locale);
  if (locale === "en") return en_reset_password_new_password_form_otp_description(inputs);
  if (locale === "es") return es_reset_password_new_password_form_otp_description(inputs);
  return "reset_password.new_password_form.otp_description";
};
const schemaFirstStep = z.object({
  ident: z.string().min(3, /* @__PURE__ */ reset_password_form_errors_valid_ident_required()).transform((val) => val.trim())
});
const schemaLastStep = schemaFirstStep.extend({
  newPassword: passwordSchema.transform((val) => val.trim()),
  token: otpSchema.transform((val) => val.trim()),
  actionId: z.string()
});
const getOtpMessage = (formData) => {
  const identifier = formData.ident || "";
  return /* @__PURE__ */ reset_password_new_password_form_otp_description({ identifier });
};
const determineIdentifierType = (value) => {
  const emailValidationResult = emailSchema.safeParse(value);
  if (emailValidationResult.success) {
    return UserIdentType.email;
  }
  const usernameValidationResult = usernameSchema.safeParse(value);
  if (usernameValidationResult.success) {
    return UserIdentType.userHandle;
  }
  return UserIdentType.email;
};

const en_reset_password_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Reset your password`;
  }
);
const es_reset_password_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Restablecer tu contraseña`;
  }
);
const reset_password_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_title", locale);
  if (locale === "en") return en_reset_password_title();
  if (locale === "es") return es_reset_password_title();
  return "reset_password.title";
};
const en_reset_password_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Provide your username or email to get a verification code`;
  }
);
const es_reset_password_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Proporciona tu nombre de usuario o correo electrónico para obtener un código de verificación`;
  }
);
const reset_password_description = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_description", locale);
  if (locale === "en") return en_reset_password_description();
  if (locale === "es") return es_reset_password_description();
  return "reset_password.description";
};
const en_reset_password_form_identifier_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Email or username`;
  }
);
const es_reset_password_form_identifier_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Correo electrónico o nombre de usuario`;
  }
);
const reset_password_form_identifier_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_form_identifier_label", locale);
  if (locale === "en") return en_reset_password_form_identifier_label();
  if (locale === "es") return es_reset_password_form_identifier_label();
  return "reset_password.form.identifier_label";
};
const en_reset_password_form_identifier_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter your email or username`;
  }
);
const es_reset_password_form_identifier_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa tu correo electrónico o nombre de usuario`;
  }
);
const reset_password_form_identifier_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_form_identifier_placeholder", locale);
  if (locale === "en") return en_reset_password_form_identifier_placeholder();
  if (locale === "es") return es_reset_password_form_identifier_placeholder();
  return "reset_password.form.identifier_placeholder";
};
const en_reset_password_form_errors_failed_to_send = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Failed to send verification code. Please try again.`;
  }
);
const es_reset_password_form_errors_failed_to_send = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Error al enviar el código de verificación. Por favor, inténtalo de nuevo.`;
  }
);
const reset_password_form_errors_failed_to_send = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_form_errors_failed_to_send", locale);
  if (locale === "en") return en_reset_password_form_errors_failed_to_send();
  if (locale === "es") return es_reset_password_form_errors_failed_to_send();
  return "reset_password.form.errors.failed_to_send";
};
const en_reset_password_form_errors_failed_to_resend = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Failed to resend verification code. Please try again.`;
  }
);
const es_reset_password_form_errors_failed_to_resend = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Error al reenviar el código de verificación. Por favor, inténtalo de nuevo.`;
  }
);
const reset_password_form_errors_failed_to_resend = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_form_errors_failed_to_resend", locale);
  if (locale === "en") return en_reset_password_form_errors_failed_to_resend();
  if (locale === "es") return es_reset_password_form_errors_failed_to_resend();
  return "reset_password.form.errors.failed_to_resend";
};
const en_reset_password_form_errors_failed_to_verify = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Failed to verify code. Please try again.`;
  }
);
const es_reset_password_form_errors_failed_to_verify = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Error al verificar el código. Por favor, inténtalo de nuevo.`;
  }
);
const reset_password_form_errors_failed_to_verify = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_form_errors_failed_to_verify", locale);
  if (locale === "en") return en_reset_password_form_errors_failed_to_verify();
  if (locale === "es") return es_reset_password_form_errors_failed_to_verify();
  return "reset_password.form.errors.failed_to_verify";
};
const en_reset_password_new_password_form_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `New password`;
  }
);
const es_reset_password_new_password_form_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Nueva contraseña`;
  }
);
const reset_password_new_password_form_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_new_password_form_label", locale);
  if (locale === "en") return en_reset_password_new_password_form_label();
  if (locale === "es") return es_reset_password_new_password_form_label();
  return "reset_password.new_password_form.label";
};
const en_reset_password_new_password_form_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter a new password`;
  }
);
const es_reset_password_new_password_form_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa una nueva contraseña`;
  }
);
const reset_password_new_password_form_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_new_password_form_placeholder", locale);
  if (locale === "en") return en_reset_password_new_password_form_placeholder();
  if (locale === "es") return es_reset_password_new_password_form_placeholder();
  return "reset_password.new_password_form.placeholder";
};
const en_reset_password_buttons_send_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Send me an email`;
  }
);
const es_reset_password_buttons_send_email = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Envíame un correo electrónico`;
  }
);
const reset_password_buttons_send_email = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_buttons_send_email", locale);
  if (locale === "en") return en_reset_password_buttons_send_email();
  if (locale === "es") return es_reset_password_buttons_send_email();
  return "reset_password.buttons.send_email";
};
const en_reset_password_buttons_have_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Don't have an account?`;
  }
);
const es_reset_password_buttons_have_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¿No tienes una cuenta?`;
  }
);
const reset_password_buttons_have_account = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_buttons_have_account", locale);
  if (locale === "en") return en_reset_password_buttons_have_account();
  if (locale === "es") return es_reset_password_buttons_have_account();
  return "reset_password.buttons.have_account";
};
const en_reset_password_buttons_update_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Update my password`;
  }
);
const es_reset_password_buttons_update_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Actualizar mi contraseña`;
  }
);
const reset_password_buttons_update_password = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_buttons_update_password", locale);
  if (locale === "en") return en_reset_password_buttons_update_password();
  if (locale === "es") return es_reset_password_buttons_update_password();
  return "reset_password.buttons.update_password";
};
const en_reset_password_buttons_processing = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Processing...`;
  }
);
const es_reset_password_buttons_processing = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Procesando...`;
  }
);
const reset_password_buttons_processing = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_buttons_processing", locale);
  if (locale === "en") return en_reset_password_buttons_processing();
  if (locale === "es") return es_reset_password_buttons_processing();
  return "reset_password.buttons.processing";
};
const en_reset_password_buttons_signup = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign up`;
  }
);
const es_reset_password_buttons_signup = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Registrarse`;
  }
);
const reset_password_buttons_signup = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_buttons_signup", locale);
  if (locale === "en") return en_reset_password_buttons_signup();
  if (locale === "es") return es_reset_password_buttons_signup();
  return "reset_password.buttons.signup";
};
const en_reset_password_buttons_start_over = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Start over`;
  }
);
const es_reset_password_buttons_start_over = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Empezar de nuevo`;
  }
);
const reset_password_buttons_start_over = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("reset_password_buttons_start_over", locale);
  if (locale === "en") return en_reset_password_buttons_start_over();
  if (locale === "es") return es_reset_password_buttons_start_over();
  return "reset_password.buttons.start_over";
};
const minLength = 8;
const commonPasswords = [
  "123456",
  "password",
  "123456789",
  "12345678",
  "12345",
  "1234567",
  "1234567890",
  "qwerty",
  "abc123",
  "password1"
];
const validatePassword = (password, email) => {
  const repetitivePattern = /^(.)\1+$/;
  const result = {
    minLength: true,
    notTooSimple: true,
    noRepetitivePattern: true,
    doesNotReuseEmail: true,
    isValid: true
  };
  if (password.length < minLength) {
    result.minLength = false;
    result.isValid = false;
  }
  if (commonPasswords.includes(password.toLowerCase())) {
    result.notTooSimple = false;
    result.isValid = false;
  }
  if (repetitivePattern.test(password)) {
    result.noRepetitivePattern = false;
    result.isValid = false;
  }
  if (email) {
    const firstEmailPart = email.split("@")[0];
    if (firstEmailPart && password.toLowerCase().includes(firstEmailPart.toLowerCase())) {
      result.doesNotReuseEmail = false;
      result.isValid = false;
    }
  }
  return result;
};
const getPasswordError = (password) => {
  if (!password) {
    return "";
  }
  const validation = validatePassword(password);
  if (!validation.notTooSimple || !validation.noRepetitivePattern || !validation.doesNotReuseEmail) {
    return "Password is too simple or guessable";
  }
  return "";
};
const passwordHelpers = {
  validatePassword,
  getPasswordError
};
function Reset_password_form($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  const steps = [
    zod(schemaFirstStep),
    zod(schemaLastStep)
  ];
  let step = 1;
  const getCurrentValidator = () => steps[step - 1];
  const userContext = getContext("myUserContext");
  let otpHandler = void 0;
  let msaId = void 0;
  let resendTimer = 30;
  let canResend = false;
  let isLoading = false;
  let hasStepError = true;
  let identifier = "";
  let identType = UserIdentType.email;
  let timerInterval;
  const DEBOUNCE_DELAY = 350;
  const { getPasswordError: getPasswordError2, validatePassword: validatePassword2 } = passwordHelpers;
  const debouncedValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      isLoading = true;
      const result = await validateForm({ update: true, focusOnError: false });
      hasStepError = !result.valid;
    } catch (error) {
      console.error("Error validating form:", error);
    } finally {
      isLoading = false;
    }
  });
  const isFormValid = (() => {
    if (step === 1) {
      return store_get($$store_subs ??= {}, "$formData", formData).ident;
    } else {
      return store_get($$store_subs ??= {}, "$formData", formData).token && store_get($$store_subs ??= {}, "$formData", formData).newPassword;
    }
  })();
  const form = superForm(data.form, {
    dataType: "json",
    validators: getCurrentValidator(),
    resetForm: false,
    validationMethod: "submit-only",
    async onChange() {
      if (msaId && !store_get($$store_subs ??= {}, "$formData", formData).actionId) {
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).actionId = msaId);
      }
      debouncedValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      const result = await validateForm({ update: true, focusOnError: true });
      if (!result.valid) return;
      if (step === 1) {
        await startPasswordReset();
      } else {
        await updateMyPassword();
      }
      return;
    }
  });
  const {
    form: formData,
    enhance,
    errors,
    delayed,
    validateForm,
    options
  } = form;
  const startResendTimer = () => {
    resendTimer = 30;
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
  const updateFormErrors = (field, message) => {
    errors.update((errors2) => {
      const newErrors = { ...errors2, [field]: [message] };
      return newErrors;
    });
  };
  const isIdentRegistered = async () => {
    isLoading = true;
    identifier = store_get($$store_subs ??= {}, "$formData", formData).ident;
    if (!identifier) return false;
    identType = determineIdentifierType(identifier);
    try {
      const response = await userContext.isUserIdentAvailable(identifier, identType);
      if (response.error) {
        updateFormErrors("ident", response.error);
        return false;
      }
      if (response.isAvailable) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error checking identifier availability:", error);
      updateFormErrors("ident", translate(AppUiMessage.systemError));
      return false;
    } finally {
      isLoading = false;
    }
  };
  const startPasswordReset = async () => {
    isLoading = true;
    try {
      const existingUser = await isIdentRegistered();
      if (!existingUser) {
        step = 2;
        startResendTimer();
        return;
      }
      isLoading = true;
      const response = await userContext.resetMyPassword(store_get($$store_subs ??= {}, "$formData", formData).ident);
      if (!response || response?.error || !response.object || response.object.error || !response?.object.actionProgress?.actionId || !response?.object.run) {
        updateFormErrors("ident", /* @__PURE__ */ reset_password_form_errors_failed_to_send());
        hasStepError = true;
        isLoading = false;
        return;
      }
      const onNotificationSent = () => {
        step = 2;
        hasStepError = true;
        isLoading = false;
      };
      const onFailure = () => {
        if (otpHandler) {
          console.error("onFailure");
          updateFormErrors("token", otpHandler.getErrorMessage());
          hasStepError = true;
          isLoading = false;
        }
      };
      const onSuccess = async () => {
        isLoading = false;
        await goto("/");
      };
      msaId = response.object.actionProgress.actionId;
      otpHandler = new MsaListenerHandler("ResetPassword", response, onNotificationSent, onFailure, onSuccess);
      startResendTimer();
      return;
    } catch (err) {
      console.error("Error resetting password:", err);
      updateFormErrors("ident", translate(AppUiMessage.systemError));
    }
  };
  const handleResendToken = async () => {
    if (!canResend) return;
    isLoading = true;
    if (!msaId) {
      console.error("ResetPasswordForm.handleResendToken: actionId missing.");
      updateFormErrors("token", translate(AppUiMessage.systemError));
      return;
    }
    try {
      const response = await userContext.sendMultiStepActionNotification(store_get($$store_subs ??= {}, "$formData", formData).actionId, store_get($$store_subs ??= {}, "$formData", formData).ident);
      if (response !== true) {
        updateFormErrors("token", typeof response === "string" ? response : /* @__PURE__ */ reset_password_form_errors_failed_to_resend());
        return;
      }
      startResendTimer();
    } catch (error) {
      console.error("Error resending email:", error);
      updateFormErrors("token", /* @__PURE__ */ reset_password_form_errors_failed_to_resend());
    } finally {
      isLoading = false;
    }
  };
  const updateMyPassword = async () => {
    isLoading = true;
    if (!msaId) {
      console.error("ResetPasswordForm.updateMyPassword: actionId missing:");
      updateFormErrors("token", translate(AppUiMessage.systemError));
      return;
    }
    if (!store_get($$store_subs ??= {}, "$formData", formData).newPassword || !store_get($$store_subs ??= {}, "$formData", formData).token) return;
    try {
      if (!validatePassword2(store_get($$store_subs ??= {}, "$formData", formData).newPassword).isValid) {
        updateFormErrors("newPassword", getPasswordError2(store_get($$store_subs ??= {}, "$formData", formData).newPassword));
        return;
      }
      const result = await userContext.verifyMultiStepActionToken(store_get($$store_subs ??= {}, "$formData", formData).actionId, store_get($$store_subs ??= {}, "$formData", formData).token, store_get($$store_subs ??= {}, "$formData", formData).newPassword);
      if (result !== true) {
        updateFormErrors("token", typeof result === "string" ? result : /* @__PURE__ */ reset_password_form_errors_failed_to_verify());
        return;
      }
    } catch (err) {
      console.error("Error verifying reset code:", err);
      updateFormErrors("newPassword", err instanceof Error ? err.message : /* @__PURE__ */ reset_password_form_errors_failed_to_verify());
    } finally {
      isLoading = false;
    }
  };
  const getCurrentStepDescription = () => {
    switch (step) {
      case 1:
        return /* @__PURE__ */ reset_password_description();
      case 2:
        return getOtpMessage(store_get($$store_subs ??= {}, "$formData", formData));
    }
  };
  const getCurrentStepButtonLabel = () => {
    switch (step) {
      case 1:
        return /* @__PURE__ */ reset_password_buttons_send_email();
      case 2:
        return /* @__PURE__ */ reset_password_buttons_update_password();
    }
  };
  onDestroy(() => {
    clearInterval(timerInterval);
    if (otpHandler) {
      otpHandler.removeListener();
    }
    debouncedValidation.cancel();
  });
  $$payload.out += `<form method="POST" id="reset-password-form">`;
  Auth_card($$payload, {
    title: /* @__PURE__ */ reset_password_title(),
    description: getCurrentStepDescription(),
    children: ($$payload2) => {
      $$payload2.out += `<div class="space-y-4">`;
      if (step == 1) {
        $$payload2.out += "<!--[-->";
        Form_ident_input($$payload2, {
          form,
          fieldName: "ident",
          placeholder: /* @__PURE__ */ reset_password_form_identifier_placeholder(),
          label: /* @__PURE__ */ reset_password_form_identifier_label(),
          isLoading
        });
      } else if (step == 2) {
        $$payload2.out += "<!--[1-->";
        Form_password_input($$payload2, {
          form,
          fieldName: "newPassword",
          label: /* @__PURE__ */ reset_password_new_password_form_label(),
          placeholder: /* @__PURE__ */ reset_password_new_password_form_placeholder()
        });
        $$payload2.out += `<!----> `;
        Form_otp_input($$payload2, {
          form,
          fieldName: "token",
          label: verify_token_verification_code(),
          length: 6,
          showResend: true,
          canResend,
          resendTimer,
          onResendClick: handleResendToken,
          showBackButton: true,
          backButtonLabel: /* @__PURE__ */ reset_password_buttons_start_over(),
          onBackButtonClick: () => {
            step = 1;
            hasStepError = false;
            if (otpHandler) {
              otpHandler.removeListener();
            }
            formData.update((data2) => {
              return {
                ident: data2.ident,
                newPassword: "",
                token: "",
                actionId: ""
              };
            });
          }
        });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      Form_button($$payload2, {
        disabled: isLoading || hasStepError || !isFormValid,
        isLoading: store_get($$store_subs ??= {}, "$delayed", delayed) || isLoading,
        buttonText: getCurrentStepButtonLabel(),
        loadingText: /* @__PURE__ */ reset_password_buttons_processing()
      });
      $$payload2.out += `<!----></div> <div class="mt-4 text-center text-sm">${escape_html(/* @__PURE__ */ reset_password_buttons_have_account())} <a href="/signup" class="underline">${escape_html(/* @__PURE__ */ reset_password_buttons_signup())}</a></div>`;
    }
  });
  $$payload.out += `<!----></form>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  const userContext = getContext("myUserContext");
  userContext.isOffline;
  userContext.isSignedIn;
  $$payload.out += `<div class="flex h-full w-full items-center justify-center px-4"><div class="w-full max-w-md">`;
  Reset_password_form($$payload, { data });
  $$payload.out += `<!----></div></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CAo3dmbB.js.map
