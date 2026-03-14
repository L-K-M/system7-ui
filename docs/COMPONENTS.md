# Component Catalog

This repository includes three documentation paths:

1. **Storybook** for interactive component docs in isolation
2. **Interactive playground** via the demo app in `demo/`
3. **Reference docs** in this file for quick prop/slot lookup

## Storybook

Run Storybook for interactive docs with controls and a11y addon support:

```bash
npm run storybook
```

Build static Storybook docs:

```bash
npm run storybook:build
```

## Interactive Playground

Run the demo application to explore components interactively:

```bash
npm run demo:install
npm run demo:dev
```

The demo includes examples for buttons, inputs, tooltips, modals, notifications, and dialogs.

## Styling Scope

`styles.css` is scoped to an `.s7-root` container so host app globals are not overridden.

```svelte
<script lang="ts">
  import '@lkmc/system7-ui/styles.css';
  import { Button } from '@lkmc/system7-ui';
</script>

<div class="s7-root">
  <Button>System 7 action</Button>
</div>
```

## Key Components

### Button

- Props:
  - `variant`: `'default' | 'primary' | 'icon'`
  - `disabled`: `boolean`
  - `type`: `'button' | 'submit' | 'reset'`
  - `title`: `string`
  - `onclick`: `(e: MouseEvent) => void`
- Slot:
  - `default`: button label or icon content

### Checkbox

- Props:
  - `checked`: `boolean`
  - `disabled`: `boolean`
  - `id`: `string`
  - `name`: `string`
  - `value`: `string`
  - `label`: `string` (fallback text when no slot is provided)
  - `onchange`: `(checked: boolean, e: Event) => void`
- Slot:
  - `default`: label content

### Radio

- Props:
  - `checked`: `boolean`
  - `disabled`: `boolean`
  - `id`: `string`
  - `name`: `string`
  - `value`: `string`
  - `label`: `string` (fallback text when no slot is provided)
  - `onchange`: `(value: string, e: Event) => void`
- Slot:
  - `default`: label content

### ModalDialog

- Props:
  - `width`: `string`
  - `onclose`: `() => void`
- Slot:
  - `default`: modal content body
- Notes:
  - Focus is moved into the dialog on mount and restored on close.
  - Slot rendering is wrapped with `ErrorBoundary` for graceful fallback UI.

### MovableDialog

- Props:
  - `title`: `string`
  - `width`: `string`
  - `focused`: `boolean`
  - `onclose`: `() => void`
- Slot:
  - `default`: movable dialog content body
- Notes:
  - Drag now supports mouse and touch input.

### ErrorBoundary

- Props:
  - `fallbackMessage`: `string`
  - `onerror`: `(error: unknown) => void`
- Slot:
  - `default`: protected child content

Use `ErrorBoundary` when rendering volatile UI blocks that should fail safely.
