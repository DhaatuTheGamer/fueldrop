import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { User, Vehicle, Order, Location, FavoriteOrder, AppNotification, CartItem, SavedAddress, OrderStatus } from '../types';
import { usePersistedState, clearPersistedState } from '../hooks/usePersistedState';

const PERSISTED_KEYS = ['fd_user', 'fd_vehicles', 'fd_orders', 'fd_favorites', 'fd_darkMode', 'fd_onboarding', 'fd_savedAddresses'];

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  vehicles: Vehicle[];
  setVehicles: (vehicles: Vehicle[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  currentOrder: Partial<Order> | null;
  setCurrentOrder: (order: Partial<Order> | null) => void;
  location: Location | null;
  setLocation: (location: Location | null) => void;
  favoriteOrders: FavoriteOrder[];
  setFavoriteOrders: (favorites: FavoriteOrder[]) => void;
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
  markNotificationRead: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (v: boolean) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  savedAddresses: SavedAddress[];
  setSavedAddresses: (addresses: SavedAddress[]) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, extra?: Partial<Order>) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = usePersistedState<User | null>('fd_user', null);
  const [vehicles, setVehicles] = usePersistedState<Vehicle[]>('fd_vehicles', []);
  const [orders, setOrders] = usePersistedState<Order[]>('fd_orders', []);
  const [currentOrder, setCurrentOrder] = useState<Partial<Order> | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [favoriteOrders, setFavoriteOrders] = usePersistedState<FavoriteOrder[]>('fd_favorites', []);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [darkMode, setDarkMode] = usePersistedState<boolean>('fd_darkMode', true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = usePersistedState<boolean>('fd_onboarding', false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedAddresses, setSavedAddresses] = usePersistedState<SavedAddress[]>('fd_savedAddresses', []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotifications(prev => {
      // Avoid duplicate notifications in quick succession
      if (prev.length > 0 && prev[0].title === title && prev[0].message === message) {
        return prev;
      }
      return [{
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false
      }, ...prev];
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  // Auto-dismiss unread notifications after 5 seconds
  useEffect(() => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;

    const timers = unread.map(n => {
      return setTimeout(() => {
        markNotificationRead(n.id);
      }, 5000);
    });

    return () => timers.forEach(clearTimeout);
  }, [notifications, markNotificationRead]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, extra?: Partial<Order>) => {
    setOrders((prev: Order[]) => prev.map(o => o.id === orderId ? { ...o, status, ...extra } : o));
    setCurrentOrder(prev => (prev?.id === orderId) ? { ...prev, status, ...extra } : prev);
  }, [setOrders]);

  const logout = () => {
    clearPersistedState(PERSISTED_KEYS);
    setUser(null);
    setVehicles([]);
    setOrders([]);
    setFavoriteOrders([]);
    setHasCompletedOnboarding(false);
    setCurrentOrder(null);
    setLocation(null);
    setNotifications([]);
    setCart([]);
    setSavedAddresses([]);
  };

  const contextValue = useMemo(() => ({
    user,
    setUser,
    vehicles,
    setVehicles,
    orders,
    setOrders,
    currentOrder,
    setCurrentOrder,
    location,
    setLocation,
    favoriteOrders,
    setFavoriteOrders,
    notifications,
    addNotification,
    markNotificationRead,
    darkMode,
    setDarkMode,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
    cart,
    setCart,
    savedAddresses,
    setSavedAddresses,
    updateOrderStatus,
    logout,
  }), [
    user, setUser, vehicles, setVehicles, orders, setOrders,
    currentOrder, location, favoriteOrders, setFavoriteOrders,
    notifications, addNotification, markNotificationRead,
    darkMode, setDarkMode, hasCompletedOnboarding, setHasCompletedOnboarding,
    cart, savedAddresses, setSavedAddresses, updateOrderStatus, logout
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

