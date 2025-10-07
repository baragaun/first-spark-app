import { q as push, V as copy_payload, W as assign_payload, E as bind_props, u as pop, I as spread_props, O as spread_attributes, Q as derived } from './index-d9yomiCc.js';
import { c as cn } from './utils-CCkZTMVc.js';
import { u as useId, n as noop, b as box, m as mergeProps, a as useRefById, v as srOnlyStylesString, l as getDataOrientation, x as getAriaHidden, h as getAriaOrientation, y as getDataRequired, z as getDataChecked, g as getDataDisabled, A as getAriaRequired, B as getAriaChecked, o as getDisabled } from './noop-kcrjqjA1.js';
import { C as Context, E as ENTER, S as SPACE } from './kbd-constants-tqlk3Es5.js';
import { C as Check } from './check-B2yEnkD1.js';

function Hidden_input($$payload, $$props) {
  push();
  let {
    value = void 0,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const mergedProps = mergeProps(restProps, {
    "aria-hidden": "true",
    tabindex: -1,
    style: srOnlyStylesString
  });
  if (mergedProps.type === "checkbox") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<input${spread_attributes({ ...mergedProps, value }, null)}/>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<input${spread_attributes({ value, ...mergedProps }, null)}/>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { value });
  pop();
}
const SEPARATOR_ROOT_ATTR = "data-separator-root";
class SeparatorRootState {
  opts;
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: this.opts.decorative.current ? "none" : "separator",
    "aria-orientation": getAriaOrientation(this.opts.orientation.current),
    "aria-hidden": getAriaHidden(this.opts.decorative.current),
    "data-orientation": getDataOrientation(this.opts.orientation.current),
    [SEPARATOR_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function useSeparatorRoot(props) {
  return new SeparatorRootState(props);
}
function Separator$1($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    child,
    children,
    decorative = false,
    orientation = "horizontal",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useSeparatorRoot({
    ref: box.with(() => ref, (v) => ref = v),
    id: box.with(() => id),
    decorative: box.with(() => decorative),
    orientation: box.with(() => orientation)
  });
  const mergedProps = mergeProps(restProps, rootState.props);
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
const SWITCH_ROOT_ATTR = "data-switch-root";
const SWITCH_THUMB_ATTR = "data-switch-thumb";
class SwitchRootState {
  opts;
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
    this.onkeydown = this.onkeydown.bind(this);
    this.onclick = this.onclick.bind(this);
  }
  #toggle() {
    this.opts.checked.current = !this.opts.checked.current;
  }
  onkeydown(e) {
    if (!(e.key === ENTER || e.key === SPACE) || this.opts.disabled.current) return;
    e.preventDefault();
    this.#toggle();
  }
  onclick(_) {
    if (this.opts.disabled.current) return;
    this.#toggle();
  }
  #sharedProps = derived(() => ({
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    "data-state": getDataChecked(this.opts.checked.current),
    "data-required": getDataRequired(this.opts.required.current)
  }));
  get sharedProps() {
    return this.#sharedProps();
  }
  set sharedProps($$value) {
    return this.#sharedProps($$value);
  }
  #snippetProps = derived(() => ({ checked: this.opts.checked.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    ...this.sharedProps,
    id: this.opts.id.current,
    role: "switch",
    disabled: getDisabled(this.opts.disabled.current),
    "aria-checked": getAriaChecked(this.opts.checked.current),
    "aria-required": getAriaRequired(this.opts.required.current),
    [SWITCH_ROOT_ATTR]: "",
    //
    onclick: this.onclick,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SwitchInputState {
  root;
  #shouldRender = derived(() => this.root.opts.name.current !== void 0);
  get shouldRender() {
    return this.#shouldRender();
  }
  set shouldRender($$value) {
    return this.#shouldRender($$value);
  }
  constructor(root) {
    this.root = root;
  }
  #props = derived(() => ({
    type: "checkbox",
    name: this.root.opts.name.current,
    value: this.root.opts.value.current,
    checked: this.root.opts.checked.current,
    disabled: this.root.opts.disabled.current,
    required: this.root.opts.required.current
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SwitchThumbState {
  opts;
  root;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
  }
  #snippetProps = derived(() => ({ checked: this.root.opts.checked.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    ...this.root.sharedProps,
    id: this.opts.id.current,
    [SWITCH_THUMB_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
const SwitchRootContext = new Context("Switch.Root");
function useSwitchRoot(props) {
  return SwitchRootContext.set(new SwitchRootState(props));
}
function useSwitchInput() {
  return new SwitchInputState(SwitchRootContext.get());
}
function useSwitchThumb(props) {
  return new SwitchThumbState(props, SwitchRootContext.get());
}
function Switch_input($$payload, $$props) {
  push();
  const inputState = useSwitchInput();
  if (inputState.shouldRender) {
    $$payload.out += "<!--[-->";
    Hidden_input($$payload, spread_props([inputState.props]));
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function Switch$1($$payload, $$props) {
  push();
  let {
    child,
    children,
    ref = null,
    id = useId(),
    disabled = false,
    required = false,
    checked = false,
    value = "on",
    name = void 0,
    type = "button",
    onCheckedChange = noop,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useSwitchRoot({
    checked: box.with(() => checked, (v) => {
      checked = v;
      onCheckedChange?.(v);
    }),
    disabled: box.with(() => disabled ?? false),
    required: box.with(() => required),
    value: box.with(() => value),
    name: box.with(() => name),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, rootState.props, { type });
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps, ...rootState.snippetProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...mergedProps }, null)}>`;
    children?.($$payload, rootState.snippetProps);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]--> `;
  Switch_input($$payload);
  $$payload.out += `<!---->`;
  bind_props($$props, { ref, checked });
  pop();
}
function Switch_thumb($$payload, $$props) {
  push();
  let {
    child,
    children,
    ref = null,
    id = useId(),
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const thumbState = useSwitchThumb({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, thumbState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, {
      props: mergedProps,
      ...thumbState.snippetProps
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes({ ...mergedProps }, null)}>`;
    children?.($$payload, thumbState.snippetProps);
    $$payload.out += `<!----></span>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
  pop();
}
function Separator($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    orientation = "horizontal",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Separator$1($$payload2, spread_props([
      {
        class: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "min-h-full w-[1px]", className),
        orientation
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
function Switch($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    checked = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Switch$1($$payload2, spread_props([
      {
        class: cn("peer inline-flex h-8 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className)
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
        get checked() {
          return checked;
        },
        set checked($$value) {
          checked = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Switch_thumb($$payload3, {
            class: cn("pointer-events-none relative flex size-7 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"),
            children: ($$payload4) => {
              if (checked) {
                $$payload4.out += "<!--[-->";
                Check($$payload4, {
                  class: "absolute size-5 text-primary opacity-100 transition-opacity"
                });
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]-->`;
            },
            $$slots: { default: true }
          });
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
  bind_props($$props, { ref, checked });
  pop();
}
function Notification_settings($$payload, $$props) {
  let {
    initialSettings = {
      emailNotifications: true,
      usernameChangeNotification: true,
      passwordChanges: true
    }
  } = $$props;
  let settings = { ...initialSettings };
  const toggleSetting = (key) => {
    settings[key] = !settings[key];
  };
  $$payload.out += `<div class="space-y-8 py-8"><div><h4 class="font-lexend mb-4 text-lg font-bold">General</h4> <div class="space-y-4"><div class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/50" tabindex="0" role="button"><div class="space-y-0.5"><label for="email-notifications" class="text-sm font-medium">Email Notifications</label> <p class="text-sm text-muted-foreground">Receive updates via email</p></div> `;
  Switch($$payload, {
    id: "email-notifications",
    checked: settings.emailNotifications,
    onchange: () => toggleSetting("emailNotifications")
  });
  $$payload.out += `<!----></div></div></div> `;
  Separator($$payload, {});
  $$payload.out += `<!----> <div><h4 class="font-lexend mb-4 text-lg font-bold">Security</h4> <div class="space-y-4"><div class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/50" tabindex="0" role="button"><div class="space-y-0.5"><label for="username-change" class="text-sm font-medium">Username Updates</label> <p class="text-sm text-muted-foreground">I am notified via email when my username is updated</p></div> `;
  Switch($$payload, {
    id: "username-change",
    checked: settings.usernameChangeNotification,
    onchange: () => toggleSetting("usernameChangeNotification")
  });
  $$payload.out += `<!----></div> <div class="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/50" tabindex="0" role="button"><div class="space-y-0.5"><label for="password-changes" class="text-sm font-medium">Password Changes</label> <p class="text-sm text-muted-foreground">Receive notifications when your password is changed</p></div> `;
  Switch($$payload, {
    id: "password-changes",
    checked: settings.passwordChanges,
    onchange: () => toggleSetting("passwordChanges")
  });
  $$payload.out += `<!----></div></div></div></div>`;
}

export { Notification_settings as N };
//# sourceMappingURL=notification-settings-DRMiSWfP.js.map
