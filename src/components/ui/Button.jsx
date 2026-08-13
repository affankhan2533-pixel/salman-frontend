'use client';

import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles = 'h-[56px] px-8 rounded-[14px] inline-flex items-center justify-center transition-all duration-300 ease-luxury font-inter text-btn focus:outline-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer select-none tracking-[0.2em] uppercase font-medium hover:scale-[1.02] hover:tracking-[0.24em] active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#1F1F1F] text-[#FFFFFF] border border-[#1F1F1F] hover:bg-[#C8A76E] hover:border-champagne/40 hover:text-[#FFFFFF] shadow-micro hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-5px_rgba(197,160,89,0.35)]',
    secondary: 'bg-transparent text-[#1F1F1F] border border-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-[#FFFFFF] hover:border-champagne/40 hover:-translate-y-0.5 hover:shadow-luxury-md',
    outline: 'bg-transparent text-[#1F1F1F] border border-[#1F1F1F]/40 hover:border-charcoal hover:bg-[#1F1F1F] hover:text-[#FFFFFF] hover:-translate-y-0.5 hover:shadow-luxury-md',
    ghost: 'text-[#1F1F1F] hover:text-[#C8A76E] bg-transparent border-0 h-auto px-0 rounded-none hover:scale-100',
    text: 'text-[#1F1F1F] hover:text-[#C8A76E] p-0 border-0 h-auto tracking-[0.2em] relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C8A76E] hover:after:w-full after:transition-all after:duration-300 hover:scale-100',
    icon: 'p-3 bg-transparent text-[#1F1F1F] hover:text-[#C8A76E] border border-[#E4DDD2] hover:border-[#C8A76E] rounded-[14px] h-[56px] w-[56px] hover:rotate-6',
  };

  const sizes = {
    sm: 'px-5 text-[11px]',
    md: 'px-8 text-xs',
    lg: 'px-10 text-xs',
    icon: 'p-3',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        variant !== 'text' && variant !== 'icon' && variant !== 'ghost' && sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
      ) : null}

      <span>{children}</span>

      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
      ) : null}
    </button>
  );
}
