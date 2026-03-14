<script lang="ts">
  export let Story: any;
</script>

<div class="s7-root story-root">
  <svelte:component this={Story} />
</div>

<style>
  .story-root {
    min-width: min(92vw, 980px);
    min-height: 180px;
    padding: 20px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #8dc0cc 0%, #6498ad 100%);
  }
</style>
