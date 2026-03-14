import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import Checkbox from '../Checkbox.svelte';

describe('Checkbox', () => {
  it('renders fallback label text prop', () => {
    render(Checkbox, {
      props: { label: 'Auto refresh' }
    });

    expect(screen.getByText('Auto refresh')).toBeTruthy();
  });

  it('calls onchange with updated checked value', async () => {
    const handleChange = vi.fn();

    render(Checkbox, {
      props: {
        onchange: handleChange
      }
    });

    await fireEvent.click(screen.getByRole('checkbox'));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true, expect.any(Event));
  });
});
