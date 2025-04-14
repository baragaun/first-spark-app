import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { schemaLastStep } from './schema';

export const load = async () => {
  const form = await superValidate(zod(schemaLastStep));
  return { form };
};
