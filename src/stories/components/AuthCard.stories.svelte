<script module>
  import AuthCard from '$lib/components/auth-card.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/AuthCard',
    component: AuthCard,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],
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
    },
  });
</script>

<Story
  name="Default"
  args={{
    title: 'Sign In',
    description: 'Enter your credentials to access your account',
    onBack: () => {},
    showBackButton: false,
  }}
/>
