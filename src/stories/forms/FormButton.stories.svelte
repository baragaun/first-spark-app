<script module>
  import FormButton from '$lib/components/forms/form-button.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/Forms/FormButton',
    parameters: { layout: 'centered' },
  });
</script>

<Story name="Default" args={{ buttonText: 'Submit', isLoading: false, isSuccess: false }}>
  <FormButton buttonText="Submit" />
</Story>

<Story name="Loading" args={{ isLoading: true, loadingText: 'Loading...' }}>
  <FormButton isLoading={true} loadingText="Loading..." />
</Story>

<Story name="Success" args={{ isSuccess: true, successText: 'Success!' }}>
  <FormButton isSuccess={true} successText="Success!" />
</Story>
