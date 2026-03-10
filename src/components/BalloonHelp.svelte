<script lang="ts">
  export let message = '';
  export let position = 'bottom';
  export let delay = 1000;

  let showBalloon = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let containerElement: HTMLDivElement;
  let balloonElement: HTMLDivElement;
  let adjustedPosition = position;
  let horizontalOffset = 0;
  let verticalOffset = 0;

  const viewportPadding = 25;

  let pointerFillPath = '';
  let pointerLeftPath = '';
  let pointerRightPath = '';

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

    const connectionX = balloonRect.left + balloonRect.width / 2 - containerRect.left;
    const connectionY =
      adjustedPosition === 'bottom'
        ? balloonRect.top - containerRect.top + 2
        : balloonRect.top - containerRect.top + balloonRect.height - 2;

    const pointerWidth = 8;
    let xOffset = -30;
    if (balloonRect.left < 200) {
      xOffset = 30;
    }

    const leftX = connectionX - pointerWidth + xOffset;
    const rightX = connectionX + pointerWidth + xOffset;

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
  <slot />
  {#if showBalloon && message}
    <svg class="pointer-svg" aria-hidden="true">
      <path d={pointerFillPath} fill="white" stroke="none" />
      <path d={pointerLeftPath} fill="none" stroke="black" stroke-width="2" />
      <path d={pointerRightPath} fill="none" stroke="black" stroke-width="2" />
    </svg>
    <div
      class="balloon {adjustedPosition}"
      bind:this={balloonElement}
      style="transform: translateX(calc(-50% + {horizontalOffset}px)) translateY({verticalOffset}px);"
    >
      <div class="balloon-content">{message}</div>
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
    z-index: 10001;
    pointer-events: none;
  }

  .balloon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    pointer-events: none;
    animation: fadeIn 0.2s ease-in;
    border-radius: 10px;
    border: 2px solid #000;
    padding: 15px;
    box-sizing: border-box;
    max-width: min(420px, calc(100vw - 50px));
    max-height: calc(100vh - 50px);
    overflow: auto;
    background-color: #fff;
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 1);
  }

  .balloon-content {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
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
