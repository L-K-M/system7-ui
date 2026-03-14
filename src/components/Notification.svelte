<script lang="ts">
  import MarkdownIt from 'markdown-it';

  /** Active notification items rendered in a stacked list. */
  export let notifications: { id: number; message: string; type: 'success' | 'error' | 'info' }[] =
    [];

  /** Enables Markdown rendering for each notification message when `true`. */
  export let markdown = false;

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

{#each notifications as notification (notification.id)}
  <div
    class="notification {notification.type}"
    style="bottom: {20 + notifications.indexOf(notification) * 70}px;"
    role="alert"
    aria-live="polite"
  >
    <div class="notification-content">
      {#if markdown}
        {@html renderMarkdown(notification.message)}
      {:else}
        {notification.message}
      {/if}
    </div>
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

  .notification-content :global(code) {
    font-family: 'Monaco', 'Andale Mono', 'Courier New', monospace;
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
