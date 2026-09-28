<script lang="ts">
  import ModalDialog from '../../src/components/ModalDialog.svelte';

  export let width = '420px';
  export let extraLines = 0;

  $: lines = Array.from(
    { length: extraLines },
    (_, index) => `Host ${index + 1}: 10.0.0.${index + 1}`
  );
</script>

<ModalDialog {width}>
  <p class="dialog-text">Apply these scan settings to all hosts?</p>
  {#each lines as line (line)}
    <p class="dialog-text">{line}</p>
  {/each}
</ModalDialog>
