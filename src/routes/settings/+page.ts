import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
  changeEmailschemaLastStep,
  deleteAccountSchema,
  passwordSchema,
  usernameSchema,
} from './account/schema';

export const load = async () => {
  return {
    usernameForm: await superValidate(zod(usernameSchema)),
    emailForm: await superValidate(zod(changeEmailschemaLastStep)),
    passwordForm: await superValidate(zod(passwordSchema)),
    deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
  };
};
