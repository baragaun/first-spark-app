import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import { signInFormSchema } from './schema.js';

export const load = async () => {
  const form = await superValidate(zod(signInFormSchema));
  return { form };
};
