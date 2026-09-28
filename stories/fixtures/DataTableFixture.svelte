<script lang="ts">
  import DataTable from '../../src/components/DataTable.svelte';

  export let showHeader = true;
  export let loading = false;
  export let empty = false;

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'kind', label: 'Kind', width: '120px' },
    { key: 'size', label: 'Size', width: '80px', align: 'right' as const }
  ];

  const rows = [
    { name: 'Read Me', kind: 'document', size: '4K' },
    { name: 'SimpleText', kind: 'application', size: '88K' },
    { name: 'Scrapbook File', kind: 'document', size: '212K' },
    { name: 'System Folder', kind: 'folder', size: '12.4M' },
    { name: 'TeachText', kind: 'application', size: '44K' }
  ];

  let sortKey: string | null = 'name';
  let sortDirection: 'asc' | 'desc' = 'asc';

  function handleSort(key: string) {
    sortDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    sortKey = key;
  }
</script>

<div class="s7-window-frame table-frame">
  <DataTable {columns} {showHeader} {loading} {empty} {sortKey} {sortDirection} onSort={handleSort}>
    {#each rows as row (row.name)}
      <tr>
        <td>{row.name}</td>
        <td>{row.kind}</td>
        <td class="s7-data-table-col is-right">{row.size}</td>
      </tr>
    {/each}
  </DataTable>
</div>

<style>
  .table-frame {
    width: 420px;
    height: 220px;
  }
</style>
