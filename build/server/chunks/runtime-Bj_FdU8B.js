const baseLocale = "en";
const locales = (
  /** @type {const} */
  ["en", "es"]
);
const cookieName = "PARAGLIDE_LOCALE";
const strategy = [
  "cookie",
  "preferredLanguage",
  "baseLocale"
];
let serverAsyncLocalStorage = void 0;
function overwriteServerAsyncLocalStorage(value) {
  serverAsyncLocalStorage = value;
}
globalThis.__paraglide = {};
let _locale;
let localeInitiallySet = false;
let getLocale = () => {
  let locale;
  if (serverAsyncLocalStorage) {
    const locale2 = serverAsyncLocalStorage?.getStore()?.locale;
    if (locale2) {
      return locale2;
    }
  }
  for (const strat of strategy) {
    if (strat === "cookie") {
      locale = extractLocaleFromCookie();
    } else if (strat === "baseLocale") {
      locale = baseLocale;
    } else ;
    if (locale !== void 0) {
      const asserted = assertIsLocale(locale);
      if (!localeInitiallySet) {
        _locale = asserted;
        localeInitiallySet = true;
        setLocale(asserted, { reload: false });
      }
      return asserted;
    }
  }
  throw new Error("No locale found. Read the docs https://inlang.com/m/gerre34r/library-inlang-paraglideJs/errors#no-locale-found");
};
let setLocale = (newLocale, options) => {
  ({
    ...options
  });
  let currentLocale;
  try {
    currentLocale = getLocale();
  } catch {
  }
  for (const strat of strategy) {
    if (strat === "cookie") {
      {
        continue;
      }
    } else if (strat === "baseLocale") {
      continue;
    } else ;
  }
  return;
};
let getUrlOrigin = () => {
  if (serverAsyncLocalStorage) {
    return serverAsyncLocalStorage.getStore()?.origin ?? "http://fallback.com";
  } else if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://fallback.com";
};
function isLocale(locale) {
  return !locale ? false : locales.includes(locale);
}
function assertIsLocale(input) {
  if (isLocale(input) === false) {
    throw new Error(`Invalid locale: ${input}. Expected one of: ${locales.join(", ")}`);
  }
  return input;
}
const extractLocaleFromRequest = (request) => {
  let locale;
  for (const strat of strategy) {
    if (strat === "cookie") {
      locale = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith(cookieName + "="))?.split("=")[1];
    } else if (strat === "preferredLanguage") {
      const acceptLanguageHeader = request.headers.get("accept-language");
      if (acceptLanguageHeader) {
        locale = negotiatePreferredLanguageFromHeader(acceptLanguageHeader);
      }
    } else if (strat === "globalVariable") {
      locale = _locale;
    } else if (strat === "baseLocale") {
      return baseLocale;
    } else if (strat === "localStorage") {
      continue;
    }
    if (locale !== void 0) {
      if (!isLocale(locale)) {
        locale = void 0;
      } else {
        return assertIsLocale(locale);
      }
    }
  }
  throw new Error("No locale found. There is an error in your strategy. Try adding 'baseLocale' as the very last strategy. Read more here https://inlang.com/m/gerre34r/library-inlang-paraglideJs/errors#no-locale-found");
};
function negotiatePreferredLanguageFromHeader(header) {
  const languages = header.split(",").map((lang) => {
    const [tag, q = "1"] = lang.trim().split(";q=");
    const baseTag = tag?.split("-")[0]?.toLowerCase();
    return {
      fullTag: tag?.toLowerCase(),
      baseTag,
      q: Number(q)
    };
  }).sort((a, b) => b.q - a.q);
  for (const lang of languages) {
    if (isLocale(lang.fullTag)) {
      return lang.fullTag;
    } else if (isLocale(lang.baseTag)) {
      return lang.baseTag;
    }
  }
  return void 0;
}
function extractLocaleFromCookie() {
  if (typeof document === "undefined" || !document.cookie) {
    return;
  }
  const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
  const locale = match?.[2];
  if (isLocale(locale)) {
    return locale;
  }
  return void 0;
}
function extractLocaleFromUrl(url) {
  {
    return defaultUrlPatternExtractLocale(url);
  }
}
function defaultUrlPatternExtractLocale(url) {
  const urlObj = new URL(url, "http://dummy.com");
  const pathSegments = urlObj.pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0) {
    const potentialLocale = pathSegments[0];
    if (isLocale(potentialLocale)) {
      return potentialLocale;
    }
  }
  return baseLocale;
}
function localizeUrl(url, options) {
  {
    return localizeUrlDefaultPattern(url, options);
  }
}
function localizeUrlDefaultPattern(url, options) {
  const urlObj = typeof url === "string" ? new URL(url, getUrlOrigin()) : new URL(url);
  const locale = options?.locale ?? getLocale();
  const currentLocale = extractLocaleFromUrl(urlObj);
  if (currentLocale === locale) {
    return urlObj;
  }
  const pathSegments = urlObj.pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0 && isLocale(pathSegments[0])) {
    pathSegments.shift();
  }
  if (locale === baseLocale) {
    urlObj.pathname = "/" + pathSegments.join("/");
  } else {
    urlObj.pathname = "/" + locale + "/" + pathSegments.join("/");
  }
  return urlObj;
}
function deLocalizeUrl(url) {
  {
    return deLocalizeUrlDefaultPattern(url);
  }
}
function deLocalizeUrlDefaultPattern(url) {
  const urlObj = typeof url === "string" ? new URL(url, getUrlOrigin()) : new URL(url);
  const pathSegments = urlObj.pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0 && isLocale(pathSegments[0])) {
    urlObj.pathname = "/" + pathSegments.slice(1).join("/");
  }
  return urlObj;
}
function localizeHref(href, options) {
  const locale = options?.locale ?? getLocale();
  const url = new URL(href, getUrlOrigin());
  const localized = localizeUrl(url, options);
  if (href.startsWith("/") && url.origin === localized.origin) {
    if (locale !== getLocale()) {
      const localizedCurrentLocale = localizeUrl(url, { locale: getLocale() });
      if (localizedCurrentLocale.origin !== localized.origin) {
        return localized.href;
      }
    }
    return localized.pathname + localized.search + localized.hash;
  }
  return localized.href;
}
function trackMessageCall(safeModuleId, locale) {
  const store = serverAsyncLocalStorage?.getStore();
  if (store) {
    store.messageCalls?.add(`${safeModuleId}:${locale}`);
  }
}

export { serverAsyncLocalStorage as a, localizeHref as b, locales as c, deLocalizeUrl as d, extractLocaleFromRequest as e, setLocale as f, getLocale as g, localizeUrl as l, overwriteServerAsyncLocalStorage as o, strategy as s, trackMessageCall as t };
//# sourceMappingURL=runtime-Bj_FdU8B.js.map
