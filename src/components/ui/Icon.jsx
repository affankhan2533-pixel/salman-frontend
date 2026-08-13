'use client';

import React from 'react';
import clsx from 'clsx';

export default function Icon({
  icon: IconComponent,
  size = 20,
  strokeWidth = 1.25,
  className = '',
  color = 'currentColor',
  ...props
}) {
  if (!IconComponent) return null;

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={clsx('inline-block transition-colors duration-300', className)}
      {...props}
    />
  );
}
