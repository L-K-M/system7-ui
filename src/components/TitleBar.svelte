<script lang="ts">
  import { onMount } from 'svelte';
  import titleBg from '../assets/titlebar_bg.png';
  import closeButton from '../assets/close_button.png';
  import resizeButton from '../assets/resize_button.png';
  import windowshadeButton from '../assets/windowshade_button.png';

  /** Window title text shown in the center label. */
  export let title: string;

  /** Shows the close button when `true`. */
  export let closable = false;

  /** Shows the shade button when `true`. */
  export let shadeable = false;

  /** Shows the resize-to-fit control when `true`. */
  export let collapsible = false;

  /** Enables drag start handling on pointer/touch down. */
  export let draggable = false;

  /** Renders focused styling when `true`. */
  export let focused = true;

  /** Callback fired when the close control is activated. */
  export let onclose: (() => void) | undefined = undefined;

  /** Callback fired when the shade control is activated. */
  export let onshade: (() => void) | undefined = undefined;

  /** Callback fired when the resize-to-fit control is activated. */
  export let oncollapse: (() => void) | undefined = undefined;

  /** Callback fired when dragging starts from the title bar. */
  export let ondragstart: ((e: MouseEvent | TouchEvent) => void) | undefined = undefined;

  /** Accessible name of the close control. */
  export let closeLabel = 'Close';

  /**
   * Accessible name of the shade control. The control toggles between collapsed and expanded, so
   * pass a state-specific label (for example `'Expand'` while collapsed) when you track that state.
   */
  export let shadeLabel = 'Collapse';

  /** Accessible name of the resize-to-fit (zoom) control. */
  export let collapseLabel = 'Zoom';

  // Horizontal space one window box takes from the title bar's padding edge: a 22px box inside a
  // 2px border plus its 12px outer margin.
  const BOX_SLOT_WIDTH = 38;

  // Matches the `.title-bar-actions` right margin.
  const ACTIONS_MARGIN = 12;

  // The title bar's 4px side padding plus a strip of rails kept visible between a truncated title
  // and the nearest control.
  const TITLE_CLEARANCE = 4 + 6;

  let actionsElement: HTMLDivElement | null = null;
  let actionsWidth = 0;

  // The title stays centred on the whole bar, so it may only grow as wide as the more crowded side
  // allows on both sides.
  $: titleInset =
    TITLE_CLEARANCE +
    Math.max(
      closable ? BOX_SLOT_WIDTH : 0,
      (actionsWidth > 0 ? actionsWidth + ACTIONS_MARGIN : 0) +
        (collapsible ? BOX_SLOT_WIDTH : 0) +
        (shadeable ? BOX_SLOT_WIDTH : 0)
    );

  onMount(() => {
    if (!actionsElement) {
      return;
    }

    measureActions();

    // Actions can change width after mount, for example when a web font loads. ResizeObserver is
    // missing in some test environments, where the initial measurement has to do.
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(measureActions);
    observer.observe(actionsElement);
    return () => observer.disconnect();
  });

  function measureActions() {
    actionsWidth = actionsElement ? Math.ceil(actionsElement.getBoundingClientRect().width) : 0;
  }

  function shouldIgnoreDragStart(target: EventTarget | null) {
    const element = target as HTMLElement | null;
    if (!element) {
      return false;
    }

    return Boolean(
      element.closest('.close-box') ||
      element.closest('.collapse-box') ||
      element.closest('.shade-box') ||
      element.closest('.button-container') ||
      element.closest('.title-bar-actions')
    );
  }

  function handleMousedown(event: MouseEvent) {
    if (!draggable) {
      return;
    }

    if (shouldIgnoreDragStart(event.target)) {
      return;
    }

    if (ondragstart) {
      ondragstart(event);
    }
  }

  function handleTouchStart(event: TouchEvent) {
    if (!draggable) {
      return;
    }

    if (shouldIgnoreDragStart(event.target)) {
      return;
    }

    if (ondragstart) {
      ondragstart(event);
    }
  }

  function handleKeydown(handler: (() => void) | undefined, e: KeyboardEvent) {
    if (handler && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handler();
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="title-bar"
  class:draggable
  class:unfocused={!focused}
  onmousedown={handleMousedown}
  ontouchstart={handleTouchStart}
  style="background-image: url({titleBg}), linear-gradient(to bottom, var(--system7-color-titlebar-edge-light, #ccccff) 50%, var(--system7-color-titlebar-edge-dark, #a3a3d7) 50%);"
>
  {#if closable}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="button-container" onmousedown={(e) => e.stopPropagation()}>
      <div
        class="close-box"
        role="button"
        tabindex="0"
        aria-label={closeLabel}
        onclick={onclose}
        onkeydown={(e) => handleKeydown(onclose, e)}
        style="background-image: url({closeButton});"
      ></div>
    </div>
  {/if}

  <div class="title-text" style:max-width={`calc(100% - ${2 * titleInset}px)`}>
    <span>{title}</span>
  </div>

  <div class="right-side-buttons" class:has-actions={$$slots.actions}>
    {#if $$slots.actions}
      <div class="title-bar-actions" bind:this={actionsElement}>
        <!-- @slot actions - Controls shown at the right end of the bar, before the zoom and shade boxes, vertically centred and drawn above the title. Pressing them never starts a window drag. The title is shortened to stay clear of them, and the bar keeps its 35px height, so keep content at most 34px tall. -->
        <slot name="actions" />
      </div>
    {/if}

    {#if collapsible}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="button-container" onmousedown={(e) => e.stopPropagation()}>
        <div
          class="collapse-box"
          role="button"
          tabindex="0"
          aria-label={collapseLabel}
          onclick={oncollapse}
          onkeydown={(e) => handleKeydown(oncollapse, e)}
          style="background-image: url({resizeButton});"
        ></div>
      </div>
    {/if}

    {#if shadeable}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="button-container" onmousedown={(e) => e.stopPropagation()}>
        <div
          class="shade-box"
          role="button"
          tabindex="0"
          aria-label={shadeLabel}
          onclick={onshade}
          onkeydown={(e) => handleKeydown(onshade, e)}
          style="background-image: url({windowshadeButton});"
        ></div>
      </div>
    {/if}
  </div>
</div>

<style>
  .title-bar {
    border-bottom: 1px solid var(--system7-color-ink, #000);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    position: relative;
    user-select: none;
    cursor: default;
    height: 35px;
    flex-shrink: 0;
    box-sizing: border-box;
    background-size:
      100% 100%,
      100% 100%;
    background-repeat: no-repeat, no-repeat;
    background-position: center;
    border-right: 2px solid var(--system7-color-titlebar-edge-dark, #a3a3d7);
    border-left: 2px solid var(--system7-color-titlebar-edge-light, #ccccff);
    image-rendering: pixelated;
  }

  /* Lets touch drags move the window instead of scrolling the page. Svelte registers touchstart
     listeners as passive, so the drag handler cannot call preventDefault(). */
  .title-bar.draggable {
    touch-action: none;
  }

  .title-text {
    display: grid;
    place-items: center;
    background: var(--system7-color-titlebar, #eee);
    top: 2px;
    bottom: 2px;
    padding: 2px 12px 2px 12px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    white-space: nowrap;
    box-sizing: border-box;
    width: max-content;
  }

  .title-text span {
    font-family: 'Sysfont', 'Chicago', 'Impact', sans-serif !important;
    letter-spacing: 1px;
    font-size: 24px;
    font-weight: normal;
    padding-top: 2px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @-moz-document url-prefix() {
    .title-text span {
      padding-top: 0;
    }
  }

  .right-side-buttons {
    display: flex;
  }

  /* Keeps actions at the right end even when no close box precedes them. */
  .right-side-buttons.has-actions {
    margin-left: auto;
  }

  .title-bar-actions {
    display: flex;
    align-items: center;
    align-self: center;
    margin-right: 12px;
    z-index: 10;
  }

  .button-container {
    display: flex;
    align-items: center;

    width: 22px;
    height: 22px;
    border: 2px solid var(--system7-color-titlebar, #eee);
    background: linear-gradient(
      135deg,
      var(--system7-color-titlebar-edge-verydark, #333366) 50%,
      var(--system7-color-titlebar-edge-light, #ccccff) 50%
    );
    z-index: 10;
  }

  .button-container:has(.close-box) {
    margin-left: 12px;
  }

  .button-container:has(.collapse-box) {
    margin-right: 12px;
  }

  .button-container:has(.shade-box) {
    margin-right: 12px;
  }

  .close-box,
  .collapse-box,
  .shade-box {
    width: 22px;
    height: 22px;
    background-size: contain;
    position: relative;
    cursor: pointer;
    pointer-events: auto;
  }

  .shade-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3px;
    padding: 5px 4px;
    box-sizing: border-box;
  }

  .close-box:active,
  .collapse-box:active,
  .shade-box:active {
    filter: invert(1);
  }

  /* Grows the touch target to 44px without changing how the boxes look. */
  @media (pointer: coarse) {
    .close-box::after,
    .collapse-box::after,
    .shade-box::after {
      content: '';
      position: absolute;
      top: -11px;
      right: -11px;
      bottom: -11px;
      left: -11px;
    }
  }

  .title-bar.unfocused {
    background-image: none !important;
    background-color: var(--system7-color-paper, #fff);
    border-right-color: var(--system7-color-paper, #fff);
    border-left-color: var(--system7-color-paper, #fff);
  }

  .title-bar.unfocused .title-text {
    background: var(--system7-color-paper, #fff);
    color: var(--system7-color-disabled-ink, #808080);
  }

  .title-bar.unfocused .button-container {
    display: none;
  }
</style>
