import { q as push, V as copy_payload, W as assign_payload, u as pop, I as spread_props, a9 as store_mutate, J as store_get, A as attr, B as escape_html, M as sanitize_props, T as slot, E as bind_props, O as spread_attributes, P as clsx, Q as derived, z as ensure_array_like, K as unsubscribe_stores } from './index-d9yomiCc.js';
import { b as Form_field, C as Control, c as Form_field_errors, d as Form_label, f as Form_button$1 } from './superForm-DTuNRgSU.js';
import { c as cn } from './utils-CCkZTMVc.js';
import { u as useId, n as noop, b as box, m as mergeProps, a as useRefById, w as watch, o as getDisabled } from './noop-kcrjqjA1.js';
import { P as Previous } from './index-server-DeHLhTK0.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { I as Input } from './input-BHwyyuIe.js';
import { I as Icon } from './Icon-CCGd_g73.js';
import { p as public_env } from './shared-server-i79vVjEm.js';
import { M as MsaTokenStatus, t as translate, A as AppUiMessage } from './translate-DAfkGQ1n.js';
import { MultiStepActionEventType } from '@baragaun/bg-node-client';

const PWM_BADGE_SPACE_WIDTH_PX = 40;
const PWM_BADGE_SPACE_WIDTH = `${PWM_BADGE_SPACE_WIDTH_PX}px`;
function usePasswordManagerBadge({
  containerRef,
  inputRef,
  pushPasswordManagerStrategy,
  isFocused
}) {
  let hasPwmBadge = false;
  function willPushPwmBadge() {
    const strategy = pushPasswordManagerStrategy.current;
    if (strategy === "none") return false;
    const increaseWidthCase = strategy === "increase-width" && hasPwmBadge;
    return increaseWidthCase;
  }
  return {
    get hasPwmBadge() {
      return hasPwmBadge;
    },
    get willPushPwmBadge() {
      return willPushPwmBadge();
    },
    PWM_BADGE_SPACE_WIDTH
  };
}
const REGEXP_ONLY_DIGITS = "^\\d+$";
const ROOT_ATTR = "data-pin-input-root";
const CELL_ATTR = "data-pin-input-cell";
const KEYS_TO_IGNORE = [
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "Escape",
  "Enter",
  "Tab",
  "Shift",
  "Control",
  "Meta"
];
class PinInputRootState {
  opts;
  #inputRef = box(null);
  #isHoveringInput = false;
  #isFocused = box(false);
  #mirrorSelectionStart = null;
  #mirrorSelectionEnd = null;
  #previousValue = new Previous(() => this.opts.value.current ?? "");
  #regexPattern = derived(() => {
    if (typeof this.opts.pattern.current === "string") {
      return new RegExp(this.opts.pattern.current);
    } else {
      return this.opts.pattern.current;
    }
  });
  #prevInputMetadata = {
    prev: [null, null, "none"],
    willSyntheticBlur: false
  };
  #pwmb;
  #initialLoad;
  constructor(opts) {
    this.opts = opts;
    this.#initialLoad = {
      value: this.opts.value,
      isIOS: typeof window !== "undefined" && window?.CSS?.supports("-webkit-touch-callout", "none")
    };
    this.#pwmb = usePasswordManagerBadge({
      containerRef: this.opts.ref,
      inputRef: this.#inputRef,
      isFocused: this.#isFocused,
      pushPasswordManagerStrategy: this.opts.pushPasswordManagerStrategy
    });
    useRefById(opts);
    useRefById({ id: this.opts.inputId, ref: this.#inputRef });
    watch(
      [
        () => this.opts.value.current,
        () => this.#inputRef.current
      ],
      () => {
        syncTimeouts(() => {
          const input = this.#inputRef.current;
          if (!input) return;
          input.dispatchEvent(new Event("input"));
          const start = input.selectionStart;
          const end = input.selectionEnd;
          const dir = input.selectionDirection ?? "none";
          if (start !== null && end !== null) {
            this.#mirrorSelectionStart = start;
            this.#mirrorSelectionEnd = end;
            this.#prevInputMetadata.prev = [start, end, dir];
          }
        });
      }
    );
  }
  onkeydown = (e) => {
    const key = e.key;
    if (KEYS_TO_IGNORE.includes(key)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (key && this.#regexPattern() && !this.#regexPattern().test(key)) {
      e.preventDefault();
    }
  };
  #rootStyles = derived(() => ({
    position: "relative",
    cursor: this.opts.disabled.current ? "default" : "text",
    userSelect: "none",
    WebkitUserSelect: "none",
    pointerEvents: "none"
  }));
  #rootProps = derived(() => ({
    id: this.opts.id.current,
    [ROOT_ATTR]: "",
    style: this.#rootStyles()
  }));
  get rootProps() {
    return this.#rootProps();
  }
  set rootProps($$value) {
    return this.#rootProps($$value);
  }
  #inputWrapperProps = derived(() => ({
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none"
    }
  }));
  get inputWrapperProps() {
    return this.#inputWrapperProps();
  }
  set inputWrapperProps($$value) {
    return this.#inputWrapperProps($$value);
  }
  #inputStyle = derived(() => ({
    position: "absolute",
    inset: 0,
    width: this.#pwmb.willPushPwmBadge ? `calc(100% + ${this.#pwmb.PWM_BADGE_SPACE_WIDTH})` : "100%",
    clipPath: this.#pwmb.willPushPwmBadge ? `inset(0 ${this.#pwmb.PWM_BADGE_SPACE_WIDTH} 0 0)` : void 0,
    height: "100%",
    display: "flex",
    textAlign: this.opts.textAlign.current,
    opacity: "1",
    color: "transparent",
    pointerEvents: "all",
    background: "transparent",
    caretColor: "transparent",
    border: "0 solid transparent",
    outline: "0 solid transparent",
    boxShadow: "none",
    lineHeight: "1",
    letterSpacing: "-.5em",
    fontSize: "var(--bits-pin-input-root-height)",
    fontFamily: "monospace",
    fontVariantNumeric: "tabular-nums"
  }));
  #applyStyles() {
    const styleEl = document.createElement("style");
    styleEl.id = "pin-input-style";
    document.head.appendChild(styleEl);
    if (styleEl.sheet) {
      const autoFillStyles = "background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";
      safeInsertRule(styleEl.sheet, "[data-pin-input-input]::selection { background: transparent !important; color: transparent !important; }");
      safeInsertRule(styleEl.sheet, `[data-pin-input-input]:autofill { ${autoFillStyles} }`);
      safeInsertRule(styleEl.sheet, `[data-pin-input-input]:-webkit-autofill { ${autoFillStyles} }`);
      safeInsertRule(styleEl.sheet, `@supports (-webkit-touch-callout: none) { [data-pin-input-input] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }`);
      safeInsertRule(styleEl.sheet, `[data-pin-input-input] + * { pointer-events: all !important; }`);
    }
  }
  #onDocumentSelectionChange = () => {
    const input = this.#inputRef.current;
    const container = this.opts.ref.current;
    if (!input || !container) return;
    if (document.activeElement !== input) {
      this.#mirrorSelectionStart = null;
      this.#mirrorSelectionEnd = null;
      return;
    }
    const selStart = input.selectionStart;
    const selEnd = input.selectionEnd;
    const selDir = input.selectionDirection ?? "none";
    const maxLength = input.maxLength;
    const val = input.value;
    const prev = this.#prevInputMetadata.prev;
    let start = -1;
    let end = -1;
    let direction;
    if (val.length !== 0 && selStart !== null && selEnd !== null) {
      const isSingleCaret = selStart === selEnd;
      const isInsertMode = selStart === val.length && val.length < maxLength;
      if (isSingleCaret && !isInsertMode) {
        const c = selStart;
        if (c === 0) {
          start = 0;
          end = 1;
          direction = "forward";
        } else if (c === maxLength) {
          start = c - 1;
          end = c;
          direction = "backward";
        } else if (maxLength > 1 && val.length > 1) {
          let offset = 0;
          if (prev[0] !== null && prev[1] !== null) {
            direction = c < prev[0] ? "backward" : "forward";
            const wasPreviouslyInserting = prev[0] === prev[1] && prev[0] < maxLength;
            if (direction === "backward" && !wasPreviouslyInserting) {
              offset = -1;
            }
          }
          start = offset - c;
          end = offset + c + 1;
        }
      }
      if (start !== -1 && end !== -1 && start !== end) {
        this.#inputRef.current?.setSelectionRange(start, end, direction);
      }
    }
    const s = start !== -1 ? start : selStart;
    const e = end !== -1 ? end : selEnd;
    const dir = direction ?? selDir;
    this.#mirrorSelectionStart = s;
    this.#mirrorSelectionEnd = e;
    this.#prevInputMetadata.prev = [s, e, dir];
  };
  oninput = (e) => {
    const newValue = e.currentTarget.value.slice(0, this.opts.maxLength.current);
    if (newValue.length > 0 && this.#regexPattern() && !this.#regexPattern().test(newValue)) {
      e.preventDefault();
      return;
    }
    const maybeHasDeleted = typeof this.#previousValue.current === "string" && newValue.length < this.#previousValue.current.length;
    if (maybeHasDeleted) {
      document.dispatchEvent(new Event("selectionchange"));
    }
    this.opts.value.current = newValue;
  };
  onfocus = (_) => {
    const input = this.#inputRef.current;
    if (input) {
      const start = Math.min(input.value.length, this.opts.maxLength.current - 1);
      const end = input.value.length;
      input.setSelectionRange(start, end);
      this.#mirrorSelectionStart = start;
      this.#mirrorSelectionEnd = end;
    }
    this.#isFocused.current = true;
  };
  onpaste = (e) => {
    const input = this.#inputRef.current;
    if (!input) return;
    const getNewValue = (finalContent) => {
      const start = input.selectionStart === null ? void 0 : input.selectionStart;
      const end = input.selectionEnd === null ? void 0 : input.selectionEnd;
      const isReplacing = start !== end;
      const initNewVal = this.opts.value.current;
      const newValueUncapped = isReplacing ? initNewVal.slice(0, start) + finalContent + initNewVal.slice(end) : initNewVal.slice(0, start) + finalContent + initNewVal.slice(start);
      return newValueUncapped.slice(0, this.opts.maxLength.current);
    };
    const isValueInvalid = (newValue2) => {
      return newValue2.length > 0 && this.#regexPattern() && !this.#regexPattern().test(newValue2);
    };
    if (!this.opts.pasteTransformer?.current && (!this.#initialLoad.isIOS || !e.clipboardData || !input)) {
      const newValue2 = getNewValue(e.clipboardData?.getData("text/plain"));
      if (isValueInvalid(newValue2)) {
        e.preventDefault();
      }
      return;
    }
    const _content = e.clipboardData?.getData("text/plain") ?? "";
    const content = this.opts.pasteTransformer?.current ? this.opts.pasteTransformer.current(_content) : _content;
    e.preventDefault();
    const newValue = getNewValue(content);
    if (isValueInvalid(newValue)) return;
    input.value = newValue;
    this.opts.value.current = newValue;
    const selStart = Math.min(newValue.length, this.opts.maxLength.current - 1);
    const selEnd = newValue.length;
    input.setSelectionRange(selStart, selEnd);
    this.#mirrorSelectionStart = selStart;
    this.#mirrorSelectionEnd = selEnd;
  };
  onmouseover = (_) => {
    this.#isHoveringInput = true;
  };
  onmouseleave = (_) => {
    this.#isHoveringInput = false;
  };
  onblur = (_) => {
    if (this.#prevInputMetadata.willSyntheticBlur) {
      this.#prevInputMetadata.willSyntheticBlur = false;
      return;
    }
    this.#isFocused.current = false;
  };
  #inputProps = derived(() => ({
    id: this.opts.inputId.current,
    style: this.#inputStyle(),
    autocomplete: this.opts.autocomplete.current || "one-time-code",
    "data-pin-input-input": "",
    "data-pin-input-input-mss": this.#mirrorSelectionStart,
    "data-pin-input-input-mse": this.#mirrorSelectionEnd,
    inputmode: this.opts.inputmode.current,
    pattern: this.#regexPattern()?.source,
    maxlength: this.opts.maxLength.current,
    value: this.opts.value.current,
    disabled: getDisabled(this.opts.disabled.current),
    //
    onpaste: this.onpaste,
    oninput: this.oninput,
    onkeydown: this.onkeydown,
    onmouseover: this.onmouseover,
    onmouseleave: this.onmouseleave,
    onfocus: this.onfocus,
    onblur: this.onblur
  }));
  get inputProps() {
    return this.#inputProps();
  }
  set inputProps($$value) {
    return this.#inputProps($$value);
  }
  #cells = derived(() => Array.from({ length: this.opts.maxLength.current }).map((_, idx) => {
    const isActive = this.#isFocused.current && this.#mirrorSelectionStart !== null && this.#mirrorSelectionEnd !== null && (this.#mirrorSelectionStart === this.#mirrorSelectionEnd && idx === this.#mirrorSelectionStart || idx >= this.#mirrorSelectionStart && idx < this.#mirrorSelectionEnd);
    const char = this.opts.value.current[idx] !== void 0 ? this.opts.value.current[idx] : null;
    return {
      char,
      isActive,
      hasFakeCaret: isActive && char === null
    };
  }));
  #snippetProps = derived(() => ({
    cells: this.#cells(),
    isFocused: this.#isFocused.current,
    isHovering: this.#isHoveringInput
  }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
}
class PinInputCellState {
  opts;
  constructor(opts) {
    this.opts = opts;
    useRefById({ id: this.opts.id, ref: this.opts.ref });
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [CELL_ATTR]: "",
    "data-active": this.opts.cell.current.isActive ? "" : void 0,
    "data-inactive": !this.opts.cell.current.isActive ? "" : void 0
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function syncTimeouts(cb) {
  const t1 = setTimeout(cb, 0);
  const t2 = setTimeout(cb, 10);
  const t3 = setTimeout(cb, 50);
  return [t1, t2, t3];
}
function safeInsertRule(sheet, rule) {
  try {
    sheet.insertRule(rule);
  } catch {
    console.error("pin input could not insert CSS rule:", rule);
  }
}
function usePinInput(props) {
  return new PinInputRootState(props);
}
function usePinInputCell(props) {
  return new PinInputCellState(props);
}
function Pin_input($$payload, $$props) {
  push();
  let {
    id = useId(),
    inputId = useId(),
    ref = null,
    maxlength = 6,
    textalign = "left",
    pattern,
    inputmode = "numeric",
    onComplete = noop,
    pushPasswordManagerStrategy = "increase-width",
    class: containerClass = "",
    children,
    autocomplete = "one-time-code",
    disabled = false,
    value = "",
    onValueChange = noop,
    pasteTransformer,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = usePinInput({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    inputId: box.with(() => inputId),
    autocomplete: box.with(() => autocomplete),
    maxLength: box.with(() => maxlength),
    textAlign: box.with(() => textalign),
    disabled: box.with(() => disabled),
    inputmode: box.with(() => inputmode),
    pattern: box.with(() => pattern),
    onComplete: box.with(() => onComplete),
    value: box.with(() => value, (v) => {
      value = v;
      onValueChange(v);
    }),
    pushPasswordManagerStrategy: box.with(() => pushPasswordManagerStrategy),
    pasteTransformer: box.with(() => pasteTransformer)
  });
  const mergedInputProps = mergeProps(restProps, rootState.inputProps);
  const mergedRootProps = mergeProps(rootState.rootProps, { class: containerClass });
  const mergedInputWrapperProps = mergeProps(rootState.inputWrapperProps, {});
  $$payload.out += `<div${spread_attributes({ ...mergedRootProps }, null)}>`;
  children?.($$payload, rootState.snippetProps);
  $$payload.out += `<!----> <div${spread_attributes({ ...mergedInputWrapperProps }, null)}><input${spread_attributes({ ...mergedInputProps }, null)}/></div></div>`;
  bind_props($$props, { ref, value });
  pop();
}
function Pin_input_cell($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    cell,
    child,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const cellState = usePinInputCell({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    cell: box.with(() => cell)
  });
  const mergedProps = mergeProps(restProps, cellState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps }, null)}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Eye_off($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
      }
    ],
    [
      "path",
      { "d": "M14.084 14.158a3 3 0 0 1-4.242-4.242" }
    ],
    [
      "path",
      {
        "d": "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
      }
    ],
    ["path", { "d": "m2 2 20 20" }]
  ];
  Icon($$payload, spread_props([
    { name: "eye-off" },
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
const en_verify_token_verification_code = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Verification code`;
  }
);
const es_verify_token_verification_code = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Código de verificación`;
  }
);
const verify_token_verification_code = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("verify_token_verification_code", locale);
  if (locale === "en") return en_verify_token_verification_code();
  if (locale === "es") return es_verify_token_verification_code();
  return "verify_token.verification_code";
};
const en_verify_token_resend = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Resend code`;
  }
);
const es_verify_token_resend = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Reenviar código`;
  }
);
const verify_token_resend = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("verify_token_resend", locale);
  if (locale === "en") return en_verify_token_resend();
  if (locale === "es") return es_verify_token_resend();
  return "verify_token.resend";
};
const en_verify_token_resend_in = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Resend in`;
  }
);
const es_verify_token_resend_in = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Reenviar en`;
  }
);
const verify_token_resend_in = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("verify_token_resend_in", locale);
  if (locale === "en") return en_verify_token_resend_in();
  if (locale === "es") return es_verify_token_resend_in();
  return "verify_token.resend_in";
};
const en_verify_token_error_dev_mode_error = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Notification failed, but you're in development.`;
  }
);
const es_verify_token_error_dev_mode_error = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `La notificación falló, pero estás en desarrollo.`;
  }
);
const verify_token_error_dev_mode_error = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("verify_token_error_dev_mode_error", locale);
  if (locale === "en") return en_verify_token_error_dev_mode_error();
  if (locale === "es") return es_verify_token_error_dev_mode_error();
  return "verify_token.error.dev_mode_error";
};
const en_verify_token_error_invalid = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `We could not verify the token you entered. Please try again.`;
  }
);
const es_verify_token_error_invalid = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `No pudimos verificar el token que ingresaste. Por favor, inténtalo de nuevo.`;
  }
);
const verify_token_error_invalid = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("verify_token_error_invalid", locale);
  if (locale === "en") return en_verify_token_error_invalid();
  if (locale === "es") return es_verify_token_error_invalid();
  return "verify_token.error.invalid";
};
function Input_otp_group($$payload, $$props) {
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
      class: clsx(cn("flex items-center", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Input_otp_slot($$payload, $$props) {
  push();
  let {
    ref = null,
    cell,
    class: className,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Pin_input_cell($$payload2, spread_props([
      {
        cell,
        class: cn("relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md", cell.isActive && "z-10 ring-2 ring-ring ring-offset-background", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(cell.char)} `;
          if (cell.hasFakeCaret) {
            $$payload3.out += "<!--[-->";
            $$payload3.out += `<div class="pointer-events-none absolute inset-0 flex items-center justify-center"><div class="h-4 w-px animate-caret-blink bg-foreground duration-1000"></div></div>`;
          } else {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
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
function Input_otp($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    value = "",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Pin_input($$payload2, spread_props([
      {
        class: cn("flex items-center gap-2 has-[:disabled]:opacity-50 [&_input]:disabled:cursor-not-allowed", className)
      },
      restProps,
      {
        get ref() {
          return ref;
        },
        set ref($$value) {
          ref = $$value;
          $$settled = false;
        },
        get value() {
          return value;
        },
        set value($$value) {
          value = $$value;
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
  bind_props($$props, { ref, value });
  pop();
}
function Form_otp_input($$payload, $$props) {
  push();
  var $$store_subs;
  let {
    form,
    fieldName = "emailOtp",
    label = /* @__PURE__ */ verify_token_verification_code(),
    length = 6,
    id = "verification-code",
    pattern = REGEXP_ONLY_DIGITS,
    showResend = false,
    canResend = false,
    resendLabel = /* @__PURE__ */ verify_token_resend(),
    resendTimerLabel = /* @__PURE__ */ verify_token_resend_in(),
    resendTimer = 0,
    onResendClick = void 0,
    showBackButton = false,
    backButtonLabel = "back",
    onBackButtonClick = void 0
  } = $$props;
  const errors = form.errors;
  const formData = form.form;
  const formatTime = () => {
    const mins = Math.floor(resendTimer / 60);
    const secs = resendTimer % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Form_field($$payload2, {
      form,
      name: fieldName,
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        {
          let children = function($$payload4, { props }) {
            $$payload4.out += `<!---->`;
            Form_label($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->${escape_html(label)}`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            {
              let children2 = function($$payload5, { cells }) {
                $$payload5.out += `<!---->`;
                Input_otp_group($$payload5, {
                  class: "w-full",
                  children: ($$payload6) => {
                    const each_array = ensure_array_like(cells);
                    $$payload6.out += `<!--[-->`;
                    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                      let cell = each_array[$$index];
                      $$payload6.out += `<!---->`;
                      Input_otp_slot($$payload6, {
                        cell,
                        class: store_get($$store_subs ??= {}, "$errors", errors)[fieldName] ? "border-red-500 focus-visible:ring-red-500" : "border-muted-foreground"
                      });
                      $$payload6.out += `<!---->`;
                    }
                    $$payload6.out += `<!--]-->`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              };
              Input_otp($$payload4, spread_props([
                props,
                {
                  id,
                  pattern,
                  maxlength: length,
                  get value() {
                    return store_get($$store_subs ??= {}, "$formData", formData)[fieldName];
                  },
                  set value($$value) {
                    store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData)[fieldName] = $$value);
                    $$settled = false;
                  },
                  children: children2,
                  $$slots: { default: true }
                }
              ]));
            }
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
    if (showResend || showBackButton) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex justify-between text-sm"><!---->`;
      Form_button$1($$payload2, {
        variant: "link",
        class: "px-0 text-muted-foreground underline",
        disabled: !canResend,
        onclick: (e) => {
          e.preventDefault();
          if (onResendClick) onResendClick();
        },
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(canResend ? resendLabel : `${resendTimerLabel} ${formatTime()}`)}`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      if (showBackButton) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<!---->`;
        Form_button$1($$payload2, {
          variant: "link",
          class: "ml-auto px-0",
          onclick: (e) => {
            e.preventDefault();
            if (onBackButtonClick) onBackButtonClick();
          },
          children: ($$payload3) => {
            $$payload3.out += `<!---->${escape_html(backButtonLabel)}`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
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
function Form_password_input($$payload, $$props) {
  push();
  var $$store_subs;
  let {
    form,
    fieldName = "password",
    placeholder = "Your password must be at least 8 characters",
    label = "Password"
  } = $$props;
  const { form: formData, errors } = form;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Form_field($$payload2, {
      form,
      name: fieldName,
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        {
          let children = function($$payload4, { props }) {
            $$payload4.out += `<!---->`;
            Form_label($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->${escape_html(label)}`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <div class="relative">`;
            Input($$payload4, spread_props([
              props,
              {
                placeholder,
                type: "password",
                class: cn("border-2 transition-all duration-200", store_get($$store_subs ??= {}, "$errors", errors)[fieldName] ? "border-red-500 focus-visible:border-transparent focus-visible:ring-red-500" : "border-gray-300 focus-visible:border-transparent", "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"),
                get value() {
                  return store_get($$store_subs ??= {}, "$formData", formData)[fieldName];
                },
                set value($$value) {
                  store_mutate($$store_subs ??= {}, "$formData", formData, store_get($$store_subs ??= {}, "$formData", formData)[fieldName] = $$value);
                  $$settled = false;
                }
              }
            ]));
            $$payload4.out += `<!----> <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"${attr("aria-label", "Show password")}>`;
            {
              $$payload4.out += "<!--[!-->";
              Eye_off($$payload4, { size: 20 });
            }
            $$payload4.out += `<!--]--></button></div>`;
          };
          Control($$payload3, { children });
        }
        $$payload3.out += `<!----> <!---->`;
        Form_field_errors($$payload3, {});
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!---->`;
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
let errorMessage = "";
let tokenStatus = MsaTokenStatus.unset;
let listening = true;
class MsaListenerHandler {
  listenerRef = "";
  listenerId;
  response;
  onNotificationSent;
  onFailure;
  onSuccess;
  constructor(listenerId, response, onNotificationSent, onFailure, onSuccess) {
    this.listenerId = listenerId;
    this.response = response;
    this.onNotificationSent = onNotificationSent;
    this.onFailure = onFailure;
    this.onSuccess = onSuccess;
    this.initialize();
  }
  initialize() {
    if (!this.response.object || !this.response.object.run) {
      errorMessage = "Missing response object";
      console.error("MsaListenerHandler.initialize: error: ", errorMessage);
      return;
    }
    try {
      this.listenerRef = this.response.object.run.addListener({
        id: this.listenerId,
        onEvent: async (eventType, action) => {
          if (eventType === MultiStepActionEventType.notificationFailed) {
            if (public_env.PUBLIC_APP_ENVIRONMENT === "development") {
              errorMessage = /* @__PURE__ */ verify_token_error_dev_mode_error();
              if (this.onNotificationSent) this.onNotificationSent();
              return;
            }
            console.error(`${this.listenerId}.multiStepActionListener: Notification failed.`, action.notificationResult);
            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            if (this.onFailure) this.onFailure();
            return;
          }
          if (eventType === MultiStepActionEventType.notificationSent) {
            tokenStatus = MsaTokenStatus.notificationSent;
            if (this.onNotificationSent) this.onNotificationSent();
            return;
          }
          if (eventType === MultiStepActionEventType.tokenFailed) {
            errorMessage = /* @__PURE__ */ verify_token_error_invalid();
            if (this.onFailure) this.onFailure();
            return;
          }
          if (eventType === MultiStepActionEventType.timedOut) {
            console.error(`${this.listenerId}.multiStepActionListener: timeout.`, action.notificationResult);
            tokenStatus = MsaTokenStatus.sendingFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            if (this.onFailure) this.onFailure();
            return;
          }
          if (eventType === MultiStepActionEventType.failed) {
            console.error(`${this.listenerId}.multiStepActionListener: error.`, action.notificationResult);
            tokenStatus = MsaTokenStatus.verificationFailed;
            errorMessage = translate(AppUiMessage.msaTokenFailedToSend, AppUiMessage.systemError);
            if (this.onFailure) this.onFailure();
            return;
          }
          if (eventType === MultiStepActionEventType.success) {
            tokenStatus = MsaTokenStatus.success;
            if (this.onSuccess) this.onSuccess();
          }
        }
      });
    } catch (error) {
      console.error(`${this.listenerId}.addMsaListener:`, { error });
      tokenStatus = MsaTokenStatus.verificationFailed;
      errorMessage = translate(AppUiMessage.systemError);
    } finally {
      listening = false;
    }
  }
  removeListener() {
    try {
      if (this.listenerRef && this.response.object?.run) {
        if (this.response.object.run.abort) {
          this.response.object.run.abort();
        }
        if (this.response.object.run.removeListener) {
          this.response.object.run.removeListener(this.listenerRef);
        } else {
          console.error(`removeListener method not found on run object for ${this.listenerId}`);
        }
      } else {
        console.warn(`Cannot remove listener for ${this.listenerId}: listenerRef=${this.listenerRef}, run=${!!this.response.object?.run}`);
      }
    } catch (error) {
      console.error(`Error removing listener for ${this.listenerId}:`, error);
    } finally {
      listening = false;
      this.listenerRef = "";
    }
  }
  getErrorMessage() {
    return errorMessage;
  }
  getTokenStatus() {
    return tokenStatus;
  }
  isListening() {
    return listening;
  }
}

export { Form_password_input as F, MsaListenerHandler as M, Form_otp_input as a, verify_token_verification_code as v };
//# sourceMappingURL=msa-listener-handler.svelte-Bv4sHlq9.js.map
