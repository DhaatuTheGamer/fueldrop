import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { OrderStatus } from '../types';

interface LiveTrackingStatusProps {
  currentStatus: OrderStatus;
  statusIndex: number;
  isPending: boolean;
  statuses: OrderStatus[];
  captainName: string | null;
}

export default function LiveTrackingStatus({
  currentStatus,
  statusIndex,
  isPending,
  statuses,
  captainName,
}: LiveTrackingStatusProps) {
  return (
    <>
      {/* Status Tracker */}
      <div className="mb-8">
        <h2 className="text-xl font-heading font-bold text-text uppercase tracking-wider mb-6">
          {currentStatus === 'Pending' ? 'Finding a Captain...' : currentStatus}
        </h2>
        <div className="relative">
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
          <div className="space-y-6 relative">
            {statuses.map((status, index) => {
              // We treat index matching as the active step
              const isCompleted = index <= statusIndex;
              const isCurrent = index === statusIndex;

              return (
                <div key={status} className="flex items-center">
                  <div className={`w-8 h-8 rounded-sm border-2 flex items-center justify-center z-10 transition-colors duration-300 ${
                    isCompleted ? 'bg-primary border-border text-bg shadow-brutal-sm' : 'bg-surface border-border text-muted'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className={`font-heading font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isCurrent ? 'text-primary text-lg' :
                      isCompleted ? 'text-text' : 'text-muted'
                    }`}>
                      {status}
                    </p>
                    <AnimatePresence>
                      {isCurrent && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-muted font-body mt-1"
                        >
                          {status === 'Pending' && 'Waiting for captain to accept...'}
                          {status === 'Accepted' && 'Captain is heading to the fuel station.'}
                          {status === 'Out for Delivery' && 'Captain is on the way to your location.'}
                          {status === 'Arriving' && 'Captain is arriving in a minute.'}
                          {status === 'Delivered' && 'Fuel delivered successfully!'}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Captain Info (only row if accepted or later) */}
      <AnimatePresence>
        {!isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-brutal p-4 flex items-center justify-between transition-colors mt-4"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface border-2 border-border rounded-sm flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="Captain" className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <p className="font-heading font-bold text-text uppercase tracking-wider">{captainName || 'Captain'}</p>
                <p className="text-sm text-muted font-body flex items-center">
                  <span className="text-primary mr-1">★</span> 4.8 (120+ deliveries)
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="w-10 h-10 bg-surface border-2 border-border rounded-sm flex items-center justify-center text-text shadow-brutal-sm hover:bg-bg transition-colors">
                <MessageSquare size={18} />
              </button>
              <button className="w-10 h-10 bg-primary border-2 border-border rounded-sm flex items-center justify-center text-bg shadow-brutal-sm hover:bg-opacity-90 transition-colors">
                <Phone size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
