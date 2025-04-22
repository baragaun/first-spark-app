import FormIdentInput from '@/components/forms/form-ident-input.svelte';
import { UserIdentType } from '@baragaun/bg-node-client';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { describe, expect, it, vi } from 'vitest';

// Create a mock SuperForm
function createMockSuperForm(formData = {}, formErrors = {}) {
  const errorsStore = writable(formErrors);
  const { subscribe, set, update } = errorsStore;

  return {
    form: writable(formData),
    errors: {
      subscribe,
      set,
      update,
      clear: () => set({}),
    },
    constraints: writable({}),
    formId: writable('mock-form-id'),
    message: writable(''),
    tainted: writable({}),
    posted: writable(false),
    submitting: writable(false),
    delayed: writable(false),
    timeout: writable(false),
    allErrors: writable([]),
    options: { id: 'mock-form-id', valid: true },
    enhance: () => ({ destroy: () => {} }),
    validate: () => Promise.resolve({ valid: true }),
    validateForm: () => Promise.resolve({ valid: true }),
    reset: () => {},
    submit: () => {},
    isTainted: () => false,
    capture: () => ({}),
    restore: () => {},
  };
}

describe('FormIdentInput', () => {
  it('renders email input by default', () => {
    render(FormIdentInput, {
      props: {
        form: createMockSuperForm({ email: '' }) as any,
        fieldName: 'email',
      },
    });

    const label = screen.getByText('Email address');
    expect(label).toBeInTheDocument();

    const input = screen.getByPlaceholderText('e.g. "student@example.com"');
    expect(input).toBeInTheDocument();
  });

  it('renders username input when identType is userHandle', () => {
    render(FormIdentInput, {
      props: {
        form: createMockSuperForm({ username: '' }, { username: 'Username is required' }) as any,
        fieldName: 'username',
        label: 'Username',
        placeholder: 'e.g. "giraffe08"',
        identType: UserIdentType.userHandle,
      },
    });

    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();

    const input = screen.getByPlaceholderText('e.g. "giraffe08"');
    expect(input).toBeInTheDocument();
  });

  it('shows suggest button for username when generateUsername is provided', () => {
    const generateUsername = vi.fn();
    render(FormIdentInput, {
      props: {
        form: createMockSuperForm({ username: '' }, { username: 'Username is required' }) as any,
        fieldName: 'username',
        identType: UserIdentType.userHandle,
        generateUsername,
      },
    });

    const suggestButton = screen.getByRole('button', { name: /suggest new/i });
    expect(suggestButton).toBeInTheDocument();
  });

  it('calls generateUsername when suggest button is clicked', async () => {
    const generateUsername = vi.fn();
    render(FormIdentInput, {
      props: {
        form: createMockSuperForm({ username: '' }, { username: 'Username is required' }) as any,
        fieldName: 'username',
        identType: UserIdentType.userHandle,
        generateUsername,
      },
    });

    const suggestButton = screen.getByRole('button', { name: /suggest new/i });
    await fireEvent.click(suggestButton);

    expect(generateUsername).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    render(FormIdentInput, {
      props: {
        form: createMockSuperForm({ username: '' }) as any,
        fieldName: 'username',
        identType: UserIdentType.userHandle,
        generateUsername: vi.fn(),
        isLoading: true,
      },
    });

    const loadingText = screen.getByText('Generating...');
    expect(loadingText).toBeInTheDocument();

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows check icon when field is valid', () => {
    render(FormIdentInput, {
      props: {
        form: createMockSuperForm({ username: 'validusername' }, { username: null }) as any,
        fieldName: 'username',
        identType: UserIdentType.userHandle,
      },
    });

    const checkIcon = document.querySelector('.text-green-500');
    expect(checkIcon).toBeInTheDocument();
  });

  it('shows error icon when field has errors', () => {
    render(FormIdentInput, {
      props: {
        form: createMockSuperForm({ username: 'invalid' }, { username: 'Invalid username' }) as any,
        fieldName: 'username',
        identType: UserIdentType.userHandle,
      },
    });

    const errorIcon = document.querySelector('.text-red-500');
    expect(errorIcon).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(FormIdentInput, {
      props: {
        form: createMockSuperForm({ email: '' }) as any,
        fieldName: 'email',
        disabled: true,
      },
    });

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies custom label and placeholder', () => {
    render(FormIdentInput, {
      props: {
        form: createMockSuperForm({ email: '' }) as any,
        fieldName: 'email',
        label: 'Custom Label',
        placeholder: 'Custom Placeholder',
      },
    });

    const label = screen.getByText('Custom Label');
    expect(label).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Custom Placeholder');
    expect(input).toBeInTheDocument();
  });
});
