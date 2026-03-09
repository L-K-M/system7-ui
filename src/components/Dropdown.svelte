<script lang="ts">
  interface DropdownOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  export let options: DropdownOption[] = [];
  export let value = '';
  export let disabled = false;
  export let id = '';
  export let name = '';
  export let title = '';
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
    {#each options as option}
      <option value={option.value} disabled={option.disabled}>{option.label}</option>
    {/each}
  </select>
  <span class="arrow" aria-hidden="true"></span>
</div>

<style>
  .sys7-dropdown {
    position: relative;
    display: inline-block;
    border: 1.5px solid #000;
    box-shadow: 2px 2px 0 #000;
    background: #fff;
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
    outline: 1px dotted #000;
    outline-offset: -3px;
  }

  .sys7-dropdown .arrow {
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 22px;
    height: 100%;
    background: #fff;
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
    border-top: 5px solid #000;
  }

  .sys7-dropdown.disabled {
    border-color: #888;
    box-shadow: none;
  }

  .sys7-dropdown.disabled select {
    color: #888;
    cursor: default;
  }

  .sys7-dropdown.disabled .arrow {
    background: #f3f3f3;
  }

  .sys7-dropdown.disabled::after {
    background: #888;
  }

  .sys7-dropdown.disabled .arrow::before {
    border-top-color: #888;
  }
</style>
