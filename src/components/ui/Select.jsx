'use client';

import React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  options = [],
  error,
  helperText,
  id,
  className = '',
  required = false,
  disabled = false,
  value,
  onChange,
  placeholder = 'Select option...',
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-2 relative">
      {label && (
        <label htmlFor={id} className="text-lbl text-warm-gray tracking-widest uppercase font-medium">
          {label} {required && <span className="text-crimson">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3.5 bg-ivory-light text-charcoal font-body text-sm border transition-all duration-400 ease-luxury focus:outline-none appearance-none cursor-pointer disabled:opacity-50',
            error
              ? 'border-crimson focus:border-crimson'
              : 'border-border-light focus:border-champagne focus:bg-white',
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-warm-gray absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <span className="text-xs text-crimson font-body">{error}</span>}
      {!error && helperText && <span className="text-xs text-warm-gray font-body">{helperText}</span>}
    </div>
  );
}
