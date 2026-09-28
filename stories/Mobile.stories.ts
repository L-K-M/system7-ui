import type { Meta, StoryObj } from '@storybook/svelte-vite';
import MobileFixture from './fixtures/MobileFixture.svelte';

/**
 * A phone-sized list built from the mobile tokens: 24px primary and 16px secondary Geneva text,
 * taller headerless table rows, a title bar with an action and a simulated status bar inset.
 * Emulate a touch device in the browser's developer tools to get the coarse-pointer hit areas.
 */
const meta = {
  title: 'Examples/Mobile',
  component: MobileFixture,
  tags: ['autodocs'],
  args: {
    safeAreaTop: 24,
    primaryFontSize: '24px',
    secondaryFontSize: '16px',
    cellPadding: '12px 8px'
  },
  argTypes: {
    primaryFontSize: {
      control: 'select',
      options: ['16px', '24px', '32px']
    },
    secondaryFontSize: {
      control: 'select',
      options: ['16px', '24px', '32px']
    }
  }
} satisfies Meta<MobileFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Phone: Story = {};

/** Every size is a whole multiple of Geneva's pixel grid: 32px is 2x and 24px is 1.5x. */
export const LargeText: Story = {
  args: {
    primaryFontSize: '32px',
    secondaryFontSize: '24px'
  }
};
