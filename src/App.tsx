import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
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
import Onboarding from './components/Onboarding';
import ProtectedRoute from './components/ProtectedRoute';
import OfflineBanner from './components/OfflineBanner';
import CaptainDashboard from './components/captain/CaptainDashboard';
import BulkOrder from './components/BulkOrder';

function AppRoutes() {
  const { user } = useAppContext();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/garage" element={<ProtectedRoute><Garage /></ProtectedRoute>} />
      <Route path="/order" element={<ProtectedRoute><OrderFuel /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/tracking" element={<ProtectedRoute><LiveTracking /></ProtectedRoute>} />
      <Route path="/rating" element={<ProtectedRoute><Rating /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      <Route path="/fleet" element={<ProtectedRoute><BulkOrder /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      <Route path="/privacy" element={<Legal type="privacy" />} />
      <Route path="/terms" element={<Legal type="terms" />} />
      {/* Captain App (Feature 10) - publicly accessible */}
      <Route path="/captain" element={<CaptainDashboard />} />
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <OfflineBanner />
      <NotificationToast />
      <AppRoutes />
    </>
  );
}
