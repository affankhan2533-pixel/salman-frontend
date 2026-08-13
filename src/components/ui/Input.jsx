'use client';

import React from 'react';
import clsx from 'clsx';

export default function Input({
  label,
  error,
  helperText,
  id,
  type = 'text',
  placeholder = '',
  className = '',
  required = false,
  disabled = false,
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-lbl text-warm-gray tracking-widest uppercase font-medium">
          {label} {required && <span className="text-crimson">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx(
          'w-full px-4 py-3.5 bg-ivory-light text-charcoal font-body text-sm border transition-all duration-400 ease-luxury focus:outline-none placeholder:text-warm-gray-light disabled:opacity-50',
          error
            ? 'border-crimson focus:border-crimson'
            : 'border-border-light focus:border-champagne focus:bg-white',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-crimson font-body">{error}</span>}
      {!error && helperText && <span className="text-xs text-warm-gray font-body">{helperText}</span>}
    </div>
  );
}
