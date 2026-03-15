import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Garage from './components/Garage';
import OrderFuel from './components/OrderFuel';
import Checkout from './components/Checkout';
import LiveTracking from './components/LiveTracking';
import Rating from './components/Rating';
import OrderHistory from './components/OrderHistory';
import NotificationToast from './components/NotificationToast';
import Settings from './components/Settings';
import Legal from './components/Legal';
import About from './components/About';

import Favorites from './components/Favorites';

function AppContent() {
  const { currentView } = useAppContext();

  switch (currentView) {
    case 'login':
      return <Login />;
    case 'home':
      return <Home />;
    case 'profile':
      return <Profile />;
    case 'garage':
      return <Garage />;
    case 'order':
      return <OrderFuel />;
    case 'checkout':
      return <Checkout />;
    case 'tracking':
      return <LiveTracking />;
    case 'rating':
      return <Rating />;
    case 'history':
      return <OrderHistory />;
    case 'settings':
      return <Settings />;
    case 'about':
      return <About />;
    case 'privacy':
      return <Legal type="privacy" />;
    case 'terms':
      return <Legal type="terms" />;
    case 'favorites':
      return <Favorites />;
    default:
      return <Login />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <NotificationToast />
      <AppContent />
    </AppProvider>
  );
}
