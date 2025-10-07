import { q as push, F as getContext, B as escape_html, u as pop } from './index-d9yomiCc.js';
import { B as Button } from './button-B_xSpjF_.js';
import { g as getLocale, t as trackMessageCall } from './runtime-Bj_FdU8B.js';
import { g as get_started } from './get_started-Dhrk9Lqg.js';
import './translate-DAfkGQ1n.js';
import '@baragaun/bg-node-client';
import { c as appTitle } from './app-store.svelte-hO-d5cjK.js';
import './utils-CCkZTMVc.js';
import './shared-server-i79vVjEm.js';

const en_welcome = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `Welcome to ${i.title}`;
  }
);
const es_welcome = (
  /** @type {(inputs: { title: NonNullable<unknown> }) => string} */
  (i) => {
    return `Bienvenido a ${i.title}`;
  }
);
const welcome = /* @__NO_SIDE_EFFECTS__ */ (inputs, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("welcome", locale);
  if (locale === "en") return en_welcome(inputs);
  if (locale === "es") return es_welcome(inputs);
  return "welcome";
};
function _page($$payload, $$props) {
  push();
  const userContext = getContext("myUserContext");
  const isSignedIn = userContext.isSignedIn;
  $$payload.out += `<div class="grid flex-1 place-items-center"><div class="flex flex-col items-center px-4 text-center"><h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">${escape_html(/* @__PURE__ */ welcome({ title: appTitle() }))}</h1>  <div class="mt-8 flex flex-wrap items-center justify-center gap-4">`;
  if (!isSignedIn) {
    $$payload.out += "<!--[-->";
    Button($$payload, {
      variant: "default",
      size: "lg",
      class: "text-background shadow-lg transition-all hover:scale-105 hover:shadow-primary/25 active:scale-100",
      href: "/signup",
      children: ($$payload2) => {
        $$payload2.out += `<!---->${escape_html(get_started())}`;
      },
      $$slots: { default: true }
    });
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-H21D3IVs.js.map
