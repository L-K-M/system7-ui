<script lang="ts">
  export let checked = false;
  export let disabled = false;
  export let id = '';
  export let name = '';
  export let value = 'on';
  export let label = '';
  export let onchange: ((checked: boolean, e: Event) => void) | undefined = undefined;

  function handleChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    checked = target.checked;
    if (onchange) {
      onchange(checked, e);
    }
  }
</script>

<label class="sys7-checkbox" class:disabled>
  <input type="checkbox" {id} {name} {value} {disabled} bind:checked onchange={handleChange} />
  <span class="icon-wrap" aria-hidden="true">
    <svg class="box" viewBox="0 0 16 16" width="16" height="16" focusable="false">
      <rect
        x="0.75"
        y="0.75"
        width="14.5"
        height="14.5"
        fill="#fff"
        stroke={disabled ? '#888' : '#000'}
        stroke-width="1.5"
      />
      {#if checked}
        <line
          x1="0.75"
          y1="0.75"
          x2="15.25"
          y2="15.25"
          stroke={disabled ? '#888' : '#000'}
          stroke-width="1.5"
          stroke-linecap="square"
        />
        <line
          x1="15.25"
          y1="0.75"
          x2="0.75"
          y2="15.25"
          stroke={disabled ? '#888' : '#000'}
          stroke-width="1.5"
          stroke-linecap="square"
        />
      {/if}
    </svg>
  </span>
  <span class="label-text"><slot>{label}</slot></span>
</label>

<style>
  .sys7-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .sys7-checkbox input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    pointer-events: none;
  }

  .sys7-checkbox .icon-wrap {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .sys7-checkbox .box {
    display: block;
    width: 16px;
    height: 16px;
  }

  .sys7-checkbox input:focus + .icon-wrap {
    outline: 1px dotted #000;
    outline-offset: 2px;
  }

  .sys7-checkbox.disabled {
    cursor: default;
    color: #888;
  }

</style>
