import dataProvider from '@/services/data-provider/data-provider';
import type { LayoutLoad } from './$types';

// Only initialize in browser environment
export const ssr = false;

export const load: LayoutLoad = async () => {
  try {
    // todo: initialize the context
    await dataProvider.init();
    console.log('BgNodeClient initialized successfully');

    return {
      initialized: true,
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to initialize client');
    console.error('Failed to initialize BgNodeClient:', error);

    return {
      initialized: false,
      error: error.message,
    };
  }
};
