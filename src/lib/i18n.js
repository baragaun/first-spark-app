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
      locale: 'es',
      key: '',
      loader: () => import('./locales/es.json'),
    },
  ],
});

export const { t, locale, locales, loading, loadTranslations } = i18n;
