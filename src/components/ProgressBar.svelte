<script lang="ts">
  /** Current progress value. Clamped between `0` and `max`. */
  export let value = 0;

  /** Maximum progress value. Values less than or equal to `0` are treated as `1`. */
  export let max = 100;

  /** Progress bar height in CSS pixels. */
  export let height = 18;

  /** Optional native tooltip text shown on hover. */
  export let title = '';

  /** Accessible label announced by assistive technologies. */
  export let ariaLabel = 'Progress';

  /**
   * Shows the classic System 7 barber-pole animation for unknown progress.
   * `value`/`max` are ignored while `true`.
   */
  export let indeterminate = false;

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
  aria-valuenow={indeterminate ? undefined : Math.round(clampedValue)}
  style={`height: ${height}px;`}
>
  {#if indeterminate}
    <div class="fill indeterminate"></div>
  {:else}
    <div class="fill" style={`width: ${percent}%;`}></div>
  {/if}
</div>

<style>
  .sys7-progress {
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    border: 1.5px solid var(--system7-color-ink, #000);
    background: var(--system7-color-progress-track, #bdc7ff);
  }

  .fill {
    height: 100%;
    position: relative;
    background: var(--system7-color-progress-fill, #7a7a7a);
  }

  .fill.indeterminate {
    width: 100%;
    background: repeating-linear-gradient(
      -45deg,
      var(--system7-color-progress-fill, #7a7a7a) 0 8px,
      var(--system7-color-progress-track, #bdc7ff) 8px 16px
    );
    /* One stripe period (16px along the gradient axis) projected onto the
       x-axis at 45 degrees: 16 * sqrt(2) ~= 22.63px. */
    animation: sys7-barber-pole 0.6s linear infinite;
  }

  @keyframes sys7-barber-pole {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 22.63px 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fill.indeterminate {
      animation: none;
    }
  }
</style>
