// frontend/src/components/ToastContainer.jsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const Toast = ({ id, message, type, onDismiss }) => {
  const baseClasses = 'p-4 rounded-lg shadow-xl mb-3 flex items-center space-x-3';
  let typeClasses, Icon;

  switch (type) {
    case 'success':
      typeClasses = 'bg-emerald-500 text-white';
      Icon = CheckCircle;
      break;
    case 'error':
      typeClasses = 'bg-red-500 text-white';
      Icon = XCircle;
      break;
    default:
      typeClasses = 'bg-indigo-500 text-white'; // Used for 'default' or 'snooze' messages
      Icon = AlertTriangle;
      break;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${baseClasses} ${typeClasses} pointer-events-auto`}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex-grow text-sm font-medium">{message}</div>
      <button onClick={() => onDismiss(id)} className="p-1 rounded-full hover:bg-white/20 transition-colors">
        <XCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, setToasts }) => {
  const handleDismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-[1000] w-full max-w-xs pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={handleDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
