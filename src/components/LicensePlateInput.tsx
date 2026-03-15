import React, { useState } from 'react';

interface LicensePlateInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function LicensePlateInput({ value, onChange, className = '' }: LicensePlateInputProps) {
  // Indian license plate format: ST DD ST DDDD (e.g., KA 01 AB 1234)
  // Segments: [2 letters] [space] [1-2 digits] [space] [1-2 letters] [space] [4 digits]

  const formatPlate = (raw: string): string => {
    // Remove all non-alphanumeric
    const cleaned = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    let result = '';

    for (let i = 0; i < cleaned.length && i < 10; i++) {
      const char = cleaned[i];

      if (i < 2) {
        // First 2: letters (state code)
        if (/[A-Z]/.test(char)) result += char;
      } else if (i < 4) {
        // Next 2: digits (district)
        if (i === 2) result += ' ';
        if (/[0-9]/.test(char)) result += char;
      } else if (i < 6) {
        // Next 1-2: letters (series)
        if (i === 4) result += ' ';
        if (/[A-Z]/.test(char)) result += char;
      } else if (i < 10) {
        // Last 4: digits (number)
        if (i === 6) result += ' ';
        if (/[0-9]/.test(char)) result += char;
      }
    }

    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlate(e.target.value);
    onChange(formatted);
  };

  // Split into visual segments for styling
  const segments = value.split(' ');
  const isComplete = value.replace(/\s/g, '').length >= 9;

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={`input-brutal uppercase font-mono tracking-[0.15em] text-lg ${className}`}
        placeholder="KA 01 AB 1234"
        maxLength={13}
        required
      />
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {['ST', 'DD', 'AA', 'DDDD'].map((seg, i) => (
            <span
              key={i}
              className={`text-[10px] font-heading font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border transition-colors ${
                segments[i] && segments[i].length >= (i === 3 ? 4 : i === 1 ? 1 : i === 2 ? 1 : 2)
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-border text-muted bg-surface'
              }`}
            >
              {seg}
            </span>
          ))}
        </div>
        {isComplete && (
          <span className="text-[10px] font-heading font-bold text-accent uppercase tracking-wider">✓ Valid</span>
        )}
      </div>
    </div>
  );
}
