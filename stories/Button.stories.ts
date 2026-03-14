import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ButtonFixture from './fixtures/ButtonFixture.svelte';

const meta = {
  title: 'Components/Button',
  component: ButtonFixture,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    disabled: false,
    type: 'button',
    label: 'System 7 Button'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'icon']
    }
  }
} satisfies Meta<ButtonFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Primary Action'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled Action'
  }
};
