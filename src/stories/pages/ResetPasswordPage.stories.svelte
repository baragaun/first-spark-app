<!-- <script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ResetPasswordPage from '../../routes/reset-password/reset-password-form.svelte';
  import MockUserProvider from '../mocks/mock-user-provider.svelte';

  const { Story } = defineMeta({
    title: 'Page/Reset Password',
    component: ResetPasswordPage,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default">
  <MockUserProvider>
    <ResetPasswordPage
      data={{
        form: {
          data: { ident: '', token: '', newPassword: '', actionId: '' },
          errors: {},
          constraints: {},
          id: '',
          valid: false,
          posted: false,
        },
      }}
    />
  </MockUserProvider>
</Story> -->
