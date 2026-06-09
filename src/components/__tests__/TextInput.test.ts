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
});
