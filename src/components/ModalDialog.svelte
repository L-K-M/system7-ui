<script lang="ts">
  import { onMount, tick } from 'svelte';
  import ErrorBoundary from './ErrorBoundary.svelte';
  import frameParts from '../assets/modal_frame_parts.png';

  /** CSS width value applied to the modal frame. */
  export let width = '400px';

  /** Callback fired when the backdrop is activated to close the modal. */
  export let onclose: (() => void) | undefined = undefined;

  let triggerElement: HTMLElement | null = null;
  let dialogElement: HTMLDivElement;

  function close() {
    if (onclose) {
      onclose();
    }
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
</script>

<div
  class="s7-backdrop"
  onclick={close}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') close();
  }}
  role="button"
  tabindex="0"
  aria-label="Close modal"
>
  <div
    bind:this={dialogElement}
    class="s7-fixed-dialog"
    style="width: {width}; border-image-source: url({frameParts});"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="s7-dialog-content">
      <ErrorBoundary fallbackMessage="Unable to render modal content.">
        <!-- @slot default - Modal body content. -->
        <slot />
      </ErrorBoundary>
    </div>
  </div>
</div>

<style>
  .s7-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--system7-overlay-soft, rgba(0, 0, 0, 0.1));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--system7-z-dialog, 100);
  }

  .s7-fixed-dialog {
    position: relative;
    background: var(--system7-color-paper, #fff);
    border: 32px solid transparent;
    border-image-slice: 32 fill;
    border-image-repeat: repeat;
    outline: none;
  }

  .s7-fixed-dialog:focus {
    outline: none;
  }

  .s7-dialog-content {
    padding: 4px;
  }
</style>
