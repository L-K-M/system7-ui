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

  it('calls onconfirm when Enter is pressed with focus on the dialog', async () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    render(ConfirmDialog, {
      props: {
        message: 'Proceed?',
        onconfirm: handleConfirm,
        oncancel: handleCancel
      }
    });

    await Promise.resolve();
    await Promise.resolve();

    await fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' });

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).not.toHaveBeenCalled();
  });

  it('does not hijack Enter when a button has focus', async () => {
    const handleConfirm = vi.fn();

    render(ConfirmDialog, {
      props: {
        message: 'Proceed?',
        onconfirm: handleConfirm
      }
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    cancelButton.focus();
    await fireEvent.keyDown(cancelButton, { key: 'Enter' });

    expect(handleConfirm).not.toHaveBeenCalled();
  });

  it('calls oncancel when Escape is pressed', async () => {
    const handleCancel = vi.fn();

    render(ConfirmDialog, {
      props: {
        message: 'Proceed?',
        oncancel: handleCancel
      }
    });

    await fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

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
