import { get } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createNotificationStore } from '../../notifications';

describe('createNotificationStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds notifications with unique ids and the requested type', () => {
    const store = createNotificationStore();

    const firstId = store.add('Saved.', 'success');
    const secondId = store.add('Something broke.', 'error');

    const items = get(store);
    expect(items).toHaveLength(2);
    expect(firstId).not.toBe(secondId);
    expect(items[0]).toMatchObject({ id: firstId, message: 'Saved.', type: 'success' });
    expect(items[1]).toMatchObject({ id: secondId, message: 'Something broke.', type: 'error' });
  });

  it('defaults the type to info', () => {
    const store = createNotificationStore();

    store.add('Heads up.');

    expect(get(store)[0].type).toBe('info');
  });

  it('removes notifications automatically after the default timeout', () => {
    const store = createNotificationStore(5000);

    store.add('Going away.');

    vi.advanceTimersByTime(4999);
    expect(get(store)).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(get(store)).toHaveLength(0);
  });

  it('honors a per-notification timeout override', () => {
    const store = createNotificationStore(5000);

    store.add('Quick one.', 'info', 1000);

    vi.advanceTimersByTime(1000);
    expect(get(store)).toHaveLength(0);
  });

  it('keeps notifications with a non-positive timeout until removed', () => {
    const store = createNotificationStore();

    const id = store.add('Sticky.', 'info', 0);

    vi.advanceTimersByTime(60000);
    expect(get(store)).toHaveLength(1);

    store.remove(id);
    expect(get(store)).toHaveLength(0);
  });

  it('removes a single notification by id', () => {
    const store = createNotificationStore();

    const keepId = store.add('Keep me.');
    const dropId = store.add('Drop me.');

    store.remove(dropId);

    const items = get(store);
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(keepId);
  });

  it('clears all notifications', () => {
    const store = createNotificationStore();

    store.add('One');
    store.add('Two');
    store.clear();

    expect(get(store)).toHaveLength(0);
  });
});
