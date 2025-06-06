declare module 'mode-watcher' {
  export type ThemeMode = 'light' | 'dark' | 'system' | 'kcu';
  
  export function setMode(mode: ThemeMode): void;
  export function resetMode(): void;
  export const userPrefersMode: import('svelte/store').Writable<ThemeMode>;
  export const mode: import('svelte/store').Writable<ThemeMode>;
  
  export class ModeWatcher {
    constructor();
  }
} 