<script lang="ts">
  import MarkdownIt from 'markdown-it';

  export let notifications: { id: number; message: string; type: 'success' | 'error' | 'info' }[] = [];
  export let markdown = false;

  const markdownParser = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: true
  });

  function renderMarkdown(text: string) {
    return markdownParser.render(text);
  }
</script>

{#each notifications as notification (notification.id)}
  <div
    class="notification notification-{notification.type}"
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
    z-index: 10000;
    pointer-events: none;
    animation: fadeIn 0.2s ease-in;
    border-radius: 10px;
    border: 2px solid #000;
    padding: 15px;
    background-color: #fff;
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 1);
  }

  .notification.success {
    border-left: 4px solid #4caf50;
  }

  .notification.error {
    border-left: 4px solid #f44336;
  }

  .notification.info {
    border-left: 4px solid #2196f3;
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
