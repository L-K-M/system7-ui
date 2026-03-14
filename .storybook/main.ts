import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|ts)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/svelte-vite',
    options: {}
  },
  viteFinal: async (config) => {
    const { svelte } = await import('@sveltejs/vite-plugin-svelte');

    return {
      ...config,
      plugins: [
        ...(config.plugins ?? []),
        svelte({
          exclude: ['node_modules/(?!@storybook/svelte)']
        })
      ]
    };
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;
