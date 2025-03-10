import { browser } from '$app/environment';
import { getLocaleFromNavigator, init, locale, register } from 'svelte-i18n';

const defaultLocale = 'en';

// Register all locales
register('en', () => import('../locales/en.json'));
register('de', () => import('../locales/de.json'));
register('hi', () => import('../locales/hi.json'));

// Initialize only in browser
export function initI18n() {
  init({
    fallbackLocale: defaultLocale,
    initialLocale: defaultLocale,
  });

  if (browser) {
    const navigatorLocale = getLocaleFromNavigator();
    // Extract the language part from the locale (e.g., 'en-US' -> 'en')
    const language = navigatorLocale?.split('-')[0] || defaultLocale;
    // Only set if it's one of our supported languages
    if (['en', 'de', 'hi'].includes(language)) {
      locale.set(language);
    } else {
      locale.set(defaultLocale);
    }
  }
}
