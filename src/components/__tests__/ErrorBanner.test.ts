import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import ErrorBanner from '../ErrorBanner.svelte';

describe('ErrorBanner', () => {
  it('renders an accessible close button with icon', () => {
    const { container } = render(ErrorBanner, {
      props: { message: 'Disk is almost full.' }
    });

    expect(screen.getByRole('button', { name: 'Close error' })).toBeTruthy();
    expect(container.querySelector('.close-error img')).not.toBeNull();
  });

  it('calls onclose callback when close button is clicked', async () => {
    const handleClose = vi.fn();

    render(ErrorBanner, {
      props: {
        message: 'Cannot connect to service.',
        onclose: handleClose
      }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Close error' }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
