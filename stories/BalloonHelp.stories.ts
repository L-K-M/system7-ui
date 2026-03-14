import type { Meta, StoryObj } from '@storybook/svelte-vite';
import BalloonHelpFixture from './fixtures/BalloonHelpFixture.svelte';

const meta = {
  title: 'Components/BalloonHelp',
  component: BalloonHelpFixture,
  tags: ['autodocs'],
  args: {
    message: 'This panel shows additional context for controls.',
    position: 'bottom',
    delay: 250,
    markdown: false
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'bottom']
    }
  }
} satisfies Meta<BalloonHelpFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlainText: Story = {};

export const Markdown: Story = {
  args: {
    markdown: true,
    message: [
      '**Markdown Help**',
      '',
      '- Explain actions',
      '- Link docs',
      '- Include `code` hints'
    ].join('\n')
  }
};
