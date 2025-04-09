import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import { fail } from '@sveltejs/kit';
import { schemaLastStep } from './schema.js';

export const load = async () => {
  const form = await superValidate(zod(schemaLastStep));
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(schemaLastStep));

    console.log('form actions default:', form);

    if (!form.valid) return fail(400, { form });

    return message(form, 'Form posted successfully!');
  },
};
