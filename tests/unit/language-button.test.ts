import LanguageButton from '@/components/language-button.svelte';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('LanguageButton', () => {
  it('renders the language selection button', () => {
    render(LanguageButton);
    const button = screen.getByRole('button', { name: /change language/i });
    expect(button).toBeVisible();
  });
});
