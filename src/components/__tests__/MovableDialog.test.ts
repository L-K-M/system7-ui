import { fireEvent, render, screen } from '@testing-library/svelte';
import { compile } from 'svelte/compiler';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import MovableDialog from '../MovableDialog.svelte';
import movableDialogSource from '../MovableDialog.svelte?raw';

function createTouchLikeEvent(type: string, clientX: number, clientY: number) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
  const touches = type === 'touchend' ? [] : [{ clientX, clientY }];

  Object.defineProperty(event, 'touches', { value: touches });
  Object.defineProperty(event, 'changedTouches', { value: [{ clientX, clientY }] });

  return event;
}

function setViewportSize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
}

// jsdom has no layout, so the dialog reports a fixed box that the tests choose.
function stubDialogBox(
  dialog: HTMLElement,
  box: { left: number; top: number; width: number; height: number }
) {
  dialog.getBoundingClientRect = () =>
    ({
      ...box,
      x: box.left,
      y: box.top,
      right: box.left + box.width,
      bottom: box.top + box.height,
      toJSON: () => box
    }) as DOMRect;
}

function renderedPosition(dialog: HTMLElement) {
  return { left: dialog.style.left, top: dialog.style.top };
}

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

  it('names the shade box after what the next press does', async () => {
    const { container } = render(MovableDialog, {
      props: { title: 'Host details' }
    });

    const shadeButton = container.querySelector('.shade-box') as HTMLElement;
    expect(shadeButton.getAttribute('aria-label')).toBe('Collapse');

    await fireEvent.click(shadeButton);
    expect(shadeButton.getAttribute('aria-label')).toBe('Expand');

    await fireEvent.click(shadeButton);
    expect(shadeButton.getAttribute('aria-label')).toBe('Collapse');
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

  it('calls onclose when Escape is pressed inside the dialog', async () => {
    const handleClose = vi.fn();

    render(MovableDialog, {
      props: {
        title: 'Host details',
        onclose: handleClose
      }
    });

    await fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('wraps Shift+Tab from the dialog to the last focusable control', async () => {
    const { container } = render(MovableDialog, {
      props: { title: 'Host details' }
    });

    await Promise.resolve();
    await Promise.resolve();

    const dialog = screen.getByRole('dialog');
    await fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });

    const shadeButton = container.querySelector('.shade-box') as HTMLElement;
    expect(document.activeElement).toBe(shadeButton);
  });
});

describe('MovableDialog placement', () => {
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;

  beforeEach(() => {
    setViewportSize(360, 800);
  });

  afterEach(() => {
    setViewportSize(originalWidth, originalHeight);
  });

  function setup() {
    const { container } = render(MovableDialog, { props: { title: 'Settings' } });
    const titleBar = container.querySelector('.title-bar') as HTMLElement;
    const backdrop = container.querySelector('.s7-backdrop') as HTMLElement;
    const dialog = screen.getByRole('dialog') as HTMLDivElement;

    return { titleBar, backdrop, dialog };
  }

  it('does not call preventDefault on the passive touchstart that begins a drag', async () => {
    const { titleBar } = setup();
    const touchStart = createTouchLikeEvent('touchstart', 40, 20);
    const preventDefault = vi.spyOn(touchStart, 'preventDefault');

    titleBar.dispatchEvent(touchStart);

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('cancels the touchmove that drags so the page does not scroll', () => {
    const { titleBar, dialog } = setup();
    stubDialogBox(dialog, { left: 30, top: 300, width: 300, height: 200 });
    const addListener = vi.spyOn(document, 'addEventListener');
    const touchMove = createTouchLikeEvent('touchmove', 20, 110);
    const preventDefault = vi.spyOn(touchMove, 'preventDefault');

    titleBar.dispatchEvent(createTouchLikeEvent('touchstart', 40, 310));
    document.dispatchEvent(touchMove);

    expect(preventDefault).toHaveBeenCalled();
    // jsdom ignores `passive`, but browsers drop preventDefault from a passive listener.
    expect(addListener).toHaveBeenCalledWith(
      'touchmove',
      expect.any(Function),
      expect.objectContaining({ passive: false })
    );
  });

  it('follows a touch drag from the title bar', async () => {
    const { titleBar, dialog } = setup();
    stubDialogBox(dialog, { left: 30, top: 300, width: 300, height: 200 });

    titleBar.dispatchEvent(createTouchLikeEvent('touchstart', 40, 310));
    document.dispatchEvent(createTouchLikeEvent('touchmove', 20, 110));
    document.dispatchEvent(createTouchLikeEvent('touchend', 20, 110));
    await Promise.resolve();

    expect(dialog.style.position).toBe('fixed');
    expect(renderedPosition(dialog)).toEqual({ left: '10px', top: '100px' });
  });

  it('keeps the whole dialog inside the viewport while dragging', async () => {
    const { titleBar, dialog } = setup();
    stubDialogBox(dialog, { left: 30, top: 300, width: 300, height: 200 });

    await fireEvent.mouseDown(titleBar, { clientX: 40, clientY: 310 });
    await fireEvent.mouseMove(document, { clientX: 900, clientY: 2000 });
    expect(renderedPosition(dialog)).toEqual({ left: '60px', top: '600px' });

    await fireEvent.mouseMove(document, { clientX: -500, clientY: -500 });
    await fireEvent.mouseUp(document);
    expect(renderedPosition(dialog)).toEqual({ left: '0px', top: '0px' });
  });

  it('keeps the dialog out of the safe-area insets held by the backdrop padding', async () => {
    const { titleBar, backdrop, dialog } = setup();
    backdrop.style.padding = '38px 4px 24px 6px';
    stubDialogBox(dialog, { left: 30, top: 300, width: 300, height: 200 });

    await fireEvent.mouseDown(titleBar, { clientX: 40, clientY: 310 });
    await fireEvent.mouseMove(document, { clientX: -500, clientY: -500 });
    expect(renderedPosition(dialog)).toEqual({ left: '6px', top: '38px' });

    await fireEvent.mouseMove(document, { clientX: 900, clientY: 2000 });
    await fireEvent.mouseUp(document);
    expect(renderedPosition(dialog)).toEqual({ left: '56px', top: '576px' });
  });

  it('keeps the title bar reachable when a tap pins a dialog taller than the viewport', async () => {
    const { titleBar, dialog } = setup();
    stubDialogBox(dialog, { left: 0, top: -624, width: 360, height: 2048 });

    await fireEvent.mouseDown(titleBar, { clientX: 100, clientY: -600 });
    await fireEvent.mouseUp(document);

    expect(renderedPosition(dialog)).toEqual({ left: '0px', top: '0px' });
  });

  it('moves a dragged dialog back into view when the window shrinks', async () => {
    const { titleBar, dialog } = setup();
    stubDialogBox(dialog, { left: 30, top: 300, width: 300, height: 200 });

    await fireEvent.mouseDown(titleBar, { clientX: 40, clientY: 310 });
    await fireEvent.mouseMove(document, { clientX: 900, clientY: 2000 });
    await fireEvent.mouseUp(document);
    expect(renderedPosition(dialog)).toEqual({ left: '60px', top: '600px' });

    setViewportSize(320, 640);
    await fireEvent(window, new Event('resize'));

    expect(renderedPosition(dialog)).toEqual({ left: '20px', top: '440px' });
  });

  it('leaves an undragged dialog to the backdrop layout on resize', async () => {
    const { dialog } = setup();

    await fireEvent(window, new Event('resize'));

    expect(dialog.style.position).toBe('');
    expect(dialog.classList.contains('positioned')).toBe(false);
  });

  it('moves the dialog back into view after expanding it from the shaded state', async () => {
    const { dialog } = setup();
    const shadeButton = dialog.querySelector('.shade-box') as HTMLElement;

    stubDialogBox(dialog, { left: 30, top: 760, width: 300, height: 36 });
    await fireEvent.click(shadeButton);
    expect(renderedPosition(dialog)).toEqual({ left: '30px', top: '760px' });

    stubDialogBox(dialog, { left: 30, top: 760, width: 300, height: 400 });
    await fireEvent.click(shadeButton);
    await Promise.resolve();

    expect(renderedPosition(dialog)).toEqual({ left: '30px', top: '400px' });
  });
});

describe('MovableDialog stylesheet', () => {
  // jsdom cannot evaluate media queries, so check the compiled stylesheet with comments removed.
  const { css } = compile(movableDialogSource, {
    css: 'external',
    filename: 'MovableDialog.svelte'
  });
  const code = (css?.code ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
  const [desktop, coarse, ...rest] = code.split('@media (pointer: coarse)');

  it('limits and scrolls the dialog only on coarse pointers', () => {
    // A scrolling body would clip popovers such as BalloonHelp in desktop dialogs.
    expect(rest).toEqual([]);
    expect(desktop).not.toMatch(/overflow|max-width|max-height/);
    expect(coarse).toMatch(/\.modal-content[^{]*\{\s*min-height: 0;\s*overflow: auto;/);
    expect(coarse).toMatch(/\.s7-dialog[^{]*\{\s*max-width: calc\(100% - 2px\);/);
  });

  it('keeps the dragged-dialog limits below the specificity of consumer overrides', () => {
    // A bare `.positioned` compiles to two classes, like `.s7-dialog`, so a consumer rule such as
    // `body .s7-backdrop > .s7-dialog` still wins once the dialog is dragged.
    expect(coarse).toMatch(/(^|\s)\.positioned\.svelte-[\w-]+\s*\{\s*max-width:/);
    expect(code).not.toMatch(/\.s7-dialog\.positioned/);
  });
});
