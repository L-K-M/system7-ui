import type { Meta, StoryObj } from '@storybook/svelte-vite';
import DataTableFixture from './fixtures/DataTableFixture.svelte';

const meta = {
  title: 'Components/DataTable',
  component: DataTableFixture,
  tags: ['autodocs'],
  args: {
    showHeader: true,
    loading: false,
    empty: false
  }
} satisfies Meta<DataTableFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutHeader: Story = {
  args: {
    showHeader: false
  }
};

export const Empty: Story = {
  args: {
    empty: true
  }
};
