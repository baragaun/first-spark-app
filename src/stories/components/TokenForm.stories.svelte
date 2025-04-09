<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TokenForm from '@/components/token-form/token-form.svelte';

  const { Story } = defineMeta({
    title: 'Components/TokenForm',
    component: TokenForm,
    parameters: {
      layout: 'centered',
    },
    argTypes: {
      ident: {
        control: { type: 'text' },
        description: 'The title displayed at the top of the card',
        defaultValue: 'Authentication',
      },
      showPasswordField: {
        control: 'boolean',
        description: 'Whether to show a back button',
        defaultValue: false,
      },
    },
  });
</script>

<Story
  name="Default"
  args={{
    ident: 'test@example.com',
    onSubmit: () => {},
    onResend: () => {},
    onBack: () => {},
    showPasswordField: false,
  }}
/>
