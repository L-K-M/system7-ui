<script lang="ts">
  import Button from '../../src/components/Button.svelte';
  import TitleBar from '../../src/components/TitleBar.svelte';

  export let title = 'Macintosh HD';
  export let closable = true;
  export let shadeable = true;
  export let collapsible = true;
  export let focused = true;
  export let withActions = false;
  export let width = '420px';
</script>

<div class="s7-window-frame" style:width>
  {#if withActions}
    <TitleBar {title} {closable} {shadeable} {collapsible} {focused}>
      <svelte:fragment slot="actions">
        <Button>Done</Button>
      </svelte:fragment>
    </TitleBar>
  {:else}
    <TitleBar {title} {closable} {shadeable} {collapsible} {focused} />
  {/if}
</div>
