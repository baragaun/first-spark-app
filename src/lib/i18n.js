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

export const { t, locale, locales, loading, loadTranslations } = i18n;
