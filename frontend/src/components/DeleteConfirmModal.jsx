// frontend/src/components/DeleteConfirmModal.jsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, task }) => {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col items-center pt-2 pb-4">
              <Trash2 className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Task Confirmation</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete the task: **"{task.title}"**? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
