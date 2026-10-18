import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BalloonHelp from '../BalloonHelp.svelte';

// jsdom has no PointerEvent, so the pointer type is attached to a plain event.
function dispatchPointerEvent(target: HTMLElement, type: string, pointerType: string) {
  const event = new Event(type, { bubbles: type !== 'pointerenter' });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  target.dispatchEvent(event);
}

describe('BalloonHelp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the balloon after the hover delay', async () => {
    const { container } = render(BalloonHelp, {
      props: { message: 'Helpful text', delay: 500 }
    });

    const trigger = container.querySelector('.balloon-container') as HTMLElement;
    await fireEvent.mouseEnter(trigger);

    expect(container.querySelector('.balloon')).toBeNull();

    await vi.advanceTimersByTimeAsync(500);

    const balloon = container.querySelector('.balloon');
    expect(balloon).not.toBeNull();
    expect(balloon?.getAttribute('role')).toBe('tooltip');
    expect(balloon?.textContent).toContain('Helpful text');
  });

  it('cancels the pending balloon when the pointer leaves', async () => {
    const { container } = render(BalloonHelp, {
      props: { message: 'Helpful text', delay: 500 }
    });

    const trigger = container.querySelector('.balloon-container') as HTMLElement;
    await fireEvent.mouseEnter(trigger);
    await fireEvent.mouseLeave(trigger);
    await vi.advanceTimersByTimeAsync(1000);

    expect(container.querySelector('.balloon')).toBeNull();
  });

  it('shows the balloon when focus enters the trigger', async () => {
    const { container } = render(BalloonHelp, {
      props: { message: 'Keyboard help', delay: 300 }
    });

    const trigger = container.querySelector('.balloon-container') as HTMLElement;
    await fireEvent.focusIn(trigger);
    await vi.advanceTimersByTimeAsync(300);

    expect(container.querySelector('.balloon')).not.toBeNull();
  });

  it('hides the balloon when Escape is pressed', async () => {
    const { container } = render(BalloonHelp, {
      props: { message: 'Dismiss me', delay: 100 }
    });

    const trigger = container.querySelector('.balloon-container') as HTMLElement;
    await fireEvent.mouseEnter(trigger);
    await vi.advanceTimersByTimeAsync(100);
    expect(container.querySelector('.balloon')).not.toBeNull();

    await fireEvent.keyDown(window, { key: 'Escape' });

    expect(container.querySelector('.balloon')).toBeNull();
  });

  it('clears the pending hover timer on unmount', async () => {
    const { container, unmount } = render(BalloonHelp, {
      props: { message: 'Helpful text', delay: 500 }
    });

    const trigger = container.querySelector('.balloon-container') as HTMLElement;
    await fireEvent.mouseEnter(trigger);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not open from the mouse and focus events that follow a touch tap', async () => {
    const { container } = render(BalloonHelp, {
      props: { message: 'Helpful text', delay: 100 }
    });

    const trigger = container.querySelector('.balloon-container') as HTMLElement;
    dispatchPointerEvent(trigger, 'pointerenter', 'touch');
    dispatchPointerEvent(trigger, 'pointerdown', 'touch');
    await fireEvent.mouseEnter(trigger);
    await fireEvent.focusIn(trigger);
    await vi.advanceTimersByTimeAsync(500);

    expect(container.querySelector('.balloon')).toBeNull();
  });

  it('opens on mouse hover after an earlier touch tap', async () => {
    const { container } = render(BalloonHelp, {
      props: { message: 'Helpful text', delay: 100 }
    });

    const trigger = container.querySelector('.balloon-container') as HTMLElement;
    dispatchPointerEvent(trigger, 'pointerdown', 'touch');
    await fireEvent.mouseLeave(trigger);
    dispatchPointerEvent(trigger, 'pointerenter', 'mouse');
    await fireEvent.mouseEnter(trigger);
    await vi.advanceTimersByTimeAsync(100);

    expect(container.querySelector('.balloon')).not.toBeNull();
  });

  it('opens on keyboard focus after an earlier touch tap', async () => {
    const { container } = render(BalloonHelp, {
      props: { message: 'Keyboard help', delay: 100 }
    });

    const trigger = container.querySelector('.balloon-container') as HTMLElement;
    dispatchPointerEvent(trigger, 'pointerdown', 'touch');
    await fireEvent.keyDown(window, { key: 'Tab' });
    await fireEvent.focusIn(trigger);
    await vi.advanceTimersByTimeAsync(100);

    expect(container.querySelector('.balloon')).not.toBeNull();
  });

  it('opens on keyboard focus after a tap even when a dialog stops keydown bubbling', async () => {
    const { container } = render(BalloonHelp, {
      props: { message: 'Keyboard help', delay: 100 }
    });

    const trigger = container.querySelector('.balloon-container') as HTMLElement;
    trigger.addEventListener('keydown', (event) => event.stopPropagation());
    dispatchPointerEvent(trigger, 'pointerdown', 'touch');
    await fireEvent.keyDown(trigger, { key: 'Tab' });
    await fireEvent.focusIn(trigger);
    await vi.advanceTimersByTimeAsync(100);

    expect(container.querySelector('.balloon')).not.toBeNull();
  });
});
