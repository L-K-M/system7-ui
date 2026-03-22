import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import Notification from '../Notification.svelte';

describe('Notification', () => {
  it('renders stacked alert rows with expected offsets', () => {
    render(Notification, {
      props: {
        notifications: [
          { id: 1, message: 'First notification', type: 'info' },
          { id: 2, message: 'Second notification', type: 'success' }
        ]
      }
    });

    const alerts = screen.getAllByRole('alert') as HTMLDivElement[];
    expect(alerts).toHaveLength(2);
    expect(alerts[0].style.bottom).toBe('20px');
    expect(alerts[1].style.bottom).toBe('90px');
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
