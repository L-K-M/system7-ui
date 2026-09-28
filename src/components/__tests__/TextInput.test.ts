import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import TextInput from '../TextInput.svelte';

describe('TextInput', () => {
  it('renders the value and native attributes', () => {
    render(TextInput, {
      props: {
        value: 'Macintosh HD',
        id: 'disk-name',
        name: 'diskName',
        placeholder: 'Untitled',
        title: 'Disk name',
        ariaLabel: 'Disk name'
      }
    });

    const input = screen.getByRole('textbox', { name: 'Disk name' }) as HTMLInputElement;
    expect(input.value).toBe('Macintosh HD');
    expect(input.id).toBe('disk-name');
    expect(input.name).toBe('diskName');
    expect(input.placeholder).toBe('Untitled');
    expect(input.title).toBe('Disk name');
  });

  it('updates value and fires oninput while typing', async () => {
    const handleInput = vi.fn();

    render(TextInput, {
      props: { ariaLabel: 'Name', oninput: handleInput }
    });

    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    await fireEvent.input(input, { target: { value: 'System 7' } });

    expect(input.value).toBe('System 7');
    expect(handleInput).toHaveBeenCalledTimes(1);
    expect(handleInput.mock.calls[0][0]).toBe('System 7');
  });

  it('forwards keydown events to the onkeydown callback', async () => {
    const handleKeydown = vi.fn();

    render(TextInput, {
      props: { ariaLabel: 'Name', onkeydown: handleKeydown }
    });

    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    await fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleKeydown).toHaveBeenCalledTimes(1);
    expect(handleKeydown.mock.calls[0][0].key).toBe('Enter');
  });

  it('fires onchange when the value is committed', async () => {
    const handleChange = vi.fn();

    render(TextInput, {
      props: { ariaLabel: 'Name', onchange: handleChange }
    });

    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    input.value = 'Performa';
    await fireEvent.change(input);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0]).toBe('Performa');
  });

  it('respects disabled and readonly', () => {
    render(TextInput, {
      props: { ariaLabel: 'Locked', disabled: true, readonly: true }
    });

    const input = screen.getByRole('textbox', { name: 'Locked' }) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
  });

  it('supports the password type', () => {
    const { container } = render(TextInput, {
      props: { type: 'password', ariaLabel: 'Secret' }
    });

    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('shows no clear control by default', () => {
    render(TextInput, {
      props: { ariaLabel: 'Name', value: 'Macintosh' }
    });

    expect(screen.queryByRole('button', { name: 'Clear text' })).toBeNull();
  });

  it('shows the clear control only once the field has content', async () => {
    render(TextInput, {
      props: { ariaLabel: 'Name', clearable: true }
    });

    expect(screen.queryByRole('button', { name: 'Clear text' })).toBeNull();

    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    await fireEvent.input(input, { target: { value: 'Quadra' } });

    expect(screen.queryByRole('button', { name: 'Clear text' })).not.toBeNull();
  });

  it('clears the field, refocuses the input, and fires onclear', async () => {
    const handleClear = vi.fn();

    render(TextInput, {
      props: { ariaLabel: 'Name', clearable: true, value: 'Centris', onclear: handleClear }
    });

    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    await fireEvent.click(screen.getByRole('button', { name: 'Clear text' }));

    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Clear text' })).toBeNull();
  });

  it('hides the clear control while disabled or readonly', async () => {
    const { rerender } = render(TextInput, {
      props: { ariaLabel: 'Name', clearable: true, value: 'LC III', disabled: true }
    });

    expect(screen.queryByRole('button', { name: 'Clear text' })).toBeNull();

    await rerender({ disabled: false, readonly: true });

    expect(screen.queryByRole('button', { name: 'Clear text' })).toBeNull();

    await rerender({ readonly: false });

    expect(screen.queryByRole('button', { name: 'Clear text' })).not.toBeNull();
  });

  it('forwards other attributes to the native input', () => {
    render(TextInput, {
      props: {
        ariaLabel: 'Search',
        inputmode: 'search',
        enterkeyhint: 'search',
        autocapitalize: 'off',
        autocomplete: 'off',
        spellcheck: 'false',
        minlength: 3,
        'aria-describedby': 'search-hint',
        'data-testid': 'search-field'
      }
    });

    const input = screen.getByRole('textbox', { name: 'Search' });
    expect(input.getAttribute('inputmode')).toBe('search');
    expect(input.getAttribute('enterkeyhint')).toBe('search');
    expect(input.getAttribute('autocapitalize')).toBe('off');
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(input.getAttribute('spellcheck')).toBe('false');
    expect(input.getAttribute('minlength')).toBe('3');
    expect(input.getAttribute('aria-describedby')).toBe('search-hint');
    expect(input.getAttribute('data-testid')).toBe('search-field');
  });

  it('forwards event handler attributes to the native input', async () => {
    const handleFocus = vi.fn();

    render(TextInput, {
      props: { ariaLabel: 'Name', onfocus: handleFocus }
    });

    await fireEvent.focus(screen.getByRole('textbox', { name: 'Name' }));

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('keeps its own class and drops a passed class', () => {
    render(TextInput, {
      // @ts-expect-error `class` is not in the props type; this checks untyped callers too.
      props: { ariaLabel: 'Name', class: 'app-field' }
    });

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input.classList.contains('sys7-text-input')).toBe(true);
    expect(input.classList.contains('app-field')).toBe(false);
  });

  it('uses an aria-label attribute when the ariaLabel prop is empty', () => {
    render(TextInput, {
      props: { 'aria-label': 'Filter entries' }
    });

    expect(screen.getByRole('textbox', { name: 'Filter entries' })).toBeTruthy();
  });

  it('prefers the ariaLabel prop over an aria-label attribute', () => {
    render(TextInput, {
      props: { ariaLabel: 'From prop', 'aria-label': 'From attribute' }
    });

    expect(screen.getByRole('textbox', { name: 'From prop' })).toBeTruthy();
  });

  it('keeps the bound value in sync when the parent changes it', async () => {
    const { rerender } = render(TextInput, {
      props: { ariaLabel: 'Name', value: 'Classic' }
    });

    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    expect(input.value).toBe('Classic');

    await rerender({ value: 'Color Classic' });

    expect(input.value).toBe('Color Classic');
  });

  it('exposes focus() and select() for the native input', () => {
    const { component } = render(TextInput, {
      props: { ariaLabel: 'Name', value: 'Performa' }
    });

    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;

    component.focus({ preventScroll: true });
    expect(document.activeElement).toBe(input);

    component.select();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe('Performa'.length);
  });
});
