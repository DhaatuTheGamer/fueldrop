import React, { useState } from 'react';

interface ManualAddressEntryProps {
  onSubmit: (address: string) => void;
  onCancel: () => void;
}

export default function ManualAddressEntry({ onSubmit, onCancel }: ManualAddressEntryProps) {
  const [manualAddress, setManualAddress] = useState('');

  const handleManualSubmit = () => {
    if (manualAddress.trim()) {
      onSubmit(manualAddress);
    }
  };

  return (
    <div>
      <textarea
        value={manualAddress}
        onChange={(e) => setManualAddress(e.target.value)}
        placeholder="Enter complete delivery address..."
        className="input-brutal resize-none h-20 mb-2"
      />
      <div className="flex space-x-2">
        <button onClick={handleManualSubmit} className="btn-primary flex-1 py-2 text-sm">
          Confirm Address
        </button>
        <button onClick={onCancel} className="btn-secondary flex-1 py-2 text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}
