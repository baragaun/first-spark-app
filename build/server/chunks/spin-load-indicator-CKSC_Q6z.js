import { q as push, E as bind_props, u as pop, M as sanitize_props, I as spread_props, T as slot } from './index-d9yomiCc.js';
import { I as Icon } from './Icon-CCGd_g73.js';

function Circle_check_big($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M21.801 10A10 10 0 1 1 17 3.335" }
    ],
    ["path", { "d": "m9 11 3 3L22 4" }]
  ];
  Icon($$payload, spread_props([
    { name: "circle-check-big" },
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
function Loader_circle($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M21 12a9 9 0 1 1-6.219-8.56" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "loader-circle" },
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
function Spin_load_indicator($$payload, $$props) {
  push();
  let { isLoading = true, isSuccess = false } = $$props;
  $$payload.out += `<div class="m-auto flex h-6 w-6 items-center justify-center svelte-lwgszb">`;
  if (isSuccess) {
    $$payload.out += "<!--[-->";
    Circle_check_big($$payload, {
      style: "animation: show-checkmark 0.3s ease-out forwards;"
    });
  } else if (isLoading) {
    $$payload.out += "<!--[1-->";
    Loader_circle($$payload, { class: "animate-spin" });
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div hidden class="svelte-lwgszb"></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { isLoading, isSuccess });
  pop();
}

export { Spin_load_indicator as S };
//# sourceMappingURL=spin-load-indicator-CKSC_Q6z.js.map
