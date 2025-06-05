import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageLoad } from './$types';
import { completeSchema } from './schema';

export const load: PageLoad = async () => {
  return { form: await superValidate(zod(completeSchema)) };
};
