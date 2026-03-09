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
  <span class="icon-wrap" aria-hidden="true">
    <svg class="dot" viewBox="0 0 16 16" width="16" height="16" focusable="false">
      <circle
        cx="8"
        cy="8"
        r="7.25"
        fill="#fff"
        stroke={disabled ? '#888' : '#000'}
        stroke-width="1.5"
      />
      {#if checked}
        <circle cx="8" cy="8" r="4.5" fill={disabled ? '#888' : '#000'} />
      {/if}
    </svg>
  </span>
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

  .sys7-radio .icon-wrap {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .sys7-radio .dot {
    display: block;
    width: 16px;
    height: 16px;
  }

  .sys7-radio input:focus + .icon-wrap {
    outline: 1px dotted #000;
    outline-offset: 2px;
  }

  .sys7-radio.disabled {
    cursor: default;
    color: #888;
  }

</style>
