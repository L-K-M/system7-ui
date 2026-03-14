<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import ErrorBoundary from './ErrorBoundary.svelte';
  import TitleBar from './TitleBar.svelte';

  /** Window title text rendered in the title bar. */
  export let title: string;

  /** CSS width value applied to the movable window frame. */
  export let width = '460px';

  /** Renders focused title bar styling when `true`. */
  export let focused = true;

  /** Callback fired when the backdrop or close button closes the dialog. */
  export let onclose: (() => void) | undefined = undefined;

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

  function toggleCollapse() {
    if (!initialized && dialogElement) {
      const rect = dialogElement.getBoundingClientRect();
      position.x = rect.left;
      position.y = rect.top;
      initialized = true;
    }
    isCollapsed = !isCollapsed;
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

    if ('touches' in event) {
      event.preventDefault();
    }

    isDragging = true;
    const rect = dialogElement.getBoundingClientRect();
    dragOffset.x = pointer.x - rect.left;
    dragOffset.y = pointer.y - rect.top;

    if (!initialized) {
      position.x = rect.left;
      position.y = rect.top;
      initialized = true;
    }

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

    const rect = dialogElement.getBoundingClientRect();
    const dialogWidth = rect.width;
    const dialogHeight = rect.height;

    const newX = pointer.x - dragOffset.x;
    const newY = pointer.y - dragOffset.y;

    const minX = 0;
    const minY = 0;
    const maxX = window.innerWidth - dialogWidth;
    const maxY = window.innerHeight - dialogHeight;

    position.x = Math.max(minX, Math.min(newX, maxX));
    position.y = Math.max(minY, Math.min(newY, maxY));
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

<div
  class="s7-backdrop"
  onclick={close}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') close();
  }}
  role="button"
  tabindex="0"
  aria-label="Close dialog"
>
  <div
    bind:this={dialogElement}
    class="s7-dialog"
    class:dragging={isDragging}
    style="width: {width}; {initialized
      ? `position: fixed; left: ${position.x}px; top: ${position.y}px; transform: none;`
      : ''}"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
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
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--system7-z-dialog, 100);
  }

  .modal-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  .s7-dialog {
    background: #fff;
    border: 1px solid #000;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    outline: none;
  }

  .s7-dialog:focus {
    outline: none;
  }

  .s7-dialog.dragging {
    user-select: none;
  }
</style>
