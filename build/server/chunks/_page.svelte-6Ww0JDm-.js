import { q as push, F as getContext, J as store_get, K as unsubscribe_stores, u as pop, a9 as store_mutate, A as attr, B as escape_html } from './index-d9yomiCc.js';
import { g as goto } from './client-BNK9U2wL.js';
import './client2-yWJSv2LX.js';
import { o as onDestroy } from './index-server-DeHLhTK0.js';
import { A as Auth_card } from './auth-card-GdGcHEig.js';
import { e as emailSchema, o as otpSchema, p as passwordSchema, u as usernameSchema, z as zod, s as superForm, F as Form_ident_input, a as Form_button } from './superForm-DTuNRgSU.js';
import { M as MsaListenerHandler, a as Form_otp_input, v as verify_token_verification_code, F as Form_password_input } from './msa-listener-handler.svelte-Bv4sHlq9.js';
import { t as translate, A as AppUiMessage } from './translate-DAfkGQ1n.js';
import { UserIdentType } from '@baragaun/bg-node-client';
import './app-7kTdB7Wo.js';
import { debounce } from 'throttle-debounce';
import { z } from 'zod';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { p as public_env } from './shared-server-i79vVjEm.js';
import { c as appTitle } from './app-store.svelte-hO-d5cjK.js';
import './exports-J2AlltLs.js';
import './utils-CCkZTMVc.js';
import './button-B_xSpjF_.js';
import './spin-load-indicator-CKSC_Q6z.js';
import './Icon-CCGd_g73.js';
import './noop-kcrjqjA1.js';
import './index-server2-_G0R5Qhl.js';
import './input-BHwyyuIe.js';
import './check-B2yEnkD1.js';

const schemaFirstStep = z.object({
  email: emailSchema.transform((val) => val.trim())
});
const schemaSecondStep = z.object({
  token: otpSchema.transform((val) => val.trim())
});
const schemaLastStep = z.object({
  username: usernameSchema.transform((val) => val.trim()),
  password: passwordSchema.transform((val) => val.trim())
});
z.object({
  email: emailSchema.optional().default("").transform((val) => val ? val.trim() : val),
  token: otpSchema.optional().default("").transform((val) => val ? val.trim() : val),
  username: usernameSchema.optional().default("").transform((val) => val ? val.trim() : val),
  password: passwordSchema.optional().default("").transform((val) => val ? val.trim() : val)
});

const en_signup_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign up`;
  }
);
const es_signup_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Registrarse`;
  }
);
const signup_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_title", locale);
  if (locale === "en") return en_signup_title();
  if (locale === "es") return es_signup_title();
  return "signup.title";
};
const en_signup_email_description = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `Provide an email address to create your ${i.title} account.`;
  }
);
const es_signup_email_description = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `Proporciona una dirección de correo electrónico para crear tu cuenta de ${i.title}.`;
  }
);
const signup_email_description = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_email_description", locale);
  if (locale === "en") return en_signup_email_description(inputs);
  if (locale === "es") return es_signup_email_description(inputs);
  return "signup.email_description";
};
const en_signup_verification_description = (
  /** @type {(inputs: { email: NonNullable<unknown> }) => string} */
  (i) => {
    return `Enter the verification code we sent to ${i.email}.`;
  }
);
const es_signup_verification_description = (
  /** @type {(inputs: { email: NonNullable<unknown> }) => string} */
  (i) => {
    return `Ingresa el código de verificación que enviamos a ${i.email}.`;
  }
);
const signup_verification_description = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_verification_description", locale);
  if (locale === "en") return en_signup_verification_description(inputs);
  if (locale === "es") return es_signup_verification_description(inputs);
  return "signup.verification_description";
};
const en_signup_create_credentials_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Choose a username and a password for your account.`;
  }
);
const es_signup_create_credentials_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Elige un nombre de usuario y una contraseña para tu cuenta.`;
  }
);
const signup_create_credentials_description = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_create_credentials_description", locale);
  if (locale === "en") return en_signup_create_credentials_description();
  if (locale === "es") return es_signup_create_credentials_description();
  return "signup.create_credentials_description";
};
const en_signup_email_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Email address`;
  }
);
const es_signup_email_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Dirección de correo electrónico`;
  }
);
const signup_email_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_email_title", locale);
  if (locale === "en") return en_signup_email_title();
  if (locale === "es") return es_signup_email_title();
  return "signup.email_title";
};
const en_signup_username = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Username`;
  }
);
const es_signup_username = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Nombre de usuario`;
  }
);
const signup_username = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_username", locale);
  if (locale === "en") return en_signup_username();
  if (locale === "es") return es_signup_username();
  return "signup.username";
};
const en_signup_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Password`;
  }
);
const es_signup_password = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Contraseña`;
  }
);
const signup_password = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_password", locale);
  if (locale === "en") return en_signup_password();
  if (locale === "es") return es_signup_password();
  return "signup.password";
};
const en_signup_email_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `e.g. 'student@example.com'`;
  }
);
const es_signup_email_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `ej. 'estudiante@ejemplo.com'`;
  }
);
const signup_email_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_email_placeholder", locale);
  if (locale === "en") return en_signup_email_placeholder();
  if (locale === "es") return es_signup_email_placeholder();
  return "signup.email_placeholder";
};
const en_signup_username_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `e.g. 'giraffe08'`;
  }
);
const es_signup_username_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `ej. 'jirafa08'`;
  }
);
const signup_username_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_username_placeholder", locale);
  if (locale === "en") return en_signup_username_placeholder();
  if (locale === "es") return es_signup_username_placeholder();
  return "signup.username_placeholder";
};
const en_signup_password_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Enter your password`;
  }
);
const es_signup_password_placeholder = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ingresa tu contraseña`;
  }
);
const signup_password_placeholder = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_password_placeholder", locale);
  if (locale === "en") return en_signup_password_placeholder();
  if (locale === "es") return es_signup_password_placeholder();
  return "signup.password_placeholder";
};
const en_signup_errors_email_unavailable = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `This email is currently unavailable for use.`;
  }
);
const es_signup_errors_email_unavailable = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Este correo electrónico no está disponible actualmente para su uso.`;
  }
);
const signup_errors_email_unavailable = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_errors_email_unavailable", locale);
  if (locale === "en") return en_signup_errors_email_unavailable();
  if (locale === "es") return es_signup_errors_email_unavailable();
  return "signup.errors.email_unavailable";
};
const en_signup_errors_username_unavailable = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `This username is currently unavailable for use.`;
  }
);
const es_signup_errors_username_unavailable = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Este nombre de usuario no está disponible actualmente para su uso.`;
  }
);
const signup_errors_username_unavailable = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_errors_username_unavailable", locale);
  if (locale === "en") return en_signup_errors_username_unavailable();
  if (locale === "es") return es_signup_errors_username_unavailable();
  return "signup.errors.username_unavailable";
};
const en_signup_buttons_sign_up = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign up`;
  }
);
const es_signup_buttons_sign_up = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Registrarse`;
  }
);
const signup_buttons_sign_up = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_buttons_sign_up", locale);
  if (locale === "en") return en_signup_buttons_sign_up();
  if (locale === "es") return es_signup_buttons_sign_up();
  return "signup.buttons.sign_up";
};
const en_signup_buttons_sign_in = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign in`;
  }
);
const es_signup_buttons_sign_in = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Iniciar sesión`;
  }
);
const signup_buttons_sign_in = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_buttons_sign_in", locale);
  if (locale === "en") return en_signup_buttons_sign_in();
  if (locale === "es") return es_signup_buttons_sign_in();
  return "signup.buttons.sign_in";
};
const en_signup_buttons_have_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Do you already have an account?`;
  }
);
const es_signup_buttons_have_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¿Ya tienes una cuenta?`;
  }
);
const signup_buttons_have_account = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_buttons_have_account", locale);
  if (locale === "en") return en_signup_buttons_have_account();
  if (locale === "es") return es_signup_buttons_have_account();
  return "signup.buttons.have_account";
};
const en_signup_buttons_verify = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verify`;
  }
);
const es_signup_buttons_verify = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verificar`;
  }
);
const signup_buttons_verify = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_buttons_verify", locale);
  if (locale === "en") return en_signup_buttons_verify();
  if (locale === "es") return es_signup_buttons_verify();
  return "signup.buttons.verify";
};
const en_signup_buttons_verifying = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verifying...`;
  }
);
const es_signup_buttons_verifying = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verificando...`;
  }
);
const signup_buttons_verifying = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_buttons_verifying", locale);
  if (locale === "en") return en_signup_buttons_verifying();
  if (locale === "es") return es_signup_buttons_verifying();
  return "signup.buttons.verifying";
};
const en_signup_buttons_create_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Create account`;
  }
);
const es_signup_buttons_create_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Crear cuenta`;
  }
);
const signup_buttons_create_account = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_buttons_create_account", locale);
  if (locale === "en") return en_signup_buttons_create_account();
  if (locale === "es") return es_signup_buttons_create_account();
  return "signup.buttons.create_account";
};
const en_signup_buttons_creating_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Creating account...`;
  }
);
const es_signup_buttons_creating_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Creando cuenta...`;
  }
);
const signup_buttons_creating_account = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("signup_buttons_creating_account", locale);
  if (locale === "en") return en_signup_buttons_creating_account();
  if (locale === "es") return es_signup_buttons_creating_account();
  return "signup.buttons.creating_account";
};
function Sign_up_form($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  const steps = [
    {
      schema: zod(schemaFirstStep),
      description: /* @__PURE__ */ signup_email_description({ title: appTitle() }),
      buttonLabel: /* @__PURE__ */ signup_buttons_sign_up(),
      loadingLabel: /* @__PURE__ */ signup_buttons_sign_up(),
      requiredFields: ["email"]
    },
    {
      schema: zod(schemaSecondStep),
      description: "",
      buttonLabel: /* @__PURE__ */ signup_buttons_verify(),
      loadingLabel: /* @__PURE__ */ signup_buttons_verifying(),
      requiredFields: ["token"]
    },
    {
      schema: zod(schemaLastStep),
      description: /* @__PURE__ */ signup_create_credentials_description(),
      buttonLabel: /* @__PURE__ */ signup_buttons_create_account(),
      loadingLabel: /* @__PURE__ */ signup_buttons_creating_account(),
      requiredFields: ["username", "password"]
    }
  ];
  const userContext = getContext("myUserContext");
  let cloudflareToken = "";
  let canResend = false;
  let resendTimer = 30;
  let otpHandler = void 0;
  let msaId = void 0;
  let identifier = "";
  let identType = UserIdentType.email;
  let formState = {
    isLoading: false,
    hasStepError: false,
    step: 1
  };
  let timerInterval;
  const DEBOUNCE_DELAY = 500;
  const RESEND_TIMER_DURATION = 30;
  const debouncedFormValidation = debounce(DEBOUNCE_DELAY, async () => {
    try {
      const requiredFields = steps[formState.step - 1].requiredFields;
      const missingRequiredFields = requiredFields.some((field) => !store_get($$store_subs ??= {}, "$formData", formData)[field] || store_get($$store_subs ??= {}, "$formData", formData)[field].trim() === "");
      if (missingRequiredFields) {
        formState.hasStepError = true;
        return;
      }
      const result = await validateForm({ update: true, focusOnError: false });
      formState.isLoading = true;
      if (formState.step === 1 || formState.step === 3) {
        const availability = await checkIdentAvailability();
        formState.hasStepError = !availability || !result.valid;
      } else if (formState.step === 2) {
        formState.hasStepError = !result.valid || !store_get($$store_subs ??= {}, "$formData", formData).token || store_get($$store_subs ??= {}, "$formData", formData).token.length < 6;
      }
    } catch (error) {
      console.error("Error debouncing the form input:", error);
    } finally {
      formState.isLoading = false;
    }
  });
  const getCurrentValidator = () => steps[formState.step - 1].schema;
  const form = superForm(data.form, {
    dataType: "json",
    validators: getCurrentValidator(),
    resetForm: false,
    validationMethod: "submit-only",
    async onChange() {
      debouncedFormValidation();
    },
    async onSubmit({ cancel }) {
      cancel();
      await handleFormSubmit();
    }
  });
  const {
    form: formData,
    errors,
    enhance,
    delayed,
    validateForm,
    options
  } = form;
  const isFormValid = (() => {
    if (formState.step === 1) {
      return store_get($$store_subs ??= {}, "$formData", formData).email && cloudflareToken;
    } else if (formState.step === 2) {
      return store_get($$store_subs ??= {}, "$formData", formData).token;
    } else if (formState.step === 3) {
      return store_get($$store_subs ??= {}, "$formData", formData).username && store_get($$store_subs ??= {}, "$formData", formData).password;
    }
    return false;
  })();
  const updateFormErrors = (field, message) => {
    errors.update((errors2) => {
      const newErrors = { ...errors2, [field]: [message] };
      return newErrors;
    });
  };
  const handleFormSubmit = async () => {
    const result = await validateForm({ update: true, focusOnError: true });
    if (!result.valid) {
      formState.hasStepError = true;
      return;
    }
    switch (formState.step) {
      case 1:
        await registerNewEmail();
        break;
      case 2:
        await verifyEmailToken();
        break;
      case 3:
        await createCredentials();
        break;
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
  const setStep = (newStep) => {
    formState.step = newStep;
    formState.hasStepError = true;
  };
  const getCurrentStepDescription = () => {
    const description = steps[formState.step - 1].description;
    return formState.step === 2 ? /* @__PURE__ */ signup_verification_description({
      email: store_get($$store_subs ??= {}, "$formData", formData).email || ""
    }) : description;
  };
  const checkIdentAvailability = async () => {
    formState.isLoading = true;
    if (formState.step === 1) {
      identifier = store_get($$store_subs ??= {}, "$formData", formData).email || "";
      if (!identifier) return false;
      identType = UserIdentType.email;
      const validationResult = emailSchema.safeParse(store_get($$store_subs ??= {}, "$formData", formData).email);
      if (!validationResult.success) return false;
    } else if (formState.step === 3) {
      identifier = store_get($$store_subs ??= {}, "$formData", formData).username || "";
      if (!identifier) return false;
      identType = UserIdentType.userHandle;
      if (identifier === userContext.myUserHandle) return true;
      const validationResult = usernameSchema.safeParse(store_get($$store_subs ??= {}, "$formData", formData).username);
      if (!validationResult.success) return false;
    }
    const fieldName = identType === UserIdentType.email ? "email" : "username";
    const message = identType === UserIdentType.email ? /* @__PURE__ */ signup_errors_email_unavailable() : /* @__PURE__ */ signup_errors_username_unavailable();
    try {
      const response = await userContext.isUserIdentAvailable(identifier, identType);
      if (response.error) {
        updateFormErrors(formState.step === 1 ? "email" : "username", response.error);
        return false;
      }
      if (!response.isAvailable) {
        updateFormErrors(fieldName, message);
        return false;
      }
      return response.isAvailable;
    } catch (error) {
      console.error("SignUpForm.checkIdentAvailability:", { error });
      updateFormErrors(fieldName, translate(AppUiMessage.systemError));
      return false;
    } finally {
      formState.isLoading = false;
    }
  };
  const setupOtpMsaHandler = (msaVerificationResponse) => {
    const msaId2 = msaVerificationResponse.object?.actionProgress?.actionId || "";
    const onNotificationSent = () => {
      setStep(2);
      formState.isLoading = false;
    };
    const onFailure = () => {
      console.error("onFailure");
      formState.isLoading = false;
    };
    const onSuccess = async () => {
      try {
        await userContext.updateMyUser({ isEmailVerified: true });
      } catch (error) {
        console.error("SignUpForm.setupOtpMsaHandler error updating verification:", { error });
      }
      if (!userContext.myUser?.passwordHash) {
        setStep(3);
      } else {
        await goto();
      }
      formState.isLoading = false;
    };
    return {
      msaId: msaId2,
      handler: new MsaListenerHandler("SignUpForm", msaVerificationResponse, onNotificationSent, onFailure, onSuccess)
    };
  };
  const registerNewEmail = async () => {
    formState.isLoading = true;
    if (!store_get($$store_subs ??= {}, "$formData", formData).email) {
      validateForm({ update: true });
      return;
    }
    try {
      const signUpResponse = await userContext.signUpUser(store_get($$store_subs ??= {}, "$formData", formData).email);
      if (signUpResponse !== true) {
        console.error("SignUpForm.registerNewEmail: signUpUser failed.", { signUpResponse });
        updateFormErrors("email", signUpResponse);
        return;
      }
      const verificationResponse = await userContext.verifyMyEmail(store_get($$store_subs ??= {}, "$formData", formData).email);
      if (!verificationResponse || verificationResponse?.error || !verificationResponse.object || verificationResponse.object.error || !verificationResponse?.object.actionProgress?.actionId || !verificationResponse?.object.run) {
        console.error("SignUpForm.onEmailSubmit: verifyMyEmail failed.", { verificationResponse });
        updateFormErrors("email", translate(AppUiMessage.systemError));
        return;
      }
      startResendTimer();
      const { msaId: newMsaId, handler } = setupOtpMsaHandler(verificationResponse);
      msaId = newMsaId;
      otpHandler = handler;
    } catch (error) {
      console.error("SignUpForm.registerNewEmail:", { error });
      updateFormErrors("email", translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };
  const verifyEmailToken = async () => {
    try {
      if (!msaId) {
        console.error("SignInForm.handleVerifyOtp: actionId missing:");
        updateFormErrors("token", translate(AppUiMessage.systemError));
        return;
      }
      formState.isLoading = true;
      const response = await userContext.verifyMultiStepActionToken(msaId, store_get($$store_subs ??= {}, "$formData", formData).token || "");
      if (response !== true) {
        console.error("SignUpForm.handleVerifyOtp: invalid response:", { result: response });
        updateFormErrors("token", translate(AppUiMessage.systemError));
        return;
      }
      try {
        await getSuggestedUsername();
      } catch (error) {
        console.error("SignUpForm.getSuggestedUsername: error:", { error });
        updateFormErrors("token", translate(AppUiMessage.systemError));
      }
    } catch (error) {
      console.error("SignUpForm.handleVerifyOtp: error:", { error });
      updateFormErrors("token", translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };
  const resendToken = async () => {
    if (!msaId) {
      console.error("SignUpForm.handleResendOtp: actionId missing.");
      updateFormErrors("token", translate(AppUiMessage.systemError));
      return;
    }
    try {
      formState.isLoading = true;
      const response = await userContext.sendMultiStepActionNotification(msaId, store_get($$store_subs ??= {}, "$formData", formData).email);
      if (typeof response === "string") {
        console.error("SignInForm.handleResendOtp: error:", { error: response });
        updateFormErrors("token", response);
        return;
      }
      startResendTimer();
    } catch (error) {
      console.error("SignUpForm.resendToken: error:", { error });
      updateFormErrors("token", translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };
  const getSuggestedUsername = async () => {
    if (!store_get($$store_subs ??= {}, "$formData", formData).email) return;
    try {
      formState.isLoading = true;
      const result = await userContext.findAvailableUserHandle(store_get($$store_subs ??= {}, "$formData", formData).email);
      if (result && typeof result === "object" && "object" in result) {
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).username = result.object ?? "");
      } else if (typeof result === "string") {
        store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData).username = result);
      }
    } catch (error) {
      console.error("Error getting suggested handle:", error);
    } finally {
      formState.isLoading = false;
    }
  };
  const createCredentials = async () => {
    formState.isLoading = true;
    if (!store_get($$store_subs ??= {}, "$formData", formData).password) return;
    try {
      const { error } = await userContext.updateMyUser({
        userHandle: store_get($$store_subs ??= {}, "$formData", formData).username,
        newPassword: store_get($$store_subs ??= {}, "$formData", formData).password
      });
      if (error) {
        updateFormErrors("password", error);
        return;
      }
      await goto("/");
    } catch (error) {
      console.error("SignUpForm.createCredentials: error:", { error });
      updateFormErrors("password", translate(AppUiMessage.systemError));
    } finally {
      formState.isLoading = false;
    }
  };
  onDestroy(() => {
    clearInterval(timerInterval);
    if (otpHandler) {
      otpHandler.removeListener();
    }
    debouncedFormValidation.cancel();
  });
  const buttonState = (() => ({
    isDisabled: !isFormValid || formState.isLoading || formState.hasStepError,
    isLoading: (store_get($$store_subs ??= {}, "$delayed", delayed) || formState.isLoading) && !formState.hasStepError
  }))();
  $$payload.out += `<form method="POST" id="sign-up-form">`;
  Auth_card($$payload, {
    title: /* @__PURE__ */ signup_title(),
    description: getCurrentStepDescription(),
    children: ($$payload2) => {
      $$payload2.out += `<div class="space-y-4">`;
      if (formState.step === 1) {
        $$payload2.out += "<!--[-->";
        Form_ident_input($$payload2, {
          form,
          fieldName: "email",
          placeholder: /* @__PURE__ */ signup_email_placeholder(),
          label: /* @__PURE__ */ signup_email_title()
        });
        $$payload2.out += `<!----> <div${attr("turnstile-sitekey", public_env.PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY)} turnstile-theme="auto" turnstile-size="flexible"${attr("turnstile-language", getLocale())} turnstile-response-field-name="turnstile" turnstile-response-field=""></div>`;
      } else if (formState.step === 2) {
        $$payload2.out += "<!--[1-->";
        Form_otp_input($$payload2, {
          form,
          fieldName: "token",
          label: verify_token_verification_code(),
          length: 6,
          showResend: true,
          canResend,
          resendTimer,
          onResendClick: resendToken
        });
      } else if (formState.step === 3) {
        $$payload2.out += "<!--[2-->";
        Form_ident_input($$payload2, {
          form,
          fieldName: "username",
          placeholder: /* @__PURE__ */ signup_username_placeholder(),
          label: /* @__PURE__ */ signup_username(),
          identType,
          suggestUsername: getSuggestedUsername
        });
        $$payload2.out += `<!----> `;
        Form_password_input($$payload2, {
          form,
          fieldName: "password",
          label: /* @__PURE__ */ signup_password(),
          placeholder: /* @__PURE__ */ signup_password_placeholder()
        });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      Form_button($$payload2, {
        disabled: buttonState.isDisabled,
        isLoading: buttonState.isLoading,
        buttonText: steps[formState.step - 1].buttonLabel,
        loadingText: steps[formState.step - 1].loadingLabel
      });
      $$payload2.out += `<!----> <div class="mt-4 text-center text-sm">${escape_html(/* @__PURE__ */ signup_buttons_have_account())} <a href="/signin" class="underline">${escape_html(/* @__PURE__ */ signup_buttons_sign_in())}</a></div></div>`;
    }
  });
  $$payload.out += `<!----></form>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload, $$props) {
  let { data } = $$props;
  $$payload.out += `<div class="flex h-full w-full items-center justify-center px-4"><div class="w-full max-w-md">`;
  Sign_up_form($$payload, { data });
  $$payload.out += `<!----></div></div>`;
}

export { _page as default };
//# sourceMappingURL=_page.svelte-6Ww0JDm-.js.map
