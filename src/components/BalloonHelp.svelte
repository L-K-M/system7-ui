<script lang="ts">
  import MarkdownIt from 'markdown-it';

  /** Tooltip content shown when hovering the wrapped element. */
  export let message = '';

  /** Preferred tooltip side relative to the wrapped element. */
  export let position: 'top' | 'bottom' = 'bottom';

  /** Delay in milliseconds before the tooltip appears on hover. */
  export let delay = 1000;

  /** Enables Markdown rendering for `message` when `true`. */
  export let markdown = false;

  const markdownParser = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: true
  });

  let showBalloon = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let containerElement: HTMLDivElement;
  let balloonElement: HTMLDivElement;
  let adjustedPosition = position;
  let horizontalOffset = 0;
  let verticalOffset = 0;

  const viewportPadding = 25;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  let pointerFillPath = '';
  let pointerLeftPath = '';
  let pointerRightPath = '';

  function escapeHtml(text: string) {
    return text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function renderMarkdown(text: string) {
    try {
      return markdownParser.render(text);
    } catch (error) {
      console.error('BalloonHelp markdown render failed', error);
      return `<p>${escapeHtml(text)}</p>`;
    }
  }

  function handleMouseEnter() {
    timeoutId = setTimeout(() => {
      showBalloon = true;
      requestAnimationFrame(() => {
        adjustBalloonPosition();
      });
    }, delay);
  }

  function handleMouseLeave() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    showBalloon = false;
    horizontalOffset = 0;
    verticalOffset = 0;
    adjustedPosition = position;
  }

  function handleWindowResize() {
    if (!showBalloon) {
      return;
    }

    requestAnimationFrame(() => {
      adjustBalloonPosition();
    });
  }

  function adjustBalloonPosition() {
    if (!balloonElement || !containerElement) {
      return;
    }

    const balloonRect = balloonElement.getBoundingClientRect();
    const padding = viewportPadding;

    adjustedPosition = position;
    horizontalOffset = 0;
    verticalOffset = 0;

    if (position === 'bottom' && balloonRect.bottom > window.innerHeight - padding) {
      adjustedPosition = 'top';
    } else if (position === 'top' && balloonRect.top < padding) {
      adjustedPosition = 'bottom';
    }

    requestAnimationFrame(() => {
      if (!balloonElement) {
        return;
      }

      const newBalloonRect = balloonElement.getBoundingClientRect();

      if (newBalloonRect.left < padding) {
        horizontalOffset = padding - newBalloonRect.left;
      } else if (newBalloonRect.right > window.innerWidth - padding) {
        horizontalOffset = window.innerWidth - padding - newBalloonRect.right;
      }

      if (newBalloonRect.top < padding) {
        verticalOffset = padding - newBalloonRect.top;
      } else if (newBalloonRect.bottom > window.innerHeight - padding) {
        verticalOffset = window.innerHeight - padding - newBalloonRect.bottom;
      }

      requestAnimationFrame(() => {
        updatePointerPath();
      });
    });
  }

  function updatePointerPath() {
    if (!balloonElement || !containerElement) {
      return;
    }

    const containerRect = containerElement.getBoundingClientRect();
    const balloonRect = balloonElement.getBoundingClientRect();

    const anchorX = containerRect.width / 2;
    const anchorY = adjustedPosition === 'bottom' ? containerRect.height : 0;

    const balloonLeft = balloonRect.left - containerRect.left;
    const balloonRight = balloonRect.right - containerRect.left;
    const balloonCenter = (balloonLeft + balloonRight) / 2;
    const borderOverlap = 3;
    const connectionYBase =
      adjustedPosition === 'bottom'
        ? balloonRect.top - containerRect.top + borderOverlap
        : balloonRect.top - containerRect.top + balloonRect.height - borderOverlap;
    const connectionY = Math.round(connectionYBase);

    const pointerWidth = 8;
    const pointerInset = 14;
    const pointerBias = anchorX < balloonCenter ? 16 : -16;
    const minConnectionX = balloonLeft + pointerInset + pointerWidth;
    const maxConnectionX = balloonRight - pointerInset - pointerWidth;
    const connectionCenterX =
      minConnectionX > maxConnectionX
        ? (balloonLeft + balloonRight) / 2
        : clamp(anchorX + pointerBias, minConnectionX, maxConnectionX);

    const leftX = connectionCenterX - pointerWidth;
    const rightX = connectionCenterX + pointerWidth;

    pointerFillPath = `
      M ${anchorX} ${anchorY}
      L ${leftX} ${connectionY}
      L ${rightX} ${connectionY}
      L ${anchorX} ${anchorY}
      Z
    `;
    pointerLeftPath = `M ${anchorX} ${anchorY} L ${leftX} ${connectionY}`;
    pointerRightPath = `M ${anchorX} ${anchorY} L ${rightX} ${connectionY}`;
  }
</script>

<svelte:window on:resize={handleWindowResize} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="balloon-container"
  bind:this={containerElement}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
>
  <!-- @slot default - Trigger element that shows help text on hover. -->
  <slot />
  {#if showBalloon && message}
    <svg class="pointer-svg" aria-hidden="true">
      <path d={pointerFillPath} fill="var(--system7-color-paper, #fff)" stroke="none" />
      <path
        d={pointerLeftPath}
        fill="none"
        stroke="var(--system7-color-ink, #000)"
        stroke-width="2"
      />
      <path
        d={pointerRightPath}
        fill="none"
        stroke="var(--system7-color-ink, #000)"
        stroke-width="2"
      />
    </svg>
    <div
      class="balloon {adjustedPosition}"
      bind:this={balloonElement}
      style="transform: translateX(calc(-50% + {horizontalOffset}px)) translateY({verticalOffset}px);"
    >
      {#if markdown}
        <div class="balloon-content markdown-content">{@html renderMarkdown(message)}</div>
      {:else}
        <div class="balloon-content">{message}</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .balloon-container {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .pointer-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    z-index: calc(var(--system7-z-tooltip, 10000) + 1);
    pointer-events: none;
  }

  .balloon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    z-index: var(--system7-z-tooltip, 10000);
    pointer-events: none;
    animation: fadeIn 0.2s ease-in;
    border-radius: 10px;
    border: 2px solid var(--system7-color-ink, #000);
    padding: 15px;
    box-sizing: border-box;
    max-width: min(64ch, calc(100vw - 50px));
    max-height: calc(100vh - 50px);
    overflow: auto;
    background-color: var(--system7-color-paper, #fff);
    box-shadow: 2px 2px 0 var(--system7-shadow-color, #000);
  }

  .balloon-content {
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  .balloon-content.markdown-content {
    white-space: normal;
  }

  .balloon-content.markdown-content :global(p) {
    margin: 0;
  }

  .balloon-content.markdown-content :global(p + p) {
    margin-top: 0.5em;
  }

  .balloon-content.markdown-content :global(ul),
  .balloon-content.markdown-content :global(ol) {
    margin: 0.4em 0;
    padding-left: 1.2em;
  }

  .balloon-content.markdown-content :global(code) {
    font-family: 'Monaco', 'Andale Mono', 'Courier New', monospace;
  }

  .balloon.bottom {
    top: calc(100% + 25px);
  }

  .balloon.top {
    bottom: calc(100% + 25px);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
