import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import TitleBar from '../TitleBar.svelte';

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
