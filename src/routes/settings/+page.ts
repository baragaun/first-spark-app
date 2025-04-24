import { myUserContext } from '@/contexts/my-user-context.svelte';
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
    // Current user data (would come from API/database)
    currentUsername: myUserContext.myUserHandle,
    email: myUserContext.myEmail,

    // Form schemas
    usernameForm: await superValidate(zod(usernameSchema)),
    emailForm: await superValidate(zod(changeEmailschemaLastStep)),
    passwordForm: await superValidate(zod(passwordSchema)),
    deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
  };
};