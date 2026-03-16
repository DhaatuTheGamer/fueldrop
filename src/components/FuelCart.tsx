import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Trash2, ArrowRight, Fuel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function FuelCart() {
  const { cart, setCart, vehicles, setCurrentOrder, location } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const vehicleMap = useMemo(() => {
    return new Map(vehicles.map(v => [v.id, v]));
  }, [vehicles]);

  if (cart.length === 0) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.amountRupees, 0);

  const handleRemoveItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    // Create a combined order from cart items
    const totalQty = cart.reduce((sum, item) => sum + item.quantityLiters, 0);
    const totalAmt = cart.reduce((sum, item) => sum + item.amountRupees, 0);

    setCurrentOrder({
      vehicleId: cart[0].vehicleId,
      fuelType: cart[0].fuelType,
      amountRupees: totalAmt,
      quantityLiters: totalQty,
      location: location || undefined,
    });

    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Floating Cart Badge */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary border-2 border-border rounded-sm shadow-brutal flex items-center justify-center text-bg hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-brutal-sm transition-all"
      >
        <ShoppingCart size={22} />
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-bg text-xs font-heading font-bold rounded-full flex items-center justify-center border-2 border-border">
          {cart.length}
        </span>
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-surface border-t-2 border-x-2 border-border rounded-t-sm p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider">
                  Fuel Cart ({cart.length})
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-muted hover:text-text transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                {cart.map((item) => {
                  const vehicle = vehicleMap.get(item.vehicleId);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-bg border-2 border-border rounded-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-surface border-2 border-border rounded-sm flex items-center justify-center text-primary shadow-brutal-sm">
                          <Fuel size={18} />
                        </div>
                        <div>
                          <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">
                            {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehicle'}
                          </p>
                          <p className="text-xs text-muted font-body">
                            {item.fuelType} • {item.quantityLiters.toFixed(1)}L
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-heading font-bold text-text">₹{item.amountRupees.toFixed(0)}</span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-t-2 border-border pt-4">
                <span className="font-heading font-bold text-text uppercase tracking-wider">Total</span>
                <span className="font-heading font-bold text-primary text-xl">₹{totalAmount.toFixed(0)}</span>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full py-4 text-base">
                Checkout All <ArrowRight size={18} className="ml-2" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
