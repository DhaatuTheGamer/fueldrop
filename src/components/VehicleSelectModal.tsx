import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, X, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface VehicleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (vehicleId: string) => void;
  title?: string;
}

export default function VehicleSelectModal({ isOpen, onClose, onSelect, title = 'Select a Vehicle' }: VehicleSelectModalProps) {
  const { vehicles } = useAppContext();

  // Focus trap (Feature 8)
  const modalRef = useFocusTrap(isOpen);

  // Close on Escape via custom event from focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = () => onClose();
    document.addEventListener('modal-escape', handleEscape);
    return () => document.removeEventListener('modal-escape', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="card-brutal p-6 w-full max-w-sm transition-colors"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-select-title"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="vehicle-select-title" className="text-lg font-heading font-bold text-text uppercase tracking-wider">{title}</h3>
              <button aria-label="Close" onClick={onClose} className="text-muted hover:text-text transition-colors">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-muted font-body mb-4">
              The original vehicle was deleted. Pick another vehicle to continue:
            </p>

            {vehicles.length === 0 ? (
              <div className="text-center py-6">
                <Car size={32} className="text-muted mx-auto mb-2" />
                <p className="text-sm text-muted font-body">No vehicles in your garage.</p>
                <p className="text-xs text-muted font-body mt-1">Add a vehicle first to reorder.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => {
                      onSelect(vehicle.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 border-2 border-border rounded-sm hover:border-primary transition-colors bg-bg group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-surface border-2 border-border rounded-sm flex items-center justify-center text-primary shadow-brutal-sm transition-colors group-hover:bg-primary group-hover:text-bg">
                        <Car size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-muted font-body">{vehicle.licensePlate} • {vehicle.fuelType}</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-muted group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            )}

            <button onClick={onClose} className="btn-secondary w-full mt-4 py-3">
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
