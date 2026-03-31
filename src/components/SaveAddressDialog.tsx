import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, X, Home, Briefcase, Dumbbell, Coffee } from 'lucide-react';
import { Location } from '../types';
import { useAppContext } from '../context/AppContext';

export const EMOJI_OPTIONS = [
  { emoji: '🏠', label: 'Home', icon: <Home size={16} /> },
  { emoji: '🏢', label: 'Office', icon: <Briefcase size={16} /> },
  { emoji: '💪', label: 'Gym', icon: <Dumbbell size={16} /> },
  { emoji: '☕', label: 'Cafe', icon: <Coffee size={16} /> },
];

interface SaveAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
}

export default function SaveAddressDialog({ isOpen, onClose, location }: SaveAddressDialogProps) {
  const { savedAddresses, setSavedAddresses, addNotification } = useAppContext();
  const [saveLabel, setSaveLabel] = useState('');
  const [saveEmoji, setSaveEmoji] = useState('🏠');

  const handleSaveAddress = () => {
    if (!location || !saveLabel.trim()) return;
    setSavedAddresses([
      ...savedAddresses,
      {
        id: `addr-${crypto.randomUUID()}`,
        label: saveLabel.trim(),
        emoji: saveEmoji,
        location,
      },
    ]);
    addNotification('Address Saved', `"${saveLabel}" has been saved to your address book.`, 'success');
    onClose();
    setSaveLabel('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4 bg-surface border-2 border-primary rounded-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-text text-sm uppercase tracking-wider">Save Address</h4>
              <button aria-label="Close" onClick={onClose} className="text-muted hover:text-text transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-2">
              {EMOJI_OPTIONS.map((opt) => (
                <button
                  key={opt.emoji}
                  onClick={() => { setSaveEmoji(opt.emoji); setSaveLabel(opt.label); }}
                  className={`flex-1 py-2 text-center rounded-sm border-2 transition-all ${
                    saveEmoji === opt.emoji
                      ? 'border-primary bg-primary/10 shadow-brutal-sm'
                      : 'border-border bg-bg hover:border-muted'
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <p className="text-[10px] text-muted font-heading font-bold uppercase mt-1">{opt.label}</p>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={saveLabel}
              onChange={(e) => setSaveLabel(e.target.value)}
              placeholder="Address label (e.g., Home)"
              className="input-brutal text-sm"
            />
            <button onClick={handleSaveAddress} disabled={!saveLabel.trim()} className="btn-primary w-full py-2 text-sm disabled:opacity-50">
              <Bookmark size={14} className="mr-2" /> Save Address
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
