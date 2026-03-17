import React from 'react';
import { Car, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: string;
  onSelectVehicle: (id: string, fuelType: string) => void;
  autoSelected: boolean;
  onAddNew: () => void;
}

export default function VehicleSelector({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  autoSelected,
  onAddNew,
}: VehicleSelectorProps) {
  return (
    <section className="card-brutal p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="label-small">Select Vehicle</h2>
        <button
          onClick={onAddNew}
          className="text-primary text-xs font-heading font-bold uppercase tracking-wider hover:underline"
        >
          Add New
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-4 bg-bg rounded-sm border-2 border-border transition-colors">
          <p className="text-muted font-body text-sm mb-2">No vehicles found</p>
          <button
            onClick={onAddNew}
            className="text-primary font-heading font-bold text-sm uppercase tracking-wider hover:underline"
          >
            Go to Garage
          </button>
        </div>
      ) : (
        <div className="flex overflow-x-auto pb-4 -mx-2 px-2 space-x-4 snap-x">
          {vehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle.id, vehicle.fuelType)}
              className={`shrink-0 w-40 p-4 rounded-sm border-2 text-left snap-start transition-all relative ${
                selectedVehicle === vehicle.id
                  ? 'border-primary bg-surface shadow-brutal-sm'
                  : 'border-border bg-bg hover:border-muted'
              }`}
            >
              {/* Feature 1: Auto-selected badge */}
              {autoSelected && selectedVehicle === vehicle.id && (
                <span className="absolute -top-2 -right-2 bg-accent text-bg text-[9px] font-heading font-bold px-1.5 py-0.5 rounded-sm border-2 border-border flex items-center">
                  <CheckCircle2 size={10} className="mr-0.5" /> AUTO
                </span>
              )}
              <Car size={24} className={`mb-2 ${selectedVehicle === vehicle.id ? 'text-primary' : 'text-muted'}`} />
              <p className="font-heading font-bold text-text truncate">{vehicle.make} {vehicle.model}</p>
              <p className="text-xs text-muted font-body mt-1">{vehicle.licensePlate}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
