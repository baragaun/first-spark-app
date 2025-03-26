<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SignUp from '../../routes/signup/+page.svelte';
  import { within, userEvent, expect, waitFor } from '@storybook/test';
  import MockUserProvider from '../mocks/mock-user-provider.svelte';

  const { Story } = defineMeta({
    title: 'Page/Sign Up',
    component: SignUp,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default">
  <MockUserProvider>
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
  </MockUserProvider>
</Story>

<Story
  name="Sign Up Process"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Step 1: Enter email
    const emailInput = canvas.getByLabelText(/Email/i);
    await userEvent.type(emailInput, 'test@example.com');

    // Click continue
    const continueButton = canvas.getByRole('button', { name: /Continue/i });
    await userEvent.click(continueButton);

    // Step 2: Enter verification code
    await waitFor(() => {
      const codeInput = canvas.getByLabelText(/Verification code/i);
      expect(codeInput).toBeInTheDocument();
    });

    const codeInput = canvas.getByLabelText(/Verification code/i);
    await userEvent.type(codeInput, '123456');

    // Click verify
    const verifyButton = canvas.getByRole('button', { name: /Verify/i });
    await userEvent.click(verifyButton);

    // Step 3: Enter username and password
    await waitFor(() => {
      const usernameInput = canvas.getByLabelText(/Username/i);
      expect(usernameInput).toBeInTheDocument();
    });

    const usernameInput = canvas.getByLabelText(/Username/i);
    await userEvent.type(usernameInput, 'testuser');

    const passwordInput = canvas.getByLabelText(/Password/i);
    await userEvent.type(passwordInput, 'Password123!');

    // Click sign up
    const signUpButton = canvas.getByRole('button', { name: /Sign up/i });
    await userEvent.click(signUpButton);

    // Wait for sign up to complete
    await waitFor(() => {
      // Check for successful sign up
    });
  }}
>
  <MockUserProvider>
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
  </MockUserProvider>
</Story>
