/**
 * Order Bridge — localStorage-based cross-tab communication
 * 
 * When the user places an order it is written to localStorage.
 * The captain tab picks it up via the `storage` event and can
 * accept / advance / cancel it. Every mutation is immediately
 * visible to the other tab.
 */
import { Order, OrderStatus } from '../types';

const STORAGE_KEY = 'fd_active_orders';

// ─── helpers ────────────────────────────────────────────────

function read(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  // StorageEvent only fires in *other* tabs.  To also notify the
  // current tab we dispatch a custom event.
  window.dispatchEvent(new CustomEvent('fd-order-change', { detail: orders }));
}

// ─── public API ─────────────────────────────────────────────

/** Get all orders currently in the bridge. */
export function getActiveOrders(): Order[] {
  return read();
}

/** Publish a new order (called by the user side after checkout). */
export function publishOrder(order: Order) {
  const orders = read();
  // Avoid duplicates
  const idx = orders.findIndex(o => o.id === order.id);
  if (idx >= 0) {
    orders[idx] = order;
  } else {
    orders.push(order);
  }
  write(orders);
}

/** Update the status of an order (called by the captain side). */
export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  captainName?: string,
) {
  const orders = read();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx < 0) return;
  orders[idx] = {
    ...orders[idx],
    status,
    ...(captainName ? { captainName } : {}),
  };
  write(orders);
}

/** Remove a finished / cancelled order from the bridge. */
export function removeOrder(orderId: string) {
  write(read().filter(o => o.id !== orderId));
}

/**
 * Subscribe to order changes.
 * Fires on:
 *   - `storage` events from other tabs
 *   - `fd-order-change` custom events from the current tab
 *
 * Returns an unsubscribe function.
 */
export function onOrderChange(cb: (orders: Order[]) => void): () => void {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cb(read());
    }
  };

  const handleCustom = (e: Event) => {
    cb((e as CustomEvent).detail as Order[]);
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('fd-order-change', handleCustom);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('fd-order-change', handleCustom);
  };
}
