# system7-ui — Code Review & Ideas

A thorough review of the component library: bugs, general issues, missing
features, and some delightful ideas. Items marked **[implemented]** have a
companion PR; the rest are documented here for future work.

---

## Bugs

### 1. Dialogs cannot be closed with the Escape key **[implemented]**

`ModalDialog` and `MovableDialog` close on backdrop click (and on
Enter/Space when the backdrop itself is focused), but not on Escape —
the universal "dismiss" key for modals, and a WAI-ARIA dialog-pattern
expectation. Keyboard users currently have to Tab _out of the dialog onto
the backdrop_ to close it.

_Files:_ `src/components/ModalDialog.svelte`, `src/components/MovableDialog.svelte`

### 2. No focus trap in modal dialogs **[implemented]**

Both dialogs set `aria-modal="true"` and move focus into the dialog on
mount, but Tab freely escapes into the (visually inert) page behind the
backdrop. WAI-ARIA requires focus to stay inside an `aria-modal` dialog.

_Files:_ `src/components/ModalDialog.svelte`, `src/components/MovableDialog.svelte`

### 3. BalloonHelp leaks its hover timer on unmount **[implemented]**

`handleMouseEnter` starts a `setTimeout`, but nothing clears it if the
component is destroyed while the timer is pending (e.g. the trigger is
removed from the DOM mid-hover). The callback then mutates state on a
destroyed component.

_File:_ `src/components/BalloonHelp.svelte:59`

### 4. TitleBar window-control gradient fallbacks are swapped

The window-control button background uses
`var(--system7-color-titlebar-edge-verydark, #ccccff)` and
`var(--system7-color-titlebar-edge-light, #a3a3d7)` — but `#ccccff` _is_
the light color and `#a3a3d7` the dark one (see `src/styles/system7.css`).
When the stylesheet isn't loaded (or the variables are unset), the bevel
gradient renders inverted. **[implemented]**

_File:_ `src/components/TitleBar.svelte:204-208`

### 5. Notification stacking uses `indexOf` inside the `{#each}` loop **[implemented]**

`style="bottom: {20 + notifications.indexOf(notification) * 70}px"` is
O(n²) and silently breaks if the same object reference appears twice.
Svelte's `{#each ... as n, i}` index is free and always correct.

_File:_ `src/components/Notification.svelte:39`

### 6. Notification mixes `role="alert"` with `aria-live="polite"` **[implemented]**

`role="alert"` implies `aria-live="assertive"`; pairing it with
`aria-live="polite"` is contradictory and screen readers resolve it
unpredictably. Errors should be assertive alerts; success/info should be
polite `role="status"`.

_File:_ `src/components/Notification.svelte:40-41`

### 7. Monospace `code` styling inside balloons/notifications is dead CSS **[implemented]**

`system7.css` applies `.s7-root * { font-family: ... !important }`, which
beats the non-`!important` `:global(code) { font-family: Monaco ... }`
rules in `BalloonHelp` and `Notification`. Inline code in markdown
messages never actually renders in a monospace font inside `.s7-root`.

_Files:_ `src/components/BalloonHelp.svelte:278`, `src/components/Notification.svelte:104`, `src/styles/system7.css:47-51`

### 8. Radio keeps its filled dot when deselected via a native group

When two `Radio` components share a `name` and are used _uncontrolled_,
selecting B unchecks A's native input — but A's `checked` prop (which
drives the SVG dot) never updates, because deselected radios don't fire
`change`. Result: two filled dots. Works fine when the parent controls
`checked={value === option}`; the controlled-only contract should either
be enforced (derive the dot from the input's state) or documented loudly.

_File:_ `src/components/Radio.svelte:30-36`

### 9. `theme.ts` silently rejects shorthand hex colors

`normalizeHexColor` only accepts `#RRGGBB`. A perfectly valid `#fff` from
the host app is silently dropped — no warning, no fallback applied, the
token just never updates. Shorthand `#RGB` should be expanded.
**[implemented]**

_File:_ `src/theme.ts:19-32`

---

## General issues

### 10. The backdrop is a focusable button labeled "Close modal"

Tabbing out of a dialog lands on an invisible full-screen "button". With
Escape support and a focus trap (items 1–2) this becomes unreachable by
keyboard anyway, but long-term the backdrop should probably be a
presentation element with a plain click handler.

### 11. Components don't forward rest attributes

`Button`, `Checkbox`, `Dropdown`, etc. expose a fixed prop list — there's
no way to pass `aria-label`, `data-*`, `form`, `autofocus`, … A
`$$restProps` spread (or runes-style `...rest`) on the underlying element
would make the kit far more composable.

### 12. Legacy Svelte 4 component style throughout

Components mix `export let` / `<slot>` with Svelte 5 event attributes
(`onclick={...}`). It works, but a migration to runes (`$props()`,
`{#snippet}`/`{@render}`) would unlock typed snippets and remove the
legacy-mode dependency before Svelte 6.

### 13. DataTable accessibility gaps

- The split header/body design renders **two** `<table>` elements, so
  screen readers announce a header-only table followed by a headerless
  body table. A single table with `position: sticky` headers would fix
  the semantics (and delete the scrollbar-padding sync code).
- No `aria-busy` on the body while `loading` is true.

### 14. ConfirmDialog's bomb icon is announced as "Bomb" **[implemented]**

The icon is decorative next to the message; `alt=""` is the right call so
screen readers skip it.

_File:_ `src/components/ConfirmDialog.svelte:36`

### 15. Animations ignore `prefers-reduced-motion` **[implemented]**

`fadeIn` in BalloonHelp/Notification (and the new indeterminate progress
animation) should be disabled under
`@media (prefers-reduced-motion: reduce)`.

### 16. `MovableDialog` ignores window resizes

A dialog dragged to the bottom-right corner stays off-screen if the
window shrinks. Clamping `position` on `window.resize` would keep the
title bar reachable.

### 17. Shared markdown helper is copy-pasted

`escapeHtml` + `renderMarkdown` + the MarkdownIt instance are duplicated
verbatim in `BalloonHelp` and `Notification`. A tiny `src/markdown.ts`
module would keep parser options in sync.

---

## Missing features

### 18. TextInput component **[implemented]**

`system7.css` already ships `.s7-input` styling, but there's no input
component — the only form controls are Checkbox, Radio, and Dropdown. A
`TextInput` with `bind:value`, `disabled`, `placeholder`, and the System 7
inset look rounds out the form set.

### 19. Indeterminate ProgressBar **[implemented]**

Real progress isn't always knowable. System 7 had the iconic diagonal
barber-pole animation for indeterminate progress — instantly recognizable
and trivially achievable with a repeating linear gradient.

### 20. Enter triggers the default button in ConfirmDialog **[implemented]**

The whole point of the System 7 "outlined default button" is that
Return/Enter activates it. `ConfirmDialog` draws the outline but Enter
does nothing.

### 21. Notification dismissal **[implemented]**

Notifications are `pointer-events: none` and live until the parent
removes them. An optional `ondismiss(id)` callback that renders a close
button per notification keeps the parent-owned-state model while letting
users dismiss noise.

### 22. More form controls

- **Slider** — the chunky rectangular System 7 thumb.
- **RadioGroup** — wraps `Radio` children, manages the single-selection
  state, and fixes issue 8 by construction.
- **Mixed-state Checkbox** — System 7 had a dash for "partially checked".

### 23. MenuBar / pull-down menus

The most iconic System 7 element of all is missing: the menu bar with
pull-down menus, keyboard navigation, ⌘-shortcut hints, and the classic
inverted highlight.

### 24. Theme presets

The CSS variables make theming possible but there are no presets — a
`themes.css` with e.g. classic B&W and the colored System 7.5 appearance
would showcase the token system.

---

## Delightful & quirky ideas

### 25. SystemErrorDialog ("Sorry, a system error occurred.") **[implemented]**

The bomb icon is already in `src/assets/`! A faithful System 7 bomb
dialog — black-bordered, bomb on the left, "Sorry, a system error
occurred." with a _Restart_ button — is the perfect themed replacement
for a generic fatal-error screen. Great as an `ErrorBoundary` fallback.

### 26. Outline dragging for MovableDialog

System 7 didn't move windows live — it dragged a dotted _outline_ and the
window jumped on mouse-up. An `outlineDrag` prop would be deeply
period-accurate (and cheaper to render, just like in 1991).

### 27. WindowShade sound & animation

The title-bar shade currently snaps. The real WindowShade had a quick
roll-up animation (and an optional "zip" sound in 7.5). Even a 100 ms
height transition would sell the effect.

### 28. Desktop pattern utility

An `.s7-desktop` class with the classic 50% dither pattern (and maybe a
few of the Desktop Patterns control panel classics) as a tiling
CSS background for demo/host apps.

### 29. Menu-bar clock

A tiny `MenuClock` component: Chicago-font time display, blinking colon,
like the beloved SuperClock! that shipped built-in from System 7.5.

### 30. Pixel cursor pack

CSS `cursor: url(...)` set of the classic pointer, watch (busy), and
I-beam cursors, exposed as utility classes (`.s7-cursor-watch`, …).

### 31. Easter egg

System 7.5's hidden "secret about box" was triggered by dragging text
onto the desktop. A `konami`-style easter egg in the demo app (e.g. the
bomb dialog with the original "ID = -37" error codes) would be a fun nod.

---

## Implementation map

To keep PRs conflict-free, changes are grouped so that **each source file
is touched by exactly one PR**:

| PR             | Scope                                                                                          | Files                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| this PR        | `awesome.md` review document                                                                   | `awesome.md`                                                                       |
| dialogs        | Items 1, 2, 14, 20 — Escape-to-close, focus trap, default-button Enter, decorative bomb        | `ModalDialog.svelte`, `MovableDialog.svelte`, `ConfirmDialog.svelte`, dialog tests |
| balloon        | Items 3, 7 (balloon half), 15 — timer cleanup, focus/Escape support, code font, reduced motion | `BalloonHelp.svelte`, new test                                                     |
| notifications  | Items 5, 6, 7 (notification half), 15, 21 — index fix, live-region roles, dismiss button       | `Notification.svelte`, test                                                        |
| progress       | Item 19 — indeterminate barber-pole                                                            | `ProgressBar.svelte`, test                                                         |
| small-fixes    | Items 4, 9 — TitleBar gradient fallbacks, shorthand hex                                        | `TitleBar.svelte`, `theme.ts`, tests                                               |
| new-components | Items 18, 25 — `TextInput`, `SystemErrorDialog`                                                | new component files, `index.ts`, `README.md`, `docs/COMPONENTS.md`, tests          |
