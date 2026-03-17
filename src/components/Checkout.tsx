import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Tag, MapPin, Fuel, ArrowRight, Calendar, Zap, MessageSquareText, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Order } from '../types';
import SafetyChecklist from './SafetyChecklist';
import { useDynamicPricing } from '../hooks/useDynamicPricing';
import { publishOrder } from '../services/orderBridge';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import CheckoutOffersSheet from './CheckoutOffersSheet';
import CheckoutConfirmModal from './CheckoutConfirmModal';

export default function Checkout() {
  const { currentOrder, setCurrentOrder, setOrders, orders, addNotification, favoriteOrders, setFavoriteOrders, cart, setCart, vehicles } = useAppContext();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [safetyChecked, setSafetyChecked] = useState(false);
  const [showOffersSheet, setShowOffersSheet] = useState(false);

  if (!currentOrder) {
    navigate('/order');
    return null;
  }

  const pricing = useDynamicPricing(
    currentOrder.location || null,
    currentOrder.quantityLiters || 0,
    currentOrder.fuelType || 'Petrol'
  );

  // Calculate totals including any cart items
  const hasCartItems = cart.length > 0;
  const allItems = hasCartItems ? cart : [{
    id: 'single',
    vehicleId: currentOrder.vehicleId || '',
    fuelType: currentOrder.fuelType || 'Petrol' as const,
    orderType: 'amount' as const,
    value: currentOrder.amountRupees || 0,
    quantityLiters: currentOrder.quantityLiters || 0,
    amountRupees: currentOrder.amountRupees || 0,
  }];

  const subtotal = allItems.reduce((sum, item) => sum + item.amountRupees, 0);
  const gst = subtotal * 0.18;
  const emergencyFee = currentOrder.isEmergency ? 150 : 0;
  const total = subtotal + pricing.deliveryFee + gst + emergencyFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FIRST50') {
      setDiscount(50);
      addNotification('Promo Applied!', '₹50 discount applied to your order.', 'success');
    } else {
      addNotification('Invalid Promo Code', 'Please enter a valid promo code.', 'warning');
      setDiscount(0);
    }
  };

  const handleCopyAndApply = (code: string) => {
    setPromoCode(code);
    setDiscount(50);
    setShowOffersSheet(false);
    addNotification('Promo Applied!', '₹50 discount applied to your order.', 'success');
  };

  const handlePlaceOrder = () => {
    setShowConfirmModal(true);
  };

  const confirmOrder = (saveAsFavorite: boolean, favoriteName: string) => {
    const mainVehicle = vehicles.find(v => v.id === currentOrder.vehicleId);
    
    const newOrder: Order = {
      ...currentOrder,
      id: `ord-${Date.now()}`,
      userId: 'user-1',
      status: 'Pending',
      date: new Date().toISOString(),
      paymentMethod,
      totalAmount: total,
      vehicleMake: mainVehicle?.make,
      vehicleModel: mainVehicle?.model,
      licensePlate: mainVehicle?.licensePlate,
    } as Order;

    setOrders([newOrder, ...orders]);
    setCurrentOrder(newOrder);
    publishOrder(newOrder);

    if (saveAsFavorite && favoriteName) {
      setFavoriteOrders([
        ...favoriteOrders,
        {
          id: `fav-${Date.now()}`,
          name: favoriteName,
          vehicleId: currentOrder.vehicleId!,
          fuelType: currentOrder.fuelType!,
          orderType: currentOrder.amountRupees ? 'amount' : 'quantity',
          value: currentOrder.amountRupees || currentOrder.quantityLiters || 0,
          location: currentOrder.location!
        }
      ]);
      addNotification('Favorite Saved', `"${favoriteName}" has been saved to your favorites.`, 'success');
    }

    // Clear the cart after checkout
    setCart([]);
    setShowConfirmModal(false);
    navigate('/tracking');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center sticky top-0 z-10 transition-colors">
        <button onClick={() => navigate('/order')} className="mr-4 text-text hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">Checkout</h1>
        {hasCartItems && (
          <span className="ml-auto text-xs font-heading font-bold bg-primary text-bg px-2 py-1 rounded-sm border-2 border-border">
            {cart.length} items
          </span>
        )}
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
        {/* Order Summary */}
        <section className="card-brutal p-6 transition-colors">
          <h2 className="label-small mb-4">Order Summary</h2>
          
          {/* Multi-item display */}
          {(() => {
            const vehiclesMap = vehicles.reduce((acc, v) => {
              acc[v.id] = v;
              return acc;
            }, {} as Record<string, typeof vehicles[0]>);

            return allItems.map((item, idx) => {
              const vehicle = vehiclesMap[item.vehicleId];
              return (
              <div key={item.id} className={`flex items-center justify-between ${idx < allItems.length - 1 ? 'mb-3 pb-3 border-b-2 border-border' : 'mb-4 pb-4 border-b-2 border-border'} transition-colors`}>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-bg border-2 border-border rounded-sm flex items-center justify-center text-primary mr-4 transition-colors shadow-brutal-sm">
                    <Fuel size={24} />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-text uppercase tracking-wider">
                      {item.fuelType}
                      {vehicle && <span className="text-xs text-muted font-body normal-case ml-2">({vehicle.make} {vehicle.model})</span>}
                    </p>
                    <p className="text-sm text-muted font-body">{item.quantityLiters.toFixed(2)} Liters</p>
                  </div>
                </div>
                <p className="font-heading font-bold text-lg text-text">₹{item.amountRupees.toFixed(2)}</p>
              </div>
            );
            });
          })()}

          <div className="flex items-start space-x-3 text-sm text-text font-body">
            <MapPin size={18} className="shrink-0 mt-0.5 text-primary" />
            <p className="line-clamp-2">{currentOrder.location?.address}</p>
          </div>

          {/* Feature 4: Display delivery instructions */}
          {currentOrder.deliveryInstructions && (
            <div className="flex items-start space-x-3 text-sm text-text font-body mt-3 bg-bg border-2 border-border rounded-sm p-3">
              <MessageSquareText size={18} className="shrink-0 text-primary mt-0.5" />
              <div>
                <p className="font-heading font-bold text-xs uppercase tracking-wider text-primary">Delivery Instructions</p>
                <p className="text-muted text-xs mt-0.5">{currentOrder.deliveryInstructions}</p>
              </div>
            </div>
          )}

          {/* Feature 5: Emergency badge */}
          {currentOrder.isEmergency && (
            <div className="flex items-center space-x-3 text-sm mt-3 bg-red-500/10 border-2 border-red-500/30 rounded-sm p-3">
              <Zap size={18} className="shrink-0 text-red-500" />
              <div>
                <p className="font-heading font-bold text-xs uppercase tracking-wider text-red-500">⚡ Emergency Priority</p>
                <p className="text-muted text-[10px] mt-0.5">Your order will be dispatched with top priority</p>
              </div>
            </div>
          )}

          {currentOrder.isScheduled && currentOrder.scheduledDate && (
            <div className="flex items-center space-x-3 text-sm text-text font-body mt-3 bg-bg border-2 border-border rounded-sm p-3">
              <Calendar size={18} className="shrink-0 text-primary" />
              <div>
                <p className="font-heading font-bold text-xs uppercase tracking-wider text-primary">Scheduled Delivery</p>
                <p className="text-muted text-xs mt-0.5">
                  {new Date(currentOrder.scheduledDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  {' at '}
                  {new Date(currentOrder.scheduledDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Feature 2: Offers with discovery */}
        <section className="card-brutal p-6 transition-colors">
          <h2 className="label-small mb-4">Offers & Benefits</h2>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter Promo Code"
                className="input-brutal pl-10 uppercase"
              />
            </div>
            <button onClick={handleApplyPromo} className="btn-secondary px-6">
              Apply
            </button>
          </div>
          {/* Promo hint */}
          {discount === 0 && (
            <button
              onClick={() => setShowOffersSheet(true)}
              className="mt-3 flex items-center space-x-2 text-xs text-primary font-heading font-bold uppercase tracking-wider hover:underline w-full justify-center py-2 bg-primary/5 border-2 border-primary/20 rounded-sm transition-colors"
            >
              <Gift size={14} />
              <span>View Available Offers</span>
            </button>
          )}
          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center space-x-2 text-xs text-accent font-heading font-bold bg-accent/10 border-2 border-accent/20 rounded-sm px-3 py-2"
            >
              <Tag size={14} />
              <span>FIRST50 applied — ₹50 off!</span>
            </motion.div>
          )}
        </section>

        {/* Payment Methods */}
        <CheckoutPaymentMethods paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />

        {/* Safety Checklist */}
        <SafetyChecklist onAllChecked={setSafetyChecked} />

        {/* Bill Details */}
        <section className="card-brutal p-6 transition-colors">
          <h2 className="label-small mb-4">Bill Details</h2>
          <div className="space-y-3 text-sm font-body">
            <div className="flex justify-between text-muted">
              <span>Item Total {hasCartItems && `(${allItems.length} items)`}</span>
              <span className="font-heading font-bold text-text">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>GST (18%)</span>
              <span className="font-heading font-bold text-text">₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>
                Delivery Fee
                {pricing.surgeActive && <span className="text-[10px] ml-1 text-primary font-bold">(PEAK)</span>}
              </span>
              <span className="font-heading font-bold text-text">₹{pricing.deliveryFee.toFixed(2)}</span>
            </div>
            {/* Feature 5: Emergency fee line item */}
            {currentOrder.isEmergency && (
              <div className="flex justify-between text-red-500 font-bold">
                <span className="flex items-center"><Zap size={12} className="mr-1" /> Emergency Priority</span>
                <span>+₹{emergencyFee.toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-primary font-bold">
                <span>Promo Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="h-px bg-border my-4 transition-colors" />
            <div className="flex justify-between font-heading font-bold text-lg text-text">
              <span className="uppercase tracking-wider">To Pay</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <div className="pb-8">
          <button
            onClick={handlePlaceOrder}
            disabled={!safetyChecked}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center"
          >
            {!safetyChecked ? 'Complete Safety Checklist' : 'Place Order'} <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </main>

      {/* Confirmation Modal */}
      <CheckoutConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmOrder}
        currentOrder={currentOrder}
        total={total}
        paymentMethod={paymentMethod}
        hasCartItems={hasCartItems}
        allItemsLength={allItems.length}
      />

      {/* Feature 2: Available Offers Bottom Sheet */}
      <CheckoutOffersSheet
        isOpen={showOffersSheet}
        onClose={() => setShowOffersSheet(false)}
        onApplyOffer={handleCopyAndApply}
      />
    </div>
  );
}
