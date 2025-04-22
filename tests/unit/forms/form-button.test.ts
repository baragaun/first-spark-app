import FormButton from '@/components/forms/form-button.svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

describe('FormButton', () => {
  it('renders with default props', () => {
    render(FormButton);

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-full');
    expect(button).not.toBeDisabled();
  });

  it('renders with custom text', () => {
    render(FormButton, { props: { buttonText: 'Save Changes' } });

    const button = screen.getByRole('button', { name: 'Save Changes' });
    expect(button).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(FormButton, {
      props: {
        loading: true,
        buttonText: 'Save',
        loadingText: 'Saving...',
      },
    });

    const button = screen.getByRole('button', { name: 'Saving...' });
    expect(button).toBeInTheDocument();

    // Check for loading spinner
    const spinner = screen.getByTestId('loader-circle') || document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(FormButton, { props: { disabled: true } });

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('can have variable width', () => {
    render(FormButton, { props: { fullWidth: false } });

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('w-full');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(FormButton, { props: { onClick: handleClick } });

    const button = screen.getByRole('button');
    await fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has the correct button type', () => {
    render(FormButton, { props: { type: 'button' } });

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies custom variant', () => {
    render(FormButton, { props: { variant: 'destructive' } });

    const button = screen.getByRole('button');
    // Check that the variant class is applied (implementation dependent)
    // This might need adjustment based on how variants are implemented
    expect(button).toHaveAttribute('data-variant', 'destructive');
  });
});
