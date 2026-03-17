import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Fuel as FuelIcon, ArrowRight, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FuelType } from '../types';
import MapPicker from './MapPicker';
import SchedulePicker from './SchedulePicker';
import { useDynamicPricing } from '../hooks/useDynamicPricing';
import { SkeletonPricing } from './SkeletonLoader';
import FuelCart from './FuelCart';
import PriceTrendIndicator from './PriceTrendIndicator';
import VehicleSelector from './VehicleSelector';
import EmergencyToggle from './EmergencyToggle';
import DeliveryInstructions from './DeliveryInstructions';

export default function OrderFuel() {
  const { vehicles, setCurrentOrder, location, setLocation, addNotification, cart, setCart } = useAppContext();
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [orderType, setOrderType] = useState<'amount' | 'quantity'>('amount');
  const [value, setValue] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [pricingLoading, setPricingLoading] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [autoSelected, setAutoSelected] = useState(false);

  const FUEL_PRICE = {
    Petrol: 101.5,
    Diesel: 89.2,
  };

  // Feature 1: Auto-select single vehicle
  useEffect(() => {
    if (vehicles.length === 1 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0].id);
      setFuelType(vehicles[0].fuelType);
      setAutoSelected(true);
    }
  }, [vehicles, selectedVehicle]);

  const numValue = Number(value) || 0;
  const quantityLiters = orderType === 'quantity' ? numValue : numValue / FUEL_PRICE[fuelType];
  const pricing = useDynamicPricing(location, quantityLiters, fuelType);

  // Skeleton loading for pricing (Feature 7)
  useEffect(() => {
    if (value && Number(value) > 0) {
      setPricingLoading(true);
      const timer = setTimeout(() => setPricingLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [value, fuelType, orderType]);

  const handleContinue = () => {
    if (!selectedVehicle) {
      addNotification('Missing Information', 'Please select a vehicle', 'warning');
      return;
    }
    if (!value || Number(value) <= 0) {
      addNotification('Missing Information', 'Please enter a valid amount or quantity', 'warning');
      return;
    }
    if (!location) {
      addNotification('Missing Information', 'Please provide a delivery location', 'warning');
      return;
    }
    if (isScheduled && !scheduledDate) {
      addNotification('Missing Information', 'Please select a delivery time slot', 'warning');
      return;
    }

    const amountRupees = orderType === 'amount' ? numValue : numValue * FUEL_PRICE[fuelType];

    setCurrentOrder({
      vehicleId: selectedVehicle,
      fuelType,
      amountRupees,
      quantityLiters,
      location,
      isScheduled,
      scheduledDate: isScheduled ? scheduledDate : undefined,
      deliveryInstructions: deliveryInstructions.trim() || undefined,
      isEmergency,
    });
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (!selectedVehicle) {
      addNotification('Missing Information', 'Please select a vehicle', 'warning');
      return;
    }
    if (!value || Number(value) <= 0) {
      addNotification('Missing Information', 'Please enter a valid amount or quantity', 'warning');
      return;
    }

    const amountRupees = orderType === 'amount' ? numValue : numValue * FUEL_PRICE[fuelType];

    setCart(prev => [...prev, {
      id: `cart-${Date.now()}`,
      vehicleId: selectedVehicle,
      fuelType,
      orderType,
      value: numValue,
      quantityLiters,
      amountRupees,
    }]);

    addNotification('Added to Cart', 'Fuel added! Select another vehicle or checkout.', 'success');
    setSelectedVehicle('');
    setValue('');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center sticky top-0 z-10 transition-colors">
        <button onClick={() => navigate('/')} className="mr-4 text-text hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">Order Fuel</h1>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
        {/* Location Section with Interactive Map */}
        <section className="card-brutal p-6 transition-colors">
          <h2 className="label-small mb-4">Delivery Location</h2>
          <MapPicker location={location} onLocationSelect={setLocation} />
        </section>

        {/* Vehicle Selection */}
        <VehicleSelector
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={(id, type) => {
            setSelectedVehicle(id);
            setFuelType(type as FuelType);
            setAutoSelected(false);
          }}
          autoSelected={autoSelected}
          onAddNew={() => navigate('/garage')}
        />

        {/* Fuel Details */}
        <section className="card-brutal p-6 transition-colors">
          <h2 className="label-small mb-4">Fuel Details</h2>
          
          <div className="flex p-1 bg-bg border-2 border-border rounded-sm mb-6 transition-colors">
            <button
              onClick={() => setFuelType('Petrol')}
              className={`flex-1 py-2 text-sm font-heading font-bold uppercase tracking-wider rounded-sm transition-all ${
                fuelType === 'Petrol' ? 'bg-primary text-bg border-2 border-border shadow-brutal-sm' : 'text-muted hover:text-text'
              }`}
            >
              Petrol
            </button>
            <button
              onClick={() => setFuelType('Diesel')}
              className={`flex-1 py-2 text-sm font-heading font-bold uppercase tracking-wider rounded-sm transition-all ${
                fuelType === 'Diesel' ? 'bg-primary text-bg border-2 border-border shadow-brutal-sm' : 'text-muted hover:text-text'
              }`}
            >
              Diesel
            </button>
          </div>

          {/* Price Trend Indicator */}
          <PriceTrendIndicator fuelType={fuelType} fuelPrice={FUEL_PRICE[fuelType]} />

          <div className="flex p-1 bg-bg border-2 border-border rounded-sm mb-6 transition-colors">
            <button
              onClick={() => { setOrderType('amount'); setValue(''); }}
              className={`flex-1 py-2 text-sm font-heading font-bold uppercase tracking-wider rounded-sm transition-all ${
                orderType === 'amount' ? 'bg-surface text-text border-2 border-border shadow-brutal-sm' : 'text-muted hover:text-text'
              }`}
            >
              By Amount
            </button>
            <button
              onClick={() => { setOrderType('quantity'); setValue(''); }}
              className={`flex-1 py-2 text-sm font-heading font-bold uppercase tracking-wider rounded-sm transition-all ${
                orderType === 'quantity' ? 'bg-surface text-text border-2 border-border shadow-brutal-sm' : 'text-muted hover:text-text'
              }`}
            >
              By Quantity
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-muted font-heading font-bold text-lg">
                {orderType === 'amount' ? '₹' : <FuelIcon size={20} />}
              </span>
            </div>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full pl-12 pr-16 py-4 rounded-sm border-2 border-border bg-bg text-text font-heading font-bold text-xl focus:border-primary focus:ring-0 outline-none transition-colors"
              placeholder={orderType === 'amount' ? 'Enter amount' : 'Enter liters'}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-muted font-heading font-bold uppercase tracking-wider text-sm">
                {orderType === 'amount' ? '' : 'Liters'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {(orderType === 'amount' ? [500, 1000, 2000] : [5, 10, 20]).map((quickValue) => (
              <button
                key={quickValue}
                onClick={() => setValue(quickValue.toString())}
                className="flex-1 py-2 bg-surface border-2 border-border rounded-sm font-heading font-bold text-sm hover:bg-bg hover:border-primary transition-colors"
              >
            {orderType === 'amount' ? `₹${quickValue}` : `${quickValue}L`}
              </button>
            ))}
          </div>

          {value && Number(value) > 0 && (
            pricingLoading ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <SkeletonPricing />
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-bg border-2 border-border rounded-sm transition-colors"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted font-body">Current Price</span>
                  <span className="font-heading font-bold text-text">₹{FUEL_PRICE[fuelType]}/L</span>
                </div>
                <div className="h-px bg-border my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-muted font-body">
                    {orderType === 'amount' ? 'Estimated Quantity' : 'Estimated Amount'}
                  </span>
                  <span className="font-heading font-bold text-primary text-lg">
                    {orderType === 'amount' 
                      ? `${(Number(value) / FUEL_PRICE[fuelType]).toFixed(2)} L` 
                      : `₹${(Number(value) * FUEL_PRICE[fuelType]).toFixed(2)}`}
                  </span>
                </div>
                <div className="h-px bg-border my-3" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted font-body flex items-center">
                    <Clock size={14} className="mr-1" /> Est. Delivery
                  </span>
                  <span className="font-heading font-bold text-text">{pricing.estimatedMinutes} min</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-muted font-body">Delivery Fee</span>
                  <span className="font-heading font-bold text-text">
                    ₹{pricing.deliveryFee}
                    {pricing.surgeActive && (
                      <span className="text-[10px] ml-1 text-primary font-bold">PEAK</span>
                    )}
                  </span>
                </div>
              </motion.div>
            )
          )}
        </section>

        {/* Schedule Picker */}
        <SchedulePicker
          isScheduled={isScheduled}
          scheduledDate={scheduledDate}
          onScheduleChange={(scheduled, date) => {
            setIsScheduled(scheduled);
            setScheduledDate(date);
          }}
        />

        {/* Feature 5: Emergency Priority Toggle */}
        <EmergencyToggle
          isEmergency={isEmergency}
          onToggle={() => setIsEmergency(!isEmergency)}
        />

        {/* Feature 4: Delivery Instructions */}
        <DeliveryInstructions
          value={deliveryInstructions}
          onChange={setDeliveryInstructions}
        />

        {/* Action Buttons */}
        <div className="pb-8 space-y-3">
          {vehicles.length > 1 && (
            <button
              onClick={handleAddToCart}
              className="btn-secondary w-full py-4 text-base flex items-center justify-center"
            >
              <Plus size={18} className="mr-2" /> Add to Cart & Select Another Vehicle
            </button>
          )}
          <button
            onClick={handleContinue}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center"
          >
            Continue to Checkout <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </main>

      {/* Floating Cart */}
      <FuelCart />
    </div>
  );
}
