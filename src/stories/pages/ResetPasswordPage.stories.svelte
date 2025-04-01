<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ResetPasswordPage from '../../routes/reset-password/+page.svelte';
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
    <ResetPasswordPage />
  </MockUserProvider>
</Story>
