import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import Notification from '../Notification.svelte';

describe('Notification', () => {
  it('renders stacked status rows with expected offsets', () => {
    render(Notification, {
      props: {
        notifications: [
          { id: 1, message: 'First notification', type: 'info' },
          { id: 2, message: 'Second notification', type: 'success' }
        ]
      }
    });

    const statuses = screen.getAllByRole('status') as HTMLDivElement[];
    expect(statuses).toHaveLength(2);
    expect(statuses[0].style.bottom).toBe('20px');
    expect(statuses[1].style.bottom).toBe('90px');
  });

  it('renders errors as alerts and the rest as polite statuses', () => {
    render(Notification, {
      props: {
        notifications: [
          { id: 1, message: 'Saved', type: 'success' },
          { id: 2, message: 'Disk full', type: 'error' }
        ]
      }
    });

    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
  });

  it('renders a dismiss button per notification when ondismiss is provided', async () => {
    const handleDismiss = vi.fn();

    render(Notification, {
      props: {
        ondismiss: handleDismiss,
        notifications: [
          { id: 7, message: 'First', type: 'info' },
          { id: 9, message: 'Second', type: 'info' }
        ]
      }
    });

    const buttons = screen.getAllByRole('button', { name: 'Dismiss notification' });
    expect(buttons).toHaveLength(2);

    await fireEvent.click(buttons[1]);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
    expect(handleDismiss).toHaveBeenCalledWith(9);
  });

  it('renders no dismiss button without ondismiss', () => {
    render(Notification, {
      props: {
        notifications: [{ id: 1, message: 'Quiet', type: 'info' }]
      }
    });

    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).toBeNull();
  });

  it('renders markdown content when markdown mode is enabled', () => {
    const { container } = render(Notification, {
      props: {
        markdown: true,
        notifications: [{ id: 3, message: '**Converted** successfully', type: 'success' }]
      }
    });

    const strong = container.querySelector('strong');
    expect(strong?.textContent).toBe('Converted');
  });

  it('keeps raw html escaped in markdown mode', () => {
    const { container } = render(Notification, {
      props: {
        markdown: true,
        notifications: [{ id: 4, message: '<script>alert(1)</script>', type: 'error' }]
      }
    });

    expect(container.querySelector('script')).toBeNull();
    expect(screen.queryByText('<script>alert(1)</script>')).not.toBeNull();
  });
});
