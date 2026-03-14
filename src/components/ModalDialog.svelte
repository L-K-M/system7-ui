<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import frameParts from '../assets/modal_frame_parts.png';

  export let width = '400px';
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
  class="backdrop"
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
    class="fixed-dialog"
    style="width: {width}; border-image-source: url({frameParts});"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="dialog-content">
      <slot />
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .fixed-dialog {
    position: relative;
    background: #fff;
    border: 32px solid transparent;
    border-image-slice: 32 fill;
    border-image-repeat: repeat;
    outline: none;
  }

  .fixed-dialog:focus {
    outline: none;
  }

  .dialog-content {
    padding: 4px;
  }
</style>
