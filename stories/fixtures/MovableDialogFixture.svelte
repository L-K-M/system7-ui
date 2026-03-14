<script lang="ts">
  import MovableDialog from '../../src/components/MovableDialog.svelte';

  export let title = 'Movable Dialog';
  export let width = '460px';
  export let focused = true;
</script>

<MovableDialog {title} {width} {focused}>
  <p class="dialog-text">Drag this dialog with mouse or touch input.</p>
</MovableDialog>
