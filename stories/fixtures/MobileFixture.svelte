<script lang="ts">
  import Button from '../../src/components/Button.svelte';
  import Checkbox from '../../src/components/Checkbox.svelte';
  import CopyIcon from '../../src/components/CopyIcon.svelte';
  import DataTable from '../../src/components/DataTable.svelte';
  import TextInput from '../../src/components/TextInput.svelte';
  import TitleBar from '../../src/components/TitleBar.svelte';

  /** Stands in for the status bar inset a phone reports through env(safe-area-inset-top). */
  export let safeAreaTop = 24;
  export let primaryFontSize = '24px';
  export let secondaryFontSize = '16px';
  export let cellPadding = '12px 8px';

  const columns = [
    { key: 'text', label: 'Text' },
    { key: 'copy', label: 'Copy', width: '52px' }
  ];

  const entries = [
    { id: 1, text: 'Meeting moved to 3pm', meta: 'Just now', pinned: true },
    {
      id: 2,
      text: 'https://example.com/a/very/long/link/that/keeps/going',
      meta: '2 min ago',
      pinned: false
    },
    { id: 3, text: 'Order #10442', meta: 'Yesterday', pinned: true },
    { id: 4, text: 'Remember to back up the System Folder', meta: 'Mon', pinned: false },
    { id: 5, text: 'SimpleText draft', meta: 'Sep 12', pinned: false }
  ];

  let filter = '';
  let pinnedOnly = false;

  $: visibleEntries = entries.filter(
    (entry) =>
      (!pinnedOnly || entry.pinned) && entry.text.toLowerCase().includes(filter.toLowerCase())
  );
</script>

<div
  class="phone"
  style:--system7-safe-area-top={`${safeAreaTop}px`}
  style:--system7-font-size={primaryFontSize}
  style:--system7-table-cell-padding={cellPadding}
>
  <div class="s7-window-frame window">
    <TitleBar title="Clipboard">
      <svelte:fragment slot="actions">
        <Button>Done</Button>
      </svelte:fragment>
    </TitleBar>

    <div class="toolbar">
      <div class="filter">
        <TextInput
          bind:value={filter}
          clearable
          ariaLabel="Filter entries"
          placeholder="Filter"
          inputmode="search"
          enterkeyhint="search"
          autocapitalize="off"
        />
      </div>
      <Checkbox bind:checked={pinnedOnly} label="Pinned" />
    </div>

    <DataTable {columns} showHeader={false} empty={visibleEntries.length === 0}>
      {#each visibleEntries as entry (entry.id)}
        <tr>
          <td>
            <div class="entry-text">{entry.text}</div>
            <div class="entry-meta" style:--system7-font-size={secondaryFontSize}>
              {entry.meta}
            </div>
          </td>
          <td>
            <Button variant="icon" aria-label={`Copy ${entry.text}`}>
              <CopyIcon alt="" />
            </Button>
          </td>
        </tr>
      {/each}
    </DataTable>
  </div>
</div>

<style>
  /* A 360px phone screen. The top padding is the safe area a real app pads with the same token. */
  .phone {
    display: flex;
    flex-direction: column;
    width: 360px;
    height: 640px;
    box-sizing: border-box;
    padding-top: var(--system7-safe-area-top);
    background: var(--system7-color-paper, #fff);
    border: 1px solid var(--system7-color-ink, #000);
  }

  .window {
    flex: 1;
    min-height: 0;
    border: none;
    box-shadow: none;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px;
  }

  .filter {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  .filter :global(.sys7-text-input-wrap),
  .filter :global(.sys7-text-input) {
    flex: 1;
    width: 100%;
    min-width: 0;
  }

  /* Table cells do not wrap, so each line ends in an ellipsis instead of being cut off. */
  .entry-text,
  .entry-meta {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
