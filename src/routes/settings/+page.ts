import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  let currentTab = '';

  if (url.pathname === '/settings') {
    return {
      currentTab: 'account',
    };
  }

  if (url.pathname.includes('/account')) {
    currentTab = 'account';
  } else if (url.pathname.includes('/notifications')) {
    currentTab = 'notifications';
  }

  return { currentTab };
};
