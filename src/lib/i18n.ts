import I18n from 'sveltekit-i18n';

const i18n = new I18n({
  fallbackLocale: 'en',
  initLocale: 'es',
  loaders: [
    {
      locale: 'en',
      key: '',
      loader: () => import('./locales/en.json'),
    },
    {
      locale: 'de',
      key: '',
      loader: () => import('./locales/de.json'),
    },
    {
      locale: 'hi',
      key: '',
      loader: () => import('./locales/hi.json'),
    },
  ],
});

// Initialize i18n
export const { t, locale, locales, loading, loadTranslations } = i18n;

// Wrapper function to infer parameters automatically
// export function t(key: string, params?: Record<string, string>) {
//   return rawT(key, params); // Use rawT instead of t to avoid recursion
// }
