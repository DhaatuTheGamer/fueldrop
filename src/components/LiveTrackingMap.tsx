import React from 'react';
import { motion } from 'motion/react';
import { Truck } from 'lucide-react';
import { OrderStatus } from '../types';

interface LiveTrackingMapProps {
  isPending: boolean;
  currentStatus: OrderStatus;
  eta: number;
}

export default function LiveTrackingMap({ isPending, currentStatus, eta }: LiveTrackingMapProps) {
  return (
    <div className="flex-1 relative bg-surface transition-colors">
      {/* Simulated Map Area */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at center, #E56B25 2px, transparent 2px)',
          backgroundSize: '24px 24px'
        }} />

        {/* Route Line */}
        {!isPending && currentStatus !== 'Delivered' && (
          <svg className="absolute w-full h-full" style={{ filter: 'drop-shadow(4px 4px 0px rgba(229, 107, 37, 0.2))' }}>
            <path
              d="M 100,100 C 150,200 250,150 300,300"
              fill="none"
              stroke="#E56B25"
              strokeWidth="4"
              strokeDasharray="8 8"
              className="animate-[dash_20s_linear_infinite]"
            />
          </svg>
        )}

        {/* Delivery Vehicle Marker */}
        {!isPending && currentStatus !== 'Delivered' && (
          <motion.div
            className="absolute w-12 h-12 bg-bg rounded-sm shadow-brutal flex items-center justify-center border-2 border-border z-10"
            animate={{
              x: [0, 50, 150, 200],
              y: [0, 100, 50, 200]
            }}
            transition={{ duration: 16, ease: "linear" }}
          >
            <Truck size={20} className="text-primary" />
          </motion.div>
        )}

        {/* Destination Marker */}
        <div className="absolute top-[300px] left-[300px] -translate-x-1/2 -translate-y-1/2">
          {!isPending && currentStatus !== 'Delivered' && (
            <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping absolute inset-0" />
          )}
          <div className="w-8 h-8 bg-primary rounded-sm border-2 border-border shadow-brutal relative z-10 flex items-center justify-center">
            <div className="w-2 h-2 bg-bg rounded-sm" />
          </div>
        </div>
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-linear-to-b from-bg/80 to-transparent">
        <div className="bg-bg/90 backdrop-blur-md rounded-sm p-4 shadow-brutal flex items-center justify-between border-2 border-border">
          <div>
            <p className="label-small">Estimated Arrival</p>
            <p className="text-2xl font-heading font-bold text-text">
              {isPending ? '--:--' : `${Math.floor(eta / 60)}:${String(eta % 60).padStart(2, '0')}`}
            </p>
          </div>
          <div className="text-right">
            <p className="label-small">Distance</p>
            <p className="text-lg font-heading font-bold text-text">{isPending ? '--' : '2.4 km'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
