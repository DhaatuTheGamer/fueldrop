import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';

interface EmergencyToggleProps {
  isEmergency: boolean;
  onToggle: () => void;
}

export default function EmergencyToggle({ isEmergency, onToggle }: EmergencyToggleProps) {
  return (
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
          aria-label={isEmergency ? "Turn off emergency mode" : "Turn on emergency mode"}
          onClick={onToggle}
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
  );
}
