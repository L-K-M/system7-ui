<script lang="ts">
  export let value = 0;
  export let max = 100;
  export let height = 18;
  export let title = '';
  export let ariaLabel = 'Progress';

  $: safeMax = max > 0 ? max : 1;
  $: clampedValue = Math.min(Math.max(value, 0), safeMax);
  $: percent = (clampedValue / safeMax) * 100;
</script>

<div
  class="sys7-progress"
  role="progressbar"
  {title}
  aria-label={ariaLabel}
  aria-valuemin={0}
  aria-valuemax={safeMax}
  aria-valuenow={Math.round(clampedValue)}
  style={`height: ${height}px;`}
>
  <div class="fill" style={`width: ${percent}%;`}></div>
</div>

<style>
  .sys7-progress {
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    border: 1.5px solid #000;
    background: #bdc7ff;
  }

  .fill {
    height: 100%;
    position: relative;
    background: #7a7a7a;
  }
</style>
