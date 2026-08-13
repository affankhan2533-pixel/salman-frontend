'use client';

import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export default function Checkbox({
  label,
  id,
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
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div className={clsx(
          'w-5 h-5 border transition-all duration-300 ease-luxury flex items-center justify-center',
          checked ? 'bg-charcoal border-charcoal text-white' : 'border-border-light bg-ivory-light hover:border-champagne'
        )}>
          {checked && <Check className="w-3.5 h-3.5" />}
        </div>
      </div>
      {label && <span className="font-body text-sm text-charcoal">{label}</span>}
    </label>
  );
}
