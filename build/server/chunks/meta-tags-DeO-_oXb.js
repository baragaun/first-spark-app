import { G as head, B as escape_html, A as attr } from './index-d9yomiCc.js';

function Meta_tags($$payload, $$props) {
  const siteUrl = "http://localhost:5173";
  let { title, description, canonicalUrl, ogImage } = $$props;
  const fullCanonicalUrl = `${siteUrl}${canonicalUrl}`;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(title)}</title>`;
    $$payload2.out += `<meta name="description"${attr("content", description)}/> <link rel="canonical"${attr("href", fullCanonicalUrl)}/> <meta property="og:type" content="website"/> <meta property="og:title"${attr("content", title)}/> <meta property="og:description"${attr("content", description)}/> <meta property="og:url"${attr("content", fullCanonicalUrl)}/> `;
    if (ogImage) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<meta property="og:image"${attr("content", ogImage)}/>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title"${attr("content", title)}/> <meta name="twitter:description"${attr("content", description)}/> `;
    if (ogImage) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<meta name="twitter:image"${attr("content", ogImage)}/>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  });
}

export { Meta_tags as M };
//# sourceMappingURL=meta-tags-DeO-_oXb.js.map
