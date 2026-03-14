import type { Meta, StoryObj } from '@storybook/svelte-vite';
import MovableDialogFixture from './fixtures/MovableDialogFixture.svelte';

const meta = {
  title: 'Components/MovableDialog',
  component: MovableDialogFixture,
  tags: ['autodocs'],
  args: {
    title: 'Movable Dialog',
    width: '460px',
    focused: true
  }
} satisfies Meta<MovableDialogFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Unfocused: Story = {
  args: {
    focused: false
  }
};
