import React from 'react';
import { MessageSquareText } from 'lucide-react';

interface DeliveryInstructionsProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DeliveryInstructions({ value, onChange }: DeliveryInstructionsProps) {
  return (
    <section className="card-brutal p-6 transition-colors">
      <div className="flex items-center space-x-3 mb-4">
        <MessageSquareText size={18} className="text-primary" />
        <h2 className="label-small">Delivery Instructions <span className="text-muted font-normal normal-case">(optional)</span></h2>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Park near Pillar 4B, call from security gate..."
        className="input-brutal w-full h-20 resize-none text-sm"
        maxLength={200}
      />
      <p className="text-[10px] text-muted font-body mt-1 text-right">{value.length}/200</p>
    </section>
  );
}
