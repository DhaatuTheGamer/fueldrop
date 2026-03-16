import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Car, Fuel, Plus, Trash2, ArrowRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FuelType, Vehicle } from '../types';
import MapPicker from './MapPicker';

interface BulkItem {
  id: string;
  vehicleId: string;
  fuelType: FuelType;
  quantityLiters: number;
}

export default function BulkOrder() {
  const { vehicles, location, setLocation, setCurrentOrder, setCart, addNotification } = useAppContext();
  const navigate = useNavigate();
  const [items, setItems] = useState<BulkItem[]>([]);

  const FUEL_PRICE: Record<FuelType, number> = {
    Petrol: 101.5,
    Diesel: 89.2,
  };

  const addItem = () => {
    if (vehicles.length === 0) {
      addNotification('No Vehicles', 'Add vehicles to your garage first.', 'warning');
      return;
    }
    setItems(prev => [...prev, {
      id: `bulk-${Date.now()}`,
      vehicleId: vehicles[0].id,
      fuelType: vehicles[0].fuelType,
      quantityLiters: 10,
    }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: string, updates: Partial<BulkItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantityLiters * FUEL_PRICE[item.fuelType], 0);

  const handleContinue = () => {
    if (items.length === 0) {
      addNotification('Empty Order', 'Add at least one vehicle to your bulk order.', 'warning');
      return;
    }
    if (!location) {
      addNotification('Missing Location', 'Please set a delivery location.', 'warning');
      return;
    }

    // Convert bulk items to cart items
    const cartItems = items.map(item => ({
      id: item.id,
      vehicleId: item.vehicleId,
      fuelType: item.fuelType,
      orderType: 'quantity' as const,
      value: item.quantityLiters,
      quantityLiters: item.quantityLiters,
      amountRupees: item.quantityLiters * FUEL_PRICE[item.fuelType],
    }));
    setCart(cartItems);

    // Set the main order context
    const firstItem = items[0];
    setCurrentOrder({
      vehicleId: firstItem.vehicleId,
      fuelType: firstItem.fuelType,
      amountRupees: subtotal,
      quantityLiters: items.reduce((sum, i) => sum + i.quantityLiters, 0),
      location,
    });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center sticky top-0 z-10 transition-colors">
        <button onClick={() => navigate('/')} className="mr-4 text-text hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center space-x-2">
          <Users size={20} className="text-primary" />
          <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">Fleet Mode</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
        {/* Common Delivery Location */}
        <section className="card-brutal p-6 transition-colors">
          <h2 className="label-small mb-4">Delivery Location (All Vehicles)</h2>
          <MapPicker location={location} onLocationSelect={setLocation} />
        </section>

        {/* Vehicle Items */}
        <section className="card-brutal p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="label-small">Vehicles & Fuel</h2>
            <span className="text-xs font-heading font-bold text-muted">{items.length} / {vehicles.length}</span>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-6 bg-bg border-2 border-border rounded-sm">
              <p className="text-muted font-body text-sm mb-2">No vehicles in your garage.</p>
              <button onClick={() => navigate('/garage')} className="text-primary font-heading font-bold text-sm uppercase tracking-wider hover:underline">
                Go to Garage
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {items.map((item) => {
                  const vehicle = vehicles.find(v => v.id === item.vehicleId);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                      className="bg-bg border-2 border-border rounded-sm p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Car size={16} className="text-primary" />
                          <span className="font-heading font-bold text-text text-sm uppercase">
                            {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown'}
                          </span>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Vehicle Picker */}
                        <select
                          value={item.vehicleId}
                          onChange={(e) => {
                            const veh = vehicles.find(v => v.id === e.target.value);
                            updateItem(item.id, {
                              vehicleId: e.target.value,
                              fuelType: veh?.fuelType || item.fuelType,
                            });
                          }}
                          className="input-brutal text-xs col-span-1"
                        >
                          {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.make} {v.model}</option>
                          ))}
                        </select>

                        {/* Fuel Type */}
                        <select
                          value={item.fuelType}
                          onChange={(e) => updateItem(item.id, { fuelType: e.target.value as FuelType })}
                          className="input-brutal text-xs col-span-1"
                        >
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                        </select>

                        {/* Quantity */}
                        <div className="relative col-span-1">
                          <input
                            type="number"
                            value={item.quantityLiters}
                            onChange={(e) => updateItem(item.id, { quantityLiters: Number(e.target.value) || 0 })}
                            className="input-brutal text-xs w-full pr-6"
                            min={1}
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted font-heading font-bold">L</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-muted font-body">Subtotal</span>
                        <span className="font-heading font-bold text-text">₹{(item.quantityLiters * FUEL_PRICE[item.fuelType]).toFixed(2)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}

          {/* Add Vehicle Button */}
          {vehicles.length > 0 && (
            <button
              onClick={addItem}
              className="btn-secondary w-full py-3 mt-4 flex items-center justify-center text-sm"
            >
              <Plus size={16} className="mr-2" /> Add Vehicle
            </button>
          )}
        </section>

        {/* Order Summary */}
        {items.length > 0 && (
          <section className="card-brutal p-6 transition-colors">
            <h2 className="label-small mb-4">Fleet Order Summary</h2>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between text-muted">
                <span>Vehicles</span>
                <span className="font-heading font-bold text-text">{items.length}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Total Fuel</span>
                <span className="font-heading font-bold text-text">{items.reduce((s, i) => s + i.quantityLiters, 0).toFixed(1)}L</span>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="flex justify-between font-heading font-bold text-lg text-text">
                <span className="uppercase tracking-wider">Estimated Total</span>
                <span className="text-primary">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="pb-8">
          <button
            onClick={handleContinue}
            disabled={items.length === 0}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Checkout <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </main>
    </div>
  );
}
