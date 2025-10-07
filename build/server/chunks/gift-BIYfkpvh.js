import { M as sanitize_props, I as spread_props, T as slot } from './index-d9yomiCc.js';
import { I as Icon } from './Icon-CCGd_g73.js';

function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function Gift($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "x": "3",
        "y": "8",
        "width": "18",
        "height": "4",
        "rx": "1"
      }
    ],
    ["path", { "d": "M12 8v13" }],
    [
      "path",
      {
        "d": "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"
      }
    ],
    [
      "path",
      {
        "d": "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "gift" },
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

export { Gift as G, html as h };
//# sourceMappingURL=gift-BIYfkpvh.js.map
