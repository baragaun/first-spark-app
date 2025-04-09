import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { schemaLastStep } from './schema';
import { fail } from '@sveltejs/kit';

export const load = async () => {
	// Create the form with the last step, to get all default values
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
