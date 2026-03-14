<script lang="ts">
  import CloseIcon from './CloseIcon.svelte';

  /** Error text rendered in the banner body. */
  export let message = '';

  /** Callback fired when the dismiss button is activated. */
  export let onclose: (() => void) | undefined = undefined;
</script>

<div class="error-banner" role="alert" aria-live="assertive">
  <span class="error-icon">⚠️</span>
  <span class="message-text">{message}</span>
  <button class="close-error" onclick={onclose} aria-label="Close error">
    <CloseIcon alt="" size={14} />
  </button>
</div>

<style>
  .error-banner {
    background: var(--system7-color-accent, #000);
    color: var(--system7-color-accent-text, #fff);
    padding: 8px;
    margin: 8px 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .message-text {
    overflow-wrap: anywhere;
  }

  .close-error {
    margin-left: auto;
    background: none;
    border: 1px solid var(--system7-color-accent-text, #fff);
    color: var(--system7-color-accent-text, #fff);
    cursor: pointer;
    width: 20px;
    height: 20px;
    padding: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .close-error :global(img) {
    filter: var(--system7-close-icon-filter, invert(1));
  }
</style>
