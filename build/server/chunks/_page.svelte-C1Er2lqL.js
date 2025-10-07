import { q as push, B as escape_html, u as pop } from './index-d9yomiCc.js';
import { M as Meta_tags } from './meta-tags-DeO-_oXb.js';

function _page($$payload, $$props) {
  push();
  const lastUpdated = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  Meta_tags($$payload, {
    title: "Privacy Policy | First Spark",
    description: "Learn about how First Spark collects, uses, and protects your personal information.",
    canonicalUrl: "/privacy-policy"
  });
  $$payload.out += `<!----> <div class="grid flex-1 place-items-center"><div class="flex flex-col items-center px-4 text-center"><h1 class="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Privacy Policy</h1> <p class="mt-4 text-muted-foreground">Last updated: ${escape_html(lastUpdated)}</p></div></div>`;
  pop();
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C1Er2lqL.js.map
