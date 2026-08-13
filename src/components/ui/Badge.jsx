'use client';

import React from 'react';
import clsx from 'clsx';

export default function Badge({ children, variant = 'champagne', className = '' }) {
  const variants = {
    champagne: 'bg-champagne/10 text-champagne border-champagne/20',
    charcoal: 'bg-charcoal text-white border-charcoal',
    cream: 'bg-cream text-charcoal border-border-light',
    sage: 'bg-sage/10 text-sage border-sage/20',
  };

  return (
    <span className={clsx('inline-flex items-center px-3 py-1 text-lbl text-[10px] tracking-widest uppercase border', variants[variant], className)}>
      {children}
    </span>
  );
}
