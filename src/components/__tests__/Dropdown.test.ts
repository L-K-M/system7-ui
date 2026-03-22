import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import Dropdown from '../Dropdown.svelte';

describe('Dropdown', () => {
  const options = [
    { value: 'quick', label: 'Quick scan' },
    { value: 'deep', label: 'Deep scan' }
  ];

  it('renders options and selected value', () => {
    render(Dropdown, {
      props: {
        options,
        value: 'quick'
      }
    });

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('quick');
    expect(screen.queryByRole('option', { name: 'Quick scan' })).not.toBeNull();
    expect(screen.queryByRole('option', { name: 'Deep scan' })).not.toBeNull();
  });

  it('fires onchange callback and updates selected value', async () => {
    const handleChange = vi.fn();

    render(Dropdown, {
      props: {
        options,
        value: 'quick',
        onchange: handleChange
      }
    });

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await fireEvent.change(select, { target: { value: 'deep' } });

    expect(select.value).toBe('deep');
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0]).toBe('deep');
  });

  it('applies disabled state and forwards native attributes', () => {
    const { container } = render(Dropdown, {
      props: {
        options,
        disabled: true,
        id: 'scan-mode',
        name: 'scanMode',
        title: 'Scan mode selector'
      }
    });

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
    expect(select.id).toBe('scan-mode');
    expect(select.name).toBe('scanMode');
    expect(select.title).toBe('Scan mode selector');

    const wrapper = container.querySelector('.sys7-dropdown');
    expect(wrapper?.classList.contains('disabled')).toBe(true);
  });
});
