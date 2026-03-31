// ⚡ Bolt: Memoized derived state to prevent unnecessary recalculations on re-renders
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { MapPin, Bell, Fuel, Car, Clock, Settings, ArrowRight, AlertCircle, Droplets, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import VehicleSelectModal from './VehicleSelectModal';

export default function Home() {
  const { user, orders, notifications, vehicles, setCurrentOrder, addNotification } = useAppContext();
  const navigate = useNavigate();
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const recentOrders = useMemo(() => orders
    .map(order => ({ order, time: new Date(order.date).getTime() }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 2)
    .map(item => item.order), [orders]);
  const vehiclesWithReminders = useMemo(() => vehicles.filter(v => v.tankCapacity && v.avgDailyKm), [vehicles]);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [pendingReorder, setPendingReorder] = useState<typeof orders[0] | null>(null);

  const handleReorder = (order: typeof orders[0]) => {
    const vehicle = vehicles.find(v => v.id === order.vehicleId);
    if (vehicle) {
      setCurrentOrder({
        vehicleId: order.vehicleId,
        fuelType: order.fuelType,
        amountRupees: order.amountRupees,
        quantityLiters: order.quantityLiters,
        location: order.location,
      });
      navigate('/checkout');
    } else {
      // Vehicle deleted — show vehicle select modal instead of blocking
      setPendingReorder(order);
      setShowVehicleModal(true);
    }
  };

  const handleVehicleSelected = (vehicleId: string) => {
    if (pendingReorder) {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      setCurrentOrder({
        vehicleId,
        fuelType: vehicle?.fuelType || pendingReorder.fuelType,
        amountRupees: pendingReorder.amountRupees,
        quantityLiters: pendingReorder.quantityLiters,
        location: pendingReorder.location,
      });
      navigate('/checkout');
    }
  };

  const vehiclesWithRefillData = vehicles.filter(v => v.tankCapacity && v.avgDailyKm);

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 bg-primary border-2 border-border rounded-sm flex items-center justify-center text-bg font-heading font-bold text-lg transition-colors shadow-brutal-sm">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-xs text-muted font-body uppercase tracking-wider">Welcome back,</p>
            <p className="font-heading font-bold text-text leading-tight">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/settings')}
            aria-label="Settings"
            className="p-2 text-text border-2 border-border rounded-sm hover:border-primary hover:text-primary transition-colors bg-bg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Settings size={20} />
          </button>
          <button
            aria-label="Notifications"
            className="p-2 text-text border-2 border-border rounded-sm hover:border-primary hover:text-primary transition-colors bg-bg relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-sm border-2 border-border"></span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary border-2 border-border rounded-sm p-6 text-bg shadow-brutal relative overflow-hidden"
        >
          <div className="relative z-10">
            <p className="text-bg/80 font-body text-xs uppercase tracking-widest mb-1 flex items-center font-bold">
              <MapPin size={14} className="mr-1" /> Current Location
            </p>
            <h2 className="text-xl font-heading font-bold mb-4 line-clamp-1">Koramangala, Bangalore</h2>
            <button 
              onClick={() => navigate('/order')}
              className="bg-bg text-text border-2 border-border px-6 py-3 rounded-sm font-heading font-bold text-sm uppercase tracking-wider shadow-brutal hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-brutal-sm transition-all inline-flex items-center focus-visible:ring-2 focus-visible:ring-text focus-visible:outline-none"
            >
              Order Fuel Now <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/garage')}
            className="card-brutal p-5 flex flex-col items-center justify-center text-center hover:border-primary transition-colors group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <div className="w-12 h-12 bg-bg border-2 border-border rounded-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-brutal-sm">
              <Car size={24} className="text-primary" />
            </div>
            <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">Garage</span>
            <span className="text-xs text-muted font-body mt-1">Vehicles</span>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => navigate('/fleet')}
            className="card-brutal p-5 flex flex-col items-center justify-center text-center hover:border-primary transition-colors group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <div className="w-12 h-12 bg-bg border-2 border-border rounded-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-brutal-sm">
              <Users size={24} className="text-primary" />
            </div>
            <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">Fleet</span>
            <span className="text-xs text-muted font-body mt-1">Bulk order</span>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/history')}
            className="card-brutal p-5 flex flex-col items-center justify-center text-center hover:border-primary transition-colors group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <div className="w-12 h-12 bg-bg border-2 border-border rounded-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-brutal-sm">
              <Clock size={24} className="text-primary" />
            </div>
            <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">History</span>
            <span className="text-xs text-muted font-body mt-1">Past orders</span>
          </motion.button>
        </div>

        {/* Feature 6: Predictive Refill Reminders */}
        {vehiclesWithReminders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider mb-3 flex items-center">
              <Droplets size={18} className="mr-2 text-primary" /> Refill Reminders
            </h3>
            <div className="space-y-3">
              {vehiclesWithReminders.map(vehicle => {
                const fuelEfficiency = vehicle.fuelType === 'Petrol' ? 15 : 20; // km/L estimate
                const dailyFuelUsage = (vehicle.avgDailyKm || 1) / fuelEfficiency;
                const daysUntilEmpty = Math.floor((vehicle.tankCapacity || 1) / dailyFuelUsage);
                const isUrgent = daysUntilEmpty <= 3;
                const isWarning = daysUntilEmpty <= 7;

                return (
                  <div
                    key={vehicle.id}
                    className={`card-brutal p-4 transition-colors ${
                      isUrgent ? 'border-red-500 bg-red-500/5' : isWarning ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-sm border-2 border-border flex items-center justify-center shadow-brutal-sm ${
                          isUrgent ? 'bg-red-500 text-white' : 'bg-surface text-primary'
                        }`}>
                          {isUrgent ? <AlertCircle size={20} /> : <Car size={20} />}
                        </div>
                        <div>
                          <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">
                            {vehicle.make} {vehicle.model}
                          </p>
                          <p className={`text-xs font-heading font-bold ${
                            isUrgent ? 'text-red-500' : isWarning ? 'text-primary' : 'text-accent'
                          }`}>
                            {isUrgent ? `⚠ Refill in ~${daysUntilEmpty} days!` : `~${daysUntilEmpty} days until refill`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/order')}
                        className="text-xs font-heading font-bold bg-primary text-bg px-3 py-1.5 rounded-sm border-2 border-border shadow-brutal-sm hover:translate-y-px hover:shadow-none transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-offset-2"
                      >
                        REFILL
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider">Recent Orders</h3>
            <button onClick={() => navigate('/history')} className="text-sm text-primary font-heading font-bold uppercase tracking-wider hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">See All</button>
          </div>
          
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="card-brutal p-6 text-center transition-colors">
                <p className="text-muted font-body text-sm">No recent orders.</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="card-brutal p-4 flex items-center justify-between transition-colors hover:border-primary">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-bg border-2 border-border rounded-sm flex items-center justify-center mr-3 transition-colors">
                      <Fuel size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-text text-sm uppercase">{order.fuelType} • {order.quantityLiters}L</p>
                      <p className="text-xs text-muted font-body mt-0.5">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-heading font-bold text-text text-sm">₹{order.totalAmount}</p>
                    <p className={`text-xs font-heading font-bold uppercase tracking-wider mt-0.5 mb-2 ${
                      order.status === 'Delivered' ? 'text-accent' : 'text-primary'
                    }`}>{order.status}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(order);
                      }}
                      className="text-xs font-heading font-bold bg-surface border-2 border-border px-2 py-1 rounded-sm hover:bg-primary hover:text-bg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      REORDER
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </main>

      <VehicleSelectModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onSelect={handleVehicleSelected}
        title="Vehicle Deleted"
      />
    </div>
  );
}
