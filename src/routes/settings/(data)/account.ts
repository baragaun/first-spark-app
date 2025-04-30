import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
  changeEmailschemaLastStep,
  deleteAccountSchema,
  passwordSchema,
  usernameSchema,
} from './schema';

export const usernameForm = await superValidate(zod(usernameSchema));
export const emailForm = await superValidate(zod(changeEmailschemaLastStep));
export const passwordForm = await superValidate(zod(passwordSchema));
export const deleteAccountForm = await superValidate(zod(deleteAccountSchema));
