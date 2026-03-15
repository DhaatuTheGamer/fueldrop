import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Bell, Fuel, Car, Clock, ChevronRight, Settings, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import VehicleSelectModal from './VehicleSelectModal';

export default function Home() {
  const { user, orders, notifications, vehicles, setCurrentOrder, addNotification } = useAppContext();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2);

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
            className="p-2 text-text border-2 border-border rounded-sm hover:border-primary hover:text-primary transition-colors bg-bg"
          >
            <Settings size={20} />
          </button>
          <button className="p-2 text-text border-2 border-border rounded-sm hover:border-primary hover:text-primary transition-colors bg-bg relative">
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
              className="bg-bg text-text border-2 border-border px-6 py-3 rounded-sm font-heading font-bold text-sm uppercase tracking-wider shadow-brutal hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-brutal-sm transition-all inline-flex items-center"
            >
              Order Fuel Now <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/garage')}
            className="card-brutal p-5 flex flex-col items-center justify-center text-center hover:border-primary transition-colors group"
          >
            <div className="w-12 h-12 bg-bg border-2 border-border rounded-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-brutal-sm">
              <Car size={24} className="text-primary" />
            </div>
            <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">My Garage</span>
            <span className="text-xs text-muted font-body mt-1">Manage vehicles</span>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/history')}
            className="card-brutal p-5 flex flex-col items-center justify-center text-center hover:border-primary transition-colors group"
          >
            <div className="w-12 h-12 bg-bg border-2 border-border rounded-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-brutal-sm">
              <Clock size={24} className="text-primary" />
            </div>
            <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">History</span>
            <span className="text-xs text-muted font-body mt-1">Past orders</span>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider">Recent Orders</h3>
            <button onClick={() => navigate('/history')} className="text-sm text-primary font-heading font-bold uppercase tracking-wider hover:underline">See All</button>
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
                      className="text-xs font-heading font-bold bg-surface border-2 border-border px-2 py-1 rounded-sm hover:bg-primary hover:text-bg transition-colors"
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
