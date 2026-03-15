import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Vehicle, Order, Location, FavoriteOrder, AppNotification } from '../types';
import { usePersistedState, clearPersistedState } from '../hooks/usePersistedState';

const PERSISTED_KEYS = ['fd_user', 'fd_vehicles', 'fd_orders', 'fd_favorites', 'fd_darkMode', 'fd_onboarding'];

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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotifications(prev => [{
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    }, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

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
  };

  return (
    <AppContext.Provider
      value={{
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
        logout,
      }}
    >
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
