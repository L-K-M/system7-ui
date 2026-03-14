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
