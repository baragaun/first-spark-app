import { q as push, z as ensure_array_like, A as attr, B as escape_html, u as pop, t as setContext, C as fallback, E as bind_props, F as getContext, G as head, I as spread_props, J as store_get, K as unsubscribe_stores, M as sanitize_props, N as rest_props, O as spread_attributes, P as clsx, Q as derived$1, R as attr_class, S as attr_style, T as slot, U as stringify, V as copy_payload, W as assign_payload } from './index-d9yomiCc.js';
import { h as get, w as writable, i as derived } from './exports-J2AlltLs.js';
import { h as html, G as Gift } from './gift-BIYfkpvh.js';
import { p as page } from './index3-DMvwsHdR.js';
import { p as public_env } from './shared-server-i79vVjEm.js';
import { c as ce, B as Button } from './button-B_xSpjF_.js';
import { I as IsMobile } from './is-mobile.svelte-C1SEZM9M.js';
import { c as cn$1, t as titleCase } from './utils-CCkZTMVc.js';
import { b as box, n as noop, w as watch, u as useId, m as mergeProps, a as useRefById, g as getDataDisabled } from './noop-kcrjqjA1.js';
import { C as Context } from './kbd-constants-tqlk3Es5.js';
import { i as isBrowser$1, a as isFocusVisible, b as isElement } from './is--6Wd6KIW.js';
import { R as Root$2, T as Trigger$1, D as Dropdown_menu_content, a as Dropdown_menu_item, F as Floating_layer, b as Dropdown_menu_shortcut, c as Floating_layer_anchor, P as Popper_layer_force_mount, d as Popper_layer, g as getFloatingContentCSSVars, u as useGraceArea } from './index4-j7NApTmy.js';
import { D as Dialog_overlay } from './dialog-overlay-D99JmK3L.js';
import { P as Portal } from './scroll-lock-BMUvnJ8g.js';
import { D as Dialog, a as Dialog_content, b as Dialog_close } from './dialog-content-C9LiXPSH.js';
import { X } from './x-CT7gPnZT.js';
import { b as localizeHref, c as locales, g as getLocale, t as trackMessageCall, f as setLocale } from './runtime-Bj_FdU8B.js';
import { g as get_started } from './get_started-Dhrk9Lqg.js';
import { a as appCanonicalUrl, b as appDescription, c as appTitle, h as headerSmallIcon, d as headerIcon } from './app-store.svelte-hO-d5cjK.js';
import { I as Icon$1 } from './Icon-CCGd_g73.js';
import { o as onDestroy } from './index-server-DeHLhTK0.js';
import { t as toastState, c as cn, u as useEffect } from './Toaster.svelte_svelte_type_style_lang-s80CJFld.js';
import { g as goto } from './client-BNK9U2wL.js';
import { m as myUserContext } from './my-user-context.svelte-C7pZorxo.js';
import { M as Meta_tags } from './meta-tags-DeO-_oXb.js';
import './client2-yWJSv2LX.js';
import './index-server2-_G0R5Qhl.js';
import './use-roving-focus.svelte-D3HknXeD.js';
import './events-CdTAYaIN.js';
import './translate-DAfkGQ1n.js';
import '@baragaun/bg-node-client';

let timeoutAction;
let timeoutEnable;
function withoutTransition(action) {
  if (typeof document === "undefined")
    return;
  clearTimeout(timeoutAction);
  clearTimeout(timeoutEnable);
  const style = document.createElement("style");
  const css = document.createTextNode(`* {
     -webkit-transition: none !important;
     -moz-transition: none !important;
     -o-transition: none !important;
     -ms-transition: none !important;
     transition: none !important;
  }`);
  style.appendChild(css);
  const disable = () => document.head.appendChild(style);
  const enable = () => document.head.removeChild(style);
  if (typeof window.getComputedStyle !== "undefined") {
    disable();
    action();
    window.getComputedStyle(style).opacity;
    enable();
    return;
  }
  if (typeof window.requestAnimationFrame !== "undefined") {
    disable();
    action();
    window.requestAnimationFrame(enable);
    return;
  }
  disable();
  timeoutAction = window.setTimeout(() => {
    action();
    timeoutEnable = window.setTimeout(enable, 120);
  }, 120);
}
function sanitizeClassNames(classNames) {
  return classNames.filter((className) => className.length > 0);
}
const noopStorage = {
  getItem: (_key) => null,
  setItem: (_key, _value) => {
  }
};
const isBrowser = typeof document !== "undefined";
const modes = ["dark", "light", "system"];
const modeStorageKey = writable("mode-watcher-mode");
const themeStorageKey = writable("mode-watcher-theme");
const userPrefersMode = createUserPrefersMode();
const systemPrefersMode = createSystemMode();
const themeColors = writable(void 0);
const theme = createCustomTheme();
const disableTransitions = writable(true);
const darkClassNames = writable([]);
const lightClassNames = writable([]);
const derivedMode = createDerivedMode();
createDerivedTheme();
function createUserPrefersMode() {
  const defaultValue = "system";
  const storage = isBrowser ? localStorage : noopStorage;
  const initialValue = storage.getItem(getModeStorageKey());
  let value = isValidMode(initialValue) ? initialValue : defaultValue;
  function getModeStorageKey() {
    return get(modeStorageKey);
  }
  const { subscribe, set: _set } = writable(value, () => {
    if (!isBrowser)
      return;
    const handler = (e) => {
      if (e.key !== getModeStorageKey())
        return;
      const newValue = e.newValue;
      if (isValidMode(newValue)) {
        _set(value = newValue);
      } else {
        _set(value = defaultValue);
      }
    };
    addEventListener("storage", handler);
    return () => removeEventListener("storage", handler);
  });
  function set(v) {
    _set(value = v);
    storage.setItem(getModeStorageKey(), value);
  }
  return {
    subscribe,
    set
  };
}
function createCustomTheme() {
  const storage = isBrowser ? localStorage : noopStorage;
  const initialValue = storage.getItem(getThemeStorageKey());
  let value = initialValue === null || initialValue === void 0 ? "" : initialValue;
  function getThemeStorageKey() {
    return get(themeStorageKey);
  }
  const { subscribe, set: _set } = writable(value, () => {
    if (!isBrowser)
      return;
    const handler = (e) => {
      if (e.key !== getThemeStorageKey())
        return;
      const newValue = e.newValue;
      if (newValue === null) {
        _set(value = "");
      } else {
        _set(value = newValue);
      }
    };
    addEventListener("storage", handler);
    return () => removeEventListener("storage", handler);
  });
  function set(v) {
    _set(value = v);
    storage.setItem(getThemeStorageKey(), value);
  }
  return {
    subscribe,
    set
  };
}
function createSystemMode() {
  const defaultValue = void 0;
  let track = true;
  const { subscribe, set } = writable(defaultValue, () => {
    if (!isBrowser)
      return;
    const handler = (e) => {
      if (!track)
        return;
      set(e.matches ? "light" : "dark");
    };
    const mediaQueryState = window.matchMedia("(prefers-color-scheme: light)");
    mediaQueryState.addEventListener("change", handler);
    return () => mediaQueryState.removeEventListener("change", handler);
  });
  function query() {
    if (!isBrowser)
      return;
    const mediaQueryState = window.matchMedia("(prefers-color-scheme: light)");
    set(mediaQueryState.matches ? "light" : "dark");
  }
  function tracking(active) {
    track = active;
  }
  return {
    subscribe,
    query,
    tracking
  };
}
function createDerivedMode() {
  const { subscribe } = derived([
    userPrefersMode,
    systemPrefersMode,
    themeColors,
    disableTransitions,
    darkClassNames,
    lightClassNames
  ], ([$userPrefersMode, $systemPrefersMode, $themeColors, $disableTransitions, $darkClassNames, $lightClassNames]) => {
    if (!isBrowser)
      return void 0;
    const derivedMode2 = $userPrefersMode === "system" ? $systemPrefersMode : $userPrefersMode;
    const sanitizedDarkClassNames = sanitizeClassNames($darkClassNames);
    const sanitizedLightClassNames = sanitizeClassNames($lightClassNames);
    function update() {
      const htmlEl = document.documentElement;
      const themeColorEl = document.querySelector('meta[name="theme-color"]');
      if (derivedMode2 === "light") {
        if (sanitizedDarkClassNames.length)
          htmlEl.classList.remove(...sanitizedDarkClassNames);
        if (sanitizedLightClassNames.length)
          htmlEl.classList.add(...sanitizedLightClassNames);
        htmlEl.style.colorScheme = "light";
        if (themeColorEl && $themeColors) {
          themeColorEl.setAttribute("content", $themeColors.light);
        }
      } else {
        if (sanitizedLightClassNames.length)
          htmlEl.classList.remove(...sanitizedLightClassNames);
        if (sanitizedDarkClassNames.length)
          htmlEl.classList.add(...sanitizedDarkClassNames);
        htmlEl.style.colorScheme = "dark";
        if (themeColorEl && $themeColors) {
          themeColorEl.setAttribute("content", $themeColors.dark);
        }
      }
    }
    if ($disableTransitions) {
      withoutTransition(update);
    } else {
      update();
    }
    return derivedMode2;
  });
  return {
    subscribe
  };
}
function createDerivedTheme() {
  const { subscribe } = derived([theme, disableTransitions], ([$theme, $disableTransitions]) => {
    if (!isBrowser)
      return void 0;
    function update() {
      const htmlEl = document.documentElement;
      htmlEl.setAttribute("data-theme", $theme);
    }
    if ($disableTransitions) {
      withoutTransition(update);
    } else {
      update();
    }
    return $theme;
  });
  return {
    subscribe
  };
}
function isValidMode(value) {
  if (typeof value !== "string")
    return false;
  return modes.includes(value);
}
function defineConfig(config) {
  return config;
}
function setInitialMode({ defaultMode = "system", themeColors: themeColors2, darkClassNames: darkClassNames2 = ["dark"], lightClassNames: lightClassNames2 = [], defaultTheme = "", modeStorageKey: modeStorageKey2 = "mode-watcher-mode", themeStorageKey: themeStorageKey2 = "mode-watcher-theme" }) {
  const rootEl = document.documentElement;
  const mode = localStorage.getItem(modeStorageKey2) || defaultMode;
  const theme2 = localStorage.getItem(themeStorageKey2) || defaultTheme;
  const light = mode === "light" || mode === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
  if (light) {
    if (darkClassNames2.length)
      rootEl.classList.remove(...darkClassNames2);
    if (lightClassNames2.length)
      rootEl.classList.add(...lightClassNames2);
  } else {
    if (lightClassNames2.length)
      rootEl.classList.remove(...lightClassNames2);
    if (darkClassNames2.length)
      rootEl.classList.add(...darkClassNames2);
  }
  rootEl.style.colorScheme = light ? "light" : "dark";
  if (themeColors2) {
    const themeMetaEl = document.querySelector('meta[name="theme-color"]');
    if (themeMetaEl) {
      themeMetaEl.setAttribute("content", mode === "light" ? themeColors2.light : themeColors2.dark);
    }
  }
  if (theme2) {
    rootEl.setAttribute("data-theme", theme2);
    localStorage.setItem(themeStorageKey2, theme2);
  }
  localStorage.setItem(modeStorageKey2, mode);
}
function Mode_watcher_lite($$payload, $$props) {
  push();
  let themeColors2 = fallback($$props["themeColors"], () => void 0, true);
  if (themeColors2) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<meta name="theme-color"${attr("content", themeColors2.dark)}/>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { themeColors: themeColors2 });
  pop();
}
function Mode_watcher_full($$payload, $$props) {
  push();
  let trueNonce = fallback($$props["trueNonce"], "");
  let initConfig = $$props["initConfig"];
  let themeColors2 = fallback($$props["themeColors"], () => void 0, true);
  head($$payload, ($$payload2) => {
    if (themeColors2) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<meta name="theme-color"${attr("content", themeColors2.dark)}/>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> ${html(`<script${trueNonce ? ` nonce=${trueNonce}` : ""}>(` + setInitialMode.toString() + `)(` + JSON.stringify(initConfig) + `);<\/script>`)}`;
  });
  bind_props($$props, { trueNonce, initConfig, themeColors: themeColors2 });
  pop();
}
function Mode_watcher($$payload, $$props) {
  push();
  let trueNonce;
  let track = fallback($$props["track"], true);
  let defaultMode = fallback($$props["defaultMode"], "system");
  let themeColors$1 = fallback($$props["themeColors"], () => void 0, true);
  let disableTransitions$1 = fallback($$props["disableTransitions"], true);
  let darkClassNames$1 = fallback($$props["darkClassNames"], () => ["dark"], true);
  let lightClassNames$1 = fallback($$props["lightClassNames"], () => [], true);
  let defaultTheme = fallback($$props["defaultTheme"], "");
  let nonce = fallback($$props["nonce"], "");
  let themeStorageKey$1 = fallback($$props["themeStorageKey"], "mode-watcher-theme");
  let modeStorageKey$1 = fallback($$props["modeStorageKey"], "mode-watcher-mode");
  let disableHeadScriptInjection = fallback($$props["disableHeadScriptInjection"], false);
  const initConfig = defineConfig({
    defaultMode,
    themeColors: themeColors$1,
    darkClassNames: darkClassNames$1,
    lightClassNames: lightClassNames$1,
    defaultTheme,
    modeStorageKey: modeStorageKey$1,
    themeStorageKey: themeStorageKey$1
  });
  disableTransitions.set(disableTransitions$1);
  themeColors.set(themeColors$1);
  darkClassNames.set(darkClassNames$1);
  lightClassNames.set(lightClassNames$1);
  modeStorageKey.set(modeStorageKey$1);
  themeStorageKey.set(themeStorageKey$1);
  trueNonce = typeof window === "undefined" ? nonce : "";
  if (disableHeadScriptInjection) {
    $$payload.out += "<!--[-->";
    Mode_watcher_lite($$payload, { themeColors: themeColors$1 });
  } else {
    $$payload.out += "<!--[!-->";
    Mode_watcher_full($$payload, { trueNonce, initConfig, themeColors: themeColors$1 });
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    track,
    defaultMode,
    themeColors: themeColors$1,
    disableTransitions: disableTransitions$1,
    darkClassNames: darkClassNames$1,
    lightClassNames: lightClassNames$1,
    defaultTheme,
    nonce,
    themeStorageKey: themeStorageKey$1,
    modeStorageKey: modeStorageKey$1,
    disableHeadScriptInjection
  });
  pop();
}
const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
class SidebarState {
  props;
  #open = derived$1(() => this.props.open());
  get open() {
    return this.#open();
  }
  set open($$value) {
    return this.#open($$value);
  }
  openMobile = false;
  setOpen;
  #isMobile;
  #state = derived$1(() => this.open ? "expanded" : "collapsed");
  get state() {
    return this.#state();
  }
  set state($$value) {
    return this.#state($$value);
  }
  constructor(props) {
    this.setOpen = props.setOpen;
    this.#isMobile = new IsMobile();
    this.props = props;
  }
  // Convenience getter for checking if the sidebar is mobile
  // without this, we would need to use `sidebar.isMobile.current` everywhere
  get isMobile() {
    return this.#isMobile.current;
  }
  // Event handler to apply to the `<svelte:window>`
  handleShortcutKeydown = (e) => {
    if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this.toggle();
    }
  };
  setOpenMobile = (value) => {
    this.openMobile = value;
  };
  toggle = () => {
    return this.#isMobile.current ? this.openMobile = !this.openMobile : this.setOpen(!this.open);
  };
}
const SYMBOL_KEY = "scn-sidebar";
function setSidebar(props) {
  return setContext(Symbol.for(SYMBOL_KEY), new SidebarState(props));
}
function useSidebar() {
  return getContext(Symbol.for(SYMBOL_KEY));
}
function Sidebar_content($$payload, $$props) {
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
      "data-sidebar": "content",
      class: clsx(cn$1("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_group($$payload, $$props) {
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
      "data-sidebar": "group",
      class: clsx(cn$1("relative flex w-full min-w-0 flex-col p-2", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_header($$payload, $$props) {
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
      "data-sidebar": "header",
      class: clsx(cn$1("flex flex-col gap-2 p-2", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function useTimeoutFn(cb, interval, options = {}) {
  const { immediate = true } = options;
  const isPending = box(false);
  let timer;
  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function stop() {
    isPending.current = false;
    clear();
  }
  function start(...args) {
    clear();
    isPending.current = true;
    timer = setTimeout(
      () => {
        isPending.current = false;
        timer = null;
        cb(...args);
      },
      interval
    );
  }
  if (immediate) {
    isPending.current = true;
    if (isBrowser$1) start();
  }
  return {
    isPending: box.readonly(isPending),
    start,
    stop
  };
}
const TOOLTIP_CONTENT_ATTR = "data-tooltip-content";
const TOOLTIP_TRIGGER_ATTR = "data-tooltip-trigger";
class TooltipProviderState {
  opts;
  isOpenDelayed = true;
  isPointerInTransit = box(false);
  #timerFn;
  #openTooltip = null;
  constructor(opts) {
    this.opts = opts;
    this.#timerFn = useTimeoutFn(
      () => {
        this.isOpenDelayed = true;
      },
      this.opts.skipDelayDuration.current,
      { immediate: false }
    );
  }
  #startTimer = () => {
    const skipDuration = this.opts.skipDelayDuration.current;
    if (skipDuration === 0) {
      return;
    } else {
      this.#timerFn.start();
    }
  };
  #clearTimer = () => {
    this.#timerFn.stop();
  };
  onOpen = (tooltip) => {
    if (this.#openTooltip && this.#openTooltip !== tooltip) {
      this.#openTooltip.handleClose();
    }
    this.#clearTimer();
    this.isOpenDelayed = false;
    this.#openTooltip = tooltip;
  };
  onClose = (tooltip) => {
    if (this.#openTooltip === tooltip) {
      this.#openTooltip = null;
    }
    this.#startTimer();
  };
  isTooltipOpen = (tooltip) => {
    return this.#openTooltip === tooltip;
  };
}
class TooltipRootState {
  opts;
  provider;
  #delayDuration = derived$1(() => this.opts.delayDuration.current ?? this.provider.opts.delayDuration.current);
  get delayDuration() {
    return this.#delayDuration();
  }
  set delayDuration($$value) {
    return this.#delayDuration($$value);
  }
  #disableHoverableContent = derived$1(() => this.opts.disableHoverableContent.current ?? this.provider.opts.disableHoverableContent.current);
  get disableHoverableContent() {
    return this.#disableHoverableContent();
  }
  set disableHoverableContent($$value) {
    return this.#disableHoverableContent($$value);
  }
  #disableCloseOnTriggerClick = derived$1(() => this.opts.disableCloseOnTriggerClick.current ?? this.provider.opts.disableCloseOnTriggerClick.current);
  get disableCloseOnTriggerClick() {
    return this.#disableCloseOnTriggerClick();
  }
  set disableCloseOnTriggerClick($$value) {
    return this.#disableCloseOnTriggerClick($$value);
  }
  #disabled = derived$1(() => this.opts.disabled.current ?? this.provider.opts.disabled.current);
  get disabled() {
    return this.#disabled();
  }
  set disabled($$value) {
    return this.#disabled($$value);
  }
  #ignoreNonKeyboardFocus = derived$1(() => this.opts.ignoreNonKeyboardFocus.current ?? this.provider.opts.ignoreNonKeyboardFocus.current);
  get ignoreNonKeyboardFocus() {
    return this.#ignoreNonKeyboardFocus();
  }
  set ignoreNonKeyboardFocus($$value) {
    return this.#ignoreNonKeyboardFocus($$value);
  }
  contentNode = null;
  triggerNode = null;
  #wasOpenDelayed = false;
  #timerFn;
  #stateAttr = derived$1(() => {
    if (!this.opts.open.current) return "closed";
    return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
  });
  get stateAttr() {
    return this.#stateAttr();
  }
  set stateAttr($$value) {
    return this.#stateAttr($$value);
  }
  constructor(opts, provider) {
    this.opts = opts;
    this.provider = provider;
    this.#timerFn = useTimeoutFn(
      () => {
        this.#wasOpenDelayed = true;
        this.opts.open.current = true;
      },
      this.delayDuration ?? 0,
      { immediate: false }
    );
    watch(() => this.delayDuration, () => {
      if (this.delayDuration === void 0) return;
      this.#timerFn = useTimeoutFn(
        () => {
          this.#wasOpenDelayed = true;
          this.opts.open.current = true;
        },
        this.delayDuration,
        { immediate: false }
      );
    });
    watch(() => this.opts.open.current, (isOpen) => {
      if (isOpen) {
        this.provider.onOpen(this);
      } else {
        this.provider.onClose(this);
      }
    });
  }
  handleOpen = () => {
    this.#timerFn.stop();
    this.#wasOpenDelayed = false;
    this.opts.open.current = true;
  };
  handleClose = () => {
    this.#timerFn.stop();
    this.opts.open.current = false;
  };
  #handleDelayedOpen = () => {
    this.#timerFn.stop();
    const shouldSkipDelay = !this.provider.isOpenDelayed;
    const delayDuration = this.delayDuration ?? 0;
    if (shouldSkipDelay || delayDuration === 0) {
      this.#wasOpenDelayed = delayDuration > 0 && shouldSkipDelay;
      this.opts.open.current = true;
    } else {
      this.#timerFn.start();
    }
  };
  onTriggerEnter = () => {
    this.#handleDelayedOpen();
  };
  onTriggerLeave = () => {
    if (this.disableHoverableContent) {
      this.handleClose();
    } else {
      this.#timerFn.stop();
    }
  };
}
class TooltipTriggerState {
  opts;
  root;
  #isPointerDown = box(false);
  #hasPointerMoveOpened = false;
  #isDisabled = derived$1(() => this.opts.disabled.current || this.root.disabled);
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.triggerNode = node;
      }
    });
  }
  handlePointerUp = () => {
    this.#isPointerDown.current = false;
  };
  #onpointerup = () => {
    if (this.#isDisabled()) return;
    this.#isPointerDown.current = false;
  };
  #onpointerdown = () => {
    if (this.#isDisabled()) return;
    this.#isPointerDown.current = true;
    document.addEventListener(
      "pointerup",
      () => {
        this.handlePointerUp();
      },
      { once: true }
    );
  };
  #onpointermove = (e) => {
    if (this.#isDisabled()) return;
    if (e.pointerType === "touch") return;
    if (this.#hasPointerMoveOpened) return;
    if (this.root.provider.isPointerInTransit.current) return;
    this.root.onTriggerEnter();
    this.#hasPointerMoveOpened = true;
  };
  #onpointerleave = () => {
    if (this.#isDisabled()) return;
    this.root.onTriggerLeave();
    this.#hasPointerMoveOpened = false;
  };
  #onfocus = (e) => {
    if (this.#isPointerDown.current || this.#isDisabled()) return;
    if (this.root.ignoreNonKeyboardFocus && !isFocusVisible(e.currentTarget)) return;
    this.root.handleOpen();
  };
  #onblur = () => {
    if (this.#isDisabled()) return;
    this.root.handleClose();
  };
  #onclick = () => {
    if (this.root.disableCloseOnTriggerClick || this.#isDisabled()) return;
    this.root.handleClose();
  };
  #props = derived$1(() => ({
    id: this.opts.id.current,
    "aria-describedby": this.root.opts.open.current ? this.root.contentNode?.id : void 0,
    "data-state": this.root.stateAttr,
    "data-disabled": getDataDisabled(this.#isDisabled()),
    "data-delay-duration": `${this.root.delayDuration}`,
    [TOOLTIP_TRIGGER_ATTR]: "",
    tabindex: this.#isDisabled() ? void 0 : 0,
    disabled: this.opts.disabled.current,
    onpointerup: this.#onpointerup,
    onpointerdown: this.#onpointerdown,
    onpointermove: this.#onpointermove,
    onpointerleave: this.#onpointerleave,
    onfocus: this.#onfocus,
    onblur: this.#onblur,
    onclick: this.#onclick
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class TooltipContentState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById({
      ...opts,
      onRefChange: (node) => {
        this.root.contentNode = node;
      },
      deps: () => this.root.opts.open.current
    });
    useGraceArea({
      triggerNode: () => this.root.triggerNode,
      contentNode: () => this.root.contentNode,
      enabled: () => this.root.opts.open.current && !this.root.disableHoverableContent,
      onPointerExit: () => {
        if (this.root.provider.isTooltipOpen(this.root)) {
          this.root.handleClose();
        }
      },
      setIsPointerInTransit: (value) => {
        this.root.provider.isPointerInTransit.current = value;
      },
      transitTimeout: this.root.provider.opts.skipDelayDuration.current
    });
  }
  onInteractOutside = (e) => {
    if (isElement(e.target) && this.root.triggerNode?.contains(e.target) && this.root.disableCloseOnTriggerClick) {
      e.preventDefault();
      return;
    }
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current?.(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onOpenAutoFocus = (e) => {
    e.preventDefault();
  };
  onCloseAutoFocus = (e) => {
    e.preventDefault();
  };
  #snippetProps = derived$1(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived$1(() => ({
    id: this.opts.id.current,
    "data-state": this.root.stateAttr,
    "data-disabled": getDataDisabled(this.root.disabled),
    style: { pointerEvents: "auto", outline: "none" },
    [TOOLTIP_CONTENT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown,
    onOpenAutoFocus: this.onOpenAutoFocus,
    onCloseAutoFocus: this.onCloseAutoFocus
  };
}
const TooltipProviderContext = new Context("Tooltip.Provider");
const TooltipRootContext = new Context("Tooltip.Root");
function useTooltipProvider(props) {
  return TooltipProviderContext.set(new TooltipProviderState(props));
}
function useTooltipRoot(props) {
  return TooltipRootContext.set(new TooltipRootState(props, TooltipProviderContext.get()));
}
function useTooltipTrigger(props) {
  return new TooltipTriggerState(props, TooltipRootContext.get());
}
function useTooltipContent(props) {
  return new TooltipContentState(props, TooltipRootContext.get());
}
function Tooltip($$payload, $$props) {
  push();
  let {
    open = false,
    onOpenChange = noop,
    disabled,
    delayDuration,
    disableCloseOnTriggerClick,
    disableHoverableContent,
    ignoreNonKeyboardFocus,
    children
  } = $$props;
  useTooltipRoot({
    open: box.with(() => open, (v) => {
      open = v;
      onOpenChange(v);
    }),
    delayDuration: box.with(() => delayDuration),
    disableCloseOnTriggerClick: box.with(() => disableCloseOnTriggerClick),
    disableHoverableContent: box.with(() => disableHoverableContent),
    ignoreNonKeyboardFocus: box.with(() => ignoreNonKeyboardFocus),
    disabled: box.with(() => disabled)
  });
  Floating_layer($$payload, {
    children: ($$payload2) => {
      children?.($$payload2);
      $$payload2.out += `<!---->`;
    }
  });
  bind_props($$props, { open });
  pop();
}
function Tooltip_content$1($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    ref = null,
    side = "top",
    sideOffset = 0,
    align = "center",
    avoidCollisions = true,
    arrowPadding = 0,
    sticky = "partial",
    hideWhenDetached = false,
    collisionPadding = 0,
    onInteractOutside = noop,
    onEscapeKeydown = noop,
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useTooltipContent({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v),
    onInteractOutside: box.with(() => onInteractOutside),
    onEscapeKeydown: box.with(() => onEscapeKeydown)
  });
  const floatingProps = {
    side,
    sideOffset,
    align,
    avoidCollisions,
    arrowPadding,
    sticky,
    hideWhenDetached,
    collisionPadding
  };
  const mergedProps = mergeProps(restProps, floatingProps, contentState.props);
  if (forceMount) {
    $$payload.out += "<!--[-->";
    {
      let popper = function($$payload2, { props, wrapperProps }) {
        const mergedProps2 = mergeProps(props, {
          style: getFloatingContentCSSVars("tooltip")
        });
        if (child) {
          $$payload2.out += "<!--[-->";
          child($$payload2, {
            props: mergedProps2,
            wrapperProps,
            ...contentState.snippetProps
          });
          $$payload2.out += `<!---->`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<div${spread_attributes({ ...wrapperProps }, null)}><div${spread_attributes({ ...mergedProps2 }, null)}>`;
          children?.($$payload2);
          $$payload2.out += `<!----></div></div>`;
        }
        $$payload2.out += `<!--]-->`;
      };
      Popper_layer_force_mount($$payload, spread_props([
        mergedProps,
        contentState.popperProps,
        {
          enabled: contentState.root.opts.open.current,
          id,
          trapFocus: false,
          loop: false,
          preventScroll: false,
          forceMount: true,
          popper,
          $$slots: { popper: true }
        }
      ]));
    }
  } else if (!forceMount) {
    $$payload.out += "<!--[1-->";
    {
      let popper = function($$payload2, { props, wrapperProps }) {
        const mergedProps2 = mergeProps(props, {
          style: getFloatingContentCSSVars("tooltip")
        });
        if (child) {
          $$payload2.out += "<!--[-->";
          child($$payload2, {
            props: mergedProps2,
            wrapperProps,
            ...contentState.snippetProps
          });
          $$payload2.out += `<!---->`;
        } else {
          $$payload2.out += "<!--[!-->";
          $$payload2.out += `<div${spread_attributes({ ...wrapperProps }, null)}><div${spread_attributes({ ...mergedProps2 }, null)}>`;
          children?.($$payload2);
          $$payload2.out += `<!----></div></div>`;
        }
        $$payload2.out += `<!--]-->`;
      };
      Popper_layer($$payload, spread_props([
        mergedProps,
        contentState.popperProps,
        {
          present: contentState.root.opts.open.current,
          id,
          trapFocus: false,
          loop: false,
          preventScroll: false,
          forceMount: false,
          popper,
          $$slots: { popper: true }
        }
      ]));
    }
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Tooltip_trigger($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    disabled = false,
    type = "button",
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = useTooltipTrigger({
    id: box.with(() => id),
    disabled: box.with(() => disabled ?? false),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, triggerState.props, { type });
  Floating_layer_anchor($$payload, {
    id,
    children: ($$payload2) => {
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, { props: mergedProps });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<button${spread_attributes({ ...mergedProps }, null)}>`;
        children?.($$payload2);
        $$payload2.out += `<!----></button>`;
      }
      $$payload2.out += `<!--]-->`;
    }
  });
  bind_props($$props, { ref });
  pop();
}
function Tooltip_provider($$payload, $$props) {
  push();
  let {
    children,
    delayDuration = 700,
    disableCloseOnTriggerClick = false,
    disableHoverableContent = false,
    disabled = false,
    ignoreNonKeyboardFocus = false,
    skipDelayDuration = 300
  } = $$props;
  useTooltipProvider({
    delayDuration: box.with(() => delayDuration),
    disableCloseOnTriggerClick: box.with(() => disableCloseOnTriggerClick),
    disableHoverableContent: box.with(() => disableHoverableContent),
    disabled: box.with(() => disabled),
    ignoreNonKeyboardFocus: box.with(() => ignoreNonKeyboardFocus),
    skipDelayDuration: box.with(() => skipDelayDuration)
  });
  children?.($$payload);
  $$payload.out += `<!---->`;
  pop();
}
function Tooltip_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    sideOffset = 4,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Tooltip_content$1($$payload2, spread_props([
      {
        sideOffset,
        class: cn$1("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)
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
const Root$1 = Tooltip;
const Trigger = Tooltip_trigger;
const Provider = Tooltip_provider;
const sidebarMenuButtonVariants = ce({
  base: "peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline: "bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});
function Sidebar_menu_button($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    child,
    variant = "default",
    size = "default",
    isActive = false,
    tooltipContent,
    tooltipContentProps,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const sidebar = useSidebar();
  const buttonProps = {
    class: cn$1(sidebarMenuButtonVariants({ variant, size }), className),
    "data-sidebar": "menu-button",
    "data-size": size,
    "data-active": isActive,
    ...restProps
  };
  function Button2($$payload2, { props }) {
    const mergedProps = mergeProps(buttonProps, props);
    if (child) {
      $$payload2.out += "<!--[-->";
      child($$payload2, { props: mergedProps });
      $$payload2.out += `<!---->`;
    } else {
      $$payload2.out += "<!--[!-->";
      $$payload2.out += `<button${spread_attributes({ ...mergedProps }, null)}>`;
      children?.($$payload2);
      $$payload2.out += `<!----></button>`;
    }
    $$payload2.out += `<!--]-->`;
  }
  if (!tooltipContent) {
    $$payload.out += "<!--[-->";
    Button2($$payload, {});
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    Root$1($$payload, {
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        {
          let child2 = function($$payload3, { props }) {
            Button2($$payload3, { props });
          };
          Trigger($$payload2, { child: child2, $$slots: { child: true } });
        }
        $$payload2.out += `<!----> <!---->`;
        Tooltip_content($$payload2, spread_props([
          {
            side: "right",
            align: "center",
            hidden: sidebar.state !== "collapsed" || sidebar.isMobile,
            children: tooltipContent
          },
          tooltipContentProps
        ]));
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_menu_item($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<li${spread_attributes(
    {
      "data-sidebar": "menu-item",
      class: clsx(cn$1("group/menu-item relative", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></li>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_menu($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<ul${spread_attributes(
    {
      "data-sidebar": "menu",
      class: clsx(cn$1("flex w-full min-w-0 flex-col gap-1", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></ul>`;
  bind_props($$props, { ref });
  pop();
}
function Sidebar_provider($$payload, $$props) {
  push();
  let {
    ref = null,
    open = true,
    onOpenChange = () => {
    },
    class: className,
    style,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  setSidebar({
    open: () => open,
    setOpen: (value) => {
      open = value;
      onOpenChange(value);
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }
  });
  $$payload.out += `<!---->`;
  Provider($$payload, {
    delayDuration: 0,
    children: ($$payload2) => {
      $$payload2.out += `<div${spread_attributes(
        {
          style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH)}; --sidebar-width-icon: ${stringify(SIDEBAR_WIDTH_ICON)}; ${stringify(style)}`,
          class: clsx(cn$1("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className)),
          ...restProps
        },
        null
      )}>`;
      children?.($$payload2);
      $$payload2.out += `<!----></div>`;
    }
  });
  $$payload.out += `<!---->`;
  bind_props($$props, { ref, open });
  pop();
}
function Chevron_left($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
  Icon$1($$payload, spread_props([
    { name: "chevron-left" },
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
function History($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      }
    ],
    ["path", { "d": "M3 3v5h5" }],
    ["path", { "d": "M12 7v5l4 2" }]
  ];
  Icon$1($$payload, spread_props([
    { name: "history" },
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
function Languages($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m5 8 6 6" }],
    ["path", { "d": "m4 14 6-6 2-3" }],
    ["path", { "d": "M2 5h12" }],
    ["path", { "d": "M7 2h1" }],
    ["path", { "d": "m22 22-5-10-5 10" }],
    ["path", { "d": "M14 18h6" }]
  ];
  Icon$1($$payload, spread_props([
    { name: "languages" },
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
function Log_in($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
      }
    ],
    ["polyline", { "points": "10 17 15 12 10 7" }],
    [
      "line",
      {
        "x1": "15",
        "x2": "3",
        "y1": "12",
        "y2": "12"
      }
    ]
  ];
  Icon$1($$payload, spread_props([
    { name: "log-in" },
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
function Menu($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      { "x1": "4", "x2": "20", "y1": "6", "y2": "6" }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "18",
        "y2": "18"
      }
    ]
  ];
  Icon$1($$payload, spread_props([
    { name: "menu" },
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
function Plug_zap($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"
      }
    ],
    ["path", { "d": "m2 22 3-3" }],
    ["path", { "d": "M7.5 13.5 10 11" }],
    ["path", { "d": "M10.5 16.5 13 14" }],
    ["path", { "d": "m18 3-4 4h6l-4 4" }]
  ];
  Icon$1($$payload, spread_props([
    { name: "plug-zap" },
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
function Settings($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }
    ],
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "3" }
    ]
  ];
  Icon$1($$payload, spread_props([
    { name: "settings" },
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
function Shopping_cart($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "8", "cy": "21", "r": "1" }],
    [
      "circle",
      { "cx": "19", "cy": "21", "r": "1" }
    ],
    [
      "path",
      {
        "d": "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
      }
    ]
  ];
  Icon$1($$payload, spread_props([
    { name: "shopping-cart" },
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
function Wallet($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
      }
    ],
    [
      "path",
      {
        "d": "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"
      }
    ]
  ];
  Icon$1($$payload, spread_props([
    { name: "wallet" },
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
function Zap($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      }
    ]
  ];
  Icon$1($$payload, spread_props([
    { name: "zap" },
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
function Sidebar_trigger($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    onclick,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const sidebar = useSidebar();
  Button($$payload, spread_props([
    {
      type: "button",
      onclick: (e) => {
        onclick?.(e);
        sidebar?.toggle();
      },
      "data-sidebar": "trigger",
      variant: "ghost",
      size: "icon",
      class: cn$1("h-10 w-10", className)
    },
    restProps,
    {
      children: ($$payload2) => {
        if (sidebar?.open && !sidebar?.isMobile) {
          $$payload2.out += "<!--[-->";
          Chevron_left($$payload2, {});
        } else {
          $$payload2.out += "<!--[!-->";
          Menu($$payload2, {});
        }
        $$payload2.out += `<!--]--> <span class="sr-only">Toggle Sidebar</span>`;
      },
      $$slots: { default: true }
    }
  ]));
  bind_props($$props, { ref });
  pop();
}
function Sheet_overlay($$payload, $$props) {
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
    Dialog_overlay($$payload2, spread_props([
      {
        class: cn$1("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)
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
  bind_props($$props, { ref, class: className });
  pop();
}
const sheetVariants = ce({
  base: "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  variants: {
    side: {
      top: "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b",
      bottom: "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t",
      left: "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
      right: "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
    }
  },
  defaultVariants: { side: "right" }
});
function Sheet_content($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    side = "right",
    portalProps,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Portal($$payload2, spread_props([
      portalProps,
      {
        children: ($$payload3) => {
          Sheet_overlay($$payload3, {});
          $$payload3.out += `<!----> <!---->`;
          Dialog_content($$payload3, spread_props([
            {
              class: cn$1(sheetVariants({ side }), className)
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
              children: ($$payload4) => {
                children?.($$payload4);
                $$payload4.out += `<!----> <!---->`;
                Dialog_close($$payload4, {
                  class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
                  children: ($$payload5) => {
                    X($$payload5, { class: "size-4" });
                    $$payload5.out += `<!----> <span class="sr-only">Close</span>`;
                  },
                  $$slots: { default: true }
                });
                $$payload4.out += `<!---->`;
              },
              $$slots: { default: true }
            }
          ]));
          $$payload3.out += `<!---->`;
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
const Root = Dialog;
function Sidebar($$payload, $$props) {
  push();
  let {
    ref = null,
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const sidebar = useSidebar();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (collapsible === "none") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div${spread_attributes(
        {
          class: clsx(cn$1("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className)),
          ...restProps
        },
        null
      )}>`;
      children?.($$payload2);
      $$payload2.out += `<!----></div>`;
    } else if (sidebar.isMobile) {
      $$payload2.out += "<!--[1-->";
      var bind_get = () => sidebar.openMobile;
      var bind_set = (v) => sidebar.setOpenMobile(v);
      $$payload2.out += `<!---->`;
      Root($$payload2, spread_props([
        {
          get open() {
            return bind_get();
          },
          set open($$value) {
            bind_set($$value);
          }
        },
        restProps,
        {
          children: ($$payload3) => {
            $$payload3.out += `<!---->`;
            Sheet_content($$payload3, {
              "data-sidebar": "sidebar",
              "data-mobile": "true",
              class: "w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
              style: `--sidebar-width: ${stringify(SIDEBAR_WIDTH_MOBILE)};`,
              side,
              children: ($$payload4) => {
                $$payload4.out += `<div class="flex h-full w-full flex-col">`;
                children?.($$payload4);
                $$payload4.out += `<!----></div>`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          },
          $$slots: { default: true }
        }
      ]));
      $$payload2.out += `<!---->`;
    } else {
      $$payload2.out += "<!--[!-->";
      $$payload2.out += `<div class="group peer hidden text-sidebar-foreground md:block"${attr("data-state", sidebar.state)}${attr("data-collapsible", sidebar.state === "collapsed" ? collapsible : "")}${attr("data-variant", variant)}${attr("data-side", side)}><div${attr_class(clsx(cn$1("relative h-svh w-[--sidebar-width] bg-transparent", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]")))}></div> <div${spread_attributes(
        {
          class: clsx(cn$1(
            "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] md:flex",
            side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )),
          ...restProps
        },
        null
      )}><div data-sidebar="sidebar" class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow">`;
      children?.($$payload2);
      $$payload2.out += `<!----></div></div></div>`;
    }
    $$payload2.out += `<!--]-->`;
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
const en_welcome_subtitle = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Connect, inspire, thrive!`;
  }
);
const es_welcome_subtitle = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `¡Conecta, inspira, prospera!`;
  }
);
const welcome_subtitle = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("welcome_subtitle", locale);
  if (locale === "en") return en_welcome_subtitle();
  if (locale === "es") return es_welcome_subtitle();
  return "welcome_subtitle";
};
const en_join_first_spark = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `Join ${i.title}`;
  }
);
const es_join_first_spark = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `Únete a ${i.title}`;
  }
);
const join_first_spark = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("join_first_spark", locale);
  if (locale === "en") return en_join_first_spark(inputs);
  if (locale === "es") return es_join_first_spark(inputs);
  return "join_first_spark";
};
const en_sidebar_menu_settings = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Settings`;
  }
);
const es_sidebar_menu_settings = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Configuración`;
  }
);
const sidebar_menu_settings = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("sidebar_menu_settings", locale);
  if (locale === "en") return en_sidebar_menu_settings();
  if (locale === "es") return es_sidebar_menu_settings();
  return "sidebar.menu.settings";
};
const en_sidebar_menu_marketplace = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Marketplace`;
  }
);
const es_sidebar_menu_marketplace = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Mercado`;
  }
);
const sidebar_menu_marketplace = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("sidebar_menu_marketplace", locale);
  if (locale === "en") return en_sidebar_menu_marketplace();
  if (locale === "es") return es_sidebar_menu_marketplace();
  return "sidebar.menu.marketplace";
};
const en_sidebar_menu_cart = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Cart`;
  }
);
const es_sidebar_menu_cart = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Carrito`;
  }
);
const sidebar_menu_cart = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("sidebar_menu_cart", locale);
  if (locale === "en") return en_sidebar_menu_cart();
  if (locale === "es") return es_sidebar_menu_cart();
  return "sidebar.menu.cart";
};
const en_sidebar_menu_wallet = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Wallet`;
  }
);
const es_sidebar_menu_wallet = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Billetera`;
  }
);
const sidebar_menu_wallet = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("sidebar_menu_wallet", locale);
  if (locale === "en") return en_sidebar_menu_wallet();
  if (locale === "es") return es_sidebar_menu_wallet();
  return "sidebar.menu.wallet";
};
const en_sidebar_menu_order_history = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Order history`;
  }
);
const es_sidebar_menu_order_history = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `historial de pedidos`;
  }
);
const sidebar_menu_order_history = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("sidebar_menu_order_history", locale);
  if (locale === "en") return en_sidebar_menu_order_history();
  if (locale === "es") return es_sidebar_menu_order_history();
  return "sidebar.menu.order_history";
};
const en_nav_auth_sign_in = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign in`;
  }
);
const es_nav_auth_sign_in = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Iniciar sesión`;
  }
);
const nav_auth_sign_in = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("nav_auth_sign_in", locale);
  if (locale === "en") return en_nav_auth_sign_in();
  if (locale === "es") return es_nav_auth_sign_in();
  return "nav.auth.sign_in";
};
const en_nav_auth_sign_up = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Sign up`;
  }
);
const es_nav_auth_sign_up = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Registrarse`;
  }
);
const nav_auth_sign_up = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("nav_auth_sign_up", locale);
  if (locale === "en") return en_nav_auth_sign_up();
  if (locale === "es") return es_nav_auth_sign_up();
  return "nav.auth.sign_up";
};
const en_footer_copyright = (
  /** @type {(inputs: { year: NonNullable<unknown>, title: NonNullable<unknown> }) => string} */
  (i) => {
    return `© ${i.year} ${i.title}. All rights reserved.`;
  }
);
const es_footer_copyright = (
  /** @type {(inputs: { year: NonNullable<unknown>, title: NonNullable<unknown> }) => string} */
  (i) => {
    return `© ${i.year} ${i.title}. Todos los derechos reservados.`;
  }
);
const footer_copyright = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("footer_copyright", locale);
  if (locale === "en") return en_footer_copyright(inputs);
  if (locale === "es") return es_footer_copyright(inputs);
  return "footer.copyright";
};
const en_footer_navigation_privacy_policy = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Privacy policy`;
  }
);
const es_footer_navigation_privacy_policy = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Política de privacidad`;
  }
);
const footer_navigation_privacy_policy = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("footer_navigation_privacy_policy", locale);
  if (locale === "en") return en_footer_navigation_privacy_policy();
  if (locale === "es") return es_footer_navigation_privacy_policy();
  return "footer.navigation.privacy_policy";
};
const en_language_button_tooltip = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Language`;
  }
);
const es_language_button_tooltip = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Idioma`;
  }
);
const language_button_tooltip = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("language_button_tooltip", locale);
  if (locale === "en") return en_language_button_tooltip();
  if (locale === "es") return es_language_button_tooltip();
  return "language_button.tooltip";
};
const en_connection_offline = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `You're offline`;
  }
);
const es_connection_offline = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Estás desconectado`;
  }
);
const connection_offline = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("connection_offline", locale);
  if (locale === "en") return en_connection_offline();
  if (locale === "es") return es_connection_offline();
  return "connection.offline";
};
const en_connection_online = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `Powered by ${i.title}`;
  }
);
const es_connection_online = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `Impulsado por ${i.title}`;
  }
);
const connection_online = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("connection_online", locale);
  if (locale === "en") return en_connection_online(inputs);
  if (locale === "es") return es_connection_online(inputs);
  return "connection.online";
};
function App_sidebar($$payload, $$props) {
  push();
  const items = [
    // {
    //   title: m['sidebar.menu.home'](),
    //   url: '/',
    //   icon: House,
    // },
    /* TODO: Hidding the following sidebar buttons as per the issue: https://github.com/baragaun/first-spark-app/issues/112 */
    /* {
      title: m['sidebar.menu.inbox'](),
      url: '#',
      icon: Inbox,
      requiresAuth: true,
    },
    {
      title: m['sidebar.menu.conversations'](),
      url: '#',
      icon: MessageSquare,
      requiresAuth: true,
    },
    {
      title: m['sidebar.menu.contacts'](),
      url: '#',
      icon: BookUser,
      requiresAuth: true,
    }, */
    {
      title: /* @__PURE__ */ sidebar_menu_wallet(),
      url: "/wallet",
      icon: Wallet,
      requiresAuth: true
    },
    {
      title: /* @__PURE__ */ sidebar_menu_marketplace(),
      url: "/marketplace",
      icon: Gift,
      requiresAuth: true
    },
    {
      title: /* @__PURE__ */ sidebar_menu_cart(),
      url: "/cart",
      icon: Shopping_cart,
      requiresAuth: true
    },
    {
      title: /* @__PURE__ */ sidebar_menu_order_history(),
      url: "/order-history",
      icon: History,
      requiresAuth: true
    },
    {
      title: /* @__PURE__ */ sidebar_menu_settings(),
      url: "/settings",
      icon: Settings,
      requiresAuth: true
    }
  ];
  let { ref = null, collapsible = "icon" } = $$props;
  const userContext = getContext("myUserContext");
  let isOffline = userContext.isOffline;
  let isSignedIn = userContext.isSignedIn;
  const isItemActive = (itemUrl, currentPath) => {
    if (itemUrl === "/") {
      return currentPath === "/";
    }
    return itemUrl !== "#" && currentPath.startsWith(itemUrl);
  };
  const isDevEnv = public_env.PUBLIC_APP_ENVIRONMENT === "development";
  const toggleConnection = () => {
    isOffline = !isOffline;
  };
  let visibleItems = isSignedIn ? items : items.filter((item) => !item.requiresAuth);
  const sidebar = useSidebar();
  const handleItemClick = () => {
    if (sidebar && sidebar.isMobile) {
      sidebar.setOpenMobile(false);
    }
  };
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Sidebar($$payload2, {
      collapsible,
      get ref() {
        return ref;
      },
      set ref($$value) {
        ref = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Sidebar_content($$payload3, {
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Sidebar_header($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Sidebar_menu($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->`;
                    Sidebar_menu_item($$payload6, {
                      children: ($$payload7) => {
                        $$payload7.out += `<div class="justify-horizontal flex items-center pt-2">`;
                        if (sidebar?.open) {
                          $$payload7.out += "<!--[-->";
                          $$payload7.out += `<div class="flex items-center justify-center"><img${attr("src", headerIcon())} alt="First Spark Logo" class="h-10"/></div>`;
                        } else {
                          $$payload7.out += "<!--[!-->";
                          $$payload7.out += `<div class="flex min-h-[2.5rem] min-w-[2rem] items-center justify-center"><img${attr("src", headerSmallIcon())} alt="First Spark Logo" class="h-10 w-10 object-contain"/></div>`;
                        }
                        $$payload7.out += `<!--]--></div>`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!---->`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Sidebar_group($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Sidebar_menu($$payload5, {
                  children: ($$payload6) => {
                    const each_array = ensure_array_like(visibleItems);
                    $$payload6.out += `<!--[-->`;
                    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
                      let item = each_array[i];
                      $$payload6.out += `<!---->`;
                      Sidebar_menu_item($$payload6, {
                        children: ($$payload7) => {
                          $$payload7.out += `<!---->`;
                          {
                            let child = function($$payload8, { props }) {
                              $$payload8.out += `<a${spread_attributes({ href: item.url, ...props }, null)}><!---->`;
                              item.icon($$payload8, {});
                              $$payload8.out += `<!----> <span>${escape_html(item.title)}</span></a>`;
                            };
                            Sidebar_menu_button($$payload7, {
                              isActive: isItemActive(item.url, page.url.pathname),
                              child,
                              $$slots: { child: true }
                            });
                          }
                          $$payload7.out += `<!---->`;
                        },
                        $$slots: { default: true }
                      });
                      $$payload6.out += `<!---->`;
                    }
                    $$payload6.out += `<!--]-->`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> `;
            if (!isSignedIn) {
              $$payload4.out += "<!--[-->";
              $$payload4.out += `<!---->`;
              Sidebar_group($$payload4, {
                class: "mb-2 mt-auto px-3 group-data-[collapsible=icon]:hidden",
                children: ($$payload5) => {
                  $$payload5.out += `<div class="rounded-lg border border-border bg-card p-4 shadow-sm"><h2 class="mb-3 text-sm font-bold">${escape_html(/* @__PURE__ */ join_first_spark({ title: appTitle() }))}</h2> <h3 class="mb-3 text-sm font-medium">${escape_html(/* @__PURE__ */ welcome_subtitle())}</h3> <div class="flex flex-col gap-2">`;
                  Button($$payload5, {
                    href: "/signup",
                    size: "sm",
                    class: "w-full text-background",
                    onclick: handleItemClick,
                    children: ($$payload6) => {
                      $$payload6.out += `<!---->${escape_html(get_started())}`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!----> `;
                  Button($$payload5, {
                    href: "/signin",
                    variant: "outline",
                    size: "sm",
                    class: "w-full",
                    onclick: handleItemClick,
                    children: ($$payload6) => {
                      $$payload6.out += `<!---->${escape_html(/* @__PURE__ */ nav_auth_sign_in())}`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!----></div></div>`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            } else {
              $$payload4.out += "<!--[!-->";
            }
            $$payload4.out += `<!--]--> <!---->`;
            Sidebar_group($$payload4, {
              class: `mb-2 ${!isSignedIn ? "" : "mt-auto"} px-3 group-data-[collapsible=icon]:mt-auto`,
              children: ($$payload5) => {
                $$payload5.out += `<!---->`;
                Sidebar_menu($$payload5, {
                  children: ($$payload6) => {
                    $$payload6.out += `<!---->`;
                    Sidebar_menu_item($$payload6, {
                      children: ($$payload7) => {
                        $$payload7.out += `<!---->`;
                        {
                          let child = function($$payload8, { props }) {
                            Button($$payload8, spread_props([
                              props,
                              {
                                disabled: !isDevEnv,
                                onclick: toggleConnection,
                                variant: "ghost",
                                children: ($$payload9) => {
                                  if (!isOffline) {
                                    $$payload9.out += "<!--[-->";
                                    Zap($$payload9, { class: "h-5 w-5 text-muted-foreground" });
                                  } else {
                                    $$payload9.out += "<!--[!-->";
                                    Plug_zap($$payload9, { class: "h-5 w-5 text-muted-foreground" });
                                  }
                                  $$payload9.out += `<!--]--> <span class="text-muted-foreground">${escape_html(isOffline ? /* @__PURE__ */ connection_offline() : /* @__PURE__ */ connection_online({ title: appTitle() }))}</span>`;
                                },
                                $$slots: { default: true }
                              }
                            ]));
                          };
                          Sidebar_menu_button($$payload7, { child, $$slots: { child: true } });
                        }
                        $$payload7.out += `<!---->`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload6.out += `<!---->`;
                  },
                  $$slots: { default: true }
                });
                $$payload5.out += `<!---->`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!---->`;
          },
          $$slots: { default: true }
        });
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
  bind_props($$props, { ref });
  pop();
}
function Bottom_navbar($$payload, $$props) {
  push();
  const items = [
    // {
    //   title: m['sidebar.menu.home'](),
    //   url: '/',
    //   icon: Home,
    //   requiresAuth: false,
    // },
    {
      title: /* @__PURE__ */ sidebar_menu_wallet(),
      url: "/wallet",
      icon: Wallet,
      requiresAuth: true
    },
    {
      title: /* @__PURE__ */ sidebar_menu_marketplace(),
      url: "/marketplace",
      icon: Gift,
      requiresAuth: true
    },
    {
      title: /* @__PURE__ */ sidebar_menu_cart(),
      url: "/cart",
      icon: Shopping_cart,
      requiresAuth: true
    },
    {
      title: /* @__PURE__ */ sidebar_menu_order_history(),
      url: "/order-history",
      icon: History,
      requiresAuth: true
    },
    {
      title: /* @__PURE__ */ sidebar_menu_settings(),
      url: "/settings",
      icon: Settings,
      requiresAuth: true
    }
  ];
  const userContext = getContext("myUserContext");
  let isSignedIn = userContext.isSignedIn;
  const isItemActive = (itemUrl, currentPath) => {
    if (itemUrl === "/") {
      return currentPath === "/";
    }
    return itemUrl !== "#" && currentPath.startsWith(itemUrl);
  };
  let visibleItems = isSignedIn ? items : items.filter((item) => !item.requiresAuth);
  const each_array = ensure_array_like(visibleItems);
  $$payload.out += `<nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"><div class="flex h-16 items-center justify-around px-2"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    Button($$payload, {
      href: item.url,
      variant: "link",
      size: "lg",
      class: cn$1("flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-background px-1 py-1 no-underline hover:no-underline", isItemActive(item.url, page.url.pathname) ? "bg-background text-nav-foreground hover:bg-background" : "text-foreground hover:text-foreground"),
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        item.icon($$payload2, {
          class: "h-[20px] w-[20px]",
          style: "height:20px!important;width:20px!important;"
        });
        $$payload2.out += `<!----> <span class="font-semi-bold truncate text-[11px]">${escape_html(item.title)}</span>`;
      },
      $$slots: { default: true }
    });
  }
  $$payload.out += `<!--]--></div></nav> <div class="h-16 md:hidden"></div>`;
  pop();
}
function Icon($$payload, $$props) {
  let type = fallback($$props["type"], "success");
  if (type === "success") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>`;
  } else if (type === "error") {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>`;
  } else if (type === "info") {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>`;
  } else if (type === "warning") {
    $$payload.out += "<!--[3-->";
    $$payload.out += `<svg viewBox="0 0 64 64" fill="currentColor" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M32.427,7.987c2.183,0.124 4,1.165 5.096,3.281l17.936,36.208c1.739,3.66 -0.954,8.585 -5.373,8.656l-36.119,0c-4.022,-0.064 -7.322,-4.631 -5.352,-8.696l18.271,-36.207c0.342,-0.65 0.498,-0.838 0.793,-1.179c1.186,-1.375 2.483,-2.111 4.748,-2.063Zm-0.295,3.997c-0.687,0.034 -1.316,0.419 -1.659,1.017c-6.312,11.979 -12.397,24.081 -18.301,36.267c-0.546,1.225 0.391,2.797 1.762,2.863c12.06,0.195 24.125,0.195 36.185,0c1.325,-0.064 2.321,-1.584 1.769,-2.85c-5.793,-12.184 -11.765,-24.286 -17.966,-36.267c-0.366,-0.651 -0.903,-1.042 -1.79,-1.03Z"></path><path d="M33.631,40.581l-3.348,0l-0.368,-16.449l4.1,0l-0.384,16.449Zm-3.828,5.03c0,-0.609 0.197,-1.113 0.592,-1.514c0.396,-0.4 0.935,-0.601 1.618,-0.601c0.684,0 1.223,0.201 1.618,0.601c0.395,0.401 0.593,0.905 0.593,1.514c0,0.587 -0.193,1.078 -0.577,1.473c-0.385,0.395 -0.929,0.593 -1.634,0.593c-0.705,0 -1.249,-0.198 -1.634,-0.593c-0.384,-0.395 -0.576,-0.886 -0.576,-1.473Z"></path></svg>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { type });
}
function Loader($$payload, $$props) {
  push();
  let visible = $$props["visible"];
  const bars = Array(12).fill(0);
  const each_array = ensure_array_like(bars);
  $$payload.out += `<div class="sonner-loading-wrapper"${attr("data-visible", visible)}><div class="sonner-spinner"><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    each_array[i];
    $$payload.out += `<div class="sonner-loading-bar"></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  bind_props($$props, { visible });
  pop();
}
function Toast($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  push();
  var $$store_subs;
  let isFront, isVisible, toastType, toastClass, toastDescriptionClass, heightIndex, coords, toastsHeightBefore, disabled, isPromiseLoadingOrInfiniteDuration;
  const TOAST_LIFETIME = 4e3;
  const GAP = 14;
  const TIME_BEFORE_UNMOUNT = 200;
  const defaultClasses = {
    toast: "",
    title: "",
    description: "",
    loader: "",
    closeButton: "",
    cancelButton: "",
    actionButton: "",
    action: "",
    warning: "",
    error: "",
    success: "",
    default: "",
    info: "",
    loading: ""
  };
  const {
    toasts,
    heights,
    removeHeight,
    remove
  } = toastState;
  let toast = $$props["toast"];
  let index = $$props["index"];
  let expanded = $$props["expanded"];
  let invert = $$props["invert"];
  let position = $$props["position"];
  let visibleToasts = $$props["visibleToasts"];
  let expandByDefault = $$props["expandByDefault"];
  let closeButton = $$props["closeButton"];
  let interacting = $$props["interacting"];
  let cancelButtonStyle = fallback($$props["cancelButtonStyle"], "");
  let actionButtonStyle = fallback($$props["actionButtonStyle"], "");
  let duration = fallback($$props["duration"], 4e3);
  let descriptionClass = fallback($$props["descriptionClass"], "");
  let classes = fallback($$props["classes"], () => ({}), true);
  let unstyled = fallback($$props["unstyled"], false);
  let mounted = false;
  let removed = false;
  let swiping = false;
  let swipeOut = false;
  let offsetBeforeRemove = 0;
  let initialHeight = 0;
  let offset = 0;
  let closeTimerStartTimeRef = 0;
  let lastCloseTimerStartTimeRef = 0;
  async function updateHeights() {
    {
      return;
    }
  }
  function deleteToast() {
    removed = true;
    offsetBeforeRemove = offset;
    removeHeight(toast.id);
    setTimeout(
      () => {
        remove(toast.id);
      },
      TIME_BEFORE_UNMOUNT
    );
  }
  let timeoutId;
  let remainingTime = toast.duration || duration || TOAST_LIFETIME;
  function pauseTimer() {
    if (lastCloseTimerStartTimeRef < closeTimerStartTimeRef) {
      const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef;
      remainingTime = remainingTime - elapsedTime;
    }
    lastCloseTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
  }
  function startTimer() {
    closeTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
    timeoutId = setTimeout(
      () => {
        toast.onAutoClose?.(toast);
        deleteToast();
      },
      remainingTime
    );
  }
  let effect;
  classes = { ...defaultClasses, ...classes };
  isFront = index === 0;
  isVisible = index + 1 <= visibleToasts;
  toast.title;
  toast.description;
  toastType = toast.type;
  toastClass = toast.class || "";
  toastDescriptionClass = toast.descriptionClass || "";
  heightIndex = store_get($$store_subs ??= {}, "$heights", heights).findIndex((height) => height.toastId === toast.id) || 0;
  coords = position.split("-");
  toastsHeightBefore = store_get($$store_subs ??= {}, "$heights", heights).reduce(
    (prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex) return prev;
      return prev + curr.height;
    },
    0
  );
  invert = toast.invert || invert;
  disabled = toastType === "loading";
  offset = Math.round(heightIndex * GAP + toastsHeightBefore);
  updateHeights();
  if (toast.updated) {
    clearTimeout(timeoutId);
    remainingTime = toast.duration || duration || TOAST_LIFETIME;
    startTimer();
  }
  isPromiseLoadingOrInfiniteDuration = toast.promise && toastType === "loading" || toast.duration === Number.POSITIVE_INFINITY;
  effect = useEffect(() => {
    if (!isPromiseLoadingOrInfiniteDuration) {
      if (expanded || interacting) {
        pauseTimer();
      } else {
        startTimer();
      }
    }
    return () => clearTimeout(timeoutId);
  });
  store_get($$store_subs ??= {}, "$effect", effect);
  if (toast.delete) {
    deleteToast();
  }
  $$payload.out += `<li${attr("aria-live", toast.important ? "assertive" : "polite")} aria-atomic="true" role="status"${attr("tabindex", 0)}${attr_class(clsx(cn($$sanitized_props.class, toastClass, classes?.toast, toast?.classes?.toast, classes?.[toastType], toast?.classes?.[toastType])))} data-sonner-toast=""${attr("data-styled", !(toast.component || toast?.unstyled || unstyled))}${attr("data-mounted", mounted)}${attr("data-promise", Boolean(toast.promise))}${attr("data-removed", removed)}${attr("data-visible", isVisible)}${attr("data-y-position", coords[0])}${attr("data-x-position", coords[1])}${attr("data-index", index)}${attr("data-front", isFront)}${attr("data-swiping", swiping)}${attr("data-type", toastType)}${attr("data-invert", invert)}${attr("data-swipe-out", swipeOut)}${attr("data-expanded", Boolean(expanded || expandByDefault && mounted))}${attr_style(`${$$sanitized_props.style} ${toast.style}`, {
    "--index": index,
    "--toasts-before": index,
    "--z-index": store_get($$store_subs ??= {}, "$toasts", toasts).length - index,
    "--offset": `${removed ? offsetBeforeRemove : offset}px`,
    "--initial-height": `${initialHeight}px`
  })}>`;
  if (closeButton && !toast.component) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button aria-label="Close toast"${attr("data-disabled", disabled)} data-close-button=""${attr_class(clsx(cn(classes?.closeButton, toast?.classes?.closeButton)))}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (toast.component) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    toast.component?.($$payload, spread_props([toast.componentProps]));
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    if (toastType !== "default" || toast.icon || toast.promise) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div data-icon="">`;
      if ((toast.promise || toastType === "loading") && !toast.icon) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "loading-icon", {}, null);
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (toast.icon) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<!---->`;
        toast.icon?.($$payload, {});
        $$payload.out += `<!---->`;
      } else if (toastType === "success") {
        $$payload.out += "<!--[1-->";
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "success-icon", {}, null);
        $$payload.out += `<!---->`;
      } else if (toastType === "error") {
        $$payload.out += "<!--[2-->";
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "error-icon", {}, null);
        $$payload.out += `<!---->`;
      } else if (toastType === "warning") {
        $$payload.out += "<!--[3-->";
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "warning-icon", {}, null);
        $$payload.out += `<!---->`;
      } else if (toastType === "info") {
        $$payload.out += "<!--[4-->";
        $$payload.out += `<!---->`;
        slot($$payload, $$props, "info-icon", {}, null);
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div data-content="">`;
    if (toast.title) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div data-title=""${attr_class(clsx(cn(classes?.title, toast?.classes?.title)))}>`;
      if (typeof toast.title !== "string") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<!---->`;
        toast.title?.($$payload, spread_props([toast.componentProps]));
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `${escape_html(toast.title)}`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (toast.description) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div data-description=""${attr_class(clsx(cn(descriptionClass, toastDescriptionClass, classes?.description, toast.classes?.description)))}>`;
      if (typeof toast.description !== "string") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<!---->`;
        toast.description?.($$payload, spread_props([toast.componentProps]));
        $$payload.out += `<!---->`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `${escape_html(toast.description)}`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (toast.cancel) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button data-button="" data-cancel=""${attr_style(cancelButtonStyle)}${attr_class(clsx(cn(classes?.cancelButton, toast?.classes?.cancelButton)))}>${escape_html(toast.cancel.label)}</button>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (toast.action) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button data-button=""${attr_style(actionButtonStyle)}${attr_class(clsx(cn(classes?.actionButton, toast?.classes?.actionButton)))}>${escape_html(toast.action.label)}</button>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></li>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    toast,
    index,
    expanded,
    invert,
    position,
    visibleToasts,
    expandByDefault,
    closeButton,
    interacting,
    cancelButtonStyle,
    actionButtonStyle,
    duration,
    descriptionClass,
    classes,
    unstyled
  });
  pop();
}
function Toaster($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "invert",
    "theme",
    "position",
    "hotkey",
    "containerAriaLabel",
    "richColors",
    "expand",
    "duration",
    "visibleToasts",
    "closeButton",
    "toastOptions",
    "offset",
    "dir"
  ]);
  push();
  var $$store_subs;
  let possiblePositions, hotkeyLabel;
  const VISIBLE_TOASTS_AMOUNT = 3;
  const VIEWPORT_OFFSET = "32px";
  const TOAST_WIDTH = 356;
  const GAP = 14;
  const DARK = "dark";
  const LIGHT = "light";
  function getInitialTheme(t) {
    if (t !== "system") {
      return t;
    }
    if (typeof window !== "undefined") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return DARK;
      }
      return LIGHT;
    }
    return LIGHT;
  }
  function getDocumentDirection() {
    if (typeof window === "undefined") return "ltr";
    if (typeof document === "undefined") return "ltr";
    const dirAttribute = document.documentElement.getAttribute("dir");
    if (dirAttribute === "auto" || !dirAttribute) {
      return window.getComputedStyle(document.documentElement).direction;
    }
    return dirAttribute;
  }
  let invert = fallback($$props["invert"], false);
  let theme2 = fallback($$props["theme"], "light");
  let position = fallback($$props["position"], "bottom-right");
  let hotkey = fallback($$props["hotkey"], () => ["altKey", "KeyT"], true);
  let containerAriaLabel = fallback($$props["containerAriaLabel"], "Notifications");
  let richColors = fallback($$props["richColors"], false);
  let expand = fallback($$props["expand"], false);
  let duration = fallback($$props["duration"], 4e3);
  let visibleToasts = fallback($$props["visibleToasts"], VISIBLE_TOASTS_AMOUNT);
  let closeButton = fallback($$props["closeButton"], false);
  let toastOptions = fallback($$props["toastOptions"], () => ({}), true);
  let offset = fallback($$props["offset"], null);
  let dir = fallback($$props["dir"], getDocumentDirection, true);
  const { toasts, heights } = toastState;
  let expanded = false;
  let interacting = false;
  let actualTheme = getInitialTheme(theme2);
  onDestroy(() => {
  });
  possiblePositions = Array.from(new Set([
    position,
    ...store_get($$store_subs ??= {}, "$toasts", toasts).filter((toast) => toast.position).map((toast) => toast.position)
  ].filter(Boolean)));
  hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  if (store_get($$store_subs ??= {}, "$toasts", toasts).length <= 1) {
    expanded = false;
  }
  {
    const toastsToDismiss = store_get($$store_subs ??= {}, "$toasts", toasts).filter((toast) => toast.dismiss && !toast.delete);
    if (toastsToDismiss.length > 0) {
      const updatedToasts = store_get($$store_subs ??= {}, "$toasts", toasts).map((toast) => {
        const matchingToast = toastsToDismiss.find((dismissToast) => dismissToast.id === toast.id);
        if (matchingToast) {
          return { ...toast, delete: true };
        }
        return toast;
      });
      toasts.set(updatedToasts);
    }
  }
  {
    if (theme2 !== "system") {
      actualTheme = theme2;
    }
    if (typeof window !== "undefined") {
      if (theme2 === "system") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          actualTheme = DARK;
        } else {
          actualTheme = LIGHT;
        }
      }
      const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
      const changeHandler = ({ matches }) => {
        actualTheme = matches ? DARK : LIGHT;
      };
      if ("addEventListener" in mediaQueryList) {
        mediaQueryList.addEventListener("change", changeHandler);
      } else {
        mediaQueryList.addListener(changeHandler);
      }
    }
  }
  if (store_get($$store_subs ??= {}, "$toasts", toasts).length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(possiblePositions);
    $$payload.out += `<section${attr("aria-label", `${containerAriaLabel} ${hotkeyLabel}`)}${attr("tabindex", -1)} class="svelte-1fo5d1m"><!--[-->`;
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let position2 = each_array[index];
      const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts).filter((toast) => !toast.position && index === 0 || toast.position === position2));
      $$payload.out += `<ol${spread_attributes(
        {
          tabindex: -1,
          class: clsx($$sanitized_props.class),
          "data-sonner-toaster": true,
          "data-theme": actualTheme,
          "data-rich-colors": richColors,
          dir: dir === "auto" ? getDocumentDirection() : dir,
          "data-y-position": position2.split("-")[0],
          "data-x-position": position2.split("-")[1],
          style: $$sanitized_props.style,
          ...$$restProps
        },
        "svelte-1fo5d1m",
        void 0,
        {
          "--front-toast-height": `${store_get($$store_subs ??= {}, "$heights", heights)[0]?.height}px`,
          "--offset": typeof offset === "number" ? `${offset}px` : offset || VIEWPORT_OFFSET,
          "--width": `${TOAST_WIDTH}px`,
          "--gap": `${GAP}px`
        }
      )}><!--[-->`;
      for (let index2 = 0, $$length2 = each_array_1.length; index2 < $$length2; index2++) {
        let toast = each_array_1[index2];
        Toast($$payload, {
          index: index2,
          toast,
          invert,
          visibleToasts,
          closeButton,
          interacting,
          position: position2,
          expandByDefault: expand,
          expanded,
          actionButtonStyle: toastOptions?.actionButtonStyle || "",
          cancelButtonStyle: toastOptions?.cancelButtonStyle || "",
          class: toastOptions?.class || "",
          descriptionClass: toastOptions?.descriptionClass || "",
          classes: toastOptions.classes || {},
          duration: toastOptions?.duration ?? duration,
          unstyled: toastOptions.unstyled || false,
          $$slots: {
            "loading-icon": ($$payload2) => {
              $$payload2.out += `<!---->`;
              slot($$payload2, $$props, "loading-icon", {}, () => {
                Loader($$payload2, { visible: toast.type === "loading" });
              });
              $$payload2.out += `<!---->`;
            },
            "success-icon": ($$payload2) => {
              $$payload2.out += `<!---->`;
              slot($$payload2, $$props, "success-icon", {}, () => {
                Icon($$payload2, { type: "success" });
              });
              $$payload2.out += `<!---->`;
            },
            "error-icon": ($$payload2) => {
              $$payload2.out += `<!---->`;
              slot($$payload2, $$props, "error-icon", {}, () => {
                Icon($$payload2, { type: "error" });
              });
              $$payload2.out += `<!---->`;
            },
            "warning-icon": ($$payload2) => {
              $$payload2.out += `<!---->`;
              slot($$payload2, $$props, "warning-icon", {}, () => {
                Icon($$payload2, { type: "warning" });
              });
              $$payload2.out += `<!---->`;
            },
            "info-icon": ($$payload2) => {
              $$payload2.out += `<!---->`;
              slot($$payload2, $$props, "info-icon", {}, () => {
                Icon($$payload2, { type: "info" });
              });
              $$payload2.out += `<!---->`;
            }
          }
        });
      }
      $$payload.out += `<!--]--></ol>`;
    }
    $$payload.out += `<!--]--></section>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    invert,
    theme: theme2,
    position,
    hotkey,
    containerAriaLabel,
    richColors,
    expand,
    duration,
    visibleToasts,
    closeButton,
    toastOptions,
    offset,
    dir
  });
  pop();
}
function Sonner_1($$payload, $$props) {
  var $$store_subs;
  let { $$slots, $$events, ...restProps } = $$props;
  Toaster($$payload, spread_props([
    {
      theme: store_get($$store_subs ??= {}, "$mode", derivedMode),
      class: "toaster group",
      toastOptions: {
        classes: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      }
    },
    restProps
  ]));
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
function Connection_sonner($$payload, $$props) {
  push();
  const userContext = getContext("myUserContext");
  userContext.isOffline;
  Sonner_1($$payload, {
    richColors: true,
    closeButton: true,
    position: "bottom-right",
    toastOptions: {
      classes: {
        toast: "mb-[5rem]",
        title: "ml-2",
        description: "ml-2"
      }
    }
  });
  pop();
}
function Language_button($$payload, $$props) {
  push();
  const { class: className = "" } = $$props;
  $$payload.out += `<!---->`;
  Root$2($$payload, {
    children: ($$payload2) => {
      $$payload2.out += `<!---->`;
      Trigger$1($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Provider($$payload3, {
            children: ($$payload4) => {
              $$payload4.out += `<!---->`;
              Root$1($$payload4, {
                children: ($$payload5) => {
                  $$payload5.out += `<!---->`;
                  Trigger($$payload5, {
                    children: ($$payload6) => {
                      $$payload6.out += `<div${attr_class(`relative inline-flex ${className}`)}${attr("aria-label", /* @__PURE__ */ language_button_tooltip())}>`;
                      Button($$payload6, {
                        variant: "ghost",
                        size: "icon",
                        class: "text-nav-foreground hover:bg-transparent hover:text-foreground"
                      });
                      $$payload6.out += `<!----> `;
                      Languages($$payload6, {
                        class: "pointer-events-none absolute inset-0 m-auto h-[1.3rem] w-[1.3rem] text-nav-foreground"
                      });
                      $$payload6.out += `<!----></div>`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!----> <!---->`;
                  Tooltip_content($$payload5, {
                    children: ($$payload6) => {
                      $$payload6.out += `<p>${escape_html(/* @__PURE__ */ language_button_tooltip())}</p>`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload5.out += `<!---->`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            }
          });
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> <!---->`;
      Dropdown_menu_content($$payload2, {
        class: "bg-background",
        children: ($$payload3) => {
          const each_array = ensure_array_like(locales);
          $$payload3.out += `<!--[-->`;
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let locale = each_array[$$index];
            $$payload3.out += `<!---->`;
            Dropdown_menu_item($$payload3, {
              class: "cursor-pointer",
              onclick: () => setLocale(),
              children: ($$payload4) => {
                $$payload4.out += `<span${attr_class("", void 0, { "font-bold": getLocale() === locale })}>${escape_html(new Intl.DisplayNames([locale], { type: "language" }).of(locale) ? titleCase(new Intl.DisplayNames([locale], { type: "language" }).of(locale) || locale) : locale)}</span> `;
                if (getLocale() === locale) {
                  $$payload4.out += "<!--[-->";
                  $$payload4.out += `<!---->`;
                  Dropdown_menu_shortcut($$payload4, {
                    children: ($$payload5) => {
                      $$payload5.out += `<!---->✓`;
                    },
                    $$slots: { default: true }
                  });
                  $$payload4.out += `<!---->`;
                } else {
                  $$payload4.out += "<!--[!-->";
                }
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!---->`;
  pop();
}
function Nav_bar($$payload, $$props) {
  push();
  const userContext = getContext("myUserContext");
  let isSignedIn = userContext.isSignedIn;
  userContext.myUser;
  const isMobile = new IsMobile();
  $$payload.out += `<nav class="sticky top-0 z-50 border-b bg-nav backdrop-blur supports-[backdrop-filter]:bg-nav"><div class="flex h-16 items-center px-4"><div class="mr-1 hidden flex-none text-nav-foreground md:block"><!---->`;
  Sidebar_trigger($$payload, {});
  $$payload.out += `<!----></div> `;
  if (isMobile.current) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center"><img${attr("src", headerSmallIcon())} alt="First Spark Logo" class="h-10"/></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="ml-auto flex flex-none items-center gap-1">`;
  Language_button($$payload, { class: "flex" });
  $$payload.out += `<!----> `;
  if (!isSignedIn) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-none items-center gap-2"><!---->`;
    Provider($$payload, {
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        Root$1($$payload2, {
          children: ($$payload3) => {
            $$payload3.out += `<!---->`;
            Trigger($$payload3, {
              children: ($$payload4) => {
                $$payload4.out += `<div class="relative inline-flex"${attr("aria-label", /* @__PURE__ */ nav_auth_sign_in())}>`;
                Button($$payload4, {
                  variant: "ghost",
                  size: "icon",
                  onclick: () => goto(),
                  class: "font-lexend text-nav-foreground hover:text-nav-foreground"
                });
                $$payload4.out += `<!----> `;
                Log_in($$payload4, {
                  class: "pointer-events-none absolute inset-0 m-auto h-[1.3rem] w-[1.3rem] text-nav-foreground"
                });
                $$payload4.out += `<!----></div>`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!----> <!---->`;
            Tooltip_content($$payload3, {
              children: ($$payload4) => {
                $$payload4.out += `<p>${escape_html(/* @__PURE__ */ nav_auth_sign_in())}</p>`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!---->`;
      }
    });
    $$payload.out += `<!----> <span class="sr-only">${escape_html(/* @__PURE__ */ nav_auth_sign_in())}</span> `;
    Button($$payload, {
      variant: "default",
      onclick: () => goto(),
      "aria-label": /* @__PURE__ */ nav_auth_sign_up(),
      class: "font-lexend text-nav",
      children: ($$payload2) => {
        $$payload2.out += `<!---->${escape_html(/* @__PURE__ */ nav_auth_sign_up())}`;
      },
      $$slots: { default: true }
    });
    $$payload.out += `<!----> <span class="sr-only">${escape_html(/* @__PURE__ */ nav_auth_sign_up())}</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div></nav>`;
  pop();
}
function Footer($$payload, $$props) {
  push();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  $$payload.out += `<footer class="border-t-0 bg-background md:border-t"><div class="px-4 py-4"><div class="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8"><div class="flex flex-col items-center lg:items-start"><p class="text-center text-sm text-muted-foreground lg:text-left">${escape_html(/* @__PURE__ */ footer_copyright({ year: currentYear, title: appTitle() }))}</p></div> <nav class="flex flex-wrap items-center justify-center gap-4 text-sm" aria-label="Footer navigation">`;
  Button($$payload, {
    variant: "link",
    href: "/privacy-policy",
    class: "text-muted-foreground hover:text-primary",
    children: ($$payload2) => {
      $$payload2.out += `<!---->${escape_html(/* @__PURE__ */ footer_navigation_privacy_policy())}`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></nav></div></div></footer>`;
  pop();
}
function My_user_provider($$payload, $$props) {
  push();
  setContext("myUserContext", myUserContext);
  const { children } = $$props;
  children?.($$payload);
  $$payload.out += `<!---->`;
  pop();
}
function _layout($$payload, $$props) {
  push();
  const isMobile = new IsMobile();
  let { children } = $$props;
  let hideNavBar = page.url.pathname.startsWith("/marketplace/") || page.url.pathname.startsWith("/wallet/") || page.url.pathname.startsWith("/order-history/");
  const each_array = ensure_array_like(locales);
  Meta_tags($$payload, {
    title: appTitle(),
    description: appDescription(),
    canonicalUrl: appCanonicalUrl()
  });
  $$payload.out += `<!----> `;
  My_user_provider($$payload, {
    children: ($$payload2) => {
      $$payload2.out += `<div class="flex min-h-screen flex-col bg-background font-sans antialiased">`;
      Mode_watcher($$payload2, {});
      $$payload2.out += `<!----> `;
      Connection_sonner($$payload2);
      $$payload2.out += `<!----> `;
      Sidebar_provider($$payload2, {
        children: ($$payload3) => {
          App_sidebar($$payload3, {});
          $$payload3.out += `<!----> <div class="flex flex-1 flex-col">`;
          if (!hideNavBar) {
            $$payload3.out += "<!--[-->";
            Nav_bar($$payload3);
          } else {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]--> <main class="flex flex-1 flex-col">`;
          children?.($$payload3);
          $$payload3.out += `<!----></main> `;
          if (!isMobile.current) {
            $$payload3.out += "<!--[-->";
            Footer($$payload3);
          } else {
            $$payload3.out += "<!--[!-->";
            $$payload3.out += `<div class="h-16 md:hidden"></div>`;
          }
          $$payload3.out += `<!--]--></div> `;
          Bottom_navbar($$payload3);
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----></div>`;
    }
  });
  $$payload.out += `<!----> <div style="display:none"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let locale = each_array[$$index];
    $$payload.out += `<a${attr("href", localizeHref(page.url.pathname, { locale }))}>${escape_html(locale)}</a>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-CVcvUKXq.js.map
