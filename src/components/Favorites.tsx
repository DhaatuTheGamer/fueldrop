import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Trash2, Edit2, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import VehicleSelectModal from './VehicleSelectModal';

export default function Favorites() {
  const { favoriteOrders, setFavoriteOrders, vehicles, setCurrentOrder, addNotification } = useAppContext();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [pendingFav, setPendingFav] = useState<typeof favoriteOrders[0] | null>(null);

  const handleReorder = (fav: typeof favoriteOrders[0]) => {
    const vehicle = vehicles.find(v => v.id === fav.vehicleId);
    if (vehicle) {
      setCurrentOrder({
        vehicleId: fav.vehicleId,
        fuelType: fav.fuelType,
        amountRupees: fav.orderType === 'amount' ? fav.value : undefined,
        quantityLiters: fav.orderType === 'quantity' ? fav.value : undefined,
        location: fav.location,
      });
      navigate('/checkout');
    } else {
      // Vehicle was deleted — prompt user to select another
      setPendingFav(fav);
      setShowVehicleModal(true);
    }
  };

  const handleVehicleSelected = (vehicleId: string) => {
    if (pendingFav) {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      setCurrentOrder({
        vehicleId,
        fuelType: vehicle?.fuelType || pendingFav.fuelType,
        amountRupees: pendingFav.orderType === 'amount' ? pendingFav.value : undefined,
        quantityLiters: pendingFav.orderType === 'quantity' ? pendingFav.value : undefined,
        location: pendingFav.location,
      });
      navigate('/checkout');
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      setFavoriteOrders(favoriteOrders.filter(f => f.id !== deleteId));
      setDeleteId(null);
      addNotification('Favorite Removed', 'The favorite order has been deleted.', 'info');
    }
  };

  const handleSaveEdit = (id: string) => {
    setFavoriteOrders(favoriteOrders.map(f =>
      f.id === id ? { ...f, name: editName } : f
    ));
    addNotification('Favorite Updated', 'The favorite name has been updated.', 'success');
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center sticky top-0 z-10 transition-colors">
        <button onClick={() => navigate('/profile')} className="mr-4 text-text hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">Favorites</h1>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full">
        {favoriteOrders.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-20 h-20 bg-surface border-2 border-border rounded-sm flex items-center justify-center mb-4 shadow-brutal-sm transition-colors">
              <Heart size={40} className="text-muted" />
            </div>
            <h2 className="text-xl font-heading font-bold text-text uppercase tracking-wider mb-2">No Favorites Yet</h2>
            <p className="text-muted font-body mb-6 max-w-xs">Save your frequent orders during checkout for quick reordering.</p>
            <button onClick={() => navigate('/order')} className="btn-primary py-3 px-6">Start Ordering</button>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteOrders.map((fav) => (
              <motion.div 
                key={fav.id}
                layout
                className="card-brutal overflow-hidden transition-colors group hover:border-primary"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/20 border-2 border-border rounded-sm flex items-center justify-center shrink-0 text-primary shadow-brutal-sm">
                        <Heart size={18} className="fill-current" />
                      </div>
                      {editingId === fav.id ? (
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="input-brutal text-sm py-1 flex-1"
                            autoFocus
                          />
                          <button onClick={() => handleSaveEdit(fav.id)} className="text-primary font-heading font-bold text-xs uppercase tracking-wider shrink-0">Save</button>
                        </div>
                      ) : (
                        <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider truncate">{fav.name}</h3>
                      )}
                    </div>
                    <div className="flex space-x-1 shrink-0 ml-3">
                      <button onClick={() => { setEditingId(fav.id); setEditName(fav.name); }} className="p-1.5 text-muted hover:text-primary transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setDeleteId(fav.id)} className="p-1.5 text-muted hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-bg border-2 border-border rounded-sm p-2 transition-colors">
                      <span className="text-muted font-body text-xs">Fuel</span>
                      <p className="font-heading font-bold text-text">{fav.fuelType}</p>
                    </div>
                    <div className="bg-bg border-2 border-border rounded-sm p-2 transition-colors">
                      <span className="text-muted font-body text-xs">{fav.orderType === 'amount' ? 'Amount' : 'Liters'}</span>
                      <p className="font-heading font-bold text-text">{fav.orderType === 'amount' ? `₹${fav.value}` : `${fav.value}L`}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-muted font-body mb-4">
                    <MapPin size={14} className="mr-2 text-primary shrink-0" />
                    <span className="truncate">{fav.location.address}</span>
                  </div>

                  <button
                    onClick={() => handleReorder(fav)}
                    className="w-full btn-primary py-3 flex items-center justify-center"
                  >
                    Reorder Now <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <VehicleSelectModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onSelect={handleVehicleSelected}
        title="Vehicle Deleted"
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
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
              className="card-brutal p-6 w-full max-w-sm transition-colors"
            >
              <h3 className="text-xl font-heading font-bold text-text mb-2 uppercase tracking-wider">Delete Favorite?</h3>
              <p className="text-muted font-body mb-6">Are you sure you want to remove this saved order?</p>
              <div className="flex space-x-3">
                <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 py-3">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-3 px-4 bg-red-500 text-bg border-2 border-border rounded-sm font-heading font-bold uppercase tracking-wider hover:bg-red-600 transition-colors shadow-brutal hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-brutal-sm">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
