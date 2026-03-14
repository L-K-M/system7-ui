import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import ModalDialog from '../ModalDialog.svelte';

describe('ModalDialog', () => {
  it('moves focus to dialog after mount', async () => {
    render(ModalDialog);

    await Promise.resolve();
    await Promise.resolve();

    expect(document.activeElement).toBe(screen.getByRole('dialog'));
  });

  it('calls onclose when backdrop is clicked', async () => {
    const handleClose = vi.fn();

    render(ModalDialog, { props: { onclose: handleClose } });

    await fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when content area is clicked', async () => {
    const handleClose = vi.fn();

    render(ModalDialog, { props: { onclose: handleClose } });

    await fireEvent.click(screen.getByRole('dialog'));

    expect(handleClose).not.toHaveBeenCalled();
  });
});
