import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ErrorBanner from '../src/components/ErrorBanner.svelte';

const meta = {
  title: 'Components/ErrorBanner',
  component: ErrorBanner,
  tags: ['autodocs'],
  args: {
    message: 'Unable to connect to scanner service.'
  }
} satisfies Meta<ErrorBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongMessage: Story = {
  args: {
    message:
      'Unable to connect to scanner service. Check credentials, host availability, and firewall rules before retrying.'
  }
};
