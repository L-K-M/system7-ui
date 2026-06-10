import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import SystemErrorDialog from '../SystemErrorDialog.svelte';

describe('SystemErrorDialog', () => {
  it('renders the classic apology and a restart button by default', () => {
    render(SystemErrorDialog);

    expect(screen.queryByText('Sorry, a system error occurred.')).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Restart' })).not.toBeNull();
    expect(screen.queryByRole('alert')).not.toBeNull();
  });

  it('renders custom message, detail, and restart label', () => {
    render(SystemErrorDialog, {
      props: {
        message: 'Sorry, a system error occurred.',
        detail: 'unimplemented trap',
        restartText: 'Reboot'
      }
    });

    expect(screen.queryByText('unimplemented trap')).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Reboot' })).not.toBeNull();
  });

  it('omits the detail line when not provided', () => {
    const { container } = render(SystemErrorDialog);

    expect(container.querySelector('.detail')).toBeNull();
  });

  it('calls onrestart when the restart button is clicked', async () => {
    const handleRestart = vi.fn();

    render(SystemErrorDialog, {
      props: { onrestart: handleRestart }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Restart' }));

    expect(handleRestart).toHaveBeenCalledTimes(1);
  });

  it('marks the bomb icon as decorative', () => {
    const { container } = render(SystemErrorDialog);

    const icon = container.querySelector('img.bomb-icon') as HTMLImageElement;
    expect(icon).not.toBeNull();
    expect(icon.alt).toBe('');
  });
});
