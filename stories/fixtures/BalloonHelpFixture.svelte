<script lang="ts">
  import BalloonHelp from '../../src/components/BalloonHelp.svelte';

  export let message = 'Hover help content';
  export let position: 'top' | 'bottom' = 'bottom';
  export let delay = 250;
  export let markdown = false;
</script>

<BalloonHelp {message} {position} {delay} {markdown}>
  <button type="button" class="trigger">Hover target</button>
</BalloonHelp>

<style>
  .trigger {
    border: 1px solid #000;
    background: #fff;
    padding: 4px 12px;
    cursor: default;
  }
</style>
