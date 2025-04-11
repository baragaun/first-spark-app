import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { signInFormSchema } from './schema.js';

export const load = async () => {
  const form = await superValidate(zod(signInFormSchema));
  return { form };
};
