import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
  deleteAccountFormSchema,
  emailFormSchemaLastStep,
  passwordFormSchema,
  usernameFormSchema,
} from './schema';

export const loadPrevalidatedAccountForms = async () => {
  const usernameForm = await superValidate(zod(usernameFormSchema));
  const emailForm = await superValidate(zod(emailFormSchemaLastStep));
  const passwordForm = await superValidate(zod(passwordFormSchema));
  const deleteAccountForm = await superValidate(zod(deleteAccountFormSchema));

  return {
    usernameForm,
    emailForm,
    passwordForm,
    deleteAccountForm,
  };
};
