import type { Meta, StoryObj } from '@storybook/svelte-vite';
import TitleBarFixture from './fixtures/TitleBarFixture.svelte';

const meta = {
  title: 'Components/TitleBar',
  component: TitleBarFixture,
  tags: ['autodocs'],
  args: {
    title: 'Macintosh HD',
    closable: true,
    shadeable: true,
    collapsible: true,
    focused: true,
    withActions: false,
    width: '420px'
  }
} satisfies Meta<TitleBarFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    title: 'Settings',
    collapsible: false,
    shadeable: false,
    withActions: true
  }
};

export const LongTitle: Story = {
  args: {
    title: 'A window title far too long to fit between the boxes',
    width: '320px'
  }
};
