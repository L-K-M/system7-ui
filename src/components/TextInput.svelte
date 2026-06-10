<script lang="ts">
  /** Current input value. Supports two-way binding with `bind:value`. */
  export let value = '';

  /** Native input type. */
  export let type: 'text' | 'password' | 'email' | 'search' | 'url' | 'tel' = 'text';

  /** Disables the input when `true`. */
  export let disabled = false;

  /** Makes the input read-only when `true`. */
  export let readonly = false;

  /** Optional id passed to the underlying input element. */
  export let id = '';

  /** Optional name used for form submissions. */
  export let name = '';

  /** Placeholder text shown when the input is empty. */
  export let placeholder = '';

  /** Tooltip text shown by the browser on hover. */
  export let title = '';

  /** Accessible label for inputs without a visible `<label>`. */
  export let ariaLabel = '';

  /**
   * Shows a System 7 close-box style clear control while the field has
   * content. Hidden when the field is empty, disabled, or read-only.
   */
  export let clearable = false;

  /** Input callback fired on every value change while typing. */
  export let oninput: ((value: string, e: Event) => void) | undefined = undefined;

  /** Change callback fired when the value is committed (blur/Enter). */
  export let onchange: ((value: string, e: Event) => void) | undefined = undefined;

  /** Callback fired after the clear control empties the field. */
  export let onclear: (() => void) | undefined = undefined;

  let inputElement: HTMLInputElement | null = null;

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    value = target.value;
    if (oninput) {
      oninput(target.value, e);
    }
  }

  function handleChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    if (onchange) {
      onchange(target.value, e);
    }
  }

  function handleClear() {
    value = '';
    inputElement?.focus();
    if (onclear) {
      onclear();
    }
  }

  $: showClear = clearable && value !== '' && !disabled && !readonly;
</script>

<span class="sys7-text-input-wrap">
  <input
    bind:this={inputElement}
    class="sys7-text-input"
    class:has-clear={showClear}
    {type}
    {id}
    {name}
    {placeholder}
    {disabled}
    {readonly}
    {title}
    aria-label={ariaLabel || undefined}
    {value}
    oninput={handleInput}
    onchange={handleChange}
  />
  {#if showClear}
    <button type="button" class="clear-button" aria-label="Clear text" onclick={handleClear}>
      <svg viewBox="0 0 10 10" width="10" height="10" focusable="false" aria-hidden="true">
        <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.5" />
        <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </button>
  {/if}
</span>

<style>
  .sys7-text-input-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    max-width: 100%;
  }

  .sys7-text-input {
    box-sizing: border-box;
    padding: 4px 6px;
    border: 1px solid var(--system7-color-ink, #000);
    border-radius: 0;
    background: var(--system7-color-paper, #fff);
    color: var(--system7-color-ink, #000);
    font-family: inherit;
    font-size: inherit;
    outline: none;
  }

  .sys7-text-input:focus {
    outline: 1px dotted var(--system7-color-focus-ring, var(--system7-color-accent, #000));
    outline-offset: 1px;
  }

  .sys7-text-input::placeholder {
    color: var(--system7-color-disabled-ink, #808080);
    opacity: 1;
  }

  .sys7-text-input:disabled {
    color: var(--system7-color-disabled-ink, #808080);
    border-color: var(--system7-color-disabled-ink, #808080);
    cursor: default;
  }

  .sys7-text-input::selection {
    background: var(--system7-color-highlight, #000);
    color: var(--system7-color-highlight-text, #fff);
  }

  .sys7-text-input.has-clear {
    padding-right: 24px;
  }

  /* Close-box style clear control, in the spirit of the title bar close
     box and the Newton MessagePad's clear box. */
  .clear-button {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
    color: var(--system7-color-ink, #000);
    cursor: pointer;
  }

  .clear-button:active {
    background: var(--system7-color-accent, #000);
    color: var(--system7-color-accent-text, #fff);
  }

  .clear-button:focus {
    outline: 1px dotted var(--system7-color-focus-ring, var(--system7-color-accent, #000));
    outline-offset: 1px;
  }

  .clear-button svg {
    display: block;
  }
</style>
