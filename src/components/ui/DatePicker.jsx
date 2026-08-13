'use client';

import React from 'react';
import clsx from 'clsx';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function DatePicker({
  label,
  id,
  value,
  onChange,
  error,
  helperText,
  min,
  max,
  className = '',
  required = false,
  disabled = false,
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
        <input
          id={id}
          type="date"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3.5 bg-ivory-light text-charcoal font-body text-sm border transition-all duration-400 ease-luxury focus:outline-none appearance-none disabled:opacity-50',
            error
              ? 'border-crimson focus:border-crimson'
              : 'border-border-light focus:border-champagne focus:bg-white',
            className
          )}
          {...props}
        />
        <CalendarIcon className="w-4 h-4 text-warm-gray absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <span className="text-xs text-crimson font-body">{error}</span>}
      {!error && helperText && <span className="text-xs text-warm-gray font-body">{helperText}</span>}
    </div>
  );
}
