<script module>
  import AuthCard from '$lib/components/auth-card.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { within, userEvent, expect, waitFor } from '@storybook/test';
  import Button from '@/components/ui/button/button.svelte';

  // Add this for the form example
  let framework = 'sveltekit';
  let frameworkLabel = 'SvelteKit';

  const frameworks = [
    { value: 'sveltekit', label: 'SvelteKit' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'solid', label: 'Solid' },
  ];

  const { Story } = defineMeta({
    title: 'Components/AuthCard',
    component: AuthCard,
    parameters: {
      layout: 'centered',
    },
    argTypes: {
      title: {
        control: { type: 'select' },
        options: ['Sign In', 'Sign Up', 'Reset Password'],
        description: 'The title displayed at the top of the card',
        defaultValue: 'Authentication',
      },
      description: {
        control: { type: 'select' },
        options: [
          'Enter your credentials to access your account',
          'Create a new account',
          'Reset your password',
        ],
        description: 'Optional description text displayed below the title',
      },
      showBackButton: {
        control: 'boolean',
        description: 'Whether to show a back button',
        defaultValue: false,
      },
      onBack: {
        action: 'onBack',
        description: 'Function called when the back button is clicked',
      },
      children: {
        description: 'Content to display inside the card',
      },
    },
  });
</script>

<Story
  name="Default"
  args={{
    title: 'Card Title',
    description: 'Enter your card details',
    onBack: () => {},
    showBackButton: true,
  }}
  play={async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Verify the card title and description
    const title = canvas.getByRole('heading', { name: args.title });
    expect(title).toBeInTheDocument();

    if (args.description) {
      const description = canvas.getByText(args.description);
      expect(description).toBeInTheDocument();
    }

    // Verify back button is visible when showBackButton is true
    if (args.showBackButton) {
      const backButton = canvas.getByRole('button', { name: /back/i });
      expect(backButton).toBeInTheDocument();

      // Test back button click
      await userEvent.click(backButton);
      // In a real test, you might verify that args.onBack was called
    }

    // Test form interaction
    // Fill in the email input
    const emailInput = canvas.getByPlaceholderText('Please enter your email.');
    await userEvent.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');

    // Fill in the password input
    const passwordInput = canvas.getByPlaceholderText('Please enter your password.');
    await userEvent.type(passwordInput, 'password123');
    expect(passwordInput).toHaveValue('password123');

    // Click the submit button
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);

  }}
>
  <form>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="email">Email</Label>
        <Input id="email" placeholder="Please enter your email." />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Label for="password">Password</Label>
        <Input id="password" type="password" placeholder="Please enter your password." />
      </div>
      <div class="flex flex-col space-y-1.5">
        <Button>Submit</Button>
      </div>
    </div>
  </form>
</Story>
