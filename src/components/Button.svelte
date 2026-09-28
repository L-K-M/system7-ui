<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type ButtonVariant = 'default' | 'primary' | 'icon';

  /*
   * The props type published in the package's .d.ts. Without it, `$$restProps` makes svelte2tsx
   * type the props as `[x: string]: any` and drop every prop's documentation. `class` is left out
   * because the component always sets its own. Keep the docs in step with the `export let` lines
   * below.
   */
  interface $$Props extends Omit<HTMLButtonAttributes, 'class'> {
    /**
     * Visual style variant.
     *
     * - `default`: standard button
     * - `primary`: emphasized action with outer border
     * - `icon`: icon-only button
     */
    variant?: ButtonVariant;

    /** Whether the button is disabled. */
    disabled?: boolean;

    /** Native button type attribute. */
    type?: 'button' | 'submit' | 'reset';

    /** Tooltip text shown by the browser on hover. */
    title?: string;

    /** Click handler called when the button is activated. */
    onclick?: ((e: MouseEvent) => void) | undefined;
  }

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

<!--
  Other attributes (aria-*, data-*, name, value, form, event handlers such as onfocus) go to the
  native <button>. They are spread first so the attributes written after them win: `class` stays
  under the component's control and cannot drop its styling hooks.
-->
{#if variant === 'primary'}
  <div class="primary-border" class:disabled>
    <button {...$$restProps} class="sys7-btn" {disabled} {title} {type} {onclick}>
      <!-- @slot default - Button label text or icon content. -->
      <slot />
    </button>
  </div>
{:else}
  <button
    {...$$restProps}
    class="sys7-btn"
    class:icon-btn={variant === 'icon'}
    {disabled}
    {title}
    {type}
    {onclick}
  >
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

  /* Hover only where a pointer can hover, so a tap does not leave the button dimmed. */
  @media (hover: hover) {
    .icon-btn:hover {
      opacity: 0.7;
    }
  }

  .icon-btn:active {
    opacity: 0.5;
  }

  .icon-btn :global(img) {
    width: 16px;
    height: 16px;
    display: block;
  }

  /* Grows the touch target of icon buttons to at least 44px each way without changing the layout
     or how the button looks. */
  @media (pointer: coarse) {
    .icon-btn::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      min-width: 44px;
      height: 100%;
      min-height: 44px;
      transform: translate(-50%, -50%);
    }
  }
</style>
