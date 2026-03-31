import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageSquare, CheckCircle2, Clock, Truck, AlertTriangle, X, Headphones, MapPin, Ban, PhoneCall, RefreshCw, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { OrderStatus } from '../types';
import { getActiveOrders, onOrderChange, updateOrderStatus as bridgeUpdateStatus } from '../services/orderBridge';
import { SUPPORT_PHONE } from '../config/constants';

const statuses: OrderStatus[] = ['Pending', 'Accepted', 'Out for Delivery', 'Arriving', 'Delivered'];

const SUPPORT_OPTIONS = [
  { id: 'find', icon: <MapPin size={18} />, label: "Captain can't find my vehicle", desc: 'We\'ll share your exact location' },
  { id: 'delay', icon: <Clock size={18} />, label: 'Delivery is taking too long', desc: 'We\'ll check with the captain' },
  { id: 'cancel', icon: <Ban size={18} />, label: 'Cancel this order', desc: 'Cancellation charges may apply' },
  { id: 'call', icon: <PhoneCall size={18} />, label: `Call Support: ${SUPPORT_PHONE}`, desc: 'Available 24/7' },
];

export default function LiveTracking() {
  const { addNotification, currentOrder, updateOrderStatus } = useAppContext();
  const navigate = useNavigate();
  
  // Derive current status from context directly to avoid stale closures
  const currentStatus = currentOrder?.status || 'Pending';
  const [captainName, setCaptainName] = useState<string | null>(null);
  
  const [eta, setEta] = useState(12 * 60);
  const [showSOS, setShowSOS] = useState(false);
  const [graceSeconds, setGraceSeconds] = useState(60);

  // Sync with order bridge
  useEffect(() => {
    if (!currentOrder?.id) return;

    const handleOrders = (orders: any[]) => {
      const active = orders.find(o => o.id === currentOrder.id);
      if (active) {
        // If the bridge has a newer status than what we know about
        if (active.status !== currentStatus) {
          updateOrderStatus(active.id, active.status, { captainName: active.captainName }); // Update context
          
          if (active.status === 'Accepted') {
            addNotification('Order Confirmed', `${active.captainName || 'A captain'} has accepted your order.`, 'success');
          } else if (active.status === 'Out for Delivery') {
            addNotification('Out for Delivery', 'Your captain is on the way with your fuel.', 'info');
          } else if (active.status === 'Delivered') {
            addNotification('Order Delivered', 'Your fuel has been delivered successfully!', 'success');
          } else if (active.status === 'Cancelled') {
            addNotification('Order Cancelled', 'No captain available, please try again later.', 'warning');
          }
        }
        if (active.captainName) setCaptainName(active.captainName);
      }
    };

    // Initial check
    handleOrders(getActiveOrders());

    // Subscribe to changes
    return onOrderChange(handleOrders);
  }, [currentOrder?.id, currentStatus, addNotification, updateOrderStatus]);

  // ETA countdown
  useEffect(() => {
    if (currentStatus === 'Delivered' || currentStatus === 'Cancelled') return;
    
    const timer = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStatus]);

  // Auto-navigate on delivery
  useEffect(() => {
    if (currentStatus === 'Delivered') {
      const timer = setTimeout(() => {
        navigate('/rating');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStatus, navigate]);

  // Feature 7: Modification grace period countdown
  useEffect(() => {
    if (currentStatus !== 'Pending') return;
    if (graceSeconds <= 0) return;

    const timer = setInterval(() => {
      setGraceSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStatus, graceSeconds]);

  const handleSupportOption = (id: string) => {
    setShowSOS(false);
    switch (id) {
      case 'find':
        addNotification('Location Shared', 'Your precise GPS location has been shared with the captain.', 'success');
        break;
      case 'delay':
        addNotification('Support Notified', 'We\'re checking with your captain. Please wait.', 'info');
        break;
      case 'cancel':
        if (currentOrder?.id) {
          bridgeUpdateStatus(currentOrder.id, 'Cancelled');
        }
        addNotification('Cancellation Request', 'Your cancellation request has been submitted.', 'warning');
        break;
      case 'call':
        addNotification('Calling Support', 'Connecting you to our support team...', 'info');
        break;
    }
  };

  useEffect(() => {
    if (!currentOrder) {
      navigate('/');
    }
  }, [currentOrder, navigate]);

  if (!currentOrder) {
    return null;
  }

  // Handle cancelled state specially
  if (currentStatus === 'Cancelled') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-surface border-2 border-border rounded-sm flex items-center justify-center mb-6 shadow-brutal text-muted">
          <Ban size={40} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-text uppercase tracking-wider mb-2">Order Cancelled</h2>
        <p className="text-muted font-body mb-8">
          No captain available. Please try again later or check your network connection.
        </p>
        <button 
          onClick={() => navigate('/order')} 
          className="btn-primary px-8 py-4 text-lg flex items-center shadow-brutal"
        >
          <RefreshCw size={20} className="mr-2" /> Try Again
        </button>
      </div>
    );
  }

  const statusIndex = statuses.indexOf(currentStatus);
  const isPending = currentStatus === 'Pending';

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <div className="flex-1 relative bg-surface transition-colors">
        {/* Simulated Map Area */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at center, #E56B25 2px, transparent 2px)',
            backgroundSize: '24px 24px'
          }} />
          
          {/* Route Line */}
          {!isPending && currentStatus !== 'Delivered' && (
            <svg className="absolute w-full h-full" style={{ filter: 'drop-shadow(4px 4px 0px rgba(229, 107, 37, 0.2))' }}>
              <path 
                d="M 100,100 C 150,200 250,150 300,300" 
                fill="none" 
                stroke="#E56B25" 
                strokeWidth="4" 
                strokeDasharray="8 8"
                className="animate-[dash_20s_linear_infinite]"
              />
            </svg>
          )}

          {/* Delivery Vehicle Marker */}
          {!isPending && currentStatus !== 'Delivered' && (
            <motion.div 
              className="absolute w-12 h-12 bg-bg rounded-sm shadow-brutal flex items-center justify-center border-2 border-border z-10"
              animate={{ 
                x: [0, 50, 150, 200],
                y: [0, 100, 50, 200]
              }}
              transition={{ duration: 16, ease: "linear" }}
            >
              <Truck size={20} className="text-primary" />
            </motion.div>
          )}

          {/* Destination Marker */}
          <div className="absolute top-[300px] left-[300px] -translate-x-1/2 -translate-y-1/2">
            {!isPending && currentStatus !== 'Delivered' && (
              <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping absolute inset-0" />
            )}
            <div className="w-8 h-8 bg-primary rounded-sm border-2 border-border shadow-brutal relative z-10 flex items-center justify-center">
              <div className="w-2 h-2 bg-bg rounded-sm" />
            </div>
          </div>
        </div>

        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-linear-to-b from-bg/80 to-transparent">
          <div className="bg-bg/90 backdrop-blur-md rounded-sm p-4 shadow-brutal flex items-center justify-between border-2 border-border">
            <div>
              <p className="label-small">Estimated Arrival</p>
              <p className="text-2xl font-heading font-bold text-text">
                {isPending ? '--:--' : `${Math.floor(eta / 60)}:${String(eta % 60).padStart(2, '0')}`}
              </p>
            </div>
            <div className="text-right">
              <p className="label-small">Distance</p>
              <p className="text-lg font-heading font-bold text-text">{isPending ? '--' : '2.4 km'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 7: Modification Grace Period Banner */}
      {isPending && graceSeconds > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 my-3 bg-primary/10 border-2 border-primary/30 rounded-sm p-4 z-20 relative"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="font-heading font-bold text-text text-sm uppercase tracking-wider flex items-center">
              <Edit3 size={14} className="mr-2 text-primary" /> Modification Window
            </p>
            <span className="font-heading font-bold text-primary text-lg">
              0:{String(graceSeconds).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[10px] text-muted font-body mb-3">You can still edit your order before a captain picks it up.</p>
          <button
            onClick={() => navigate('/order')}
            className="btn-secondary w-full py-2 text-sm flex items-center justify-center"
          >
            <Edit3 size={14} className="mr-2" /> Edit Order
          </button>
        </motion.div>
      )}
      <div className="bg-bg border-t-2 border-border z-20 relative transition-colors">
        <div className="w-12 h-1.5 bg-border rounded-sm mx-auto mt-4 mb-6" />
        
        <div className="px-6 pb-8">
          {/* Status Tracker */}
          <div className="mb-8">
            <h2 className="text-xl font-heading font-bold text-text uppercase tracking-wider mb-6">
              {currentStatus === 'Pending' ? 'Finding a Captain...' : currentStatus}
            </h2>
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-6 relative">
                {statuses.map((status, index) => {
                  // We treat index matching as the active step
                  const isCompleted = index <= statusIndex;
                  const isCurrent = index === statusIndex;
                  
                  return (
                    <div key={status} className="flex items-center">
                      <div className={`w-8 h-8 rounded-sm border-2 flex items-center justify-center z-10 transition-colors duration-300 ${
                        isCompleted ? 'bg-primary border-border text-bg shadow-brutal-sm' : 'bg-surface border-border text-muted'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className={`font-heading font-bold uppercase tracking-wider transition-colors duration-300 ${
                          isCurrent ? 'text-primary text-lg' : 
                          isCompleted ? 'text-text' : 'text-muted'
                        }`}>
                          {status}
                        </p>
                        <AnimatePresence>
                          {isCurrent && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-sm text-muted font-body mt-1"
                            >
                              {status === 'Pending' && 'Waiting for captain to accept...'}
                              {status === 'Accepted' && 'Captain is heading to the fuel station.'}
                              {status === 'Out for Delivery' && 'Captain is on the way to your location.'}
                              {status === 'Arriving' && 'Captain is arriving in a minute.'}
                              {status === 'Delivered' && 'Fuel delivered successfully!'}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Captain Info (only row if accepted or later) */}
          <AnimatePresence>
            {!isPending && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-brutal p-4 flex items-center justify-between transition-colors mt-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-surface border-2 border-border rounded-sm flex items-center justify-center overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Captain" className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-text uppercase tracking-wider">{captainName || 'Captain'}</p>
                    <p className="text-sm text-muted font-body flex items-center">
                      <span className="text-primary mr-1">★</span> 4.8 (120+ deliveries)
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button aria-label="Message Captain" className="w-10 h-10 bg-surface border-2 border-border rounded-sm flex items-center justify-center text-text shadow-brutal-sm hover:bg-bg transition-colors">
                    <MessageSquare size={18} />
                  </button>
                  <button aria-label="Call Captain" className="w-10 h-10 bg-primary border-2 border-border rounded-sm flex items-center justify-center text-bg shadow-brutal-sm hover:bg-opacity-90 transition-colors">
                    <Phone size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SOS / Support FAB (Feature 5) */}
      {currentStatus !== 'Delivered' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowSOS(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-red-500 border-2 border-border rounded-sm shadow-brutal flex items-center justify-center text-white hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-brutal-sm transition-all"
        >
          <AlertTriangle size={22} className={isPending ? "animate-pulse" : ""} />
        </motion.button>
      )}

      {/* Support Action Sheet (Feature 5) */}
      <AnimatePresence>
        {showSOS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowSOS(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-surface border-t-2 border-x-2 border-border rounded-t-sm p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500/20 border-2 border-red-500 rounded-sm flex items-center justify-center">
                    <Headphones size={20} className="text-red-500" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider">Need Help?</h3>
                </div>
                <button aria-label="Close SOS" onClick={() => setShowSOS(false)} className="text-muted hover:text-text transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-muted font-body mb-4">
                Select an issue below and we'll help you right away.
              </p>

              <div className="space-y-2">
                {SUPPORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSupportOption(option.id)}
                    className="w-full flex items-center space-x-4 p-4 bg-bg border-2 border-border rounded-sm hover:border-primary transition-colors text-left group"
                  >
                    <div className="w-10 h-10 bg-surface border-2 border-border rounded-sm flex items-center justify-center text-primary shrink-0 shadow-brutal-sm group-hover:bg-primary group-hover:text-bg transition-colors">
                      {option.icon}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">{option.label}</p>
                      <p className="text-xs text-muted font-body mt-0.5">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button onClick={() => setShowSOS(false)} className="btn-secondary w-full mt-4 py-3">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
