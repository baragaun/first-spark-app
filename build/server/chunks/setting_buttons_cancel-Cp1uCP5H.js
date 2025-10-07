import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';

const en_setting_buttons_cancel = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cancel`;
  }
);
const es_setting_buttons_cancel = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cancelar`;
  }
);
const setting_buttons_cancel = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_buttons_cancel", locale);
  if (locale === "en") return en_setting_buttons_cancel();
  if (locale === "es") return es_setting_buttons_cancel();
  return "setting.buttons.cancel";
};

export { setting_buttons_cancel as s };
//# sourceMappingURL=setting_buttons_cancel-Cp1uCP5H.js.map
