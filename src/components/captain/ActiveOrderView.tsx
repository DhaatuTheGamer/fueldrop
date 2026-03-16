import React from 'react';
import { motion } from 'motion/react';
import {
  Zap, MessageSquareText, CheckCircle2, Clock, Shield, User, Phone, Navigation, ExternalLink, ChevronRight
} from 'lucide-react';
import { Order } from '../../types';
import { SAFETY_ITEMS } from './constants';

interface ActiveOrderViewProps {
  status: string;
  activeOrder: Order;
  checklist: boolean[];
  setChecklist: (checklist: boolean[]) => void;
  onStartPickup: () => void;
  onPickedUp: () => void;
  onArrived: () => void;
  onStartFueling: () => void;
  onComplete: () => void;
  onNewOrder: () => void;
  displayVehicle: string;
}

export default function ActiveOrderView({
  status,
  activeOrder,
  checklist,
  setChecklist,
  onStartPickup,
  onPickedUp,
  onArrived,
  onStartFueling,
  onComplete,
  onNewOrder,
  displayVehicle,
}: ActiveOrderViewProps) {
  const allChecked = checklist.every(Boolean);

  return (
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
            <span className="text-text font-heading font-bold">Customer</span>
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
                <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">Customer</p>
                <p className="text-xs text-muted font-body">+91 XXXX XXXXX</p>
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
          <button onClick={onStartPickup} className="btn-primary w-full py-4 text-base"
            style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}>
            Reached Fuel Station <ChevronRight size={18} className="ml-2" />
          </button>
        )}
        {status === 'pickup' && (
          <button onClick={onPickedUp} className="btn-primary w-full py-4 text-base"
            style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}>
            Fuel Picked Up — Start Delivery <ChevronRight size={18} className="ml-2" />
          </button>
        )}
        {status === 'transit' && (
          <button onClick={onArrived} className="btn-primary w-full py-4 text-base"
            style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}>
            I've Arrived <ChevronRight size={18} className="ml-2" />
          </button>
        )}
        {status === 'arrived' && (
          <button onClick={onStartFueling} disabled={!allChecked} className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--accent)', boxShadow: allChecked ? '4px 4px 0px var(--accent)' : 'none' }}>
            {allChecked ? 'Start Fueling' : 'Complete Safety Checklist'} <ChevronRight size={18} className="ml-2" />
          </button>
        )}
        {status === 'fueling' && (
          <button onClick={onComplete} className="btn-primary w-full py-4 text-base"
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
            <button onClick={onNewOrder} className="btn-primary px-8 py-3"
              style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}>
              Accept New Orders
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
