// frontend/src/hooks/useToast.js
import { useState, useCallback, useMemo } from 'react';
import { ToastContainer } from '../components/ToastContainer';

// Central store for toast messages
let addToast;

export const useToast = () => {
  if (!addToast) {
    // This is mainly a development guard. In App.jsx, it's wrapped by ToastProvider.
    return { addToast: () => console.warn("ToastProvider not found.") };
  }
  return useMemo(() => ({ addToast }), []);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const handleAddToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  // Set the global reference on mount
  addToast = handleAddToast;

  const value = useMemo(() => ({ toasts, setToasts }), [toasts]);

  return (
    <>
      {children}
      <ToastContainer toasts={value.toasts} setToasts={value.setToasts} />
    </>
  );
};
