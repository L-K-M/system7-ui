import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Checkbox from '../src/components/Checkbox.svelte';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Auto refresh',
    checked: false,
    disabled: false
  }
} satisfies Meta<Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};
