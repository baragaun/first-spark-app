import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { schemaLastStep } from './form/schema';;

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(schemaLastStep)),
  };
};
