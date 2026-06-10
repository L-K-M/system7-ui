<script lang="ts">
  import MarkdownIt from 'markdown-it';

  /** Active notification items rendered in a stacked list. */
  export let notifications: { id: number; message: string; type: 'success' | 'error' | 'info' }[] =
    [];

  /** Enables Markdown rendering for each notification message when `true`. */
  export let markdown = false;

  /**
   * Optional dismiss callback. When provided, each notification renders a
   * close button and the callback receives the notification id to remove.
   */
  export let ondismiss: ((id: number) => void) | undefined = undefined;

  const markdownParser = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: true
  });

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
      console.error('Notification markdown render failed', error);
      return `<p>${escapeHtml(text)}</p>`;
    }
  }
</script>

{#each notifications as notification, index (notification.id)}
  <div
    class="notification {notification.type}"
    style="bottom: {20 + index * 70}px;"
    role={notification.type === 'error' ? 'alert' : 'status'}
  >
    <div class="notification-content">
      {#if markdown}
        {@html renderMarkdown(notification.message)}
      {:else}
        {notification.message}
      {/if}
    </div>
    {#if ondismiss}
      <button
        type="button"
        class="dismiss-button"
        aria-label="Dismiss notification"
        onclick={() => ondismiss?.(notification.id)}
      >
        <svg viewBox="0 0 10 10" width="10" height="10" focusable="false" aria-hidden="true">
          <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.5" />
          <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.5" />
        </svg>
      </button>
    {/if}
  </div>
{/each}

<style>
  .notification {
    position: fixed;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 300px;
    z-index: var(--system7-z-notification, 1000);
    pointer-events: none;
    animation: fadeIn 0.2s ease-in;
    border-radius: 10px;
    border: 2px solid var(--system7-color-ink, #000);
    padding: 15px;
    background-color: var(--system7-color-paper, #fff);
    box-shadow: 2px 2px 0 var(--system7-shadow-color, #000);
  }

  .notification.success {
    border-left: 4px solid var(--system7-color-success, #4caf50);
  }

  .notification.error {
    border-left: 4px solid var(--system7-color-error, #f44336);
  }

  .notification.info {
    border-left: 4px solid var(--system7-color-info, #2196f3);
  }

  .notification-content {
    flex: 1;
    overflow-wrap: break-word;
    hyphens: auto;
    white-space: pre-wrap;
  }

  .notification-content :global(p) {
    margin: 0;
  }

  .notification-content :global(p + p) {
    margin-top: 0.5em;
  }

  .notification-content :global(ul),
  .notification-content :global(ol) {
    margin: 0.4em 0;
    padding-left: 1.2em;
  }

  /* !important so the rule survives the `.s7-root *` font override in system7.css */
  .notification-content :global(code) {
    font-family: 'Monaco', 'Andale Mono', 'Courier New', monospace !important;
  }

  /* Close-box style dismiss control, matching the TextInput clear box. */
  .dismiss-button {
    pointer-events: auto;
    flex-shrink: 0;
    background: var(--system7-color-paper, #fff);
    border: 1px solid var(--system7-color-ink, #000);
    color: var(--system7-color-ink, #000);
    cursor: pointer;
    width: 16px;
    height: 16px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .dismiss-button:active {
    background: var(--system7-color-accent, #000);
    color: var(--system7-color-accent-text, #fff);
  }

  .dismiss-button:focus {
    outline: 1px dotted var(--system7-color-focus-ring, var(--system7-color-accent, #000));
    outline-offset: 1px;
  }

  .dismiss-button svg {
    display: block;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .notification {
      animation: none;
    }
  }
</style>
