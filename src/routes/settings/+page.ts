import type { PageLoad } from './$types';
import { loadPrevalidatedAccountForms } from './(data)/account';

export const load: PageLoad = async ({ url }) => {
  let currentTab = 'account';
  if (url.pathname.includes('/notifications')) {
    currentTab = 'notifications';
  }

  const accountForms = await loadPrevalidatedAccountForms();

  return {
    currentTab,
    accountForms,
  };
};
