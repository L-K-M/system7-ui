import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import MovableDialog from '../MovableDialog.svelte';

describe('MovableDialog', () => {
  it('moves focus to the dialog after mount', async () => {
    render(MovableDialog, {
      props: { title: 'Host details' }
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(document.activeElement).toBe(screen.getByRole('dialog'));
  });

  it('calls onclose when backdrop is clicked', async () => {
    const handleClose = vi.fn();

    render(MovableDialog, {
      props: {
        title: 'Host details',
        onclose: handleClose
      }
    });

    await fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when dialog body is clicked', async () => {
    const handleClose = vi.fn();

    render(MovableDialog, {
      props: {
        title: 'Host details',
        onclose: handleClose
      }
    });

    await fireEvent.click(screen.getByRole('dialog'));

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('toggles body visibility when shade button is clicked', async () => {
    const { container } = render(MovableDialog, {
      props: { title: 'Host details' }
    });

    expect(container.querySelector('.modal-content')).not.toBeNull();

    const shadeButton = container.querySelector('.shade-box') as HTMLElement;
    expect(shadeButton).not.toBeNull();

    await fireEvent.click(shadeButton);
    expect(container.querySelector('.modal-content')).toBeNull();

    await fireEvent.click(shadeButton);
    expect(container.querySelector('.modal-content')).not.toBeNull();
  });

  it('updates dialog position when dragged from title bar', async () => {
    const { container } = render(MovableDialog, {
      props: { title: 'Host details' }
    });

    const titleBar = container.querySelector('.title-bar') as HTMLElement;
    const dialog = screen.getByRole('dialog') as HTMLDivElement;

    await fireEvent.mouseDown(titleBar, { clientX: 20, clientY: 20 });
    await fireEvent.mouseMove(document, { clientX: 120, clientY: 90 });
    await fireEvent.mouseUp(document);

    const style = dialog.getAttribute('style') || '';
    expect(style.includes('position: fixed')).toBe(true);
    expect(style.includes('left:')).toBe(true);
    expect(style.includes('top:')).toBe(true);
  });
});
