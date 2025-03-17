import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '$lib/i18n/constants';
import de from '$lib/locales/de.json';
import en from '$lib/locales/en.json';
import hi from '$lib/locales/hi.json';
import { addMessages, init } from 'svelte-i18n';
import { vi } from 'vitest';

const translations = {
  en,
  de,
  hi,
};

export function setupI18n(locale = DEFAULT_LANGUAGE) {
  // Validate locale
  if (!SUPPORTED_LANGUAGES.includes(locale)) {
    throw new Error(
      `Unsupported locale: ${locale}. Supported locales are: ${SUPPORTED_LANGUAGES.join(', ')}`,
    );
  }

  // Mock getLocaleFromNavigator
  vi.mock('svelte-i18n', async (importOriginal) => {
    const actual = await importOriginal<typeof import('svelte-i18n')>();
    return {
      ...actual,
      getLocaleFromNavigator: () => locale,
    };
  });

  // Add all translations
  Object.entries(translations).forEach(([lang, messages]) => {
    addMessages(lang, messages);
  });

  // Initialize with specified locale
  init({
    fallbackLocale: DEFAULT_LANGUAGE,
    initialLocale: locale,
  });
}

// Helper function to change locale during tests
export function changeLocale(locale: string) {
  if (!SUPPORTED_LANGUAGES.includes(locale)) {
    throw new Error(
      `Unsupported locale: ${locale}. Supported locales are: ${SUPPORTED_LANGUAGES.join(', ')}`,
    );
  }

  init({
    fallbackLocale: DEFAULT_LANGUAGE,
    initialLocale: locale,
  });
}

// Helper to get all available locales
export function getAvailableLocales(): string[] {
  return SUPPORTED_LANGUAGES;
}
