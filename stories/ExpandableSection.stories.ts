import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ExpandableSectionFixture from './fixtures/ExpandableSectionFixture.svelte';

const meta = {
  title: 'Components/ExpandableSection',
  component: ExpandableSectionFixture,
  tags: ['autodocs'],
  args: {
    label: 'Apple Extras',
    expanded: false,
    disabled: false
  }
} satisfies Meta<ExpandableSectionFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};

export const Expanded: Story = {
  args: {
    expanded: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};
