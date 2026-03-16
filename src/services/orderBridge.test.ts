// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getActiveOrders, publishOrder, updateOrderStatus, removeOrder, onOrderChange } from './orderBridge';
import { Order } from '../types';

describe('orderBridge', () => {
  const STORAGE_KEY = 'fd_active_orders';

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('read() / getActiveOrders()', () => {
    it('returns empty array if localStorage is empty', () => {
      expect(getActiveOrders()).toEqual([]);
    });

    it('returns parsed orders if localStorage has valid JSON', () => {
      const orders = [{ id: 'order-1', status: 'Pending' } as Order];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

      expect(getActiveOrders()).toEqual(orders);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      // Untested error handling scenario: malformed JSON
      localStorage.setItem(STORAGE_KEY, 'invalid-json-{[');
      expect(getActiveOrders()).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws an error', () => {
      // Untested error handling scenario: Storage access throws
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Access denied to localStorage');
      });

      expect(getActiveOrders()).toEqual([]);
      expect(getItemSpy).toHaveBeenCalledWith(STORAGE_KEY);
    });
  });

  describe('write() helpers via public API', () => {
    it('publishOrder adds a new order and dispatches custom event', () => {
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
      const newOrder = { id: 'order-2', status: 'Pending' } as Order;

      publishOrder(newOrder);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toEqual([newOrder]);

      expect(dispatchEventSpy).toHaveBeenCalled();
      const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('fd-order-change');
      expect(event.detail).toEqual([newOrder]);
    });

    it('publishOrder updates an existing order', () => {
      const initialOrder = { id: 'order-3', status: 'Pending' } as Order;
      publishOrder(initialOrder);

      const updatedOrder = { id: 'order-3', status: 'Accepted' } as Order;
      publishOrder(updatedOrder);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toEqual([updatedOrder]);
    });

    it('updateOrderStatus updates the status of an existing order', () => {
      publishOrder({ id: 'order-4', status: 'Pending' } as Order);

      updateOrderStatus('order-4', 'Accepted', 'Captain Joe');

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toEqual([{ id: 'order-4', status: 'Accepted', captainName: 'Captain Joe' }]);
    });

    it('updateOrderStatus updates the status of an existing order without captainName', () => {
      publishOrder({ id: 'order-without-captain', status: 'Pending' } as Order);

      updateOrderStatus('order-without-captain', 'Accepted');

      const stored = JSON.parse(localStorage.getItem('fd_active_orders')!);
      expect(stored).toEqual([{ id: 'order-without-captain', status: 'Accepted' }]);
    });

    it('updateOrderStatus ignores non-existent orders', () => {
      publishOrder({ id: 'order-5', status: 'Pending' } as Order);

      updateOrderStatus('order-999', 'Accepted');

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toEqual([{ id: 'order-5', status: 'Pending' }]);
    });

    it('removeOrder deletes an order by id', () => {
      publishOrder({ id: 'order-6', status: 'Pending' } as Order);
      publishOrder({ id: 'order-7', status: 'Pending' } as Order);

      removeOrder('order-6');

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toEqual([{ id: 'order-7', status: 'Pending' }]);
    });
  });

  describe('onOrderChange', () => {
    it('subscribes to storage and custom events, and unsubscribes correctly', () => {
      const cb = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const unsubscribe = onOrderChange(cb);

      expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('fd-order-change', expect.any(Function));

      unsubscribe();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('fd-order-change', expect.any(Function));
    });

    it('calls callback when storage event is fired for the correct key', () => {
      const cb = vi.fn();
      onOrderChange(cb);

      const orders = [{ id: 'order-8' } as Order];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

      // Simulate storage event from another tab
      const storageEvent = new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(orders),
      });
      window.dispatchEvent(storageEvent);

      expect(cb).toHaveBeenCalledWith(orders);
    });

    it('does not call callback when storage event is fired for a different key', () => {
      const cb = vi.fn();
      onOrderChange(cb);

      const storageEvent = new StorageEvent('storage', {
        key: 'some_other_key',
        newValue: '[]',
      });
      window.dispatchEvent(storageEvent);

      expect(cb).not.toHaveBeenCalled();
    });

    it('calls callback when custom fd-order-change event is fired', () => {
      const cb = vi.fn();
      onOrderChange(cb);

      const orders = [{ id: 'order-9' } as Order];

      const customEvent = new CustomEvent('fd-order-change', { detail: orders });
      window.dispatchEvent(customEvent);

      expect(cb).toHaveBeenCalledWith(orders);
    });
  });
});
