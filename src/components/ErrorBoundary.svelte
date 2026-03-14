<script lang="ts">
  /** Message displayed when child content throws during render. */
  export let fallbackMessage = 'Something went wrong while rendering this view.';

  /** Optional callback fired when an error is captured. */
  export let onerror: ((error: unknown) => void) | undefined = undefined;

  function handleError(error: unknown) {
    if (onerror) {
      onerror(error);
    }
  }

  function getErrorMessage(error: unknown) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Unknown rendering error';
  }
</script>

<svelte:boundary onerror={handleError}>
  {#snippet failed(error, reset)}
    <div class="error-boundary" role="alert" aria-live="assertive">
      <p class="fallback-message">{fallbackMessage}</p>
      <p class="error-detail">{getErrorMessage(error)}</p>
      <button type="button" class="retry-button" onclick={reset}>Retry</button>
    </div>
  {/snippet}

  <!-- @slot default - Content protected by this boundary. -->
  <slot />
</svelte:boundary>

<style>
  .error-boundary {
    border: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
    padding: 8px;
    display: grid;
    gap: 6px;
    max-width: 100%;
  }

  .fallback-message,
  .error-detail {
    margin: 0;
  }

  .error-detail {
    font-family: 'Monaco', 'Andale Mono', 'Courier New', monospace;
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  .retry-button {
    justify-self: start;
    border: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
    padding: 2px 8px;
    color: var(--system7-color-ink, #000);
    cursor: pointer;
  }

  .retry-button:active {
    background: var(--system7-color-accent, #000);
    color: var(--system7-color-accent-text, #fff);
  }
</style>
