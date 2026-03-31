import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, X, Copy } from 'lucide-react';

const AVAILABLE_OFFERS = [
  { code: 'FIRST50', description: '₹50 off your first order', discount: 50, minOrder: 200 },
];

interface CheckoutOffersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyOffer: (code: string) => void;
}

export default function CheckoutOffersSheet({ isOpen, onClose, onApplyOffer }: CheckoutOffersSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-surface border-t-2 border-x-2 border-border rounded-t-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 border-2 border-primary rounded-sm flex items-center justify-center">
                  <Gift size={20} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider">Available Offers</h3>
              </div>
              <button aria-label="Close" onClick={onClose} className="text-muted hover:text-text transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {AVAILABLE_OFFERS.map((offer) => (
                <div
                  key={offer.code}
                  className="p-4 bg-bg border-2 border-border rounded-sm transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-primary text-sm uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-sm border border-primary/20">
                      {offer.code}
                    </span>
                    <span className="font-heading font-bold text-accent text-lg">-₹{offer.discount}</span>
                  </div>
                  <p className="text-sm text-text font-body mb-3">{offer.description}</p>
                  <p className="text-[10px] text-muted font-body mb-3">Min. order: ₹{offer.minOrder}</p>
                  <button
                    onClick={() => onApplyOffer(offer.code)}
                    className="btn-primary w-full py-2 text-sm flex items-center justify-center"
                  >
                    <Copy size={14} className="mr-2" /> Copy & Apply
                  </button>
                </div>
              ))}
            </div>

            <button onClick={onClose} className="btn-secondary w-full mt-4 py-3">
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
