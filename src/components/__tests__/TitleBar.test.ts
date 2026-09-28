import { fireEvent, render, screen } from '@testing-library/svelte';
import { compile } from 'svelte/compiler';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import TitleBar from '../TitleBar.svelte';
import titleBarSource from '../TitleBar.svelte?raw';
import TitleBarActionsFixture from './fixtures/TitleBarActionsFixture.svelte';

function createTouchLikeEvent(type: string, clientX: number, clientY: number) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;

  Object.defineProperty(event, 'touches', {
    value: [{ clientX, clientY }]
  });

  Object.defineProperty(event, 'changedTouches', {
    value: [{ clientX, clientY }]
  });

  return event;
}

describe('TitleBar touch drag support', () => {
  it('invokes ondragstart on touchstart when draggable', () => {
    const handleDragStart = vi.fn();

    const { container } = render(TitleBar, {
      props: {
        title: 'Drag window',
        draggable: true,
        ondragstart: handleDragStart
      }
    });

    const titleBar = container.querySelector('.title-bar') as HTMLDivElement;
    titleBar.dispatchEvent(createTouchLikeEvent('touchstart', 120, 90));

    expect(handleDragStart).toHaveBeenCalledTimes(1);
  });
});

describe('TitleBar window boxes', () => {
  it('names the boxes for assistive technology', () => {
    render(TitleBar, {
      props: { title: 'Window', closable: true, shadeable: true, collapsible: true }
    });

    expect(screen.getByRole('button', { name: 'Close' }).classList).toContain('close-box');
    expect(screen.getByRole('button', { name: 'Collapse' }).classList).toContain('shade-box');
    expect(screen.getByRole('button', { name: 'Zoom' }).classList).toContain('collapse-box');
  });

  it('accepts custom box labels', () => {
    render(TitleBar, {
      props: {
        title: 'Fenster',
        closable: true,
        shadeable: true,
        collapsible: true,
        closeLabel: 'Schliessen',
        shadeLabel: 'Ausklappen',
        collapseLabel: 'Zoomen'
      }
    });

    expect(screen.getByRole('button', { name: 'Schliessen' }).classList).toContain('close-box');
    expect(screen.getByRole('button', { name: 'Ausklappen' }).classList).toContain('shade-box');
    expect(screen.getByRole('button', { name: 'Zoomen' }).classList).toContain('collapse-box');
  });

  it('keeps the title clear of the more crowded side', () => {
    const { container } = render(TitleBar, {
      props: { title: 'Window', closable: true, shadeable: true, collapsible: true }
    });

    // 4px padding + 6px clearance + two 38px box slots on the right, mirrored on the left.
    const titleText = container.querySelector('.title-text') as HTMLElement;
    expect(titleText.style.maxWidth).toBe('calc(100% - 172px)');
  });

  it('declares touch-only hit areas and drag behaviour in its stylesheet', () => {
    // jsdom cannot evaluate media queries or touch-action, so check the compiled stylesheet.
    const { css } = compile(titleBarSource, { css: 'external', filename: 'TitleBar.svelte' });

    expect(css?.code).toMatch(/\.title-bar\.draggable[^{]*\{\s*touch-action: none;/);
    expect(css?.code).toMatch(
      /@media \(pointer: coarse\) \{[^}]*\.close-box[^{]*::after[^{]*\{[^}]*top: -11px;/
    );
  });
});

describe('TitleBar actions slot', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders nothing extra when no actions are given', () => {
    const { container } = render(TitleBar, { props: { title: 'Window', closable: true } });

    expect(container.querySelector('.title-bar-actions')).toBeNull();
    expect(container.querySelector('.right-side-buttons')?.classList).not.toContain('has-actions');
    expect(screen.getByText('Window')).not.toBeNull();
  });

  it('renders actions before the zoom and shade boxes', () => {
    const { container } = render(TitleBarActionsFixture, {
      props: { collapsible: true, shadeable: true }
    });

    const rightSide = container.querySelector('.right-side-buttons') as HTMLElement;
    expect(rightSide.classList).toContain('has-actions');
    expect(rightSide.firstElementChild?.classList).toContain('title-bar-actions');
    expect(
      rightSide.firstElementChild?.contains(screen.getByRole('button', { name: 'Settings' }))
    ).toBe(true);
  });

  it('activates actions without starting a window drag', async () => {
    const handleDragStart = vi.fn();
    const handleAction = vi.fn();
    const { container } = render(TitleBarActionsFixture, {
      props: { draggable: true, ondragstart: handleDragStart, onaction: handleAction }
    });

    const action = screen.getByRole('button', { name: 'Settings' });
    await fireEvent.mouseDown(action);
    action.dispatchEvent(createTouchLikeEvent('touchstart', 300, 10));
    await fireEvent.click(action);

    expect(handleAction).toHaveBeenCalledTimes(1);
    expect(handleDragStart).not.toHaveBeenCalled();

    await fireEvent.mouseDown(container.querySelector('.title-bar') as HTMLElement);
    expect(handleDragStart).toHaveBeenCalledTimes(1);
  });

  it('keeps the title clear of the actions as they resize', async () => {
    let notifyResize: () => void = () => {};
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ConstructorParameters<typeof ResizeObserver>[0]) {
          notifyResize = () => callback([], this as unknown as ResizeObserver);
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
    let actionsWidth = 40;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement
    ) {
      const width = this.classList.contains('title-bar-actions') ? actionsWidth : 0;
      return new DOMRect(0, 0, width, 0);
    });

    const { container } = render(TitleBarActionsFixture, { props: { shadeable: true } });
    const titleText = container.querySelector('.title-text') as HTMLElement;

    await tick();
    // 10px clearance + 40px actions + 12px margin + 38px shade box, mirrored on the left.
    expect(titleText.style.maxWidth).toBe('calc(100% - 200px)');

    actionsWidth = 60;
    notifyResize();
    await tick();
    expect(titleText.style.maxWidth).toBe('calc(100% - 240px)');
  });
});
