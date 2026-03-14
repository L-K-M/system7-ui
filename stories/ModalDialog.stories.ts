import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ModalDialogFixture from './fixtures/ModalDialogFixture.svelte';

const meta = {
  title: 'Components/ModalDialog',
  component: ModalDialogFixture,
  tags: ['autodocs'],
  args: {
    width: '420px'
  }
} satisfies Meta<ModalDialogFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Wide: Story = {
  args: {
    width: '560px'
  }
};
