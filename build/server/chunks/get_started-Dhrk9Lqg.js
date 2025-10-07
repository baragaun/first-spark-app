import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';

const en_get_started = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Get started`;
  }
);
const es_get_started = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Comenzar`;
  }
);
const get_started = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("get_started", locale);
  if (locale === "en") return en_get_started();
  if (locale === "es") return es_get_started();
  return "get_started";
};

export { get_started as g };
//# sourceMappingURL=get_started-Dhrk9Lqg.js.map
