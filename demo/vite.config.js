import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      {
        find: '@lkmc/system7-ui/styles.css',
        replacement: fileURLToPath(new URL('../src/styles/system7.css', import.meta.url))
      },
      {
        find: '@lkmc/system7-ui',
        replacement: fileURLToPath(new URL('../src/index.ts', import.meta.url))
      }
    ]
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
});
