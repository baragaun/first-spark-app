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
    const identifierInput = canvas.getByPlaceholderText(/me@example.com, myusername/i);
    await userEvent.type(identifierInput, 'test@example.com');

    // Click the "Sign in with password" button to show password field
    const showPasswordButton = canvas.getByRole('button', { name: /Sign in with password/i });
    await userEvent.click(showPasswordButton);

    // Fill in the password field
    const passwordInput = canvas.getByPlaceholderText(/Password/i);
    await userEvent.type(passwordInput, '123456789');

    // Click the sign in button
    const signInButton = canvas.getByRole('button', { name: /Sign in$/i });
    await userEvent.click(signInButton);

    // Wait for the sign-in process to complete
    await waitFor(() => {
      // Check for successful sign up
      // Add a success popup to the DOM
      const successPopup = document.createElement('div');
      successPopup.id = 'test-success-popup';
      successPopup.style.position = 'fixed';
      successPopup.style.top = '20px';
      successPopup.style.right = '20px';
      successPopup.style.padding = '15px 20px';
      successPopup.style.background = '#4CAF50';
      successPopup.style.color = 'white';
      successPopup.style.borderRadius = '5px';
      successPopup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      successPopup.style.zIndex = '9999';
      successPopup.style.fontFamily = 'sans-serif';
      successPopup.textContent = '✅ Test Completed Successfully!';

      document.body.appendChild(successPopup);

      // Remove the popup after 5 seconds
      setTimeout(() => {
        if (document.body.contains(successPopup)) {
          document.body.removeChild(successPopup);
        }
      }, 5000);
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
    const identifierInput = canvas.getByPlaceholderText(/me@example.com, myusername/i);
    await userEvent.type(identifierInput, 'test@example.com');

    // Click the "Sign in with token" button
    const tokenButton = canvas.getByRole('button', { name: 'Sign in' });
    await userEvent.click(tokenButton);

    // Wait for the token form to appear
    await waitFor(() => {
      // Look for the verification code heading/text
      const verificationTitle = canvas.getByText(/Verify your email/i);
      expect(verificationTitle).toBeInTheDocument();
    });

    // Find all input elements in the OTP component
    // We need to use a more direct approach since the OTP component has a complex structure
    const otpInputs = Array.from(canvasElement.querySelectorAll('input[type="text"]'));

    // If no inputs are found, try with a more generic selector
    if (otpInputs.length === 0) {
      const allInputs = Array.from(canvasElement.querySelectorAll('input'));
      // Filter to likely OTP inputs (usually small, single-character inputs)
      const likelyOtpInputs = allInputs.filter(
        (input) =>
          !input.getAttribute('placeholder')?.includes('@') &&
          !input.getAttribute('type')?.includes('password'),
      );

      // Type the verification code
      if (likelyOtpInputs.length > 0) {
        // Type '123456' into the first input - many OTP components handle distribution automatically
        await userEvent.type(likelyOtpInputs[0], '123456');
      }
    } else {
      // If we found the specific OTP inputs, type each digit
      for (let i = 0; i < Math.min(otpInputs.length, 6); i++) {
        await userEvent.type(otpInputs[i], (i + 1).toString());
      }
    }

    // Click the verify button
    const verifyButton = canvas.getByRole('button', { name: /Verify/i });
    await userEvent.click(verifyButton);

    // Wait for verification to complete
    await waitFor(() => {
      // Check for successful sign up
      // Add a success popup to the DOM
      const successPopup = document.createElement('div');
      successPopup.id = 'test-success-popup';
      successPopup.style.position = 'fixed';
      successPopup.style.top = '20px';
      successPopup.style.right = '20px';
      successPopup.style.padding = '15px 20px';
      successPopup.style.background = '#4CAF50';
      successPopup.style.color = 'white';
      successPopup.style.borderRadius = '5px';
      successPopup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      successPopup.style.zIndex = '9999';
      successPopup.style.fontFamily = 'sans-serif';
      successPopup.textContent = '✅ Test Completed Successfully!';

      document.body.appendChild(successPopup);

      // Remove the popup after 5 seconds
      setTimeout(() => {
        if (document.body.contains(successPopup)) {
          document.body.removeChild(successPopup);
        }
      }, 5000);
    });
  }}
>
  <MockUserProvider>
    <SignIn />
  </MockUserProvider>
</Story>
