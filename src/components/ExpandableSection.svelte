<script lang="ts">
  import disclosureTriangleDown from '../assets/disclosure_triangle_down.svg';
  import disclosureTriangleRight from '../assets/disclosure_triangle_right.svg';

  /** Whether the section is expanded, showing its content. */
  export let expanded = false;

  /** Label text shown next to the disclosure triangle. */
  export let label = '';

  /** Disables user interaction when true. */
  export let disabled = false;

  /** Callback fired when expanded state changes. */
  export let onchange: ((expanded: boolean) => void) | undefined = undefined;

  function toggle() {
    if (disabled) return;
    expanded = !expanded;
    onchange?.(expanded);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }
</script>

<div class="s7-expandable" class:disabled>
  <button
    type="button"
    class="disclosure-trigger"
    onclick={toggle}
    onkeydown={handleKeydown}
    aria-expanded={expanded}
    aria-disabled={disabled}
    {disabled}
  >
    <img
      class="triangle"
      src={expanded ? disclosureTriangleDown : disclosureTriangleRight}
      alt=""
      aria-hidden="true"
      width="9"
      height="9"
      draggable="false"
    />
    <span class="label">{label}</span>
  </button>

  {#if expanded}
    <div class="content">
      <slot />
    </div>
  {/if}
</div>

<style>
  .s7-expandable {
    display: flex;
    flex-direction: column;
  }

  .s7-expandable.disabled {
    color: #888;
  }

  .disclosure-trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    text-align: left;
  }

  .disclosure-trigger:disabled {
    cursor: default;
  }

  .disclosure-trigger:focus {
    outline: 1px dotted #000;
    outline-offset: 2px;
  }

  .triangle {
    flex-shrink: 0;
    image-rendering: pixelated;
  }

  .s7-expandable.disabled .triangle {
    opacity: 0.6;
  }

  .label {
    white-space: nowrap;
  }

  .content {
    margin-left: 15px;
    margin-top: 4px;
  }
</style>
