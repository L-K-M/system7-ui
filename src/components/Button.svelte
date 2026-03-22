<script lang="ts">
  type ButtonVariant = 'default' | 'primary' | 'icon';

  /**
   * Visual style variant.
   *
   * - `default`: standard button
   * - `primary`: emphasized action with outer border
   * - `icon`: icon-only button
   */
  export let variant: ButtonVariant = 'default';

  /** Whether the button is disabled. */
  export let disabled = false;

  /** Native button type attribute. */
  export let type: 'button' | 'submit' | 'reset' = 'button';

  /** Tooltip text shown by the browser on hover. */
  export let title = '';

  /** Click handler called when the button is activated. */
  export let onclick: ((e: MouseEvent) => void) | undefined = undefined;
</script>

{#if variant === 'primary'}
  <div class="primary-border" class:disabled>
    <button class="sys7-btn" {disabled} {title} {type} {onclick}>
      <!-- @slot default - Button label text or icon content. -->
      <slot />
    </button>
  </div>
{:else}
  <button class="sys7-btn" class:icon-btn={variant === 'icon'} {disabled} {title} {type} {onclick}>
    <!-- @slot default - Button label text or icon content. -->
    <slot />
  </button>
{/if}

<style>
  .primary-border {
    display: inline-block;
    border: 3px solid var(--system7-color-ink, #000);
    border-radius: 10px;
    padding: 2px;
    margin-top: -4px;
    margin-bottom: -4px;
  }

  .primary-border.disabled {
    border-color: var(--system7-color-ink, #000);
  }

  .sys7-btn {
    background: var(--system7-color-paper, #fff);
    border: 1.5px solid var(--system7-color-ink, #000);
    padding: 4px 20px 3px;
    font-family: inherit;
    cursor: pointer;
    border-radius: 6px;
    transition: none;
    position: relative;
  }

  .sys7-btn:active:not(:disabled) {
    background: var(--system7-color-accent, #000);
    color: var(--system7-color-accent-text, #fff);
  }

  .sys7-btn:disabled {
    color: var(--system7-color-disabled-ink, #808080);
    cursor: default;
  }

  .icon-btn {
    border: none !important;
    background: transparent !important;
    padding: 2px !important;
    min-width: 20px;
    cursor: pointer;
  }

  .icon-btn:hover {
    opacity: 0.7;
  }

  .icon-btn:active {
    opacity: 0.5;
  }

  .icon-btn :global(img) {
    width: 16px;
    height: 16px;
    display: block;
  }
</style>
