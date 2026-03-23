import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Car, Plus, Trash2, Edit2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Vehicle } from '../types';
import LicensePlateInput from './LicensePlateInput';
import { SkeletonCard } from './SkeletonLoader';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema for optional number fields — the register's setValueAs handles empty→undefined coercion
const optionalNumber = (min: number, max: number, maxLabel: string) =>
  z.number().min(min, `Must be at least ${min}`).max(max, maxLabel).optional();

// Zod schema for vehicle form (Feature 9)
const vehicleSchema = z.object({
  type: z.enum(['Car', 'Bike']),
  fuelType: z.enum(['Petrol', 'Diesel']),
  make: z.string().min(1, 'Make is required').max(30, 'Too long'),
  model: z.string().min(1, 'Model is required').max(30, 'Too long'),
  licensePlate: z.string().min(9, 'Enter a complete license plate (e.g., KA 01 AB 1234)'),
  tankCapacity: optionalNumber(1, 200, 'Max 200L'),
  avgDailyKm: optionalNumber(1, 500, 'Max 500 km'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function Garage() {
  const { vehicles, setVehicles, addNotification } = useAppContext();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Focus trap for delete modal (Feature 8)
  const deleteModalRef = useFocusTrap(!!vehicleToDelete);

  // Skeleton loading (Feature 7)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // React Hook Form (Feature 9)
  const { register, handleSubmit, formState: { errors, touchedFields }, reset, setValue: setFormValue, watch } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: 'Car',
      fuelType: 'Petrol',
      make: '',
      model: '',
      licensePlate: '',
      tankCapacity: undefined,
      avgDailyKm: undefined,
    },
  });

  const licensePlateValue = watch('licensePlate');

  const onSubmit = (data: VehicleFormData) => {
    if (editingId) {
      setVehicles(vehicles.map(v => v.id === editingId ? { ...data, id: editingId } as Vehicle : v));
      addNotification('Vehicle Updated', 'Your vehicle details have been updated.', 'success');
    } else {
      setVehicles([
        ...vehicles,
        { ...data, id: `veh-${crypto.randomUUID()}` } as Vehicle,
      ]);
      addNotification('Vehicle Added', 'New vehicle added to your garage.', 'success');
    }
    setIsAdding(false);
    setEditingId(null);
    reset();
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete));
      setVehicleToDelete(null);
      addNotification('Vehicle Deleted', 'Vehicle removed from your garage.', 'info');
    }
  };

  const startEdit = (vehicle: Vehicle) => {
    reset({
      type: vehicle.type,
      fuelType: vehicle.fuelType,
      make: vehicle.make,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
      tankCapacity: vehicle.tankCapacity,
      avgDailyKm: vehicle.avgDailyKm,
    });
    setEditingId(vehicle.id);
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
  };

  // Close delete modal on Escape (Feature 8)
  useEffect(() => {
    const handleEscape = () => setVehicleToDelete(null);
    document.addEventListener('modal-escape' as any, handleEscape);
    return () => document.removeEventListener('modal-escape' as any, handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center">
          <button aria-label="Go back" onClick={() => navigate('/')} className="mr-4 text-text hover:text-primary transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">My Garage</h1>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-primary font-heading font-bold uppercase tracking-wider flex items-center hover:underline"
          >
            <Plus size={20} className="mr-1" /> Add
          </button>
        )}
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="add-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-brutal p-6 transition-colors"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-bold text-text uppercase tracking-wider">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                <button aria-label="Cancel edit" onClick={cancelEdit} className="text-muted hover:text-text transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-small">Type</label>
                    <select {...register('type')} className="input-brutal">
                      <option value="Car">Car</option>
                      <option value="Bike">Bike</option>
                    </select>
                    {errors.type && <p className="text-red-500 text-xs font-body mt-1">{errors.type.message}</p>}
                  </div>
                  <div>
                    <label className="label-small">Fuel Type</label>
                    <select {...register('fuelType')} className="input-brutal">
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                    {errors.fuelType && <p className="text-red-500 text-xs font-body mt-1">{errors.fuelType.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label-small">Make (e.g., Hyundai)</label>
                  <input
                    type="text"
                    {...register('make')}
                    className={`input-brutal ${errors.make && touchedFields.make ? 'border-red-500' : ''}`}
                    placeholder="Enter make"
                  />
                  {errors.make && touchedFields.make && (
                    <p className="text-red-500 text-xs font-body mt-1">{errors.make.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-small">Model (e.g., i20)</label>
                  <input
                    type="text"
                    {...register('model')}
                    className={`input-brutal ${errors.model && touchedFields.model ? 'border-red-500' : ''}`}
                    placeholder="Enter model"
                  />
                  {errors.model && touchedFields.model && (
                    <p className="text-red-500 text-xs font-body mt-1">{errors.model.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-small">License Plate</label>
                  <LicensePlateInput
                    value={licensePlateValue}
                    onChange={(val) => setFormValue('licensePlate', val, { shouldValidate: true, shouldTouch: true })}
                  />
                  {errors.licensePlate && touchedFields.licensePlate && (
                    <p className="text-red-500 text-xs font-body mt-1">{errors.licensePlate.message}</p>
                  )}
                </div>

                {/* Feature 6: Tank Capacity & Daily Run */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-small">Tank Capacity (L) <span className="text-muted font-normal">(optional)</span></label>
                    <input
                      type="number"
                      {...register('tankCapacity', { setValueAs: (v: string) => v === '' ? undefined : Number(v) })}
                      className={`input-brutal ${errors.tankCapacity ? 'border-red-500' : ''}`}
                      placeholder="e.g., 45"
                    />
                    {errors.tankCapacity && (
                      <p className="text-red-500 text-xs font-body mt-1">{errors.tankCapacity.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label-small">Avg Daily Km <span className="text-muted font-normal">(optional)</span></label>
                    <input
                      type="number"
                      {...register('avgDailyKm', { setValueAs: (v: string) => v === '' ? undefined : Number(v) })}
                      className={`input-brutal ${errors.avgDailyKm ? 'border-red-500' : ''}`}
                      placeholder="e.g., 30"
                    />
                    {errors.avgDailyKm && (
                      <p className="text-red-500 text-xs font-body mt-1">{errors.avgDailyKm.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 mt-6"
                >
                  {editingId ? 'Save Changes' : 'Add Vehicle'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="vehicle-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {isLoading ? (
                // Skeleton Loading (Feature 7)
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="w-20 h-20 bg-surface border-2 border-border rounded-sm flex items-center justify-center mb-4 shadow-brutal-sm transition-colors">
                    <Car size={40} className="text-muted" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-text mb-2 uppercase tracking-wider">No vehicles added</h3>
                  <p className="text-muted font-body mb-6">Add your car or bike to order fuel easily.</p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="btn-primary px-6 py-3"
                  >
                    Add Vehicle
                  </button>
                </div>
              ) : (
                vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="card-brutal p-5 flex items-center justify-between transition-colors hover:border-primary group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-surface border-2 border-border rounded-sm flex items-center justify-center text-primary shadow-brutal-sm transition-colors group-hover:bg-primary group-hover:text-bg">
                        <Car size={24} />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-text text-lg uppercase tracking-wider">{vehicle.make} {vehicle.model}</h3>
                        <div className="flex items-center text-sm text-muted mt-1 font-body">
                          <span className="bg-surface border-2 border-border px-2 py-0.5 rounded-sm font-mono text-xs mr-2 transition-colors text-text">
                            {vehicle.licensePlate}
                          </span>
                          <span className="uppercase tracking-wider text-xs font-bold">• {vehicle.fuelType}</span>
                          {vehicle.tankCapacity && (
                            <span className="uppercase tracking-wider text-xs font-bold">• {vehicle.tankCapacity}L tank</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(vehicle)}
                        className="p-2 text-muted hover:text-primary transition-colors border-2 border-transparent hover:border-primary rounded-sm hover:bg-surface"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => setVehicleToDelete(vehicle.id)}
                        className="p-2 text-muted hover:text-red-500 transition-colors border-2 border-transparent hover:border-red-500 rounded-sm hover:bg-surface"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Delete Confirmation Modal (with focus trap - Feature 8) */}
      <AnimatePresence>
        {vehicleToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              ref={deleteModalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border-2 border-border rounded-sm p-6 w-full max-w-sm shadow-brutal transition-colors"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
            >
              <div className="w-12 h-12 bg-red-500/20 border-2 border-red-500 rounded-sm flex items-center justify-center mb-4 text-red-500 transition-colors shadow-brutal-sm">
                <Trash2 size={24} />
              </div>
              <h3 id="delete-dialog-title" className="text-xl font-heading font-bold text-text mb-2 uppercase tracking-wider">Delete Vehicle?</h3>
              <p className="text-muted font-body mb-6">Are you sure you want to remove this vehicle from your garage? This action cannot be undone.</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setVehicleToDelete(null)}
                  className="btn-secondary flex-1 py-3"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 bg-red-500 text-bg border-2 border-border rounded-sm font-heading font-bold uppercase tracking-wider hover:bg-red-600 transition-colors shadow-brutal hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-brutal-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
