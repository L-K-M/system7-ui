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

  it('forwards other attributes to the native button', () => {
    render(Button, {
      props: { variant: 'icon', 'aria-label': 'Copy entry', 'data-entry-id': '42' }
    });

    const button = screen.getByRole('button', { name: 'Copy entry' });
    expect(button.getAttribute('data-entry-id')).toBe('42');
    expect(button.classList.contains('icon-btn')).toBe(true);
  });

  it('forwards other attributes to the native button of the primary variant', () => {
    const { container } = render(Button, {
      props: { variant: 'primary', 'aria-label': 'Save changes', name: 'intent', value: 'save' }
    });

    const button = screen.getByRole('button', { name: 'Save changes' }) as HTMLButtonElement;
    expect(button.parentElement).toBe(container.querySelector('.primary-border'));
    expect(button.name).toBe('intent');
    expect(button.value).toBe('save');
  });

  it('keeps its own attributes when conflicting attributes are passed', () => {
    render(Button, {
      props: { class: 'app-button', type: 'submit' }
    });

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.classList.contains('sys7-btn')).toBe(true);
    expect(button.type).toBe('submit');
  });
});
