import { q as push, a5 as hasContext, F as getContext, B as escape_html, u as pop, z as ensure_array_like, V as copy_payload, W as assign_payload, E as bind_props, I as spread_props, O as spread_attributes } from './index-d9yomiCc.js';
import { g as goto } from './client-BNK9U2wL.js';
import { p as page } from './index3-DMvwsHdR.js';
import { T as Tabs, a as Tabs_list$1, u as useTabsContent, b as Tabs_trigger$1 } from './tabs-trigger-ACKEQyOu.js';
import './translate-DAfkGQ1n.js';
import '@baragaun/bg-node-client';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { s as setting_account } from './setting_account-BoTCKCEe.js';
import { I as IsMobile } from './is-mobile.svelte-C1SEZM9M.js';
import { c as cn } from './utils-CCkZTMVc.js';
import { u as useId, b as box, m as mergeProps } from './noop-kcrjqjA1.js';
import './exports-J2AlltLs.js';
import './client2-yWJSv2LX.js';
import './index-server2-_G0R5Qhl.js';
import './kbd-constants-tqlk3Es5.js';
import './use-roving-focus.svelte-D3HknXeD.js';
import './is--6Wd6KIW.js';

function Tabs_content$1($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    ref = null,
    value,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useTabsContent({
    value: box.with(() => value),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, contentState.props);
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
const en_setting_setting_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Settings`;
  }
);
const es_setting_setting_label = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Configuración`;
  }
);
const setting_setting_label = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_setting_label", locale);
  if (locale === "en") return en_setting_setting_label();
  if (locale === "es") return es_setting_setting_label();
  return "setting.setting_label";
};
const en_setting_notification = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Notification`;
  }
);
const es_setting_notification = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Notificación`;
  }
);
const setting_notification = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("setting_notification", locale);
  if (locale === "en") return en_setting_notification();
  if (locale === "es") return es_setting_notification();
  return "setting.notification";
};
function Tabs_content($$payload, $$props) {
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
    Tabs_content$1($$payload2, spread_props([
      {
        class: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)
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
function Tabs_list($$payload, $$props) {
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
    Tabs_list$1($$payload2, spread_props([
      {
        class: cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)
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
function Tabs_trigger($$payload, $$props) {
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
    Tabs_trigger$1($$payload2, spread_props([
      {
        class: cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className)
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
const Root = Tabs;
function _layout($$payload, $$props) {
  push();
  const isMobile = new IsMobile();
  const userContext = hasContext("myUserContext") ? getContext("myUserContext") : null;
  userContext?.isSignedIn ?? false;
  const tabs = [
    {
      id: "account",
      label: setting_account(),
      path: "/settings/account",
      disabled: false
    },
    {
      id: "notifications",
      label: /* @__PURE__ */ setting_notification(),
      path: "/settings/notifications",
      disabled: true
    }
  ];
  let { children } = $$props;
  let activeTab = (() => {
    const path = page.url.pathname;
    if (path === "/settings") {
      return "account";
    }
    return tabs.find((tab) => path.startsWith(tab.path))?.id || "account";
  })();
  $$payload.out += `<div class="container py-2">`;
  if (!isMobile.current) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<h1 class="font-lexend text-3xl font-bold tracking-tight">${escape_html(/* @__PURE__ */ setting_setting_label())}</h1>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <!---->`;
  Root($$payload, {
    value: activeTab,
    class: "my-8",
    children: ($$payload2) => {
      const each_array_1 = ensure_array_like(tabs);
      $$payload2.out += `<!---->`;
      Tabs_list($$payload2, {
        class: "mx-auto grid w-3/5 grid-cols-2",
        children: ($$payload3) => {
          const each_array = ensure_array_like(tabs);
          $$payload3.out += `<!--[-->`;
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let tab = each_array[$$index];
            $$payload3.out += `<!---->`;
            Tabs_trigger($$payload3, {
              value: tab.id,
              disabled: tab.disabled,
              onclick: () => goto(tab.path),
              children: ($$payload4) => {
                $$payload4.out += `<!---->${escape_html(tab.label)}`;
              },
              $$slots: { default: true }
            });
            $$payload3.out += `<!---->`;
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> <!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let tab = each_array_1[$$index_1];
        $$payload2.out += `<!---->`;
        Tabs_content($$payload2, {
          value: tab.id,
          children: ($$payload3) => {
            children($$payload3);
            $$payload3.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!---->`;
      }
      $$payload2.out += `<!--]-->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!----></div>`;
  pop();
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-XndOy_jK.js.map
