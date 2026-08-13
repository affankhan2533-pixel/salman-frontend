'use client';

import React from 'react';
import clsx from 'clsx';

export default function Radio({
  label,
  id,
  name,
  value,
  checked = false,
  onChange,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <label htmlFor={id} className={clsx('inline-flex items-center gap-3 cursor-pointer select-none', disabled && 'opacity-50 pointer-events-none', className)}>
      <div className="relative">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div className={clsx(
          'w-5 h-5 border rounded-full transition-all duration-300 ease-luxury flex items-center justify-center',
          checked ? 'border-champagne bg-ivory' : 'border-border-light bg-ivory-light hover:border-warm-gray'
        )}>
          {checked && <div className="w-2.5 h-2.5 bg-champagne rounded-full" />}
        </div>
      </div>
      {label && <span className="font-body text-sm text-charcoal">{label}</span>}
    </label>
  );
}
