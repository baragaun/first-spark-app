import { env } from '$env/dynamic/public';
import { FirstSparkApp, KCUApp, TapcoApp } from '@/types/enums';

let projectName = $state(env.PUBLIC_PROJECTNAME);

export const appTitle = () => {
  switch (projectName) {
    case 'FirstSpark':
      return FirstSparkApp.title;
    case 'KCU':
      return KCUApp.title;
    case 'Tapco':
      return TapcoApp.title;
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
    case 'Tapco':
      return TapcoApp.description;
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
    case 'Tapco':
      return TapcoApp.canonicalUrl;
    default:
      return '';
  }
};

export let headerIcon = () => {
  switch (projectName) {
    case 'FirstSpark':
      return '/fs-logo.svg';
    case 'KCU':
      return '/fs-logo-kcu-large.png';
    case 'Tapco':
      return '/tapco.svg';
    default:
      return '/fs-logo.svg';
  }
};

export let headerSmallIcon = () => {
  switch (projectName) {
    case 'FirstSpark':
      return '/fs-logo.svg';
    case 'KCU':
      return '/fs-logo-kcu-small.png';
    case 'Tapco':
      return '/tapco-small.png';
    default:
      return '/fs-logo.svg';
  }
};
