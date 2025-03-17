import { DEFAULT_LANGUAGE } from '$lib/i18n/constants';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { setupI18n } from './setup/i18n-setup';

// Mock matchMedia
global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Setup i18n with default language
setupI18n(DEFAULT_LANGUAGE);
