<script lang="ts">
  import ExpandableSection from '../../src/components/ExpandableSection.svelte';

  export let label = 'Apple Extras';
  export let expanded = false;
  export let disabled = false;
</script>

<ExpandableSection {label} {expanded} {disabled}>
  <div class="nested-list">
    <div>About the MacOS</div>
    <div>Apple IR File Exchange</div>
    <div>Apple Video Player</div>
  </div>
</ExpandableSection>

<style>
  .nested-list {
    display: grid;
    gap: 2px;
  }
</style>
