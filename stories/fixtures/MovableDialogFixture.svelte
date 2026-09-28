<script lang="ts">
  import MovableDialog from '../../src/components/MovableDialog.svelte';

  export let title = 'Movable Dialog';
  export let width = '460px';
  export let focused = true;
  export let extraLines = 0;

  $: lines = Array.from({ length: extraLines }, (_, index) => `Setting line ${index + 1}`);
</script>

<MovableDialog {title} {width} {focused}>
  <p class="dialog-text">Drag this dialog with mouse or touch input.</p>
  {#each lines as line (line)}
    <p class="dialog-text">{line}</p>
  {/each}
</MovableDialog>
