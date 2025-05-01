import { loadPrevalidatedAccountForms } from '../(data)/account';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const accountForms = await loadPrevalidatedAccountForms();

  return { accountForms };
};
