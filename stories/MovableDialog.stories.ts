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

/**
 * Taller than most viewports: on a touch screen the dialog stays inside the viewport and its body
 * scrolls. On desktop the dialog grows with its content.
 */
export const TallContent: Story = {
  args: {
    title: 'Settings',
    extraLines: 40
  }
};
