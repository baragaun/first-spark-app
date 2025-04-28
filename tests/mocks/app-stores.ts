import { readable, writable } from 'svelte/store';

// Mock page store
export const page = readable({
  url: new URL('http://localhost:3000'),
  params: {},
  route: {
    id: null,
  },
  status: 200,
  error: null,
  data: {},
  form: null,
});

// Mock navigating store
export const navigating = readable(null);

// Mock updated store
export const updated = {
  subscribe: readable(false).subscribe,
  check: () => Promise.resolve(false),
};

// Mock session store
export const session = writable({});
