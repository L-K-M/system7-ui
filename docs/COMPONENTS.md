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

## Color Theming

All components now use CSS custom properties for color styling.

- Accent and selection:
  - `--system7-color-accent`
  - `--system7-color-accent-text`
  - `--system7-color-highlight`
  - `--system7-color-highlight-text`
- Base surfaces:
  - `--system7-color-ink`
  - `--system7-color-paper`

The accent/highlight tokens default to existing host-level variables:

- `--system-accent-color`
- `--system-accent-text-color`
- `--system-highlight-color`
- `--system-highlight-text-color`

For apps that fetch OS colors at runtime, use utility exports:

- `applySystem7SystemColors(colors, target?)`
- `getSystem7ColorVariables(colors)`
- `getSystem7ColorStyle(colors)`
- `getSystem7WindowToneVariables(accentColor)` — derives the window chrome tones
  (`--system7-color-focus-ring`, title bar rail/button and scrollbar variables) from a
  single accent color, like classic System 7 colored windows
- `getSystem7WindowStyle(colors)` — inline `style` string combining the system colors
  with the derived window tones; apply it to the window frame element

```svelte
<script lang="ts">
  import { getSystem7WindowStyle } from '@lkmc/system7-ui';

  // e.g. fetched from the OS via a Tauri command
  const colors = { accent_color: '#6688CC', highlight_color: '#88AA00' };
</script>

<div class="s7-root" style={getSystem7WindowStyle(colors)}>...</div>
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

### TextInput

- Props:
  - `value`: `string` (supports `bind:value`)
  - `type`: `'text' | 'password' | 'email' | 'search' | 'url' | 'tel'`
  - `disabled`: `boolean`
  - `readonly`: `boolean`
  - `id`: `string`
  - `name`: `string`
  - `placeholder`: `string`
  - `title`: `string`
  - `ariaLabel`: `string`
  - `clearable`: `boolean` (shows a close-box style clear control while the field has content)
  - `oninput`: `(value: string, e: Event) => void`
  - `onchange`: `(value: string, e: Event) => void`
  - `onkeydown`: `(e: KeyboardEvent) => void`
  - `onclear`: `() => void`

### SystemErrorDialog

- Props:
  - `message`: `string` (defaults to `'Sorry, a system error occurred.'`)
  - `detail`: `string` (optional secondary line)
  - `restartText`: `string` (defaults to `'Restart'`)
  - `onrestart`: `() => void`
- Notes:
  - Renders the classic System 7 bomb alert; works well as an `ErrorBoundary` fallback.

### Notification

- Props:
  - `notifications`: `{ id: number; message: string; type: 'success' | 'error' | 'info' }[]`
  - `markdown`: `boolean`
  - `ondismiss`: `(id: number) => void` (renders a close button per notification when provided)
- Notes:
  - The `createNotificationStore(defaultTimeoutMs?)` export creates the matching store:
    `add(message, type?, timeoutMs?)` returns the id, plus `remove(id)` and `clear()`.
    Wire `remove` to `ondismiss` for dismissable notifications.

```svelte
<script lang="ts">
  import { Notification, createNotificationStore } from '@lkmc/system7-ui';

  const notifications = createNotificationStore();
</script>

<Notification notifications={$notifications} ondismiss={(id) => notifications.remove(id)} />
```

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

### File Icons

File/folder icon components are exported for common list and explorer UIs:

- `FolderIcon`
- `GenericFileIcon`
- `TextFileIcon`
- `PdfFileIcon`
- `ImageFileIcon`
- `ArchiveFileIcon`
- `AudioFileIcon`
- `VideoFileIcon`
- `CodeFileIcon`
- `SpreadsheetFileIcon`
- `DocumentFileIcon`
- `PresentationFileIcon`

Each icon supports the same props shape as other icon wrappers:

- `alt`: `string`
- `size`: `number`
- `title`: `string`
