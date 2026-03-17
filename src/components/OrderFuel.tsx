import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Car, Fuel as FuelIcon, ArrowRight, Clock, TrendingDown, TrendingUp, Plus, Zap, MessageSquareText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FuelType } from '../types';
import MapPicker from './MapPicker';
import SchedulePicker from './SchedulePicker';
import { useDynamicPricing } from '../hooks/useDynamicPricing';
import { SkeletonPricing } from './SkeletonLoader';
import FuelCart from './FuelCart';

// Simulated 7-day price history
const PRICE_HISTORY: Record<FuelType, number[]> = {
  Petrol: [102.10, 101.95, 101.80, 101.90, 101.70, 101.60, 101.50],
  Diesel: [89.80, 89.65, 89.50, 89.40, 89.35, 89.25, 89.20],
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];

function SparklineChart({ data, color = '#E56B25' }: { data: number[]; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 140;
  const height = 36;
  const padding = 4;

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkGrad)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle cx={parseFloat(points[points.length - 1].split(',')[0])} cy={parseFloat(points[points.length - 1].split(',')[1])} r={3} fill={color} />
    </svg>
  );
}

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

  // Price trend calculation
  const history = PRICE_HISTORY[fuelType];
  const yesterdayPrice = history[history.length - 2];
  const todayPrice = history[history.length - 1];
  const priceDiff = todayPrice - yesterdayPrice;
  const isFalling = priceDiff < 0;

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
        <section className="card-brutal p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="label-small">Select Vehicle</h2>
            <button onClick={() => navigate('/garage')} className="text-primary text-xs font-heading font-bold uppercase tracking-wider hover:underline">Add New</button>
          </div>
          
          {vehicles.length === 0 ? (
            <div className="text-center py-4 bg-bg rounded-sm border-2 border-border transition-colors">
              <p className="text-muted font-body text-sm mb-2">No vehicles found</p>
              <button onClick={() => navigate('/garage')} className="text-primary font-heading font-bold text-sm uppercase tracking-wider hover:underline">Go to Garage</button>
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-4 -mx-2 px-2 space-x-4 snap-x">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => {
                    setSelectedVehicle(vehicle.id);
                    setFuelType(vehicle.fuelType);
                    setAutoSelected(false);
                  }}
                  className={`shrink-0 w-40 p-4 rounded-sm border-2 text-left snap-start transition-all relative ${
                    selectedVehicle === vehicle.id
                      ? 'border-primary bg-surface shadow-brutal-sm'
                      : 'border-border bg-bg hover:border-muted'
                  }`}
                >
                  {/* Feature 1: Auto-selected badge */}
                  {autoSelected && selectedVehicle === vehicle.id && (
                    <span className="absolute -top-2 -right-2 bg-accent text-bg text-[9px] font-heading font-bold px-1.5 py-0.5 rounded-sm border-2 border-border flex items-center">
                      <CheckCircle2 size={10} className="mr-0.5" /> AUTO
                    </span>
                  )}
                  <Car size={24} className={`mb-2 ${selectedVehicle === vehicle.id ? 'text-primary' : 'text-muted'}`} />
                  <p className="font-heading font-bold text-text truncate">{vehicle.make} {vehicle.model}</p>
                  <p className="text-xs text-muted font-body mt-1">{vehicle.licensePlate}</p>
                </button>
              ))}
            </div>
          )}
        </section>

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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-bg border-2 border-border rounded-sm transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-muted font-body uppercase tracking-wider">Today's Price</p>
                <p className="font-heading font-bold text-2xl text-text">₹{FUEL_PRICE[fuelType]}<span className="text-sm text-muted">/L</span></p>
              </div>
              <SparklineChart data={PRICE_HISTORY[fuelType]} color={isFalling ? '#2B825B' : '#E56B25'} />
            </div>
            <div className="flex items-center space-x-2">
              {isFalling ? (
                <TrendingDown size={14} className="text-accent" />
              ) : (
                <TrendingUp size={14} className="text-primary" />
              )}
              <span className={`text-xs font-heading font-bold ${isFalling ? 'text-accent' : 'text-primary'}`}>
                {isFalling ? '↓' : '↑'} ₹{Math.abs(priceDiff).toFixed(2)} since yesterday
              </span>
            </div>
            {isFalling && (
              <p className="text-[10px] text-accent font-body mt-2 bg-accent/10 px-2 py-1 rounded-sm inline-block border border-accent/20">
                Prices are falling — good time to top up!
              </p>
            )}
          </motion.div>

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
        <section className="card-brutal p-6 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-sm border-2 border-border flex items-center justify-center shadow-brutal-sm transition-colors ${isEmergency ? 'bg-red-500 text-white' : 'bg-surface text-muted'}`}>
                <Zap size={20} />
              </div>
              <div>
                <p className="font-heading font-bold text-text uppercase tracking-wider text-sm">Emergency Refill</p>
                <p className="text-xs text-muted font-body">Skip the queue • Priority dispatch</p>
              </div>
            </div>
            <button
              onClick={() => setIsEmergency(!isEmergency)}
              className={`relative w-14 h-7 rounded-full border-2 border-border transition-colors ${isEmergency ? 'bg-red-500' : 'bg-bg'}`}
            >
              <motion.div
                animate={{ x: isEmergency ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`absolute top-0.5 w-5 h-5 rounded-full border-2 border-border shadow-sm ${isEmergency ? 'bg-white' : 'bg-muted'}`}
              />
            </button>
          </div>
          <AnimatePresence>
            {isEmergency && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-3 bg-red-500/10 border-2 border-red-500/30 rounded-sm">
                  <p className="text-xs font-heading font-bold text-red-500 uppercase tracking-wider flex items-center">
                    <Zap size={12} className="mr-1" /> +₹150 Emergency Surge Fee
                  </p>
                  <p className="text-[10px] text-muted font-body mt-1">Your order will be prioritized to the nearest available captain.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Feature 4: Delivery Instructions */}
        <section className="card-brutal p-6 transition-colors">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquareText size={18} className="text-primary" />
            <h2 className="label-small">Delivery Instructions <span className="text-muted font-normal normal-case">(optional)</span></h2>
          </div>
          <textarea
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            placeholder="e.g., Park near Pillar 4B, call from security gate..."
            className="input-brutal w-full h-20 resize-none text-sm"
            maxLength={200}
          />
          <p className="text-[10px] text-muted font-body mt-1 text-right">{deliveryInstructions.length}/200</p>
        </section>

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
