import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function NotificationToast() {
  const { notifications, markNotificationRead } = useAppContext();

  // Only show unread notifications, max 3 at a time
  const visibleNotifications = useMemo(() => notifications.filter(n => !n.read).slice(0, 3), [notifications]);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 space-y-2">
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="w-full max-w-sm bg-surface border-2 border-border rounded-sm shadow-brutal p-4 pointer-events-auto flex items-start transition-colors"
          >
            <div className={`shrink-0 mt-0.5 ${
              notification.type === 'success' ? 'text-accent' :
              notification.type === 'warning' ? 'text-primary' : 'text-blue-500'
            }`}>
              {notification.type === 'success' && <CheckCircle2 size={20} />}
              {notification.type === 'warning' && <AlertTriangle size={20} />}
              {notification.type === 'info' && <Info size={20} />}
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-heading font-bold text-text uppercase tracking-wider">{notification.title}</h4>
              <p className="text-sm text-muted font-body mt-0.5 leading-tight">{notification.message}</p>
            </div>
            <button 
              onClick={() => markNotificationRead(notification.id)}
              className="ml-3 shrink-0 text-muted hover:text-primary transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
