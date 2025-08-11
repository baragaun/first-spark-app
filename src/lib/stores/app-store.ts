import { env } from '$env/dynamic/public';
import { FirstSparkApp, KCUApp } from '@/types/enums';
import { derived, writable } from 'svelte/store';

// Create a derived store for the app title
export const appTitle = derived(writable(env.PUBLIC_PROJECTNAME), ($projectName) => {
  switch ($projectName) {
    case 'FirstSpark':
      return FirstSparkApp.title;
    case 'KCU':
      return KCUApp.title;
    default:
      return 'First Spark';
  }
});

// Create a derived store for the app description
export const appDescription = derived(writable(env.PUBLIC_PROJECTNAME), ($projectName) => {
  switch ($projectName) {
    case 'FirstSpark':
      return FirstSparkApp.description;
    case 'KCU':
      return KCUApp.description;
    default:
      return '';
  }
});

// Create a derived store for the canonical URL
export const appCanonicalUrl = derived(writable(env.PUBLIC_PROJECTNAME), ($projectName) => {
  switch ($projectName) {
    case 'FirstSpark':
      return FirstSparkApp.canonicalUrl;
    case 'KCU':
      return KCUApp.canonicalUrl;
    default:
      return '';
  }
});

export const headerIcon = derived(writable(env.PUBLIC_PROJECTNAME), ($projectName) => {
  switch ($projectName) {
    case 'FirstSpark':
      return '/fs-logo.svg';
    case 'KCU':
      return '/favicon-kcu.png';
    default:
      return '/fs-logo.svg';
  }
});

export const headerSmallIcon = derived(writable(env.PUBLIC_PROJECTNAME), ($projectName) => {
  switch ($projectName) {
    case 'FirstSpark':
      return '/fs-logo.svg';
    case 'KCU':
      return '/KCU-Logo-small.png';
    default:
      return '/fs-logo.svg';
  }
});
