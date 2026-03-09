<script lang="ts">
  export let checked = false;
  export let disabled = false;
  export let id = '';
  export let name = '';
  export let value = '';
  export let label = '';
  export let onchange: ((value: string, e: Event) => void) | undefined = undefined;

  function handleChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    checked = target.checked;
    if (onchange && checked) {
      onchange(target.value, e);
    }
  }
</script>

<label class="sys7-radio" class:disabled>
  <input type="radio" {id} {name} {value} {disabled} checked={checked} onchange={handleChange} />
  <span class="dot" aria-hidden="true"></span>
  <span class="label-text"><slot>{label}</slot></span>
</label>

<style>
  .sys7-radio {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .sys7-radio input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    pointer-events: none;
  }

  .sys7-radio .dot {
    width: 16px;
    height: 16px;
    border: 1.5px solid #000;
    border-radius: 999px;
    background: #fff;
    position: relative;
    flex-shrink: 0;
  }

  .sys7-radio .dot::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 4px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #000;
    opacity: 0;
  }

  .sys7-radio input:checked + .dot::after {
    opacity: 1;
  }

  .sys7-radio input:focus + .dot {
    outline: 1px dotted #000;
    outline-offset: 2px;
  }

  .sys7-radio.disabled {
    cursor: default;
    color: #888;
  }

  .sys7-radio.disabled .dot {
    border-color: #888;
  }

  .sys7-radio.disabled .dot::after {
    background: #888;
  }
</style>
