import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/components/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/components/Button.svelte',
        'src/components/Checkbox.svelte',
        'src/components/ConfirmDialog.svelte',
        'src/components/DataTable.svelte',
        'src/components/Dropdown.svelte',
        'src/components/ErrorBanner.svelte',
        'src/components/*Icon.svelte',
        'src/components/ModalDialog.svelte',
        'src/components/MovableDialog.svelte',
        'src/components/Notification.svelte',
        'src/components/ProgressBar.svelte'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70
      }
    }
  }
});
