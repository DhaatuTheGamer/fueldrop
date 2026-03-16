import React from 'react';
import { motion } from 'motion/react';
import { User, Fuel, MapPin, DollarSign, Zap, MessageSquareText, XCircle, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types';

interface IncomingOrderViewProps {
  activeOrder: Order;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingOrderView({ activeOrder, onAccept, onDecline }: IncomingOrderViewProps) {
  return (
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
        <button onClick={onDecline} className="btn-secondary flex-1 py-3 flex items-center justify-center">
          <XCircle size={18} className="mr-2" /> Decline
        </button>
        <button onClick={onAccept} className="btn-primary flex-1 py-3 flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent)', boxShadow: '4px 4px 0px var(--accent)' }}
        >
          <CheckCircle2 size={18} className="mr-2" /> Accept
        </button>
      </div>
    </motion.div>
  );
}
