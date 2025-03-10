import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('de', () => import('./locales/de.json'));
register('hi', () => import('./locales/hi.json'));

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});

interface MessageObject {
  id?: string;
  locale?: string;
  format?: string;
  default?: string;
  values?: Record<string, string | number | Date>;
}
