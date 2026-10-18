<script lang="ts">
  import { onMount, tick } from 'svelte';
  import ErrorBoundary from './ErrorBoundary.svelte';
  import frameParts from '../assets/modal_frame_parts.png';
  import { trapFocus } from '../focus-trap';

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

  function handleDialogKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Tab') {
      trapFocus(dialogElement, e);
    }
    e.stopPropagation();
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
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') close();
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
    onkeydown={handleDialogKeydown}
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
    box-sizing: border-box;
    /* Keeps the dialog clear of the notch, status bar and gesture bar. The insets are 0 on
       desktop, so the layout there is unchanged. */
    padding: var(--system7-safe-area-top, env(safe-area-inset-top, 0px))
      var(--system7-safe-area-right, env(safe-area-inset-right, 0px))
      var(--system7-safe-area-bottom, env(safe-area-inset-bottom, 0px))
      var(--system7-safe-area-left, env(safe-area-inset-left, 0px));
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

  /* On touch screens the dialog is limited to the safe area and its content scrolls. Desktop
     dialogs grow with their content instead, because a scrolling body would clip popovers such
     as BalloonHelp that reach past it. */
  @media (pointer: coarse) {
    /* The width prop sizes the content box, so the limits subtract the 32px frame on each side
       and a narrow or short viewport shrinks the dialog instead of cutting off its frame. The
       column lets the content shrink below its height so it can scroll. */
    .s7-fixed-dialog {
      display: flex;
      flex-direction: column;
      max-width: calc(100% - 64px);
      max-height: calc(100% - 64px);
    }

    /* Content such as the ConfirmDialog button row reaches up to 10px past the 4px padding into
       the frame's white inner band; the negative margin moves the scroll clip edge 12px into that
       band so the overhang is neither clipped nor scrollable, while the padding keeps the content
       box exactly where a 4px padding puts it. */
    .s7-dialog-content {
      min-height: 0;
      overflow: auto;
      margin: -12px;
      padding: 16px;
    }
  }
</style>
