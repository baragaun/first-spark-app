import { M as sanitize_props, I as spread_props, T as slot } from './index-d9yomiCc.js';
import { I as Icon } from './Icon-CCGd_g73.js';

function Arrow_left($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m12 19-7-7 7-7" }],
    ["path", { "d": "M19 12H5" }]
  ];
  Icon($$payload, spread_props([
    { name: "arrow-left" },
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

export { Arrow_left as A };
//# sourceMappingURL=arrow-left-ByyUiPBJ.js.map
