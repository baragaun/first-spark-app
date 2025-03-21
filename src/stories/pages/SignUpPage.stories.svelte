<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import SignUp from '../../routes/signup/+page.svelte';
  import { within, userEvent, expect, waitFor } from '@storybook/test';

  const { Story } = defineMeta({
    title: 'Page/Sign Un',
    component: SignUp,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default">
  <Sidebar.Provider>
    <SignUp
      data={{
        form: {
          data: {
            email: '',
            emailOtp: '',
            username: '',
            password: '',
          },
          errors: {},
          constraints: {},
          id: '',
          valid: false,
          posted: false,
        },
      }}
    />
  </Sidebar.Provider>
</Story>

<!-- <Story name="Sign Up Process" play={async ({ canvasElement }) => {
      const canvas = within(canvasElement);

      // Fill in the email/username field
      const identifierInput = canvas.getByLabelText(/Email or Username/i);
      await userEvent.type(identifierInput, 'test@example.com');

      // Click the "Sign in with password" button to show password field
      const showPasswordButton = canvas.getByRole('button', { name: /Sign in with password/i });
      await userEvent.click(showPasswordButton);

      // Fill in the password field
      const passwordInput = canvas.getByLabelText(/Password/i);
      await userEvent.type(passwordInput, 'password123');

      // Click the sign in button
      const signInButton = canvas.getByRole('button', { name: /Sign in$/i });
      await userEvent.click(signInButton);

      // Wait for the sign-in process (this is a mock, so we're just demonstrating the interaction)
      // await waitFor(() => {
      //   // In a real test, you might check for a success message or redirect
      //   expect(canvas.getByText(/Sign In/i)).toBeInTheDocument();
      // });
    }}
  />



 -->
