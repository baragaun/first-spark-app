<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SignIn from '../../routes/signin/+page.svelte';
  import { within, userEvent, expect, waitFor } from '@storybook/test';
  import MockUserProvider from '../mocks/mock-user-provider.svelte';

  const { Story } = defineMeta({
    title: 'Page/Sign In',
    component: SignIn,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default">
  <MockUserProvider>
    <SignIn />
  </MockUserProvider>
</Story>

<Story
  name="Sign In Process"
  play={async ({ canvasElement }) => {
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

    // Wait for the sign-in process to complete
    await waitFor(() => {
      // Check for successful sign-in (this depends on your UI)
      // For example, you might check for a success message or a redirect
      // expect(canvas.getByText(/Welcome/i)).toBeInTheDocument();
    });
  }}
>
  <MockUserProvider>
    <SignIn />
  </MockUserProvider>
</Story>

<Story
  name="Sign In With Token"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the email/username field
    const identifierInput = canvas.getByLabelText(/Email or Username/i);
    await userEvent.type(identifierInput, 'test@example.com');

    // Click the "Sign in with token" button
    const tokenButton = canvas.getByRole('button', { name: /Sign in with token/i });
    await userEvent.click(tokenButton);

    // Wait for the token form to appear
    await waitFor(() => {
      const tokenInput = canvas.getByLabelText(/Verification code/i);
      expect(tokenInput).toBeInTheDocument();
    });

    // Enter the verification code
    const tokenInput = canvas.getByLabelText(/Verification code/i);
    await userEvent.type(tokenInput, '123456');

    // Click the verify button
    const verifyButton = canvas.getByRole('button', { name: /Verify/i });
    await userEvent.click(verifyButton);

    // Wait for verification to complete
    await waitFor(() => {
      // Check for successful verification
    });
  }}
>
  <MockUserProvider>
    <SignIn />
  </MockUserProvider>
</Story>
