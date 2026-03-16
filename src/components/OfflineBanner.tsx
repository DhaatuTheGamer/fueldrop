import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-9999 bg-red-500 text-white px-4 py-3 flex items-center justify-center space-x-2 border-b-2 border-border shadow-brutal-sm"
        >
          <WifiOff size={18} className="animate-pulse" />
          <span className="font-heading font-bold text-sm uppercase tracking-wider">
            You are offline — some features may not work
          </span>
        </motion.div>
      )}
      {showReconnected && !isOffline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-9999 bg-accent text-white px-4 py-3 flex items-center justify-center space-x-2 border-b-2 border-border shadow-brutal-sm"
        >
          <Wifi size={18} />
          <span className="font-heading font-bold text-sm uppercase tracking-wider">
            Back online!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
