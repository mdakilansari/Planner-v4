// frontend/src/components/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-6 px-8 bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center space-x-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 5 }}
          >
            <BookOpen className="w-7 h-7 text-pink-500" />
          </motion.span>
          <span className="text-gray-900">
            Hi **Ziya Hamza**, here’s your study plan 🤍
          </span>
        </h1>
        {/* Placeholder for future user profile/settings */}
      </motion.div>
    </header>
  );
};

export default Header;
