import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Filter, Clock, CheckCircle2, X, Package, XCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { OrderStatus } from '../types';

export default function OrderHistory() {
  const { orders } = useAppContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions: (OrderStatus | 'All')[] = ['All', 'Pending', 'Accepted', 'Out for Delivery', 'Arriving', 'Delivered', 'Cancelled'];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'text-accent';
      case 'Cancelled': return 'text-red-500';
      case 'Pending': return 'text-muted';
      default: return 'text-primary';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return <CheckCircle2 size={16} />;
      case 'Cancelled': return <XCircle size={16} />;
      case 'Pending': return <Clock size={16} />;
      default: return <Package size={16} />;
    }
  };

  const filtered = useMemo(() => {
    let result = [...orders];

    if (selectedStatus !== 'All') {
      result = result.filter(o => o.status === selectedStatus);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.fuelType.toLowerCase().includes(q) ||
        o.location?.address?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, selectedStatus, search, sortOrder]);

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center">
          <button aria-label="Go back" onClick={() => navigate('/')} className="mr-4 text-text hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">Order History</h1>
        </div>
        <button
          aria-label={showFilters ? 'Hide filters' : 'Show filters'}
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 border-2 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${showFilters ? 'bg-primary text-bg border-border' : 'bg-bg text-text border-border hover:border-primary'}`}
        >
          <Filter size={20} />
        </button>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            aria-label="Search orders"
            className="input-brutal pl-10"
          />
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="card-brutal p-4 space-y-4 transition-colors">
                <div>
                  <p className="label-small mb-2">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-3 py-1.5 border-2 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                          selectedStatus === status
                            ? 'bg-primary text-bg border-border shadow-brutal-sm'
                            : 'bg-bg border-border text-muted hover:border-muted'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label-small mb-2">Sort</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSortOrder('newest')}
                      className={`flex-1 py-2 border-2 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                        sortOrder === 'newest' ? 'bg-primary text-bg border-border shadow-brutal-sm' : 'bg-bg border-border text-muted'
                      }`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => setSortOrder('oldest')}
                      className={`flex-1 py-2 border-2 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                        sortOrder === 'oldest' ? 'bg-primary text-bg border-border shadow-brutal-sm' : 'bg-bg border-border text-muted'
                      }`}
                    >
                      Oldest First
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-surface border-2 border-border rounded-sm flex items-center justify-center mb-4 shadow-brutal-sm transition-colors">
              <Clock size={40} className="text-muted" />
            </div>
            <h3 className="text-lg font-heading font-bold text-text mb-2 uppercase tracking-wider">No orders found</h3>
            <p className="text-muted font-body mb-4">{search ? 'Try a different search term' : 'Place your first order to see it here'}</p>
            <button onClick={() => navigate('/order')} className="btn-primary px-6 py-3 focus-visible:ring-2 focus-visible:ring-text focus-visible:outline-none focus-visible:ring-offset-2">
              Order Fuel
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-brutal p-5 transition-colors hover:border-primary"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-heading font-bold text-text uppercase tracking-wider">{order.fuelType} • {order.quantityLiters?.toFixed(1)}L</p>
                    <p className="text-xs text-muted font-body mt-0.5">#{order.id.slice(-6)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-lg text-text">₹{order.totalAmount?.toFixed(2)}</p>
                    <div className={`flex items-center text-xs font-heading font-bold uppercase tracking-wider mt-0.5 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted font-body border-t-2 border-border pt-3 transition-colors">
                  <Clock size={14} className="mr-2 shrink-0" />
                  <span>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {order.isScheduled && (
                    <span className="ml-2 inline-flex items-center bg-primary/10 border border-primary/30 text-primary text-[10px] font-heading font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      <Calendar size={10} className="mr-0.5" /> Scheduled
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
