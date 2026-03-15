import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fuel, Car, ArrowRight, MapPin, Zap, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Vehicle, VehicleType, FuelType } from '../types';

export default function Onboarding() {
  const navigate = useNavigate();
  const { setVehicles, vehicles, addNotification, setHasCompletedOnboarding } = useAppContext();
  const [step, setStep] = useState(0);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: 'Car',
    fuelType: 'Petrol',
    make: '',
    model: '',
    licensePlate: '',
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVehicle.make && newVehicle.model && newVehicle.licensePlate) {
      setVehicles([
        ...vehicles,
        {
          ...newVehicle,
          id: `veh-${Date.now()}`,
        } as Vehicle,
      ]);
      addNotification('Vehicle Added', 'Your first vehicle has been added!', 'success');
      setStep(2);
    }
  };

  const finish = () => {
    setHasCompletedOnboarding(true);
    navigate('/');
  };

  const skip = () => {
    setHasCompletedOnboarding(true);
    navigate('/');
  };

  const steps = [
    // Step 0: Welcome
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="w-24 h-24 bg-primary border-2 border-border rounded-sm flex items-center justify-center mx-auto mb-6 shadow-brutal">
        <Fuel size={48} className="text-bg" />
      </div>
      <h1 className="text-3xl font-heading font-bold text-text mb-2">Welcome to FuelDrop!</h1>
      <p className="text-muted font-body mb-8 max-w-xs mx-auto">
        Get fuel delivered right to your doorstep. Let's set you up in under a minute.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Car, label: 'Add Vehicle' },
          { icon: MapPin, label: 'Set Location' },
          { icon: Zap, label: 'Order Fuel' },
        ].map((item, i) => (
          <div key={i} className="card-brutal p-3 flex flex-col items-center">
            <item.icon size={24} className="text-primary mb-2" />
            <span className="text-xs font-heading font-bold text-text uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>

      <button onClick={() => setStep(1)} className="btn-primary w-full py-4 text-lg mb-3">
        Get Started <ArrowRight size={20} className="ml-2" />
      </button>
      <button onClick={skip} className="w-full py-3 text-muted font-heading font-bold uppercase tracking-wider hover:text-text transition-colors text-sm">
        Skip for now
      </button>
    </motion.div>,

    // Step 1: Add first vehicle
    <motion.div
      key="vehicle"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-heading font-bold text-text mb-2 uppercase tracking-wider">Add Your Vehicle</h2>
      <p className="text-muted font-body mb-6">Let's register your first car or bike.</p>

      <form onSubmit={handleAddVehicle} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-small">Type</label>
            <select
              value={newVehicle.type}
              onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as VehicleType })}
              className="input-brutal"
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
          </div>
          <div>
            <label className="label-small">Fuel Type</label>
            <select
              value={newVehicle.fuelType}
              onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value as FuelType })}
              className="input-brutal"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label-small">Make (e.g., Hyundai)</label>
          <input
            type="text"
            value={newVehicle.make}
            onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
            className="input-brutal"
            placeholder="Enter make"
            required
          />
        </div>
        <div>
          <label className="label-small">Model (e.g., i20)</label>
          <input
            type="text"
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
            className="input-brutal"
            placeholder="Enter model"
            required
          />
        </div>
        <div>
          <label className="label-small">License Plate</label>
          <input
            type="text"
            value={newVehicle.licensePlate}
            onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value.toUpperCase() })}
            className="input-brutal uppercase"
            placeholder="KA 01 AB 1234"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full py-4 mt-2">
          Add Vehicle <ArrowRight size={20} className="ml-2" />
        </button>
      </form>
      <button onClick={skip} className="w-full py-3 mt-3 text-muted font-heading font-bold uppercase tracking-wider hover:text-text transition-colors text-sm">
        Skip for now
      </button>
    </motion.div>,

    // Step 2: All set!
    <motion.div
      key="done"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center"
    >
      <div className="w-20 h-20 bg-accent/20 border-2 border-accent rounded-sm flex items-center justify-center mx-auto mb-6 shadow-brutal">
        <Check size={40} className="text-accent" />
      </div>
      <h2 className="text-3xl font-heading font-bold text-text mb-2">You're All Set!</h2>
      <p className="text-muted font-body mb-8 max-w-xs mx-auto">
        Your vehicle has been added. You're ready to order fuel to your doorstep.
      </p>
      <button onClick={finish} className="btn-primary w-full py-4 text-lg">
        Start Ordering <ArrowRight size={20} className="ml-2" />
      </button>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-sm transition-all ${
                i === step ? 'w-8 bg-primary' : i < step ? 'w-4 bg-accent' : 'w-4 bg-border'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
      </div>
    </div>
  );
}
