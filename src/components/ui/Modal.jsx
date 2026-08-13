'use client';

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className={clsx('relative w-full max-w-2xl bg-ivory border border-border-light shadow-luxury-float z-10 max-h-[90vh] flex flex-col', className)}>
        {title && (
          <div className="px-8 py-6 border-b border-border-light flex items-center justify-between">
            <h3 className="font-heading text-2xl text-charcoal">{title}</h3>
            <button onClick={onClose} className="p-2 text-warm-gray hover:text-charcoal transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-8 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
