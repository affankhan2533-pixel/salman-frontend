'use client';

import React from 'react';
import clsx from 'clsx';

export default function Skeleton({
  className = '',
  variant = 'rectangular', // 'rectangular' | 'circular' | 'text'
  width,
  height,
  ...props
}) {
  const baseStyles = 'animate-pulse bg-[#EAE5DC]/60 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent';

  const variants = {
    rectangular: 'rounded-2xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-3/4',
  };

  return (
    <div
      className={clsx(baseStyles, variants[variant], className)}
      style={{ width, height }}
      {...props}
    />
  );
}
