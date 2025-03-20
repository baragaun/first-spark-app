import type { Actions, PageServerLoad } from './$types';
import { fail, message, superValidate } from "sveltekit-superforms";
import { formSchema } from "./form/sign-up-form-schema.js";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
 return {
  form: await superValidate(zod(formSchema)),
 };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    return {
      form,
    };
  },
};