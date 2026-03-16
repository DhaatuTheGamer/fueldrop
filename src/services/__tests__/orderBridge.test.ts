import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getActiveOrders, publishOrder, updateOrderStatus, removeOrder, onOrderChange } from '../orderBridge';
import { Order } from '../../types';

describe('orderBridge', () => {
  const STORAGE_KEY = 'fd_active_orders';

  const mockOrder: Order = {
    id: 'order-1',
    userId: 'user-1',
    vehicleId: 'vehicle-1',
    fuelType: 'Petrol',
    quantityLiters: 10,
    amountRupees: 1000,
    location: { lat: 10, lng: 20, address: 'Test Location' },
    status: 'Pending',
    date: new Date().toISOString(),
    paymentMethod: 'Cash',
    totalAmount: 1000,
  };

  const mockOrder2: Order = {
    ...mockOrder,
    id: 'order-2',
    status: 'Accepted'
  };

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getActiveOrders', () => {
    it('should return empty array if localStorage is empty', () => {
      expect(getActiveOrders()).toEqual([]);
    });

    it('should return empty array if localStorage has invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json');
      expect(getActiveOrders()).toEqual([]);
    });

    it('should return parsed orders if localStorage has valid data', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockOrder]));
      expect(getActiveOrders()).toEqual([mockOrder]);
    });
  });

  describe('publishOrder', () => {
    it('should add a new order and dispatch event', () => {
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      publishOrder(mockOrder);

      const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(orders).toHaveLength(1);
      expect(orders[0]).toEqual(mockOrder);

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
      const event = dispatchEventSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('fd-order-change');
      expect(event.detail).toEqual([mockOrder]);
    });

    it('should update an existing order instead of adding a new one', () => {
      // First publish
      publishOrder(mockOrder);

      // Publish again with same ID but different status
      const updatedOrder = { ...mockOrder, status: 'Accepted' as const };
      publishOrder(updatedOrder);

      const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(orders).toHaveLength(1);
      expect(orders[0]).toEqual(updatedOrder);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockOrder]));

      updateOrderStatus('order-1', 'Accepted');

      const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(orders[0].status).toBe('Accepted');
    });

    it('should update captainName if provided', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockOrder]));

      updateOrderStatus('order-1', 'Accepted', 'Captain John');

      const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(orders[0].status).toBe('Accepted');
      expect(orders[0].captainName).toBe('Captain John');
    });

    it('should not throw or update if order is not found', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockOrder]));
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      updateOrderStatus('non-existent-id', 'Accepted');

      const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(orders[0]).toEqual(mockOrder);
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });
  });

  describe('removeOrder', () => {
    it('should remove the order and dispatch event', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockOrder, mockOrder2]));
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      removeOrder('order-1');

      const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      expect(orders).toHaveLength(1);
      expect(orders[0].id).toBe('order-2');

      expect(dispatchEventSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onOrderChange', () => {
    it('should notify listener when publishOrder is called', () => {
      const callback = vi.fn();
      const unsubscribe = onOrderChange(callback);

      publishOrder(mockOrder);

      expect(callback).toHaveBeenCalledWith([mockOrder]);
      unsubscribe();
    });

    it('should notify listener when updateOrderStatus is called', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockOrder]));
      const callback = vi.fn();
      const unsubscribe = onOrderChange(callback);

      updateOrderStatus('order-1', 'Accepted');

      expect(callback).toHaveBeenCalled();
      const calls = callback.mock.calls;
      const lastCallArgs = calls[calls.length - 1];
      expect(lastCallArgs[0][0].status).toBe('Accepted');

      unsubscribe();
    });

    it('should notify listener when removeOrder is called', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockOrder]));
      const callback = vi.fn();
      const unsubscribe = onOrderChange(callback);

      removeOrder('order-1');

      expect(callback).toHaveBeenCalledWith([]);
      unsubscribe();
    });

    it('should call callback on storage event with correct key', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([mockOrder]));
      const callback = vi.fn();
      const unsubscribe = onOrderChange(callback);

      // Simulate storage event from another tab
      const event = new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify([mockOrder])
      });
      window.dispatchEvent(event);

      expect(callback).toHaveBeenCalledWith([mockOrder]);
      unsubscribe();
    });

    it('should not call callback on storage event with different key', () => {
      const callback = vi.fn();
      const unsubscribe = onOrderChange(callback);

      const event = new StorageEvent('storage', {
        key: 'other_key',
        newValue: '[]'
      });
      window.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
      unsubscribe();
    });

    it('should successfully unsubscribe', () => {
      const callback = vi.fn();
      const unsubscribe = onOrderChange(callback);

      unsubscribe();

      publishOrder(mockOrder);

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
