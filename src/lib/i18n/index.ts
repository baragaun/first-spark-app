import { browser } from '$app/environment';
import { getLocaleFromNavigator, init, locale, register } from 'svelte-i18n';
import { DEFAULT_LANGUAGE, LANGUAGE_KEY, SUPPORTED_LANGUAGES } from './constants';

// Register all locales
register('en', () => import('../locales/en.json'));
register('de', () => import('../locales/de.json'));
register('hi', () => import('../locales/hi.json'));

// Initialize only in browser
export function initI18n() {
  init({
    fallbackLocale: DEFAULT_LANGUAGE,
    initialLocale: DEFAULT_LANGUAGE,
  });

  if (browser) {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage as any)) {
      locale.set(savedLanguage);
      return;
    }

    const navigatorLocale = getLocaleFromNavigator();
    const language = navigatorLocale?.split('-')[0] || DEFAULT_LANGUAGE;

    if (SUPPORTED_LANGUAGES.includes(language as any)) {
      locale.set(language);
      localStorage.setItem(LANGUAGE_KEY, language);
    } else {
      locale.set(DEFAULT_LANGUAGE);
      localStorage.setItem(LANGUAGE_KEY, DEFAULT_LANGUAGE);
    }
  }
}
