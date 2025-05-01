import type { PageLoad } from './$types';
import { loadPrevalidatedAccountForms } from '../(data)/account';

export const load: PageLoad = async () => {
  const accountForms = await loadPrevalidatedAccountForms();

  return { accountForms };
};
