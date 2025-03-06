import { writable } from 'svelte/store';
import en from './locales/en.json';
import fr from './locales/es.json';

const translations = { en, fr };
export const locale = writable('en');
export const t = writable(translations.en);

locale.subscribe((lang) => {
  t.set(translations.en);
});
