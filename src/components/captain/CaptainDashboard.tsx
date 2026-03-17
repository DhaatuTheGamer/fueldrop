import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck, MapPin, Fuel, Clock, CheckCircle2, XCircle, DollarSign,
  Star, ChevronRight, Shield, User, Phone, Navigation, Package, Zap, MessageSquareText, ExternalLink
} from 'lucide-react';
import { Order } from '../../types';
import { getActiveOrders, onOrderChange, updateOrderStatus, removeOrder } from '../../services/orderBridge';

const SAFETY_ITEMS = [
  'Wear safety gloves before handling fuel',
  'Ensure no open flames or cigarettes nearby',
  'Verify vehicle is turned OFF before fueling',
  'Use anti-static grounding strap',
  'Confirm fuel type matches vehicle requirements',
];

type CaptainStatus = 'offline' | 'available' | 'incoming' | 'accepted' | 'pickup' | 'transit' | 'arrived' | 'fueling' | 'completed';

export default function CaptainDashboard() {
  const [status, setStatus] = useState<CaptainStatus>('offline');
  const [checklist, setChecklist] = useState<boolean[]>(new Array(SAFETY_ITEMS.length).fill(false));
  const [earnings] = useState({ today: 1240, trips: 5, rating: 4.9 });
  const allChecked = checklist.every(Boolean);
  
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
            <motion.div
              key="incoming"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-brutal p-6 transition-colors border-primary"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg text-primary uppercase tracking-wider animate-pulse">
                  New Order Request!
                </h3>
                <span className="text-xs font-heading font-bold bg-primary text-bg px-2 py-1 rounded-sm border-2 border-border">
                  2.4 km
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <User size={16} className="text-muted shrink-0" />
                  <span className="text-text font-body">Customer</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Fuel size={16} className="text-muted shrink-0" />
                  <span className="text-text font-body">
                    {activeOrder.fuelType} • {activeOrder.quantityLiters?.toFixed(2) || 0}L
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin size={16} className="text-muted shrink-0" />
                  <span className="text-text font-body line-clamp-2">{activeOrder.location.address}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <DollarSign size={16} className="text-muted shrink-0" />
                  <span className="font-heading font-bold text-primary">₹{(activeOrder.totalAmount || 0).toFixed(2)}</span>
                </div>
                {/* Feature 5: Emergency badge on incoming order */}
                {activeOrder.isEmergency && (
                  <div className="flex items-center space-x-2 text-sm bg-red-500/10 border-2 border-red-500/30 rounded-sm p-2">
                    <Zap size={16} className="text-red-500 shrink-0" />
                    <span className="font-heading font-bold text-red-500 uppercase tracking-wider text-xs">⚡ Emergency Priority</span>
                  </div>
                )}
                {/* Feature 4: Delivery instructions on incoming order */}
                {activeOrder.deliveryInstructions && (
                  <div className="flex items-start space-x-3 text-sm bg-bg border-2 border-border rounded-sm p-2">
                    <MessageSquareText size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-heading font-bold text-[10px] uppercase tracking-wider text-primary">Instructions</p>
                      <p className="text-xs text-muted font-body">{activeOrder.deliveryInstructions}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button onClick={handleDecline} className="btn-secondary flex-1 py-3 flex items-center justify-center">
                  <XCircle size={18} className="mr-2" /> Decline
                </button>
                <button onClick={handleAccept} className="btn-primary flex-1 py-3 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}
                >
                  <CheckCircle2 size={18} className="mr-2" /> Accept
                </button>
              </div>
            </motion.div>
          )}

          {/* Active Order Flow */}
          {['accepted', 'pickup', 'transit', 'arrived', 'fueling', 'completed'].includes(status) && activeOrder && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Order Details */}
              <div className="card-brutal p-5 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-text uppercase tracking-wider">Order {activeOrder.id.slice(-4)}</h3>
                  <span className="text-xs font-heading font-bold bg-primary text-bg px-2 py-1 rounded-sm border-2 border-border uppercase">
                    {status}
                  </span>
                </div>
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-muted">Customer</span>
                    <span className="text-text font-heading font-bold">{activeOrder.userName || 'Customer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Vehicle</span>
                    <span className="text-text font-heading font-bold text-xs uppercase text-right max-w-[150px]">{displayVehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Fuel</span>
                    <span className="text-text font-heading font-bold">{activeOrder.fuelType} • {activeOrder.quantityLiters?.toFixed(2)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Earnings</span>
                    <span className="text-primary font-heading font-bold">₹{((activeOrder.totalAmount || 0) * 0.12).toFixed(0)}</span>
                  </div>
                  {/* Feature 5: Emergency indicator in active order */}
                  {activeOrder.isEmergency && (
                    <div className="flex items-center space-x-2 bg-red-500/10 border-2 border-red-500/30 rounded-sm p-2 mt-1">
                      <Zap size={14} className="text-red-500" />
                      <span className="font-heading font-bold text-red-500 text-xs uppercase tracking-wider">Emergency Priority</span>
                    </div>
                  )}
                  {/* Feature 4: Delivery instructions in active order */}
                  {activeOrder.deliveryInstructions && (
                    <div className="flex items-start space-x-2 bg-bg border-2 border-border rounded-sm p-2 mt-1">
                      <MessageSquareText size={14} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-heading font-bold text-[10px] uppercase tracking-wider text-primary">Instructions</p>
                        <p className="text-xs text-muted font-body">{activeOrder.deliveryInstructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Steps */}
              <div className="card-brutal p-5 transition-colors">
                <h4 className="label-small mb-4">Delivery Progress</h4>
                <div className="relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
                  <div className="space-y-4 relative">
                    {[
                      { key: 'accepted', label: 'Order Accepted', desc: 'Head to nearest fuel station' },
                      { key: 'pickup', label: 'At Fuel Station', desc: 'Fill fuel and verify quantity' },
                      { key: 'transit', label: 'In Transit', desc: 'Driving to customer location' },
                      { key: 'arrived', label: 'Arrived', desc: 'At customer location' },
                      { key: 'fueling', label: 'Fueling Vehicle', desc: 'Complete safety checklist first' },
                      { key: 'completed', label: 'Completed', desc: 'Delivery successful!' },
                    ].map((step, idx) => {
                      const stepOrder = ['accepted', 'pickup', 'transit', 'arrived', 'fueling', 'completed'];
                      const currentIdx = stepOrder.indexOf(status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = stepOrder[idx] === status;

                      return (
                        <div key={step.key} className="flex items-center">
                          <div className={`w-8 h-8 rounded-sm border-2 flex items-center justify-center z-10 transition-colors ${
                            isCompleted ? 'bg-accent border-border text-bg shadow-brutal-sm' : 'bg-surface border-border text-muted'
                          }`}>
                            {isCompleted ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                          </div>
                          <div className="ml-4">
                            <p className={`font-heading font-bold uppercase tracking-wider text-sm ${
                              isCurrent ? 'text-accent' : isCompleted ? 'text-text' : 'text-muted'
                            }`}>{step.label}</p>
                            {isCurrent && (
                              <p className="text-xs text-muted font-body mt-0.5">{step.desc}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Safety Checklist (shown when arrived) */}
              {(status === 'arrived' || status === 'fueling') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="card-brutal p-5 transition-colors border-accent"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield size={18} className="text-accent" />
                    <h4 className="font-heading font-bold text-text uppercase tracking-wider text-sm">Safety Checklist</h4>
                  </div>
                  <div className="space-y-3">
                    {SAFETY_ITEMS.map((item, idx) => (
                      <label key={idx} className="flex items-start space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checklist[idx]}
                          onChange={() => {
                            const next = [...checklist];
                            next[idx] = !next[idx];
                            setChecklist(next);
                          }}
                          className="mt-1 w-4 h-4 rounded-sm border-2 border-border accent-accent"
                        />
                        <span className={`text-sm font-body transition-colors ${checklist[idx] ? 'text-text line-through' : 'text-muted group-hover:text-text'}`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contact Customer */}
              {status !== 'completed' && (
                <div className="space-y-3">
                  <div className="card-brutal p-4 flex items-center justify-between transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-surface border-2 border-border rounded-sm flex items-center justify-center">
                        <User size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">{activeOrder.userName || 'Customer'}</p>
                        <p className="text-xs text-muted font-body">{activeOrder.userPhone ? `+91 ${activeOrder.userPhone}` : '+91 XXXX XXXXX'}</p>
                      </div>
                    </div>
                    <button className="w-10 h-10 bg-accent border-2 border-border rounded-sm flex items-center justify-center text-bg shadow-brutal-sm">
                      <Phone size={18} />
                    </button>
                  </div>

                  {/* Feature 3: Navigate in Maps button */}
                  {activeOrder.location && (status === 'accepted' || status === 'pickup' || status === 'transit') && (
                    <button
                      onClick={() => window.open(`https://maps.google.com/?daddr=${activeOrder.location.lat},${activeOrder.location.lng}`, '_blank')}
                      className="card-brutal p-4 flex items-center justify-between transition-colors w-full hover:border-primary group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/20 border-2 border-accent rounded-sm flex items-center justify-center group-hover:bg-accent group-hover:text-bg transition-colors">
                          <Navigation size={18} className="text-accent group-hover:text-bg" />
                        </div>
                        <div className="text-left">
                          <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">Navigate in Maps</p>
                          <p className="text-xs text-muted font-body">Open Google Maps for directions</p>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-muted group-hover:text-primary" />
                    </button>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="pb-4">
                {status === 'accepted' && (
                  <button onClick={handleStartPickup} className="btn-primary w-full py-4 text-base" 
                    style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}>
                    Reached Fuel Station <ChevronRight size={18} className="ml-2" />
                  </button>
                )}
                {status === 'pickup' && (
                  <button onClick={handlePickedUp} className="btn-primary w-full py-4 text-base"
                    style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}>
                    Fuel Picked Up — Start Delivery <ChevronRight size={18} className="ml-2" />
                  </button>
                )}
                {status === 'transit' && (
                  <button onClick={handleArrived} className="btn-primary w-full py-4 text-base"
                    style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}>
                    I've Arrived <ChevronRight size={18} className="ml-2" />
                  </button>
                )}
                {status === 'arrived' && (
                  <button onClick={handleStartFueling} disabled={!allChecked} className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--accent)', boxShadow: allChecked ? '4px 4px 0px var(--accent)' : 'none' }}>
                    {allChecked ? 'Start Fueling' : 'Complete Safety Checklist'} <ChevronRight size={18} className="ml-2" />
                  </button>
                )}
                {status === 'fueling' && (
                  <button onClick={handleComplete} className="btn-primary w-full py-4 text-base"
                    style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}>
                    Mark as Completed <CheckCircle2 size={18} className="ml-2" />
                  </button>
                )}
                {status === 'completed' && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-accent border-2 border-border rounded-sm flex items-center justify-center mx-auto shadow-brutal">
                      <CheckCircle2 size={32} className="text-bg" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-text uppercase tracking-wider">Delivery Complete!</h3>
                    <p className="text-muted font-body text-sm">You earned ₹{((activeOrder.totalAmount || 0) * 0.12).toFixed(0)} for this trip.</p>
                    <button onClick={handleNewOrder} className="btn-primary px-8 py-3"
                      style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}>
                      Accept New Orders
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
