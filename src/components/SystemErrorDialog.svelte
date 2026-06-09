<script lang="ts">
  import bombIcon from '../assets/bomb-icon.png';
  import Button from './Button.svelte';

  /** Apology line shown next to the bomb icon. */
  export let message = 'Sorry, a system error occurred.';

  /** Optional secondary detail line (e.g. an error code or description). */
  export let detail = '';

  /** Label for the restart action button. */
  export let restartText = 'Restart';

  /** Callback fired when the restart button is clicked. */
  export let onrestart: (() => void) | undefined = undefined;

  function handleRestart() {
    if (onrestart) {
      onrestart();
    }
  }
</script>

<div class="s7-system-error" role="alert">
  <div class="error-row">
    <img src={bombIcon} alt="" class="bomb-icon" />
    <div class="error-text">
      <p class="headline dialog-text">{message}</p>
      {#if detail}
        <p class="detail dialog-text">{detail}</p>
      {/if}
    </div>
  </div>
  <div class="actions">
    <Button variant="primary" onclick={handleRestart}>{restartText}</Button>
  </div>
</div>

<style>
  .s7-system-error {
    box-sizing: border-box;
    background: var(--system7-color-paper, #fff);
    border: 2px solid var(--system7-color-ink, #000);
    /* Inner hairline echoes the classic System 7 alert frame. */
    box-shadow:
      inset 0 0 0 3px var(--system7-color-paper, #fff),
      inset 0 0 0 4px var(--system7-color-ink, #000);
    padding: 20px;
  }

  .error-row {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .bomb-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    image-rendering: pixelated;
  }

  .error-text {
    flex: 1;
    min-height: 48px;
  }

  .headline,
  .detail {
    margin: 0;
    line-height: 1.3;
  }

  .detail {
    margin-top: 8px;
    color: var(--system7-color-ink, #000);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
</style>
