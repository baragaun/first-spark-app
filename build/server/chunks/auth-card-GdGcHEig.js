import { q as push, O as spread_attributes, P as clsx, E as bind_props, u as pop, B as escape_html } from './index-d9yomiCc.js';
import { c as cn } from './utils-CCkZTMVc.js';
import { B as Button } from './button-B_xSpjF_.js';

function Card_content($$payload, $$props) {
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
      class: clsx(cn("p-6", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Card_description($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<p${spread_attributes(
    {
      class: clsx(cn("text-sm text-muted-foreground", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></p>`;
  bind_props($$props, { ref });
  pop();
}
function Card_header($$payload, $$props) {
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
      class: clsx(cn("flex flex-col space-y-1.5 p-6 pb-0", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Card_title($$payload, $$props) {
  push();
  let {
    ref = null,
    class: className,
    level = 3,
    children,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  $$payload.out += `<div${spread_attributes(
    {
      role: "heading",
      "aria-level": level,
      class: clsx(cn("text-2xl font-semibold leading-none tracking-tight", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Card($$payload, $$props) {
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
      class: clsx(cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)),
      ...restProps
    },
    null
  )}>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  bind_props($$props, { ref });
  pop();
}
function Auth_card($$payload, $$props) {
  let {
    title,
    description,
    showBackButton = false,
    onBack,
    children
  } = $$props;
  Card($$payload, {
    class: "w-full overflow-hidden",
    children: ($$payload2) => {
      if (showBackButton && onBack) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<div class="px-4 pt-4">`;
        Button($$payload2, {
          variant: "ghost",
          size: "sm",
          onclick: onBack,
          children: ($$payload3) => {
            $$payload3.out += `<!---->← Back`;
          },
          $$slots: { default: true }
        });
        $$payload2.out += `<!----></div>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      Card_header($$payload2, {
        children: ($$payload3) => {
          Card_title($$payload3, {
            class: "break-words text-2xl text-foreground",
            children: ($$payload4) => {
              $$payload4.out += `<!---->${escape_html(title)}`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> `;
          if (description) {
            $$payload3.out += "<!--[-->";
            Card_description($$payload3, {
              class: "break-words",
              children: ($$payload4) => {
                $$payload4.out += `<!---->${escape_html(description)}`;
              },
              $$slots: { default: true }
            });
          } else {
            $$payload3.out += "<!--[!-->";
          }
          $$payload3.out += `<!--]-->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> `;
      Card_content($$payload2, {
        class: "w-full",
        children: ($$payload3) => {
          children?.($$payload3);
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
}

export { Auth_card as A };
//# sourceMappingURL=auth-card-GdGcHEig.js.map
