import { fireEvent, render, screen } from '@testing-library/svelte';
import { compile } from 'svelte/compiler';
import { describe, expect, it, vi } from 'vitest';

import ModalDialog from '../ModalDialog.svelte';
import modalDialogSource from '../ModalDialog.svelte?raw';

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

  it('calls onclose when Escape is pressed inside the dialog', async () => {
    const handleClose = vi.fn();

    render(ModalDialog, { props: { onclose: handleClose } });

    await fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('keeps focus on the dialog when Tab is pressed with no focusable children', async () => {
    render(ModalDialog);

    await Promise.resolve();
    await Promise.resolve();

    const dialog = screen.getByRole('dialog');
    await fireEvent.keyDown(dialog, { key: 'Tab' });

    expect(document.activeElement).toBe(dialog);
  });
});

describe('ModalDialog stylesheet', () => {
  it('limits and scrolls the dialog only on coarse pointers', () => {
    // jsdom cannot evaluate media queries, so check the compiled stylesheet with comments removed.
    // A scrolling body would clip popovers such as BalloonHelp in desktop dialogs.
    const { css } = compile(modalDialogSource, { css: 'external', filename: 'ModalDialog.svelte' });
    const code = (css?.code ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
    const [desktop, coarse, ...rest] = code.split('@media (pointer: coarse)');

    expect(rest).toEqual([]);
    expect(desktop).not.toMatch(/overflow|max-width|max-height|margin/);
    expect(desktop).toMatch(/\.s7-dialog-content[^{]*\{\s*padding: 4px;\s*\}/);
    expect(coarse).toMatch(/\.s7-fixed-dialog[^{]*\{[^}]*max-height: calc\(100% - 64px\);/);
    expect(coarse).toMatch(/\.s7-dialog-content[^{]*\{\s*min-height: 0;\s*overflow: auto;/);
  });
});
