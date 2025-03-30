import { myUserContext } from '@/contexts/my-user-context.svelte';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
  deleteAccountSchema,
  emailSchema,
  passwordSchema,
  usernameSchema,
} from './account-settings-schema';

export const load = async () => {
  return {
    // Current user data (would come from API/database)
    currentUsername: myUserContext.myUserHandle,
    email: myUserContext.myEmail,

    // Form schemas
    usernameForm: await superValidate(zod(usernameSchema)),
    emailForm: await superValidate(zod(emailSchema)),
    passwordForm: await superValidate(zod(passwordSchema)),
    deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
  };
};

export const actions = {
  updateUsername: async (event) => {
    const form = await superValidate(event, zod(usernameSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    // TODO: Implement username update API call
    // await updateUsername(form.data.username);

    // Return success
    return { form };
  },

  updateEmail: async (event) => {
    const form = await superValidate(event, zod(emailSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    // TODO: Implement email update API call
    // await updateEmail(form.data.email, form.data.currentPassword);

    // Return success
    return { form };
  },

  updatePassword: async (event) => {
    const form = await superValidate(event, zod(passwordSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    // TODO: Implement password update API call
    // await updatePassword(form.data.currentPassword, form.data.newPassword);

    // Return success
    return { form };
  },

  deleteAccount: async (event) => {
    const form = await superValidate(event, zod(deleteAccountSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    // TODO: Implement account deletion API call
    // await deleteAccount(form.data.confirmEmail);

    // Return success
    return { form };
  },
};
