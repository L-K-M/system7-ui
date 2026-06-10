import { writable, type Readable } from 'svelte/store';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationItem {
  id: number;
  message: string;
  type: NotificationType;
}

export interface NotificationStore extends Readable<NotificationItem[]> {
  /**
   * Adds a notification and returns its id. The notification is removed
   * automatically after `timeoutMs` milliseconds; pass `0` (or a negative
   * value) to keep it until it is removed explicitly.
   */
  add(message: string, type?: NotificationType, timeoutMs?: number): number;
  /** Removes a single notification by id (e.g. from a dismiss control). */
  remove(id: number): void;
  /** Removes all notifications. */
  clear(): void;
}

/**
 * Creates the notification list store consumed by the `Notification`
 * component. Pair the store's `remove` with the component's `ondismiss`
 * to get dismissable notifications.
 */
export function createNotificationStore(defaultTimeoutMs = 5000): NotificationStore {
  const { subscribe, update } = writable<NotificationItem[]>([]);
  let counter = 0;

  function remove(id: number) {
    update((items) => items.filter((item) => item.id !== id));
  }

  return {
    subscribe,
    add(message: string, type: NotificationType = 'info', timeoutMs: number = defaultTimeoutMs) {
      const id = counter++;
      update((items) => [...items, { id, message, type }]);

      if (timeoutMs > 0) {
        setTimeout(() => {
          remove(id);
        }, timeoutMs);
      }

      return id;
    },
    remove,
    clear() {
      update(() => []);
    }
  };
}
