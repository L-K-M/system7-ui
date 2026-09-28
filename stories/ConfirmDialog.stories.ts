import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ConfirmDialog from '../src/components/ConfirmDialog.svelte';

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  args: {
    message: 'Delete all scan results? This cannot be undone.',
    okText: 'Delete',
    cancelText: 'Cancel',
    width: '400px'
  }
} satisfies Meta<ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  args: {
    width: '280px'
  }
};
