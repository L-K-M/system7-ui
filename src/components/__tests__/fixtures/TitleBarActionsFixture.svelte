<script lang="ts">
  import TitleBar from '../../TitleBar.svelte';

  export let closable = false;
  export let shadeable = false;
  export let collapsible = false;
  export let draggable = false;
  export let ondragstart: ((e: MouseEvent | TouchEvent) => void) | undefined = undefined;
  export let onaction: (() => void) | undefined = undefined;
</script>

<TitleBar title="Window" {closable} {shadeable} {collapsible} {draggable} {ondragstart}>
  <button slot="actions" type="button" onclick={onaction}>Settings</button>
</TitleBar>
