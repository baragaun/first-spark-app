<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ResetPasswordPage from '../../routes/reset-password/reset-password-form.svelte';
  import MockUserProvider from '../mocks/mock-user-provider.svelte';
  import { zod } from 'sveltekit-superforms/adapters';
  import { superValidate } from 'sveltekit-superforms/server';
  import { schemaLastStep } from '../../routes/reset-password/schema';

  // Create a properly validated form for the story
  const getValidatedForm = async () => {
    return await superValidate(zod(schemaLastStep));
  };

  const { Story } = defineMeta({
    title: 'Page/Reset Password',
    component: ResetPasswordPage,
    args: {
      // This will be available to all stories
      data: {
        form: {
          data: { ident: '', token: '', newPassword: '', actionId: '' },
          id: '',
          valid: false,
          posted: false,
          errors: {},
          constraints: {}
        } // Will be set in the loader
      }
    },
    loaders: [
      async ({ args }) => {
        // Set the validated form in the args
        args.data.form = await getValidatedForm();
        return args;
      }
    ],
    parameters: {
      layout: 'centered',
    },

  });
</script>

<Story name="Default">
  <MockUserProvider>
    <ResetPasswordPage data={$$props.data} />
  </MockUserProvider>
</Story>
