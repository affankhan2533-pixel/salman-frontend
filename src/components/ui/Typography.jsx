'use client';

import React from 'react';
import clsx from 'clsx';

// Global Luxury Typography Primitives
export function Display({ children, size = 'hero', className = '', as = 'h1', ...props }) {
  const Tag = as;
  const sizes = {
    hero: 'text-hero',
    section: 'text-section',
  };

  return (
    <Tag className={clsx('font-cormorant text-[#1F1F1F] font-normal select-none', sizes[size], className)} {...props}>
      {children}
    </Tag>
  );
}

export function Heading({ children, className = '', as = 'h2', ...props }) {
  const Tag = as;
  return (
    <Tag className={clsx('font-cormorant text-section text-[#1F1F1F] font-normal', className)} {...props}>
      {children}
    </Tag>
  );
}

export function Subheading({ children, className = '', as = 'h3', ...props }) {
  const Tag = as;
  return (
    <Tag className={clsx('font-cormorant text-subheading text-[#1F1F1F] font-normal', className)} {...props}>
      {children}
    </Tag>
  );
}

export function SectionTitle({ children, className = '', ...props }) {
  return (
    <h4 className={clsx('text-btn text-[#C8A76E] font-medium tracking-[0.25em] uppercase mb-4 block', className)} {...props}>
      {children}
    </h4>
  );
}

export function Text({ children, variant = 'body', className = '', ...props }) {
  const variants = {
    large: 'text-body-editorial text-[#1F1F1F]',
    body: 'text-body-editorial text-[#66665F]',
    caption: 'text-caption-editorial text-[#66665F]',
    number: 'font-num text-[#1F1F1F]',
  };

  return (
    <p className={clsx(variants[variant], className)} {...props}>
      {children}
    </p>
  );
}
