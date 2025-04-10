import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { schemaLastStep } from './schema';

export const load = async () => {
	const form = await superValidate(zod(schemaLastStep));
	return { form };
};
