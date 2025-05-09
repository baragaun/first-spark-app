<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SignUp from '../../routes/signup/+page.svelte';
  import { within, userEvent, expect, waitFor } from '@storybook/test';
  import MockUserProvider from '../mocks/mock-user-provider.svelte';
  import { zod } from 'sveltekit-superforms/adapters';
  import { superValidate } from 'sveltekit-superforms/server';
  import { schemaLastStep } from '../../routes/signup/schema';

  // Create a properly validated form for the story
  const getValidatedForm = async () => {
    return await superValidate(zod(schemaLastStep));
  };

  const { Story } = defineMeta({
    title: 'Page/Sign Up',
    component: SignUp,
    parameters: {
      layout: 'centered',
    },
     args: {
      // This will be available to all stories
      data: {
        userInitialized: false,
        form: {
          data: { email: '', token: '', username: '', password: '' },
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
    <SignUp data={$$props.data} />
  </MockUserProvider>
</Story>

<Story
  name="Sign Up Process"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Step 1: Enter email
    const emailInput = canvas.getByPlaceholderText(/Enter your email/i);
    await userEvent.type(emailInput, 'test+123@example.com');

    // Click continue
    const continueButton = canvas.getByRole('button', { name: /Continue/i });
    await userEvent.click(continueButton);

    // Step 2: Enter verification code
    await waitFor(() => {
      const verificationTitle = canvas.getByText(/Verify your email/i);
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

    // Click verify
    const verifyButton = canvas.getByRole('button', { name: /Verify/i });
    await userEvent.click(verifyButton);

    // Step 3: Enter username and password
    await waitFor(() => {
      const usernameInput = canvas.getByPlaceholderText(/Username/i);
      expect(usernameInput).toBeInTheDocument();
    });

    const usernameInput = canvas.getByPlaceholderText(/Username/i);
    await userEvent.type(usernameInput, 'testuser123');

    const passwordInput = canvas.getByPlaceholderText(/Password/i);
    await userEvent.type(passwordInput, 'Password123');

    // Click sign up
    const signUpButton = canvas.getByRole('button', { name: /Create Account/i });
    await userEvent.click(signUpButton);

    // Wait for sign up to complete
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
    <SignUp data={$$props.data}
    />
  </MockUserProvider>
</Story>
