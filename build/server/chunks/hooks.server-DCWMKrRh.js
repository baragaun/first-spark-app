import { o as overwriteServerAsyncLocalStorage, e as extractLocaleFromRequest, s as strategy, l as localizeUrl, d as deLocalizeUrl, a as serverAsyncLocalStorage } from './runtime-Bj_FdU8B.js';

async function paraglideMiddleware(request, resolve) {
  if (!serverAsyncLocalStorage) {
    const { AsyncLocalStorage } = await import('async_hooks');
    overwriteServerAsyncLocalStorage(new AsyncLocalStorage());
  } else if (!serverAsyncLocalStorage) {
    overwriteServerAsyncLocalStorage(createMockAsyncLocalStorage());
  }
  const locale = extractLocaleFromRequest(request);
  const origin = new URL(request.url).origin;
  if (request.headers.get("Sec-Fetch-Dest") === "document" && strategy.includes("url")) {
    const localizedUrl = localizeUrl(request.url, { locale });
    if (normalizeURL(localizedUrl.href) !== normalizeURL(request.url)) {
      return Response.redirect(localizedUrl, 307);
    }
  }
  const newRequest = strategy.includes("url") ? new Request(deLocalizeUrl(request.url), request) : (
    // need to create a new request object because some metaframeworks (nextjs!) throw otherwise
    // https://github.com/opral/inlang-paraglide-js/issues/411
    new Request(request)
  );
  const messageCalls = /* @__PURE__ */ new Set();
  const response = await serverAsyncLocalStorage?.run({ locale, origin, messageCalls }, () => resolve({ locale, request: newRequest }));
  return response;
}
function normalizeURL(url) {
  const urlObj = new URL(url);
  urlObj.pathname = urlObj.pathname.replace(/\/$/, "");
  return urlObj.href;
}
function createMockAsyncLocalStorage() {
  let currentStore = void 0;
  return {
    getStore() {
      return currentStore;
    },
    async run(store, callback) {
      currentStore = store;
      try {
        return await callback();
      } finally {
        currentStore = void 0;
      }
    }
  };
}
const paraglideHandle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
  if (event.url.pathname.startsWith("/.well-known/appspecific/com.chrome.devtools")) {
    return new Response(null, { status: 204 });
  }
  event.request = localizedRequest;
  return resolve(event, {
    transformPageChunk: ({ html }) => {
      return html.replace("%lang%", locale);
    }
  });
});
const handle = paraglideHandle;

export { handle };
//# sourceMappingURL=hooks.server-DCWMKrRh.js.map
