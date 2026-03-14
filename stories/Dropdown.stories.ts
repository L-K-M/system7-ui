import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Dropdown from '../src/components/Dropdown.svelte';

const profileOptions = [
  { value: 'quick', label: 'Quick' },
  { value: 'standard', label: 'Standard' },
  { value: 'deep', label: 'Deep' }
];

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: {
    options: profileOptions,
    value: 'quick',
    disabled: false
  }
} satisfies Meta<Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};
