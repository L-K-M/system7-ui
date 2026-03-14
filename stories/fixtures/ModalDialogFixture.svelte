<script lang="ts">
  import ModalDialog from '../../src/components/ModalDialog.svelte';

  export let width = '420px';
</script>

<ModalDialog {width}>
  <p class="dialog-text">Apply these scan settings to all hosts?</p>
</ModalDialog>
