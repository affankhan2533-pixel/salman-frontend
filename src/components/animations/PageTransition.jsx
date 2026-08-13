'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}
