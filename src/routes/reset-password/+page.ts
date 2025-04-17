import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { schemaLastStep } from './schema';

export const load = async () => {
  return { form: await superValidate(zod(schemaLastStep)) };
};
