'use client';

import React from 'react';
import clsx from 'clsx';

// Container: Max width 1440px, Responsive Padding
export function Container({ children, className = '', size = 'editorial', ...props }) {
  const sizes = {
    editorial: 'max-w-[1440px]',
    narrow: 'max-w-4xl',
    standard: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={clsx('w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-16', sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// 12-Column Responsive Grid System
export function Grid({ children, cols = 12, className = '', gap = 8, ...props }) {
  return (
    <div className={clsx('grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6 md:gap-10', className)} {...props}>
      {children}
    </div>
  );
}

// Section System
export function Section({ children, className = '', bg = 'ivory', id = '', ...props }) {
  const backgrounds = {
    ivory: 'bg-[#F7F4EF] text-[#1F1F1F]',
    cream: 'bg-[#F2EEE7] text-[#1F1F1F]',
    white: 'bg-[#FFFFFF] text-[#1F1F1F]',
    charcoal: 'bg-[#1F1F1F] text-[#F7F4EF]',
  };

  return (
    <section id={id} className={clsx('py-16 md:py-24 lg:py-32 border-b border-[#E4DDD2]', backgrounds[bg], className)} {...props}>
      {children}
    </section>
  );
}
