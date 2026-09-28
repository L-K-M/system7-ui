import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Notification from '../src/components/Notification.svelte';

const sampleNotifications = [
  { id: 1, type: 'info', message: 'Scan started for 24 hosts.' },
  { id: 2, type: 'success', message: 'Scan complete: 3 services detected.' },
  { id: 3, type: 'error', message: 'One host timed out while connecting.' }
] as const;

const meta = {
  title: 'Components/Notification',
  component: Notification,
  tags: ['autodocs'],
  args: {
    notifications: sampleNotifications,
    markdown: false
  }
} satisfies Meta<Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Markdown: Story = {
  args: {
    markdown: true,
    notifications: [
      {
        id: 1,
        type: 'info',
        message: ['**Profile tips**', '', '- Quick: common ports', '- Deep: larger range'].join(
          '\n'
        )
      }
    ]
  }
};

/** Multi-line toasts stack without overlapping; long unbroken text wraps inside the toast. */
export const LongMessages: Story = {
  args: {
    ondismiss: () => {},
    notifications: [
      { id: 1, type: 'success', message: 'Scan complete.' },
      {
        id: 2,
        type: 'error',
        message:
          'Sync failed: the server at 192.168.1.5:3742 did not answer within 45 seconds. Check the address and try again.'
      },
      {
        id: 3,
        type: 'info',
        message:
          'Report saved to https://example.com/reports/2026/09/network-scan-with-a-very-long-name.html'
      }
    ]
  }
};
