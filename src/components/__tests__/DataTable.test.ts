import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import DataTable from '../DataTable.svelte';

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
});
