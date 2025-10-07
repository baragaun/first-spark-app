import { q as push, F as getContext, J as store_get, K as unsubscribe_stores, u as pop, A as attr, B as escape_html, a9 as store_mutate } from './index-d9yomiCc.js';
import { g as goto } from './client-BNK9U2wL.js';
import { A as Auth_card } from './auth-card-GdGcHEig.js';
import { p as passwordSchema, o as otpSchema, e as emailSchema, u as usernameSchema, z as zod, s as superForm, F as Form_ident_input, a as Form_button } from './superForm-DTuNRgSU.js';
import { F as Form_password_input, M as MsaListenerHandler, a as Form_otp_input, v as verify_token_verification_code } from './msa-listener-handler.svelte-Bv4sHlq9.js';
import { B as Button } from './button-B_xSpjF_.js';
import { t as translate, A as AppUiMessage } from './translate-DAfkGQ1n.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { UserIdentType } from '@baragaun/bg-node-client';
import { o as onDestroy } from './index-server-DeHLhTK0.js';
import './app-7kTdB7Wo.js';
import { debounce } from 'throttle-debounce';
import { p as public_env } from './shared-server-i79vVjEm.js';
import { c as appTitle } from './app-store.svelte-hO-d5cjK.js';
import { z } from 'zod';
import './exports-J2AlltLs.js';
import './utils-CCkZTMVc.js';
import './spin-load-indicator-CKSC_Q6z.js';
import './Icon-CCGd_g73.js';
import './noop-kcrjqjA1.js';
import './index-server2-_G0R5Qhl.js';
import './input-BHwyyuIe.js';
import './check-B2yEnkD1.js';

const en_signin_sign_with_token_description = (
  /** @type {(inputs: { identifier: NonNullable<unknown> }) => string} */
  (i) => {
    return `Enter the verification code sent to ${i.identifier}`;
  }
);
const es_signin_sign_with_token_description = (
  /** @type {(inputs: { identifier: NonNullable<unknown> }) => string} */
  (i) => {
    return `Ingresa el código de verificación enviado a ${i.identifier}`;
  }
);
const signin_sign_with_token_description = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_sign_with_token_description", locale);
  if (locale === "en") return en_signin_sign_with_token_description(inputs);
  if (locale === "es") return es_signin_sign_with_token_description(inputs);
  return "signin.sign_with_token_description";
};
const en_signin_error_required = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Username or email is required`;
  }
);
const es_signin_error_required = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Se requiere nombre de usuario o correo electrónico`;
  }
);
const signin_error_required = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_error_required", locale);
  if (locale === "en") return en_signin_error_required();
  if (locale === "es") return es_signin_error_required();
  return "signin.error.required";
};
const schemaFirstStep = z.object({
  ident: z.string().min(3, /* @__PURE__ */ signin_error_required()).transform((val) => val.trim()),
  token: otpSchema.transform((val) => val.trim()).optional(),
  password: passwordSchema.transform((val) => val.trim()).optional(),
  authType: z.literal("password").default("password")
});
const schemaLastStep = schemaFirstStep.extend({
  token: otpSchema.transform((val) => val.trim()).optional(),
  authType: z.literal("token").optional()
});
z.discriminatedUnion("authType", [schemaFirstStep, schemaLastStep]);
const getOtpMessage = (formData) => {
  const identifier = formData.ident || "";
  return /* @__PURE__ */ signin_sign_with_token_description({ identifier });
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

const en_signin_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign in`;
  }
);
const es_signin_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Iniciar sesión`;
  }
);
const signin_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_title", locale);
  if (locale === "en") return en_signin_title();
  if (locale === "es") return es_signin_title();
  return "signin.title";
};
const en_signin_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter your email address below to sign in to your account`;
  }
);
const es_signin_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa tu dirección de correo electrónico a continuación para iniciar sesión en tu cuenta`;
  }
);
const signin_description = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_description", locale);
  if (locale === "en") return en_signin_description();
  if (locale === "es") return es_signin_description();
  return "signin.description";
};
const en_signin_sign_with_password_description = (
  /** @type {(inputs: { identifier: NonNullable<unknown> }) => string} */
  (i) => {
    return `Enter your password to sign in as ${i.identifier}`;
  }
);
const es_signin_sign_with_password_description = (
  /** @type {(inputs: { identifier: NonNullable<unknown> }) => string} */
  (i) => {
    return `Ingresa tu contraseña para iniciar sesión como ${i.identifier}`;
  }
);
const signin_sign_with_password_description = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_sign_with_password_description", locale);
  if (locale === "en") return en_signin_sign_with_password_description(inputs);
  if (locale === "es") return es_signin_sign_with_password_description(inputs);
  return "signin.sign_with_password_description";
};
const en_signin_have_account = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `New to ${i.title}?`;
  }
);
const es_signin_have_account = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `¿Nuevo en ${i.title}?`;
  }
);
const signin_have_account = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_have_account", locale);
  if (locale === "en") return en_signin_have_account(inputs);
  if (locale === "es") return es_signin_have_account(inputs);
  return "signin.have_account";
};
const en_signin_identifier_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Email or Username`;
  }
);
const es_signin_identifier_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Correo electrónico o nombre de usuario`;
  }
);
const signin_identifier_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_identifier_label", locale);
  if (locale === "en") return en_signin_identifier_label();
  if (locale === "es") return es_signin_identifier_label();
  return "signin.identifier_label";
};
const en_signin_password_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Password`;
  }
);
const es_signin_password_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Contraseña`;
  }
);
const signin_password_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_password_label", locale);
  if (locale === "en") return en_signin_password_label();
  if (locale === "es") return es_signin_password_label();
  return "signin.password_label";
};
const en_signin_identifier_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter your email or username`;
  }
);
const es_signin_identifier_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa tu correo electrónico o nombre de usuario`;
  }
);
const signin_identifier_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_identifier_placeholder", locale);
  if (locale === "en") return en_signin_identifier_placeholder();
  if (locale === "es") return es_signin_identifier_placeholder();
  return "signin.identifier_placeholder";
};
const en_signin_password_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter your password`;
  }
);
const es_signin_password_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa tu contraseña`;
  }
);
const signin_password_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_password_placeholder", locale);
  if (locale === "en") return en_signin_password_placeholder();
  if (locale === "es") return es_signin_password_placeholder();
  return "signin.password_placeholder";
};
const en_signin_buttons_signin = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign in`;
  }
);
const es_signin_buttons_signin = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Iniciar sesión`;
  }
);
const signin_buttons_signin = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_buttons_signin", locale);
  if (locale === "en") return en_signin_buttons_signin();
  if (locale === "es") return es_signin_buttons_signin();
  return "signin.buttons.signin";
};
const en_signin_buttons_signin_with_token = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign in with token`;
  }
);
const es_signin_buttons_signin_with_token = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Iniciar sesión con token`;
  }
);
const signin_buttons_signin_with_token = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_buttons_signin_with_token", locale);
  if (locale === "en") return en_signin_buttons_signin_with_token();
  if (locale === "es") return es_signin_buttons_signin_with_token();
  return "signin.buttons.signin_with_token";
};
const en_signin_buttons_signin_with_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign in with password`;
  }
);
const es_signin_buttons_signin_with_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Iniciar sesión con contraseña`;
  }
);
const signin_buttons_signin_with_password = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_buttons_signin_with_password", locale);
  if (locale === "en") return en_signin_buttons_signin_with_password();
  if (locale === "es") return es_signin_buttons_signin_with_password();
  return "signin.buttons.signin_with_password";
};
const en_signin_buttons_forgot_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Forgot your password?`;
  }
);
const es_signin_buttons_forgot_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¿Olvidaste tu contraseña?`;
  }
);
const signin_buttons_forgot_password = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_buttons_forgot_password", locale);
  if (locale === "en") return en_signin_buttons_forgot_password();
  if (locale === "es") return es_signin_buttons_forgot_password();
  return "signin.buttons.forgot_password";
};
const en_signin_buttons_verify = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verify`;
  }
);
const es_signin_buttons_verify = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verificar`;
  }
);
const signin_buttons_verify = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_buttons_verify", locale);
  if (locale === "en") return en_signin_buttons_verify();
  if (locale === "es") return es_signin_buttons_verify();
  return "signin.buttons.verify";
};
const en_signin_buttons_verifying = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verifying...`;
  }
);
const es_signin_buttons_verifying = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verificando...`;
  }
);
const signin_buttons_verifying = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_buttons_verifying", locale);
  if (locale === "en") return en_signin_buttons_verifying();
  if (locale === "es") return es_signin_buttons_verifying();
  return "signin.buttons.verifying";
};
const en_signin_buttons_signing_in1 = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Signing in...`;
  }
);
const es_signin_buttons_signing_in1 = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Iniciando sesión...`;
  }
);
const signin_buttons_signing_in1 = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_buttons_signing_in1", locale);
  if (locale === "en") return en_signin_buttons_signing_in1();
  if (locale === "es") return es_signin_buttons_signing_in1();
  return "signin.buttons.Signing_in";
};
const en_signin_buttons_signup = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign up`;
  }
);
const es_signin_buttons_signup = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Registrarse`;
  }
);
const signin_buttons_signup = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_buttons_signup", locale);
  if (locale === "en") return en_signin_buttons_signup();
  if (locale === "es") return es_signin_buttons_signup();
  return "signin.buttons.signup";
};
const en_signin_error_invalid_credentials = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Invalid username, email or password. Please try again.`;
  }
);
const es_signin_error_invalid_credentials = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Nombre de usuario, correo electrónico o contraseña inválidos. Por favor, inténtalo de nuevo.`;
  }
);
const signin_error_invalid_credentials = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signin_error_invalid_credentials", locale);
  if (locale === "en") return en_signin_error_invalid_credentials();
  if (locale === "es") return es_signin_error_invalid_credentials();
  return "signin.error.invalid_credentials";
};
function Sign_in_form($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  const userContext = getContext("myUserContext");
  let cloudflareToken = "";
  let formState = {
    isLoading: false,
    hasStepError: false,
    step: 1
  };
  let otpState = {
    handler: void 0,
    msaId: void 0,
    resendTimer: 30,
    canResend: false
  };
  const buttonState = (() => ({
    isDisabled: !isFormValid || formState.isLoading || formState.hasStepError,
    isLoading: (store_get($$store_subs ??= {}, "$delayed", delayed) || formState.isLoading) && !formState.hasStepError
  }))();
  const steps = [
    zod(schemaFirstStep),
    zod(schemaLastStep)
  ];
  const getCurrentValidator = () => steps[formState.step - 1];
  let identifier = "";
  let identType = UserIdentType.email;
  let timerInterval;
  const DEBOUNCE_DELAY = 350;
  const emailCooldowns = /* @__PURE__ */ new Map();
  const isFormValid = (() => {
    if (formState.step === 1) {
      return store_get($$store_subs ??= {}, "$formData", formData).ident && store_get($$store_subs ??= {}, "$formData", formData).password && cloudflareToken;
    } else if (formState.step === 2) {
      return store_get($$store_subs ??= {}, "$formData", formData).ident && store_get($$store_subs ??= {}, "$formData", formData).token;
    }
    return false;
  })();
  const debouncedValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      if (formState.step === 1 && (!store_get($$store_subs ??= {}, "$formData", formData).ident || !store_get($$store_subs ??= {}, "$formData", formData).password)) {
        return;
      } else if (formState.step === 2 && !store_get($$store_subs ??= {}, "$formData", formData).token) {
        return;
      }
      const result = await validateForm({ update: true, focusOnError: false });
      formState.hasStepError = !result.valid;
    } catch (error) {
      console.error("Error validating form:", error);
    } finally {
      formState.isLoading = false;
    }
  });
  const form = superForm(data.form, {
    dataType: "json",
    validators: getCurrentValidator(),
    resetForm: false,
    async onChange() {
      if (!store_get($$store_subs ??= {}, "$formData", formData)) return;
      debouncedValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      const result = await validateForm({ update: true, focusOnError: true });
      if (!result.valid) {
        formState.hasStepError = true;
        return;
      }
      if (formState.step === 1) {
        await signMeInWithPassword();
      } else if (formState.step === 2 && store_get($$store_subs ??= {}, "$formData", formData).token) {
        await verifySignInToken();
      }
      return;
    }
  });
  const {
    form: formData,
    errors,
    enhance,
    delayed,
    validateForm,
    options,
    isTainted
  } = form;
  const startResendTimer = () => {
    otpState.resendTimer = 30;
    otpState.canResend = false;
    emailCooldowns.set(identifier, Date.now() + otpState.resendTimer * 1e3);
    clearInterval(timerInterval);
    timerInterval = setInterval(
      () => {
        otpState.resendTimer -= 1;
        if (otpState.resendTimer <= 0) {
          clearInterval(timerInterval);
          otpState.canResend = true;
          emailCooldowns.delete(identifier);
        }
      },
      1e3
    );
  };
  const setStep = (newStep) => {
    formState.step = newStep;
    formState.hasStepError = true;
  };
  const updateFormErrors = (field, message) => {
    errors.update((errors2) => {
      const newErrors = { ...errors2, [field]: [message] };
      return newErrors;
    });
  };
  const toggleAuthType = async () => {
    if (otpState.handler) {
      otpState.handler.removeListener();
      otpState.handler = void 0;
    }
    if (store_get($$store_subs ??= {}, "$formData", formData).ident && schemaFirstStep.safeParse(store_get($$store_subs ??= {}, "$formData", formData).ident)) {
      if (formState.step === 1) {
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).authType = "token");
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).token = "");
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).password = void 0);
        await sendTokenForSignIn();
        setStep(2);
      } else {
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).authType = "password");
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).password = "");
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).token = void 0);
        setStep(1);
      }
    }
    return;
  };
  const onSignIn = async () => {
    const onboardingCompletion = userContext.myUserOnboardingCompletion;
    if (onboardingCompletion === 0) {
      console.error("signMeInWithPassword.success.onboardingCompletion: User data not found.");
    } else if (onboardingCompletion === 1) {
      await goto();
    } else {
      await goto();
    }
  };
  const signMeInWithPassword = async () => {
    if (!store_get($$store_subs ??= {}, "$formData", formData).password) return;
    try {
      formState.isLoading = true;
      identifier = store_get($$store_subs ??= {}, "$formData", formData).ident || "";
      identType = determineIdentifierType(identifier);
      const response = await userContext.signMeInWithPassword(store_get($$store_subs ??= {}, "$formData", formData).ident, identType, store_get($$store_subs ??= {}, "$formData", formData).password);
      if (response !== true) {
        updateFormErrors("ident", void 0);
        updateFormErrors("password", /* @__PURE__ */ signin_error_invalid_credentials());
        formState.hasStepError = true;
        return;
      }
      await onSignIn();
    } catch (error) {
      console.error("SignInForm.signMeInWithPassword: error:", { error });
      updateFormErrors("password", translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };
  const sendTokenForSignIn = async () => {
    formState.isLoading = true;
    if (!store_get($$store_subs ??= {}, "$formData", formData).ident) {
      validateForm({ update: true });
      return;
    }
    identifier = store_get($$store_subs ??= {}, "$formData", formData).ident || "";
    identType = determineIdentifierType(identifier);
    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1e3);
      if (remainingTime > 0) {
        otpState.resendTimer = remainingTime;
        return;
      }
    }
    try {
      const response = await userContext.signMeInWithToken(identifier);
      if (!response || response?.error || !response.object || response.object.error || !response?.object.actionProgress?.actionId || !response?.object.run) {
        updateFormErrors("ident", "Failed to send verification code. Please try again.");
        return;
      }
      startResendTimer();
      otpState.msaId = response.object.actionProgress.actionId;
      const onNotificationSent = () => {
        setStep(2);
        formState.isLoading = false;
      };
      const onFailure = () => {
        if (otpState.handler) {
          console.error("onFailure");
          updateFormErrors("token", otpState.handler.getErrorMessage());
          formState.hasStepError = true;
          formState.isLoading = false;
        }
      };
      const onSuccess = async () => {
        await onSignIn();
      };
      otpState.handler = new MsaListenerHandler("SignInForm", response, onNotificationSent, onFailure, onSuccess);
      return;
    } catch (error) {
      console.error("SignInForm.startTokenSignIn:", { error });
      updateFormErrors("ident", translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };
  const verifySignInToken = async () => {
    formState.isLoading = true;
    if (!store_get($$store_subs ??= {}, "$formData", formData).token) return;
    try {
      if (!otpState.msaId) {
        console.error("SignInForm.handleVerifyOtp: actionId missing:");
        updateFormErrors("token", translate(AppUiMessage.systemError));
        return;
      }
      const response = await userContext.verifyMultiStepActionToken(otpState.msaId, store_get($$store_subs ??= {}, "$formData", formData).token);
      if (response !== true) {
        console.error("SignInForm.handleVerifyOtp: invalid response:", { result: response });
        updateFormErrors("token", translate(AppUiMessage.systemError));
        formState.isLoading = false;
        return;
      }
    } catch (error) {
      console.error("SignInForm.handleVerifyOtp: error:", { error });
      updateFormErrors("token", translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = true;
    }
  };
  const handleResendToken = async () => {
    if (!otpState.canResend) return;
    if (!otpState.msaId) {
      console.error("SignInForm.handleResendToken: actionId missing.");
      updateFormErrors("token", translate(AppUiMessage.systemError));
      return;
    }
    if (emailCooldowns.has(identifier)) {
      const cooldownEnd = emailCooldowns.get(identifier) || 0;
      const remainingTime = Math.ceil((cooldownEnd - Date.now()) / 1e3);
      if (remainingTime > 0) {
        otpState.resendTimer = remainingTime;
        return;
      }
    }
    try {
      formState.isLoading = true;
      const response = await userContext.sendMultiStepActionNotification(otpState.msaId, identifier);
      if (typeof response === "string") {
        console.error("SignInForm.handleResendToken: error:", { error: response });
        updateFormErrors("token", response);
        return;
      }
      startResendTimer();
    } catch (error) {
      console.error("SignInForm.handleResendToken: error:", { error });
      updateFormErrors("ident", translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };
  onDestroy(() => {
    clearInterval(timerInterval);
    if (otpState.handler) {
      otpState.handler.removeListener();
    }
    debouncedValidation.cancel();
  });
  const getCurrentStepDescription = () => {
    switch (formState.step) {
      case 1:
        return /* @__PURE__ */ signin_description();
      case 2:
        return formState.step === 2 ? getOtpMessage(store_get($$store_subs ??= {}, "$formData", formData)) : /* @__PURE__ */ signin_sign_with_password_description({ identifier });
    }
  };
  $$payload.out += `<form method="POST" id="sign-in-form">`;
  Auth_card($$payload, {
    title: /* @__PURE__ */ signin_title(),
    description: getCurrentStepDescription(),
    children: ($$payload2) => {
      $$payload2.out += `<div class="space-y-4">`;
      if (formState.step === 1) {
        $$payload2.out += "<!--[-->";
        Form_ident_input($$payload2, {
          form,
          fieldName: "ident",
          placeholder: /* @__PURE__ */ signin_identifier_placeholder(),
          label: /* @__PURE__ */ signin_identifier_label()
        });
        $$payload2.out += `<!----> `;
        Form_password_input($$payload2, {
          form,
          fieldName: "password",
          label: /* @__PURE__ */ signin_password_label(),
          placeholder: /* @__PURE__ */ signin_password_placeholder()
        });
        $$payload2.out += `<!----> <div class="w-full overflow-x-hidden"${attr("turnstile-sitekey", public_env.PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY)} turnstile-theme="auto" turnstile-size="normal"${attr("turnstile-language", getLocale())} turnstile-response-field-name="turnstile" turnstile-response-field=""></div> `;
        Form_button($$payload2, {
          disabled: buttonState.isDisabled,
          isLoading: buttonState.isLoading,
          buttonText: /* @__PURE__ */ signin_buttons_signin(),
          loadingText: /* @__PURE__ */ signin_buttons_signing_in1()
        });
        $$payload2.out += `<!----> <div class="flex flex-col justify-between gap-2 text-sm sm:flex-row">`;
        Button($$payload2, {
          variant: "link",
          disabled: !store_get($$store_subs ??= {}, "$formData", formData).ident,
          onclick: () => toggleAuthType(),
          children: ($$payload3) => {
            $$payload3.out += `<!---->${escape_html(/* @__PURE__ */ signin_buttons_signin_with_token())}`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!----> `;
        Button($$payload2, {
          variant: "link",
          onclick: async () => await goto(),
          children: ($$payload3) => {
            $$payload3.out += `<!---->${escape_html(/* @__PURE__ */ signin_buttons_forgot_password())}`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!----></div>`;
      } else if (formState.step === 2) {
        $$payload2.out += "<!--[1-->";
        Form_otp_input($$payload2, {
          form,
          fieldName: "token",
          label: verify_token_verification_code(),
          length: 6,
          showResend: true,
          canResend: otpState.canResend,
          resendTimer: otpState.resendTimer,
          onResendClick: handleResendToken
        });
        $$payload2.out += `<!----> `;
        Form_button($$payload2, {
          disabled: buttonState.isLoading,
          isLoading: buttonState.isLoading,
          buttonText: /* @__PURE__ */ signin_buttons_verify(),
          loadingText: /* @__PURE__ */ signin_buttons_verifying()
        });
        $$payload2.out += `<!----> <div class="flex flex-col justify-between gap-2 text-sm sm:flex-row">`;
        Button($$payload2, {
          variant: "link",
          onclick: async () => await toggleAuthType(),
          children: ($$payload3) => {
            $$payload3.out += `<!---->${escape_html(/* @__PURE__ */ signin_buttons_signin_with_password())}`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!----> `;
        Button($$payload2, {
          variant: "link",
          onclick: async () => await goto(),
          children: ($$payload3) => {
            $$payload3.out += `<!---->${escape_html(/* @__PURE__ */ signin_buttons_forgot_password())}`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!----></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> <div class="mt-4 break-words text-center text-sm">${escape_html(/* @__PURE__ */ signin_have_account({ title: appTitle() }))} <a href="/signup" class="underline">${escape_html(/* @__PURE__ */ signin_buttons_signup())}</a></div></div>`;
    }
  });
  $$payload.out += `<!----></form>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload, $$props) {
  let { data } = $$props;
  $$payload.out += `<div class="flex h-full w-full items-center justify-center px-4 py-4"><div class="w-full max-w-md">`;
  Sign_in_form($$payload, { data });
  $$payload.out += `<!----></div></div>`;
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C44adUAu.js.map
