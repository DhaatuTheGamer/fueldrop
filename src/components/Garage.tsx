import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Car, Plus, Trash2, Edit2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Vehicle, VehicleType, FuelType } from '../types';
import LicensePlateInput from './LicensePlateInput';

export default function Garage() {
  const { vehicles, setVehicles, addNotification } = useAppContext();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: 'Car',
    fuelType: 'Petrol',
    make: '',
    model: '',
    licensePlate: '',
  });

  const handleAddOrEditVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    // The LicensePlateInput handles formatting; just check minimum length
    const plateClean = (newVehicle.licensePlate || '').replace(/\s/g, '');
    if (plateClean.length < 9) {
      addNotification('Invalid License Plate', 'Please enter a complete license plate (e.g., KA 01 AB 1234).', 'warning');
      return;
    }

    if (newVehicle.make && newVehicle.model && newVehicle.licensePlate) {
      if (editingId) {
        setVehicles(vehicles.map(v => v.id === editingId ? { ...newVehicle, id: editingId } as Vehicle : v));
        addNotification('Vehicle Updated', 'Your vehicle details have been updated.', 'success');
      } else {
        setVehicles([
          ...vehicles,
          {
            ...newVehicle,
            id: `veh-${Date.now()}`,
          } as Vehicle,
        ]);
        addNotification('Vehicle Added', 'New vehicle added to your garage.', 'success');
      }
      setIsAdding(false);
      setEditingId(null);
      setNewVehicle({ type: 'Car', fuelType: 'Petrol', make: '', model: '', licensePlate: '' });
    }
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete));
      setVehicleToDelete(null);
      addNotification('Vehicle Deleted', 'Vehicle removed from your garage.', 'info');
    }
  };

  const startEdit = (vehicle: Vehicle) => {
    setNewVehicle(vehicle);
    setEditingId(vehicle.id);
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewVehicle({ type: 'Car', fuelType: 'Petrol', make: '', model: '', licensePlate: '' });
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="mr-4 text-text hover:text-primary transition-colors">
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
                <button onClick={cancelEdit} className="text-muted hover:text-text transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddOrEditVehicle} className="space-y-4">
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
                  <LicensePlateInput
                    value={newVehicle.licensePlate || ''}
                    onChange={(val) => setNewVehicle({ ...newVehicle, licensePlate: val })}
                  />
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
              {vehicles.length === 0 ? (
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {vehicleToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border-2 border-border rounded-sm p-6 w-full max-w-sm shadow-brutal transition-colors"
            >
              <div className="w-12 h-12 bg-red-500/20 border-2 border-red-500 rounded-sm flex items-center justify-center mb-4 text-red-500 transition-colors shadow-brutal-sm">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-heading font-bold text-text mb-2 uppercase tracking-wider">Delete Vehicle?</h3>
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
