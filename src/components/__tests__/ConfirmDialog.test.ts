import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import ConfirmDialog from '../ConfirmDialog.svelte';

describe('ConfirmDialog', () => {
  it('renders message and default action labels', () => {
    render(ConfirmDialog, {
      props: {
        message: 'Remove selected entry?'
      }
    });

    expect(screen.queryByText('Remove selected entry?')).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'OK' })).not.toBeNull();
  });

  it('supports custom action labels', () => {
    render(ConfirmDialog, {
      props: {
        message: 'Proceed?',
        cancelText: 'Nope',
        okText: 'Yep'
      }
    });

    expect(screen.queryByRole('button', { name: 'Nope' })).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Yep' })).not.toBeNull();
  });

  it('calls onconfirm when OK is clicked', async () => {
    const handleConfirm = vi.fn();

    render(ConfirmDialog, {
      props: {
        message: 'Proceed?',
        onconfirm: handleConfirm
      }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'OK' }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls oncancel when Cancel is clicked', async () => {
    const handleCancel = vi.fn();

    render(ConfirmDialog, {
      props: {
        message: 'Proceed?',
        oncancel: handleCancel
      }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('calls oncancel when modal close button is clicked', async () => {
    const handleCancel = vi.fn();

    render(ConfirmDialog, {
      props: {
        message: 'Proceed?',
        oncancel: handleCancel
      }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
