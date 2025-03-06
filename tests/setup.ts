import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock browser globals
// global.localStorage = {
//   getItem: vi.fn(),
//   setItem: vi.fn(),
//   clear: vi.fn(),
//   length: 0,
//   key: vi.fn(),
//   removeItem: vi.fn(),
// } as Storage;

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
