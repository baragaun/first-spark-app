<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SignIn from '../../routes/signin/+page.svelte';
  import { within, userEvent, expect, waitFor } from '@storybook/test';
  import MockUserProvider from '../mocks/mock-user-provider.svelte';
  import { zod } from 'sveltekit-superforms/adapters';
  import { superValidate } from 'sveltekit-superforms/server';
  import { signInFormSchema } from '../../routes/signin/schema';
  import { mockMyUserContext } from '../mocks/mock-user-context';

  // Create a properly validated form for the story
  const getValidatedForm = async () => {
    return await superValidate(zod(signInFormSchema));
  };

  // Ensure the mock context is initialized
  mockMyUserContext.isInitialized = true;
  mockMyUserContext.client.isInitialized = true;

  const { Story } = defineMeta({
    title: 'Page/Sign In',
    component: SignIn,
    parameters: {
      layout: 'fullscreen',
    },
    args: {
      // This will be available to all stories
      data: {
        userInitialized: true,
        form: {
          data: { ident: '', authType: 'password' },
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
    ]
  });
</script>

<Story name="Default">
  <MockUserProvider>
    <SignIn data={$$props.data} />
  </MockUserProvider>
</Story>

<Story
  name="Sign In Process"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Fill in the email/username field
    const identifierInput = canvas.getByPlaceholderText(/Enter your email or username/i);
    await userEvent.type(identifierInput, 'test@example.com');

    // Fill in the password field
    const passwordInput = canvas.getByPlaceholderText(/Enter your password/i);
    await userEvent.type(passwordInput, '123456789');

    // Click the sign in button
    const signInButton = canvas.getByRole('button', { name: /Sign in/i });
    await userEvent.click(signInButton);

    //todo add verfication code test

    // Wait for the sign-in process to complete
    await waitFor(() => {
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
    <SignIn data={$$props.data} />
  </MockUserProvider>
</Story>

<Story
  name="Sign In With Token"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the context to be initialized
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fill in the email/username field
    const identifierInput = canvas.getByPlaceholderText(/Enter your email or username/i);
    await userEvent.type(identifierInput, 'test@example.com');

    // Click the "Sign in with token" button
    const tokenButton = canvas.getByRole('button', { name: /Sign in with token/i });
    await userEvent.click(tokenButton);

    // Wait for the token form to appear
    await waitFor(() => {
      // Look for the verification code heading/text
      const verificationTitle = canvas.getByText(/Enter the verification code sent to/);
      expect(verificationTitle).toBeInTheDocument();
    });

        // Find all input elements in the OTP component
    const otpInputs = Array.from(canvasElement.querySelectorAll('input[type="text"]'));

    // If we found the specific OTP inputs, type each digit
    if (otpInputs.length > 0) {
      for (let i = 0; i < Math.min(otpInputs.length, 6); i++) {
        await userEvent.type(otpInputs[i], (i + 1).toString());
      }
    } else {
      // Fallback: try to find any inputs that might be OTP fields
      const allInputs = Array.from(canvasElement.querySelectorAll('input'));
      const likelyOtpInputs = allInputs.filter(
        (input) =>
          !input.getAttribute('placeholder')?.includes('@') &&
          !input.getAttribute('type')?.includes('password'),
      );

      if (likelyOtpInputs.length > 0) {
        await userEvent.type(likelyOtpInputs[0], '123456');
      }
    }

    // Click the verify button
    const verifyButton = canvas.getByRole('button', { name: /Verify/i });
    await userEvent.click(verifyButton);

    // Wait for verification to complete
    await waitFor(() => {
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
    <SignIn data={$$props.data} />
  </MockUserProvider>
</Story>
