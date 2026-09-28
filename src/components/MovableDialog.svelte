<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import ErrorBoundary from './ErrorBoundary.svelte';
  import TitleBar from './TitleBar.svelte';
  import { trapFocus } from '../focus-trap';

  /** Window title text rendered in the title bar. */
  export let title: string;

  /** CSS width value applied to the movable window frame. */
  export let width = '460px';

  /** Renders focused title bar styling when `true`. */
  export let focused = true;

  /** Callback fired when the backdrop or close button closes the dialog. */
  export let onclose: (() => void) | undefined = undefined;

  let backdropElement: HTMLDivElement;
  let dialogElement: HTMLDivElement;
  let isDragging = false;
  let isCollapsed = false;
  let dragOffset = { x: 0, y: 0 };
  let position = { x: 0, y: 0 };
  let initialized = false;
  let triggerElement: HTMLElement | null = null;

  function close() {
    if (onclose) {
      onclose();
    }
  }

  function handleDialogKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Tab') {
      trapFocus(dialogElement, e);
    }
    e.stopPropagation();
  }

  /**
   * Returns the viewport position closest to `x`/`y` that keeps the whole dialog inside the
   * safe area. The backdrop's padding holds the safe-area insets, so it is read from there. When
   * the dialog is larger than the safe area, the top-left corner wins so the title bar stays
   * reachable.
   */
  function clampToSafeArea(x: number, y: number) {
    const rect = dialogElement.getBoundingClientRect();
    const insets = getComputedStyle(backdropElement);
    const minX = Number.parseFloat(insets.paddingLeft) || 0;
    const minY = Number.parseFloat(insets.paddingTop) || 0;
    const maxX = window.innerWidth - (Number.parseFloat(insets.paddingRight) || 0) - rect.width;
    const maxY = window.innerHeight - (Number.parseFloat(insets.paddingBottom) || 0) - rect.height;

    return {
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY))
    };
  }

  /**
   * Switches the dialog from being centred by the backdrop to being placed at explicit viewport
   * coordinates, starting from where it is currently drawn.
   */
  function pinToCurrentPosition() {
    if (initialized) {
      return;
    }

    const rect = dialogElement.getBoundingClientRect();
    position = clampToSafeArea(rect.left, rect.top);
    initialized = true;
  }

  async function toggleCollapse() {
    if (!dialogElement) {
      return;
    }

    pinToCurrentPosition();
    isCollapsed = !isCollapsed;

    // Expanding a shaded dialog near the bottom edge would push its body out of view.
    await tick();
    if (dialogElement) {
      position = clampToSafeArea(position.x, position.y);
    }
  }

  function handleWindowResize() {
    if (!initialized || !dialogElement) {
      return;
    }

    position = clampToSafeArea(position.x, position.y);
  }

  function getEventPoint(event: MouseEvent | TouchEvent) {
    if ('touches' in event) {
      const touchPoint = event.touches[0] ?? event.changedTouches[0];
      if (!touchPoint) {
        return null;
      }

      return { x: touchPoint.clientX, y: touchPoint.clientY };
    }

    return { x: event.clientX, y: event.clientY };
  }

  function handleDragStart(event: MouseEvent | TouchEvent) {
    if (!dialogElement) {
      return;
    }

    const pointer = getEventPoint(event);
    if (!pointer) {
      return;
    }

    // No preventDefault() here: Svelte registers the title bar's touchstart listener as passive,
    // so the call would be ignored with a console error. The draggable title bar sets
    // `touch-action: none` to stop the page from scrolling instead.
    isDragging = true;
    const rect = dialogElement.getBoundingClientRect();
    dragOffset.x = pointer.x - rect.left;
    dragOffset.y = pointer.y - rect.top;

    pinToCurrentPosition();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);
  }

  function handleDragMove(event: MouseEvent | TouchEvent) {
    if (!isDragging || !dialogElement) {
      return;
    }

    const pointer = getEventPoint(event);
    if (!pointer) {
      return;
    }

    position = clampToSafeArea(pointer.x - dragOffset.x, pointer.y - dragOffset.y);
  }

  function handleMouseMove(event: MouseEvent) {
    handleDragMove(event);
  }

  function handleTouchMove(event: TouchEvent) {
    event.preventDefault();
    handleDragMove(event);
  }

  function handleDragEnd() {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('touchcancel', handleDragEnd);
  }

  onMount(() => {
    triggerElement = document.activeElement as HTMLElement;
    tick().then(() => {
      dialogElement?.focus();
    });

    return () => {
      triggerElement?.focus();
    };
  });

  onDestroy(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('touchcancel', handleDragEnd);
  });
</script>

<svelte:window onresize={handleWindowResize} />

<div
  bind:this={backdropElement}
  class="s7-backdrop"
  onclick={close}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') close();
  }}
  role="button"
  tabindex="0"
  aria-label="Close dialog"
>
  <div
    bind:this={dialogElement}
    class="s7-dialog"
    class:dragging={isDragging}
    class:positioned={initialized}
    style="width: {width}; {initialized
      ? `position: fixed; left: ${position.x}px; top: ${position.y}px; transform: none;`
      : ''}"
    onclick={(e) => e.stopPropagation()}
    onkeydown={handleDialogKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <TitleBar
      {title}
      {focused}
      closable
      shadeable
      draggable
      onclose={close}
      onshade={toggleCollapse}
      ondragstart={handleDragStart}
    />

    {#if !isCollapsed}
      <div class="modal-content">
        <ErrorBoundary fallbackMessage="Unable to render dialog content.">
          <!-- @slot default - Dialog body content. -->
          <slot />
        </ErrorBoundary>
      </div>
    {/if}
  </div>
</div>

<style>
  .s7-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    /* Keeps the dialog clear of the notch, status bar and gesture bar. The insets are 0 on
       desktop, so the layout there is unchanged. */
    padding: var(--system7-safe-area-top, env(safe-area-inset-top, 0px))
      var(--system7-safe-area-right, env(safe-area-inset-right, 0px))
      var(--system7-safe-area-bottom, env(safe-area-inset-bottom, 0px))
      var(--system7-safe-area-left, env(safe-area-inset-left, 0px));
    background: var(--system7-overlay-strong, rgba(0, 0, 0, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--system7-z-dialog, 100);
  }

  .modal-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    /* Scrolls when the dialog is limited to the viewport height. */
    min-height: 0;
    overflow: auto;
  }

  .s7-dialog {
    background: var(--system7-color-paper, #fff);
    border: 1px solid var(--system7-color-ink, #000);
    box-shadow: 4px 4px 0 var(--system7-shadow-soft, rgba(0, 0, 0, 0.2));
    display: flex;
    flex-direction: column;
    /* The width prop sizes the content box, so the limits subtract the 1px border on each side.
       Inside the backdrop, 100% is the safe area. */
    max-width: calc(100% - 2px);
    max-height: calc(100% - 2px);
    outline: none;
  }

  /* Once dragged, the dialog is fixed to the viewport rather than laid out by the backdrop, so
     100% is the whole viewport and the limits subtract the safe-area insets themselves. */
  .s7-dialog.positioned {
    max-width: calc(
      100% - 2px - var(--system7-safe-area-left, env(safe-area-inset-left, 0px)) -
        var(--system7-safe-area-right, env(safe-area-inset-right, 0px))
    );
    max-height: calc(
      100% - 2px - var(--system7-safe-area-top, env(safe-area-inset-top, 0px)) -
        var(--system7-safe-area-bottom, env(safe-area-inset-bottom, 0px))
    );
  }

  .s7-dialog:focus {
    outline: none;
  }

  .s7-dialog.dragging {
    user-select: none;
  }
</style>
