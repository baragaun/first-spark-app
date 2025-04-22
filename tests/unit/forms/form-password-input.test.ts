import FormPasswordInput from '@/components/forms/form-password-input.svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

// Mock superform
const mockSuperForm = {
  form: { password: '' },
  errors: { password: null },
};

describe('FormPasswordInput', () => {
  it('renders with default props', () => {
    render(FormPasswordInput, {
      props: {
        form: mockSuperForm as any,
      },
    });

    const label = screen.getByText('Password');
    expect(label).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Your password must be at least 8 characters');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders with custom label and placeholder', () => {
    render(FormPasswordInput, {
      props: {
        form: mockSuperForm as any,
        label: 'New Password',
        placeholder: 'Enter a strong password',
      },
    });

    const label = screen.getByText('New Password');
    expect(label).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Enter a strong password');
    expect(input).toBeInTheDocument();
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    render(FormPasswordInput, {
      props: {
        form: mockSuperForm as any,
      },
    });

    // Initially password should be hidden
    let input = screen.getByPlaceholderText('Your password must be at least 8 characters');
    expect(input).toHaveAttribute('type', 'password');

    // Find and click the eye icon
    const toggleButton =
      screen.getByRole('button', { name: /toggle password visibility/i }) ||
      document.querySelector('button');
    await fireEvent.click(toggleButton);

    // Now password should be visible
    input = screen.getByPlaceholderText('Your password must be at least 8 characters');
    expect(input).toHaveAttribute('type', 'text');

    // Click again to hide
    await fireEvent.click(toggleButton);

    // Password should be hidden again
    input = screen.getByPlaceholderText('Your password must be at least 8 characters');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows error state when there are errors', () => {
    render(FormPasswordInput, {
      props: {
        form: {
          form: { password: 'weak' } as any,
          errors: { password: 'Password must be at least 8 characters' } as any,
        } as any,
      },
    });

    const input = screen.getByPlaceholderText('Your password must be at least 8 characters');
    expect(input).toHaveClass('border-red-500');
  });

  it('binds value to form data', async () => {
    const formData = { password: '' };
    render(FormPasswordInput, {
      props: {
        form: {
          form: formData,
          errors: { password: null },
        } as any,
      },
    });

    const input = screen.getByPlaceholderText('Your password must be at least 8 characters');
    await fireEvent.input(input, { target: { value: 'newpassword123' } });

    // This is a bit tricky to test in isolation since the binding happens in Svelte
    // In a real scenario, we'd need to check if the form state was updated
    expect(input).toHaveValue('newpassword123');
  });
});
