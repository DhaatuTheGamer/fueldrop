import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Zap } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CheckoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (saveAsFavorite: boolean, favoriteName: string) => void;
  currentOrder: any;
  total: number;
  paymentMethod: string;
  hasCartItems: boolean;
  allItemsLength: number;
}

export default function CheckoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  currentOrder,
  total,
  paymentMethod,
  hasCartItems,
  allItemsLength
}: CheckoutConfirmModalProps) {
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);
  const [favoriteName, setFavoriteName] = useState('');

  // Focus trap for confirmation modal (Feature 8)
  const confirmModalRef = useFocusTrap(isOpen);

  // Close on Escape
  useEffect(() => {
    const handleEscape = () => onClose();
    document.addEventListener('modal-escape' as any, handleEscape);
    return () => document.removeEventListener('modal-escape' as any, handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            ref={confirmModalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="card-brutal p-6 w-full max-w-sm transition-colors"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
          >
            <h3 id="confirm-dialog-title" className="text-xl font-heading font-bold text-text uppercase tracking-wider mb-4">Confirm Order</h3>

            <div className="bg-bg border-2 border-border rounded-sm p-4 mb-6 space-y-3 transition-colors">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted">Fuel</span>
                <span className="font-heading font-bold text-text uppercase tracking-wider">
                  {hasCartItems ? `${allItemsLength} items` : `${currentOrder.fuelType} (${currentOrder.quantityLiters?.toFixed(2)}L)`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted">Total</span>
                <span className="font-heading font-bold text-primary">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted">Payment</span>
                <span className="font-heading font-bold text-text uppercase tracking-wider">{paymentMethod}</span>
              </div>
              {currentOrder.isEmergency && (
                <div className="flex justify-between text-sm font-body">
                  <span className="text-red-500 flex items-center"><Zap size={12} className="mr-1" /> Priority</span>
                  <span className="font-heading font-bold text-red-500">EMERGENCY</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsFavorite}
                  onChange={(e) => setSaveAsFavorite(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary rounded-sm focus:ring-primary border-2 border-border bg-bg accent-primary"
                />
                <div>
                  <span className="text-sm font-heading font-bold text-text uppercase tracking-wider flex items-center">
                    Save as Favorite <Heart size={14} className="ml-1 text-primary" />
                  </span>
                  <p className="text-xs text-muted font-body mt-0.5">Quickly reorder this exact fuel amount and location next time.</p>
                </div>
              </label>

              <AnimatePresence>
                {saveAsFavorite && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      value={favoriteName}
                      onChange={(e) => setFavoriteName(e.target.value)}
                      placeholder="e.g., Home Car Refill"
                      className="input-brutal text-sm"
                      required={saveAsFavorite}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="btn-secondary flex-1 py-3"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(saveAsFavorite, favoriteName)}
                disabled={saveAsFavorite && !favoriteName.trim()}
                className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
