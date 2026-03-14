import type { Preview } from '@storybook/svelte-vite';
import '../src/styles/system7.css';
import StoryRoot from './StoryRoot.svelte';

const preview: Preview = {
  decorators: [
    (Story) => ({
      Component: StoryRoot,
      props: { storyFn: Story }
    })
  ],
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true
    }
  }
};

export default preview;
