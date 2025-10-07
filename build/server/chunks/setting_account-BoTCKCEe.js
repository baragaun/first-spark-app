import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';

const en_setting_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Account`;
  }
);
const es_setting_account = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cuenta`;
  }
);
const setting_account = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_account", locale);
  if (locale === "en") return en_setting_account();
  if (locale === "es") return es_setting_account();
  return "setting.account";
};

export { setting_account as s };
//# sourceMappingURL=setting_account-BoTCKCEe.js.map
