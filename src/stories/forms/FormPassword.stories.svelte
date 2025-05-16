<script module>
  import FormPassword from '$lib/components/forms/form-password-input.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { writable } from 'svelte/store';

  // Create a mock SuperFormErrors store with the required clear method
  function createMockErrorsStore() {
    const { subscribe, set, update } = writable({});
    return {
      subscribe,
      set,
      update,
      clear: () => set({}),
    };
  }

  // Create a minimal SuperFormSnapshot for options
  const mockOptions = {
    id: 'mock-form-id',
    valid: true,
    posted: false,
    errors: {},
    data: { token: '' },
    constraints: {},
    message: '',
  };

  const { Story } = defineMeta({
    title: 'Components/Forms/FormPassword',
    component: FormPassword,
    parameters: {
      layout: 'centered',
    },
    argTypes: {
      form: {
        control: { type: 'object' },
        description: 'The form object',
      },
      fieldName: {
        control: { type: 'text' },
        description: 'The name of the field',
      },
    },
  });
</script>

<Story
  name="Default"
  args={{
    form: {
      form: {
        subscribe: function (run, invalidate) {
          // Mock implementation that returns an unsubscriber function
          run({ password: 'Johan' }); // token field value
          return function unsubscribe() {};
        },
        set: function (value, options) {},
        update: function (updater, options) {},
      },
      errors: createMockErrorsStore(),
      constraints: writable({}),
      posted: writable(false),
      message: writable(''),
      tainted: writable({ token: true }),
      formId: writable(''),
      submitting: writable(false),
      delayed: writable(false),
      timeout: writable(false),
      allErrors: writable([]),
      options: mockOptions,
      enhance: function (_el, _events) {
        return {
          destroy: () => {},
        };
      },
      isTainted: function (path) {
        return false; // Return a boolean value instead of throwing an error
      },
      reset: function (options) {},
      submit: function (submitter) {},
      capture: function () {
        throw new Error('Function not implemented.');
      },
      restore: function (snapshot) {
        throw new Error('Function not implemented.');
      },
      validate: function (path, opts) {
        throw new Error('Function not implemented.');
      },
      validateForm: function (opts) {
        throw new Error('Function not implemented.');
      },
    },
    fieldName: 'Password',
  }}
/>
