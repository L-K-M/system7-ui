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

  /** Input callback fired on every value change while typing. */
  export let oninput: ((value: string, e: Event) => void) | undefined = undefined;

  /** Change callback fired when the value is committed (blur/Enter). */
  export let onchange: ((value: string, e: Event) => void) | undefined = undefined;

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
</script>

<input
  class="sys7-text-input"
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

<style>
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
</style>
