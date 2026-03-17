import React from 'react';
import { Location } from '../types';

interface SavedAddressChipsProps {
  savedAddresses: any[];
  currentLocation: Location | null;
  onSelect: (addr: any) => void;
}

export default function SavedAddressChips({ savedAddresses, currentLocation, onSelect }: SavedAddressChipsProps) {
  if (savedAddresses.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {savedAddresses.map((addr) => (
        <button
          key={addr.id}
          onClick={() => onSelect(addr)}
          className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-sm border-2 text-sm font-heading font-bold uppercase tracking-wider transition-all ${
            currentLocation?.address === addr.location.address
              ? 'border-primary bg-primary/10 text-primary shadow-brutal-sm'
              : 'border-border bg-bg text-text hover:border-primary'
          }`}
        >
          <span>{addr.emoji}</span>
          <span>{addr.label}</span>
        </button>
      ))}
    </div>
  );
}
