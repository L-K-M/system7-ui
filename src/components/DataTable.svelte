<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';

  type DataTableColumn = {
    key: string;
    label: string;
    width?: string;
    className?: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    ariaLabel?: string;
  };

  /**
   * Column metadata used to render the table structure and default header row.
   * When a custom `header` slot is provided, this still controls `<colgroup>` widths/classes.
   */
  export let columns: DataTableColumn[] = [];

  /** Active sort column key. Set `null` when no column is actively sorted. */
  export let sortKey: string | null = null;

  /** Sort direction used with `sortKey`. */
  export let sortDirection: 'asc' | 'desc' = 'asc';

  /** Callback fired when a sortable header is activated. */
  export let onSort: ((key: string) => void) | undefined = undefined;

  /** Whether the table should show the loading placeholder row. */
  export let loading = false;

  /** Loading placeholder text shown when `loading` is true. */
  export let loadingText = 'Loading...';

  /** Whether the table should show the empty placeholder row. */
  export let empty = false;

  /** Empty placeholder text shown when `empty` is true. */
  export let emptyText = 'No items.';

  /** Custom colspan for placeholder rows. Defaults to `columns.length` (or `1` when empty). */
  export let emptyColspan: number | null = null;

  /** Extra class names applied to the fixed header container. */
  export let headerClass = '';

  /** Extra class names applied to the scrollable body container. */
  export let bodyClass = '';

  /** Extra class names applied to both internal `<table>` elements. */
  export let tableClass = '';

  /** Additional CSS classes applied to the root table wrapper. */
  let className = '';
  export { className as class };

  let bodyContainerElement: HTMLDivElement | null = null;
  let headerPaddingRight = 0;
  let rafId = 0;

  $: resolvedColspan = emptyColspan ?? Math.max(columns.length, 1);

  afterUpdate(() => {
    scheduleHeaderPaddingUpdate();
  });

  onMount(() => {
    scheduleHeaderPaddingUpdate();

    const handleResize = () => {
      scheduleHeaderPaddingUpdate();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  });

  function scheduleHeaderPaddingUpdate() {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      rafId = 0;
      updateHeaderPadding();
    });
  }

  function updateHeaderPadding() {
    if (!bodyContainerElement) {
      headerPaddingRight = 0;
      return;
    }

    const scrollbarWidth = bodyContainerElement.offsetWidth - bodyContainerElement.clientWidth;
    headerPaddingRight = Math.max(0, scrollbarWidth);
  }

  function getAriaSort(columnKey: string): 'ascending' | 'descending' | 'none' {
    if (sortKey !== columnKey) {
      return 'none';
    }
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  function getColumnClass(column: DataTableColumn): string {
    const classes = ['s7-data-table-col'];
    if (column.className) {
      classes.push(column.className);
    }
    if (column.align) {
      classes.push(`is-${column.align}`);
    }
    return classes.join(' ');
  }

  function handleSort(column: DataTableColumn) {
    if (!column.sortable) {
      return;
    }
    onSort?.(column.key);
  }
</script>

<div class={`s7-data-table-root ${className}`}>
  <div
    class={`s7-data-table-header-container ${headerClass}`}
    style:padding-right={`${headerPaddingRight}px`}
  >
    <table class={`s7-data-table-table ${tableClass}`}>
      {#if columns.length > 0}
        <colgroup>
          {#each columns as column (column.key)}
            <col class={getColumnClass(column)} style:width={column.width} />
          {/each}
        </colgroup>
      {/if}
      <thead>
        {#if $$slots.header}
          <slot name="header" {sortKey} {sortDirection} {onSort} />
        {:else}
          <tr>
            {#each columns as column (column.key)}
              <th
                class={getColumnClass(column)}
                style:width={column.width}
                aria-sort={getAriaSort(column.key)}
              >
                {#if column.sortable}
                  <button
                    type="button"
                    class="s7-data-table-sort-button"
                    class:is-active={sortKey === column.key}
                    aria-label={column.ariaLabel || `Sort by ${column.label}`}
                    onclick={() => handleSort(column)}
                  >
                    {column.label}
                  </button>
                {:else}
                  <span class="s7-data-table-header-text">{column.label}</span>
                {/if}
              </th>
            {/each}
          </tr>
        {/if}
      </thead>
    </table>
  </div>

  <div class={`s7-data-table-body-container ${bodyClass}`} bind:this={bodyContainerElement}>
    <table class={`s7-data-table-table ${tableClass}`}>
      {#if columns.length > 0}
        <colgroup>
          {#each columns as column (column.key)}
            <col class={getColumnClass(column)} style:width={column.width} />
          {/each}
        </colgroup>
      {/if}
      <tbody>
        {#if loading}
          <tr>
            <td colspan={resolvedColspan} class="s7-data-table-placeholder">{loadingText}</td>
          </tr>
        {:else if empty}
          <tr>
            <td colspan={resolvedColspan} class="s7-data-table-placeholder">{emptyText}</td>
          </tr>
        {:else}
          <slot />
        {/if}
      </tbody>
    </table>
  </div>
</div>

<style>
  .s7-data-table-root {
    flex: 1;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    background: var(--system7-color-paper, #fff);
  }

  .s7-data-table-header-container {
    border-bottom: 1px solid var(--system7-color-ink, #000);
    background: var(--system7-color-paper, #fff);
  }

  .s7-data-table-body-container {
    flex: 1;
    min-height: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    border-top: 1px solid var(--system7-color-ink, #000);
    margin-top: 2px;
    background: var(--system7-color-paper, #fff);
  }

  .s7-data-table-root :global(table.s7-data-table-table) {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .s7-data-table-root :global(table.s7-data-table-table th),
  .s7-data-table-root :global(table.s7-data-table-table td) {
    text-align: left;
    border-bottom: 0.5px solid var(--system7-color-ink, #000);
    padding: 5px 8px;
    vertical-align: middle;
  }

  .s7-data-table-root :global(table.s7-data-table-table th) {
    font-weight: normal;
    border-bottom: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .s7-data-table-root :global(table.s7-data-table-table td) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .s7-data-table-root :global(table.s7-data-table-table tbody tr:last-child td) {
    border-bottom: none;
  }

  .s7-data-table-root :global(.s7-data-table-col.is-right) {
    text-align: right;
  }

  .s7-data-table-root :global(.s7-data-table-col.is-center) {
    text-align: center;
  }

  .s7-data-table-sort-button {
    border: none;
    background: transparent;
    color: inherit;
    display: block;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    line-height: inherit;
    padding: 0 0 0 1px;
    cursor: pointer;
    text-decoration: none;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .s7-data-table-sort-button.is-active {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .s7-data-table-header-text {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding-left: 1px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .s7-data-table-placeholder {
    text-align: center !important;
    color: var(--system7-color-disabled-ink, #808080);
    font-style: italic;
    padding: 20px 8px !important;
  }
</style>
