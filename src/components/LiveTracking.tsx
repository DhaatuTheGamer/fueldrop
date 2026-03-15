import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Phone, MessageSquare, CheckCircle2, Clock, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { OrderStatus } from '../types';

const statuses: OrderStatus[] = ['Pending', 'Accepted', 'Out for Delivery', 'Arriving', 'Delivered'];

export default function LiveTracking() {
  const { addNotification } = useAppContext();
  const navigate = useNavigate();
  const [statusIndex, setStatusIndex] = useState(0);
  const [eta, setEta] = useState(12 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statuses.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentStatus = statuses[statusIndex];
    if (currentStatus === 'Accepted') {
      addNotification('Order Confirmed', 'Your fuel order has been accepted and a captain is assigned.', 'success');
    } else if (currentStatus === 'Out for Delivery') {
      addNotification('Out for Delivery', 'Your captain is on the way with your fuel.', 'info');
    } else if (currentStatus === 'Delivered') {
      addNotification('Order Delivered', 'Your fuel has been delivered successfully!', 'success');
    }
  }, [statusIndex, addNotification]);

  useEffect(() => {
    if (statusIndex === statuses.length - 1) {
      setTimeout(() => {
        navigate('/rating');
      }, 1500);
    }
  }, [statusIndex, navigate]);

  const currentStatus = statuses[statusIndex];

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <div className="flex-1 relative bg-surface transition-colors">
        {/* Simulated Map Area */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at center, #E56B25 2px, transparent 2px)',
            backgroundSize: '24px 24px'
          }} />
          
          {/* Route Line */}
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

          {/* Delivery Vehicle Marker */}
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

          {/* Destination Marker */}
          <div className="absolute top-[300px] left-[300px] -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping absolute inset-0" />
            <div className="w-8 h-8 bg-primary rounded-sm border-2 border-border shadow-brutal relative z-10 flex items-center justify-center">
              <div className="w-2 h-2 bg-bg rounded-sm" />
            </div>
          </div>
        </div>

        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-bg/80 to-transparent">
          <div className="bg-bg/90 backdrop-blur-md rounded-sm p-4 shadow-brutal flex items-center justify-between border-2 border-border">
            <div>
              <p className="label-small">Estimated Arrival</p>
              <p className="text-2xl font-heading font-bold text-text">
                {Math.floor(eta / 60)}:{String(eta % 60).padStart(2, '0')}
              </p>
            </div>
            <div className="text-right">
              <p className="label-small">Distance</p>
              <p className="text-lg font-heading font-bold text-text">2.4 km</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg border-t-2 border-border z-20 relative transition-colors">
        <div className="w-12 h-1.5 bg-border rounded-sm mx-auto mt-4 mb-6" />
        
        <div className="px-6 pb-8">
          {/* Status Tracker */}
          <div className="mb-8">
            <h2 className="text-xl font-heading font-bold text-text uppercase tracking-wider mb-6">{currentStatus}</h2>
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-6 relative">
                {statuses.map((status, index) => {
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
                        {isCurrent && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-sm text-muted font-body mt-1"
                          >
                            {status === 'Pending' && 'Waiting for captain to accept...'}
                            {status === 'Accepted' && 'Captain is heading to the fuel station.'}
                            {status === 'Out for Delivery' && 'Captain is on the way to your location.'}
                            {status === 'Arriving' && 'Captain is arriving in a minute.'}
                            {status === 'Delivered' && 'Fuel delivered successfully!'}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Captain Info */}
          <div className="card-brutal p-4 flex items-center justify-between transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface border-2 border-border rounded-sm flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="Captain" className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <p className="font-heading font-bold text-text uppercase tracking-wider">Rahul Kumar</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
