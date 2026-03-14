<script lang="ts">
  interface DropdownOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  /** Select options shown in the dropdown list. */
  export let options: DropdownOption[] = [];

  /** Currently selected option value. Supports two-way binding with `bind:value`. */
  export let value = '';

  /** Disables the select when `true`. */
  export let disabled = false;

  /** Optional id passed to the underlying select element. */
  export let id = '';

  /** Optional name used for form submissions. */
  export let name = '';

  /** Tooltip text shown by the browser on hover. */
  export let title = '';

  /** Change callback fired after a new option is selected. */
  export let onchange: ((value: string, e: Event) => void) | undefined = undefined;

  function handleChange(e: Event) {
    const target = e.currentTarget as HTMLSelectElement;
    value = target.value;
    if (onchange) {
      onchange(target.value, e);
    }
  }
</script>

<div class="sys7-dropdown" class:disabled>
  <select {id} {name} {title} {disabled} bind:value onchange={handleChange}>
    {#each options as option (option.value)}
      <option value={option.value} disabled={option.disabled}>{option.label}</option>
    {/each}
  </select>
  <span class="arrow" aria-hidden="true"></span>
</div>

<style>
  .sys7-dropdown {
    position: relative;
    display: inline-block;
    border: 1.5px solid var(--system7-color-ink, #000);
    box-shadow: 2px 2px 0 var(--system7-shadow-color, #000);
    background: var(--system7-color-paper, #fff);
    min-width: 180px;
  }

  .sys7-dropdown select {
    appearance: none;
    -webkit-appearance: none;
    border: none;
    background: transparent;
    padding: 1px 30px 0 7px;
    font-family: 'Sysfont', 'Chicago', 'Impact', sans-serif !important;
    font-size: 18px;
    line-height: 1;
    width: 100%;
    margin: 0;
    cursor: pointer;
    border-radius: 0;
    min-height: 21px;
  }

  .sys7-dropdown select:focus {
    outline: 1px dotted var(--system7-color-focus-ring, var(--system7-color-accent, #000));
    outline-offset: -3px;
  }

  .sys7-dropdown .arrow {
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 22px;
    height: 100%;
    background: var(--system7-color-paper, #fff);
    z-index: 3;
  }

  .sys7-dropdown .arrow::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -30%);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 5px solid var(--system7-color-ink, #000);
  }

  .sys7-dropdown.disabled {
    border-color: var(--system7-color-disabled-ink, #808080);
    box-shadow: 2px 2px 0 var(--system7-color-disabled-ink, #808080);
  }

  .sys7-dropdown.disabled select {
    color: var(--system7-color-disabled-ink, #808080);
    cursor: default;
  }

  .sys7-dropdown.disabled .arrow::before {
    border-top-color: var(--system7-color-disabled-ink, #808080);
  }
</style>
