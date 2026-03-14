import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import Button from '../Button.svelte';

describe('Button', () => {
  it('renders a button element', () => {
    render(Button);

    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('calls click handler when activated', async () => {
    const handleClick = vi.fn();
    render(Button, { props: { onclick: handleClick } });

    await fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled attribute when disabled', () => {
    render(Button, {
      props: { disabled: true }
    });

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('renders primary variant wrapper class', () => {
    const { container } = render(Button, {
      props: { variant: 'primary' }
    });

    expect(container.querySelector('.primary-border')).not.toBeNull();
  });
});
