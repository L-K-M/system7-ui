# Development Guidelines for @lkmc/system7-ui

This document outlines coding standards and best practices to maintain code quality and avoid common issues.

This is a living document and should be updated as necessary.

---

## Development Setup

```bash
npm install
npm run demo:install
```

Run local checks before opening a pull request:

```bash
npm run check
npm run lint
npm run test
npm run package
```

Optional docs preview:

```bash
npm run storybook
```

---

## Code Style Requirements

- ESLint is configured with TypeScript + Svelte support via `eslint.config.js`.
- Prettier is configured via `.prettierrc` and should be used for formatting.
- Keep CSS scoped and avoid adding broad global selectors.

---

## Testing Requirements

- Add or update tests for behavior changes in `src/components/__tests__/`.
- Keep coverage at or above the configured threshold for core components.
- Use `npm run test:coverage` when validating larger changes.

---

## Pull Request Process

1. Create a branch from the latest `main`.
2. Ensure checks pass locally (`check`, `lint`, `test`, `package`).
3. Include a concise summary of user-visible changes and screenshots when UI changes are involved.
4. Link related issues and call out follow-up work, if any.

---

## Security

### Never use `@html` with unsanitized content

```svelte
<!-- GOOD: Use markdown-it with html: false -->
<script>
  const md = new MarkdownIt({ html: false, linkify: true, breaks: true });
</script>

<!-- BAD: XSS vulnerability -->
<p>{@html userInput}</p>
<p>{@html md.render(content)}</p>

<!-- BEST: Use plain text when possible -->
<p>{content}</p>
```

### Sanitize all user-provided content

If accepting external input (API responses, user input), always sanitize before rendering with `@html`.

---

## Accessibility

### All interactive elements must have keyboard handlers

Every element with `onclick` must have a corresponding `onkeydown` handler:

```svelte
<!-- BAD: Mouse-only interaction -->
<button onclick={handleClick}>Click</button>

<!-- GOOD: Keyboard accessible -->
<button
  onclick={handleClick}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click
</button>
```

### Use semantic elements and ARIA attributes

```svelte
<!-- BAD: Non-semantic -->
<div onclick={close}>Close</div>

<!-- GOOD: Semantic with ARIA -->
<button onclick={close} aria-label="Close dialog"> Close </button>
```

### Live regions for dynamic content

Notifications and alerts must be announced to screen readers:

```svelte
<!-- BAD: Not announced -->
<div class="notification">{message}</div>

<!-- GOOD: Announced to screen readers -->
<div class="notification" role="alert" aria-live="polite">
  {message}
</div>
```

### Focus management for dialogs and modals

Dialogs must:

1. Focus the dialog element when opened
2. Restore focus to the trigger element when closed

```svelte
<script>
  import { onMount, tick } from 'svelte';

  let triggerElement: HTMLElement | null = null;
  let dialogElement: HTMLDivElement;

  onMount(() => {
    triggerElement = document.activeElement as HTMLElement;
    tick().then(() => dialogElement?.focus());

    return () => triggerElement?.focus();
  });
</script>

<div bind:this={dialogElement} tabindex="-1" role="dialog" aria-modal="true">
  <!-- dialog content -->
</div>
```

---

## TypeScript

### Use literal types for props with specific values

```svelte
<!-- BAD: Too permissive -->
<script>
  export let position = 'bottom'; // type is string
</script>

<!-- GOOD: Restrictive literal type -->
<script lang="ts">
  export let position: 'top' | 'bottom' = 'bottom';
</script>
```

### Provide default values for optional props

```svelte
<!-- BAD: Runtime error if not provided -->
<script lang="ts">
  export let message: string;
</script>

<!-- GOOD: Safe default -->
<script lang="ts">
  export let message: string = '';
</script>
```

### Explicit type annotations for callbacks

```svelte
<!-- GOOD: Clear callback types -->
<script lang="ts">
  export let onchange: ((value: string) => void) | undefined = undefined;
  export let onclose: (() => void) | undefined = undefined;
</script>
```

---

## Svelte 5 Syntax

### Use modern event handlers

```svelte
<!-- BAD: Legacy Svelte 4 syntax -->
<button on:click={handleClick}>Click</button>

<!-- GOOD: Svelte 5 syntax -->
<button onclick={handleClick}>Click</button>
```

### Use runes for reactive state

```svelte
<!-- BAD: Legacy reactive declarations -->
<script>
  let count = 0;
  $: doubled = count * 2;
</script>

<!-- GOOD: Svelte 5 runes -->
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

### Event modifiers

```svelte
<!-- BAD: Manual stopPropagation -->
<div onclick={(e) => { e.stopPropagation(); handleClick(); }}>

<!-- GOOD: Event modifier -->
<div onclick={(e) => e.stopPropagation()}>
<!-- Or use the modifier pattern where applicable -->
```

---

## CSS

### Use CSS custom properties for z-index values

This allows consumers to override stacking order:

```css
/* Define in system7.css */
:root {
  --system7-z-dialog: 100;
  --system7-z-notification: 1000;
  --system7-z-tooltip: 10000;
}

/* Use in components */
.notification {
  z-index: var(--system7-z-notification, 1000);
}
```

### Provide fallbacks for custom properties

```css
/* GOOD: Fallback value provided */
.tooltip {
  z-index: var(--system7-z-tooltip, 10000);
}

/* BAD: No fallback */
.tooltip {
  z-index: var(--system7-z-tooltip);
}
```

### Avoid global selectors

```css
/* BAD: Affects everything */
* {
  font-family: 'Geneva', sans-serif !important;
}

/* BETTER: Scoped to component */
.my-component * {
  font-family: 'Geneva', sans-serif;
}

/* BEST: Use specific class names */
.my-component-text {
  font-family: 'Geneva', sans-serif;
}
```

---

## Code Quality

### DRY: Don't Repeat Yourself

When you see duplicated code across multiple components, extract a shared component:

```svelte
<!-- BAD: Duplicated in CopyIcon, DownloadIcon, EditIcon, TrashIcon -->
<script>
  export let alt = 'Copy';
  export let size = 16;
</script>
<img src={icon} {alt} width={size} height={size} class="sys7-icon" />

<!-- GOOD: Generic Icon component -->
<!-- Icon.svelte -->
<script lang="ts">
  export let src: string;
  export let alt = '';
  export let size = 16;
</script>
<img src={src} {alt} width={size} height={size} class="sys7-icon" />

<!-- CopyIcon.svelte -->
<script>
  import Icon from './Icon.svelte';
  import icon from '../assets/copy.png';
</script>
<Icon src={icon} alt="Copy" />
```

### Remove unused code

```svelte
<!-- BAD: Unused prop -->
<script>
  export let collapsible = false; // Never used!
</script>

<!-- GOOD: Clean up unused code -->
<script>
  // collapsible removed - functionality not implemented
  export let shadeable = false; // Actually used
</script>
```

---

## Component Structure

### Recommended component file structure

```svelte
<script lang="ts">
  // 1. Imports
  import { onMount } from 'svelte';
  import OtherComponent from './OtherComponent.svelte';

  // 2. Props (with types and defaults)
  export let title: string;
  export let disabled = false;
  export let onchange: ((value: string) => void) | undefined = undefined;

  // 3. Local state
  let isOpen = false;
  let element: HTMLDivElement;

  // 4. Functions
  function handleClick() {
    isOpen = !isOpen;
    onchange?.('new value');
  }

  // 5. Lifecycle hooks
  onMount(() => {
    // setup
    return () => {
      // cleanup
    };
  });
</script>

<!-- 6. Template -->
<div bind:this={element} class="component" class:disabled>
  <h2>{title}</h2>
  <slot />
</div>

<!-- 7. Styles -->
<style>
  .component {
    /* styles */
  }

  .disabled {
    opacity: 0.5;
  }
</style>
```

---

## Before Committing

Run these checks before committing:

```bash
# Type checking
npm run check

# Linting
npm run lint

# Test suite
npm run test

# Package validation
npm run package
```

---

## Summary Checklist

- [ ] No `@html` with unsanitized content
- [ ] All `onclick` handlers have corresponding `onkeydown` handlers
- [ ] Dynamic notifications have `role="alert"` and `aria-live="polite"`
- [ ] Dialogs manage focus (focus on open, restore on close)
- [ ] Props with specific values use literal types
- [ ] Optional props have default values
- [ ] Using Svelte 5 event syntax (`onclick` not `on:click`)
- [ ] Z-index values use CSS custom properties
- [ ] No duplicated code across components
- [ ] No unused props or code
- [ ] `npm run check` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npm run package` succeeds
