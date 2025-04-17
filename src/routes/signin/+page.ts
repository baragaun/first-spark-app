import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageLoad } from './$types.js';

import { signInFormSchema } from './schema.js';

export const load: PageLoad = async () => {
  return { form: await superValidate(zod(signInFormSchema)) };
};
