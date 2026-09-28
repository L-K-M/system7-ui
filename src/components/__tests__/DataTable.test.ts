import { fireEvent, render, screen } from '@testing-library/svelte';
import { compile } from 'svelte/compiler';
import { describe, expect, it, vi } from 'vitest';

import DataTable from '../DataTable.svelte';
import dataTableSource from '../DataTable.svelte?raw';

describe('DataTable', () => {
  const columns = [
    { key: 'ip', label: 'IP', sortable: true },
    { key: 'name', label: 'Name', sortable: true }
  ];

  it('renders loading placeholder text', () => {
    render(DataTable, {
      props: {
        columns,
        loading: true,
        loadingText: 'Scanning...'
      }
    });

    expect(screen.queryByText('Scanning...')).not.toBeNull();
  });

  it('renders empty placeholder text', () => {
    render(DataTable, {
      props: {
        columns,
        empty: true,
        emptyText: 'No rows yet.'
      }
    });

    expect(screen.queryByText('No rows yet.')).not.toBeNull();
  });

  it('renders slotted rows and forwards sort interactions', async () => {
    const onSort = vi.fn();

    render(DataTable, {
      props: {
        columns,
        sortKey: 'name',
        sortDirection: 'asc',
        onSort
      }
    });

    const nameSortButton = screen.getByRole('button', { name: 'Sort by Name' });
    const nameHeader = nameSortButton.closest('th');
    expect(nameHeader?.getAttribute('aria-sort')).toBe('ascending');

    await fireEvent.click(nameSortButton);

    expect(onSort).toHaveBeenCalledTimes(1);
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('renders the header above a double rule by default', () => {
    const { container } = render(DataTable, { props: { columns } });

    expect(container.querySelector('.s7-data-table-header-container')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Sort by IP' })).not.toBeNull();
    expect(container.querySelector('.s7-data-table-body-container')?.classList).not.toContain(
      'is-headless'
    );
  });

  it('omits the header and its rule when showHeader is false', () => {
    const { container } = render(DataTable, {
      props: {
        columns: [
          { key: 'star', label: 'Star', width: '40px' },
          { key: 'name', label: 'Name', sortable: true }
        ],
        showHeader: false
      }
    });

    expect(container.querySelector('.s7-data-table-header-container')).toBeNull();
    expect(container.querySelector('thead')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Sort by Name' })).toBeNull();
    expect(container.querySelector('.s7-data-table-body-container')?.classList).toContain(
      'is-headless'
    );

    const cols = container.querySelectorAll('.s7-data-table-body-container col');
    expect(cols).toHaveLength(2);
    expect((cols[0] as HTMLElement).style.width).toBe('40px');
  });

  it('pads cells from the --system7-table-cell-padding token with the old default', () => {
    // jsdom does not apply component styles, so check the compiled stylesheet instead.
    const { css } = compile(dataTableSource, { css: 'external', filename: 'DataTable.svelte' });

    expect(css?.code).toMatch(
      /table\.s7-data-table-table td \{[^}]*padding: var\(--system7-table-cell-padding, 5px 8px\);/
    );
    expect(css?.code).toMatch(
      /\.s7-data-table-body-container\.is-headless[^{]*\{\s*border-top: none;\s*margin-top: 0;/
    );
  });
});
