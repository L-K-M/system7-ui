import type { Meta, StoryObj } from '@storybook/svelte-vite';
import FileIconsFixture from './fixtures/FileIconsFixture.svelte';

const meta = {
  title: 'Components/File Icons',
  component: FileIconsFixture,
  tags: ['autodocs'],
  args: {
    size: 16
  },
  argTypes: {
    size: {
      control: { type: 'number', min: 12, max: 48, step: 2 }
    }
  }
} satisfies Meta<FileIconsFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Larger: Story = {
  args: {
    size: 24
  }
};
