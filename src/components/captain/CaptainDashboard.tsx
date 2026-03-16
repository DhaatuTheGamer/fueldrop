import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck, DollarSign, Star, Package, Navigation
} from 'lucide-react';
import { Order } from '../../types';
import { getActiveOrders, onOrderChange, updateOrderStatus, removeOrder } from '../../services/orderBridge';
import { SAFETY_ITEMS } from './constants';
import IncomingOrderView from './IncomingOrderView';
import ActiveOrderView from './ActiveOrderView';

type CaptainStatus = 'offline' | 'available' | 'incoming' | 'accepted' | 'pickup' | 'transit' | 'arrived' | 'fueling' | 'completed';

export default function CaptainDashboard() {
  const [status, setStatus] = useState<CaptainStatus>('offline');
  const [checklist, setChecklist] = useState<boolean[]>(new Array(SAFETY_ITEMS.length).fill(false));
  const [earnings] = useState({ today: 1240, trips: 5, rating: 4.9 });
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Sync orders from bridge
  useEffect(() => {
    const handleOrders = (orders: Order[]) => {
      // Find the first pending order if we're available, or our current active order
      const pending = orders.find(o => o.status === 'Pending');
      
      if (status === 'available' && pending && !activeOrder) {
        setActiveOrder(pending);
        setStatus('incoming');
      } else if (activeOrder) {
        // Update our active order reference if it changed in the bridge
        const updated = orders.find(o => o.id === activeOrder.id);
        if (updated) {
          setActiveOrder(updated);
          // If the order was cancelled by user (or somewhere else), reset
          if (updated.status === 'Cancelled') {
            setActiveOrder(null);
            setStatus('available');
            setChecklist(new Array(SAFETY_ITEMS.length).fill(false));
          }
        }
      }
    };

    // Initial load
    handleOrders(getActiveOrders());

    // Subscribe to changes
    return onOrderChange(handleOrders);
  }, [status, activeOrder]);

  const handleAccept = () => {
    if (!activeOrder) return;
    setStatus('accepted');
    updateOrderStatus(activeOrder.id, 'Accepted', 'Rahul Kumar');
  };

  const handleDecline = () => {
    if (!activeOrder) return;
    // We treat declining as cancelling the order so the user sees it
    updateOrderStatus(activeOrder.id, 'Cancelled');
    setActiveOrder(null);
    setStatus('available');
  };

  const handleStartPickup = () => setStatus('pickup'); // Internal step, no status change in DB yet
  
  const handlePickedUp = () => {
    if (!activeOrder) return;
    setStatus('transit');
    updateOrderStatus(activeOrder.id, 'Out for Delivery');
  };
  
  const handleArrived = () => {
    if (!activeOrder) return;
    setStatus('arrived');
    updateOrderStatus(activeOrder.id, 'Arriving');
  };
  
  const handleStartFueling = () => setStatus('fueling'); // Internal step
  
  const handleComplete = () => {
    if (!activeOrder) return;
    setStatus('completed');
    updateOrderStatus(activeOrder.id, 'Delivered');
  };
  
  const handleNewOrder = () => {
    if (activeOrder) {
      removeOrder(activeOrder.id);
    }
    setActiveOrder(null);
    setStatus('available'); 
    setChecklist(new Array(SAFETY_ITEMS.length).fill(false)); 
  };

  const statusColors: Record<string, string> = {
    offline: 'bg-muted',
    available: 'bg-accent',
    incoming: 'bg-primary',
    accepted: 'bg-primary',
    pickup: 'bg-primary',
    transit: 'bg-primary',
    arrived: 'bg-primary',
    fueling: 'bg-primary',
    completed: 'bg-accent',
  };

  const displayVehicle = activeOrder?.vehicleMake 
    ? `${activeOrder.vehicleMake} ${activeOrder.vehicleModel || ''} (${activeOrder.licensePlate || 'Unknown'})`
    : 'Vehicle not specified';

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      {/* Captain Header */}
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-accent border-2 border-border rounded-sm flex items-center justify-center text-bg font-heading font-bold text-lg shadow-brutal-sm">
            <Truck size={20} />
          </div>
          <div className="ml-3">
            <p className="text-xs text-muted font-body uppercase tracking-wider">Captain Mode</p>
            <p className="font-heading font-bold text-text leading-tight">Rahul Kumar</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${statusColors[status]} ${status !== 'offline' ? 'animate-pulse' : ''}`} />
          <span className="text-xs font-heading font-bold text-text uppercase tracking-wider">
            {status === 'offline' ? 'OFFLINE' : status === 'available' ? 'ONLINE' : 'ON TRIP'}
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
        {/* Driver Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent border-2 border-border rounded-sm p-6 text-bg shadow-brutal relative overflow-hidden"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-bg/20 border-2 border-bg/30 rounded-sm flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="Captain" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl">Rahul Kumar</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Star size={14} className="fill-current" />
                  <span className="text-sm font-bold">{earnings.rating}</span>
                  <span className="text-bg/60 text-sm">• 120+ deliveries</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Earnings Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Today's Earnings", value: `₹${earnings.today}`, icon: <DollarSign size={18} /> },
            { label: 'Trips Today', value: earnings.trips.toString(), icon: <Package size={18} /> },
            { label: 'Rating', value: earnings.rating.toString(), icon: <Star size={18} /> },
          ].map((stat) => (
            <div key={stat.label} className="card-brutal p-4 text-center transition-colors">
              <div className="w-8 h-8 bg-bg border-2 border-border rounded-sm flex items-center justify-center text-primary mx-auto mb-2 shadow-brutal-sm">
                {stat.icon}
              </div>
              <p className="font-heading font-bold text-text text-lg">{stat.value}</p>
              <p className="text-[10px] text-muted font-body uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Status-based Content */}
        <AnimatePresence mode="wait">
          {/* Offline -> Go Online */}
          {status === 'offline' && (
            <motion.div
              key="offline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-surface border-2 border-border rounded-sm flex items-center justify-center mb-4 mx-auto shadow-brutal">
                <Truck size={36} className="text-muted" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider mb-2">You're Offline</h3>
              <p className="text-muted font-body text-sm mb-6">Go online to start receiving delivery requests.</p>
              <button
                onClick={() => setStatus('available')}
                className="btn-primary px-8 py-4 text-base mx-auto"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}
              >
                Go Online
              </button>
            </motion.div>
          )}

          {/* Available - Waiting */}
          {status === 'available' && (
            <motion.div
              key="available"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-accent/20 border-2 border-accent rounded-sm flex items-center justify-center mb-4 mx-auto animate-pulse">
                <Navigation size={36} className="text-accent" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider mb-2">Looking for Orders...</h3>
              <p className="text-muted font-body text-sm mb-6">Stay online to receive new delivery requests.</p>
              <button
                onClick={() => setStatus('offline')}
                className="btn-secondary px-6 py-3"
              >
                Go Offline
              </button>
            </motion.div>
          )}

          {/* Incoming Order */}
          {status === 'incoming' && activeOrder && (
            <IncomingOrderView
              key="incoming"
              activeOrder={activeOrder}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          )}

          {/* Active Order Flow */}
          {['accepted', 'pickup', 'transit', 'arrived', 'fueling', 'completed'].includes(status) && activeOrder && (
            <ActiveOrderView
              key="active"
              status={status}
              activeOrder={activeOrder}
              checklist={checklist}
              setChecklist={setChecklist}
              onStartPickup={handleStartPickup}
              onPickedUp={handlePickedUp}
              onArrived={handleArrived}
              onStartFueling={handleStartFueling}
              onComplete={handleComplete}
              onNewOrder={handleNewOrder}
              displayVehicle={displayVehicle}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
