import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import { Button } from '$lib/components/ui/button';

describe('Button Component', () => {
  it('renders with correct label', () => {
    render(Button, { props: { value: 'Submit' } });
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  // it('triggers event on click', async () => {
  //   const { component } = render(Button);
  //   let clicked = false;
  //   component.$on('click', () => clicked = true);
  //   await fireEvent.click(screen.getByText('Click me'));
  //   expect(clicked).toBe(true);
  // });

  it('is disabled when the prop is set', () => {
    render(Button, { props: { disabled: true } });
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
