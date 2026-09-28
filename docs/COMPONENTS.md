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

## Typography and Layout Tokens

Override these on `:root`, or on `.s7-root` or any element inside it to change only that subtree:

- `--system7-font-size` (`24px`): Geneva text
- `--system7-control-font-size` (`18px`): Sysfont text in buttons, checkbox and radio labels,
  dropdowns, `.dialog-text` and headings
- `--system7-safe-area-top`, `-right`, `-bottom`, `-left` (`env(safe-area-inset-*, 0px)`):
  used by `ModalDialog`, `MovableDialog` and `Notification`
- `--system7-scrollbar-size` (`16px`): scrollbar width and height
- `--system7-table-cell-padding` (`5px 8px`): `DataTable` cell padding
- `--system7-notification-offset-bottom`, `--system7-notification-offset-right` (`20px`):
  `Notification` stack offsets, added to the safe-area insets

Geneva is drawn on a 16px pixel grid, so use `16px` (1x), `24px` (1.5x) or `32px` (2x). On phones,
use `24px` for primary text and `16px` for secondary text. The README's "Mobile and touch" section
covers `viewport-fit=cover`, safe areas and touch targets.

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
- Notes:
  - Other attributes (`aria-*`, `data-*`, `name`, `value`, `form`, event handlers such as
    `onfocus`) go to the native `<button>`. A `class` attribute is ignored.
  - On coarse pointers, `icon` buttons get a 44px hit area. Their hover dimming applies only under
    `@media (hover: hover)`.

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
- Notes:
  - On coarse pointers, the control gets a hit area of at least 44px each way.

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
- Notes:
  - On coarse pointers, the control gets a hit area of at least 44px each way.

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
- Methods (via `bind:this`):
  - `focus(options?: FocusOptions)`: focuses the input
  - `select()`: selects the whole text
- Notes:
  - Other attributes (`inputmode`, `enterkeyhint`, `autocapitalize`, `autocomplete`,
    `spellcheck`, `minlength`, `aria-*`, `data-*`, event handlers such as `onfocus`) go to the
    native `<input>`. A `class` attribute is ignored, and a non-empty `ariaLabel` wins over an
    `aria-label` attribute.
  - On coarse pointers, the clear box gets a 44px hit area and the field's right padding grows to
    44px while the box shows.

### BalloonHelp

- Props:
  - `message`: `string`
  - `position`: `'top' | 'bottom'`
  - `delay`: `number` (milliseconds)
  - `markdown`: `boolean`
- Slot:
  - `default`: trigger element
- Notes:
  - Opens on mouse or pen hover and on keyboard focus, but not on touch taps.

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
  - Toasts render in one fixed `.notification-stack` element, which is always present, even with no
    toasts. The first toast sits at the bottom and a toast that wraps pushes later ones up.
  - The stack sits `--system7-notification-offset-bottom` and `--system7-notification-offset-right`
    (default `20px`) from the edges, plus the safe-area insets. Toasts shrink to fit narrow
    screens.
  - On coarse pointers, the dismiss box gets a 44px hit area.

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
  - On coarse pointers (touch screens), the dialog stays inside the safe area. When it does not
    fit, it shrinks and its content scrolls. On desktop, it still grows with its content, so a
    popover such as `BalloonHelp` inside it is not clipped.

### ConfirmDialog

- Props:
  - `message`: `string`
  - `okText`: `string` (defaults to `'OK'`)
  - `cancelText`: `string` (defaults to `'Cancel'`)
  - `width`: `string` (defaults to `'400px'`; the dialog still shrinks on narrower touch screens)
  - `onconfirm`: `() => void` (OK button or Enter)
  - `oncancel`: `() => void` (cancel button, backdrop or Escape)

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
  - The dialog stays inside the safe area while dragged, after it is shaded or expanded, and when
    the window is resized. On coarse pointers (touch screens), a dialog that does not fit shrinks
    and its content scrolls. On desktop, it still grows with its content, so a popover such as
    `BalloonHelp` inside it is not clipped.

### TitleBar

- Props:
  - `title`: `string`
  - `closable`, `collapsible`, `shadeable`: `boolean` (show the close, zoom and shade boxes)
  - `draggable`: `boolean` (calls `ondragstart` on mouse or touch down)
  - `focused`: `boolean`
  - `onclose`, `oncollapse`, `onshade`: `() => void`
  - `ondragstart`: `(e: MouseEvent | TouchEvent) => void`
  - `closeLabel`: `string` (defaults to `'Close'`)
  - `collapseLabel`: `string` (defaults to `'Zoom'`)
  - `shadeLabel`: `string` (defaults to `'Collapse'`; pass `'Expand'` while shaded)
- Slot:
  - `actions` (optional): controls at the right end of the bar, before the zoom and shade boxes;
    at most 34px tall. Pressing them never starts a drag.
- Notes:
  - Long titles end in an ellipsis instead of overlapping the boxes or actions.
  - The bar keeps its 35px height in a flex column.
  - A draggable bar sets `touch-action: none`. On coarse pointers, the boxes get 44px hit areas.

### DataTable

- Props:
  - `columns`: `Array<{ key, label, width?, className?, align?, sortable?, ariaLabel? }>`
  - `sortKey`: `string | null`
  - `sortDirection`: `'asc' | 'desc'`
  - `onSort`: `(key: string) => void`
  - `loading`, `empty`: `boolean`
  - `loadingText`, `emptyText`: `string`
  - `emptyColspan`: `number | null`
  - `showHeader`: `boolean` (defaults to `true`; `false` drops the header row and its double
    rule, while `columns` still sets the widths)
  - `headerClass`, `bodyClass`, `tableClass`, `class`: `string`
- Slots:
  - `default`: body rows (`<tr>...</tr>`)
  - `header` (optional): custom header row; not rendered when `showHeader` is `false`
- Notes:
  - Cell padding comes from `--system7-table-cell-padding`.
  - Without a header, screen readers get no column names, so make each cell understandable on its
    own.

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
