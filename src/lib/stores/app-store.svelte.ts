import { env } from '$env/dynamic/public';
import { FirstSparkApp, KCUApp } from '@/types/enums';

let projectName = $state(env.PUBLIC_PROJECTNAME);

export const appTitle = () => {
  switch (projectName) {
    case 'FirstSpark':
      return FirstSparkApp.title;
    case 'KCU':
      return KCUApp.title;
    default:
      return 'First Spark';
  }
};

export let appDescription = () => {
  switch (projectName) {
    case 'FirstSpark':
      return FirstSparkApp.description;
    case 'KCU':
      return KCUApp.description;
    default:
      return '';
  }
};

export let appCanonicalUrl = () => {
  switch (projectName) {
    case 'FirstSpark':
      return FirstSparkApp.canonicalUrl;
    case 'KCU':
      return KCUApp.canonicalUrl;
    default:
      return '';
  }
};

export let headerIcon = () => {
  switch (projectName) {
    case 'FirstSpark':
      return '/fs-logo.svg';
    case 'KCU':
      return '/favicon-kcu.png';
    default:
      return '/fs-logo.svg';
  }
};

export let headerSmallIcon = () => {
  switch (projectName) {
    case 'FirstSpark':
      return '/fs-logo.svg';
    case 'KCU':
      return '/KCU-Logo-small.png';
    default:
      return '/fs-logo.svg';
  }
};
