# Changelog

## Unreleased

### Added

- CSS tokens for mobile layouts: `--system7-font-size`, `--system7-control-font-size`,
  `--system7-safe-area-top`, `-right`, `-bottom` and `-left`, `--system7-scrollbar-size`,
  `--system7-table-cell-padding`, `--system7-notification-offset-bottom` and
  `--system7-notification-offset-right`. The size, padding and offset tokens default to the
  previous fixed values.
- `DataTable` `showHeader` prop to hide the header row.
- `TitleBar` `actions` slot for controls at the right end of the bar, and `closeLabel`,
  `collapseLabel` and `shadeLabel` props that name its boxes for screen readers.
- `ConfirmDialog` `width` prop.
- `TextInput` `focus()` and `select()` methods.
- `Button` and `TextInput` forward other attributes, such as `aria-*`, `data-*`, `inputmode` and
  `enterkeyhint`, to the native element. Their prop types include the native element's attributes
  except `class`, which the components ignore.
- 44px hit areas on coarse pointers for `Checkbox`, `Radio`, `icon` buttons, the `TextInput` clear
  box, the `Notification` dismiss box and the `TitleBar` boxes.
- Storybook stories for `ConfirmDialog`, `DataTable` and `TitleBar`, tall dialog content, long
  notifications and a phone layout.

### Changed

- `.s7-root` sets `-webkit-tap-highlight-color: transparent`.
- On coarse pointers (touch screens), `ModalDialog` and `MovableDialog` stay inside the safe area
  and scroll content that does not fit. App rules that override `max-width` or `max-height` on
  the `MovableDialog` `.s7-dialog` element still win, also after a drag. On desktop, dialogs still
  grow with their content, so a popover such as `BalloonHelp` inside them is not clipped. A dragged
  `MovableDialog` is kept on screen when the window is resized.
- The `ModalDialog` and `MovableDialog` backdrops set their padding from the
  `--system7-safe-area-*` tokens, which are `0px` on desktop. This overrides padding that an app
  sets with a selector such as `body .s7-backdrop`, so set the tokens instead.
- `Notification` toasts render inside one `.notification-stack` element, which is always present.
  The stack keeps clear of the safe area.
- `BalloonHelp` no longer opens on touch taps. Mouse and pen hover and keyboard focus still open
  it.
- `icon` buttons dim on hover only on devices that can hover.
- A draggable `TitleBar` sets `touch-action: none`, so touch drags move the window instead of
  scrolling the page.
- A clearable `TextInput` on a coarse pointer widens its right padding to 44px while the clear box
  shows.
- `TitleBar` clips its title text with an ellipsis. The clip can switch Chromium from LCD
  (subpixel) to grayscale antialiasing for the title glyphs, so titles can look slightly lighter.

### Fixed

- `TitleBar` no longer shrinks below 35px in a flex column, and long titles end in an ellipsis
  instead of overlapping the boxes and widening the page.
- Toasts that wrap onto several lines no longer overlap, and long unbroken text such as a URL
  wraps inside its toast.
- Touch-dragging a `MovableDialog` no longer logs a console error about `preventDefault` in a
  passive listener.
- `npm run format:check` passes again after Prettier was applied to `.claude/settings.json`,
  `.github/workflows/zai-code-review.yml`, `AGENTS.md` and `README.md`.
