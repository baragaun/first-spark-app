import { vi } from 'vitest';

// Common navigation mocks
export const mockNavigation = () => {
  vi.mock('$app/navigation', () => ({
    goto: vi.fn(),
    beforeNavigate: vi.fn(),
    afterNavigate: vi.fn(),
    disableScrollHandling: vi.fn(),
    onNavigate: vi.fn(),
    invalidate: vi.fn(),
    invalidateAll: vi.fn(),
    preloadData: vi.fn(),
    preloadCode: vi.fn(),
  }));
};

// Common browser API mocks
export const mockBrowserAPIs = () => {
  // Mock CSS.supports which is used by the OTP input component
  if (!window.CSS) {
    window.CSS = {} as any;
  }
  window.CSS.supports = vi.fn().mockReturnValue(true);

  // Mock ResizeObserver
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = MockResizeObserver as any;
};

// Create mock user context methods
export const createMockUserContext = (methods: string[]) => {
  const mockMethods: Record<string, any> = {};

  methods.forEach((method) => {
    mockMethods[method] = vi.fn();
  });

  return mockMethods;
};

// Remove this function or fix it by adding the contextPath parameter
// export const mockUserContext = (methods: string[]) => {
//   const mockMethods: Record<string, any> = {};
//
//   methods.forEach(method => {
//     mockMethods[method] = vi.fn();
//   });
//
//   vi.mock(contextPath, () => ({
//     myUserContext: mockMethods
//   }));
// };
