import ThemeButton from '@/components/theme-button.svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('ThemeButton', () => {
  it('renders the theme toggle button', () => {
    render(ThemeButton);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeVisible();
  });

  it('changes theme when clicked', async () => {
    render(ThemeButton);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await fireEvent.click(button);
    // Add assertions based on your theme implementation
  });
});
