'use client';

import React from 'react';
import clsx from 'clsx';
import { Calendar, ArrowRight } from 'lucide-react';

/**
 * 1. Luxury Section Heading
 * Consistent uppercase tracking label + large editorial title + body paragraph
 */
export function LuxurySectionHeading({
  label,
  title,
  titleItalic,
  description,
  className = '',
}) {
  return (
    <div className={clsx('max-w-3xl space-y-4 select-none', className)}>
      {label && (
        <div className="inline-flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
          <span className="text-lbl text-xs tracking-[0.32em] text-warm-gray uppercase font-medium">
            {label}
          </span>
        </div>
      )}

      {title && (
        <h2 className="font-heading text-4xl sm:text-6xl lg:text-[72px] text-charcoal font-normal leading-[0.92] uppercase">
          {title}{' '}
          {titleItalic && (
            <span className="italic text-champagne block sm:inline">{titleItalic}</span>
          )}
        </h2>
      )}

      {description && (
        <p className="text-warm-gray font-light text-base lg:text-lg leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * 2. Luxury Divider
 * Thin gold hairline divider with 20% opacity
 */
export function LuxuryDivider({ className = '' }) {
  return (
    <div
      className={clsx(
        'w-full h-[1px] bg-champagne/20 opacity-20 pointer-events-none select-none my-8 lg:my-16',
        className
      )}
    />
  );
}

/**
 * 3. Luxury Card
 * Warm ivory glass card with soft gold hover elevation
 */
export function LuxuryCard({ children, className = '', isFeatured = false, ...props }) {
  return (
    <div
      className={clsx(
        'group relative bg-ivory/80 backdrop-blur-md border rounded-[28px] transition-all duration-500 ease-luxury overflow-hidden select-none',
        isFeatured
          ? 'p-8 md:p-10 border-champagne/50 shadow-[0_35px_80px_-20px_rgba(197,160,89,0.18)] hover:border-champagne lg:scale-[1.03] z-20'
          : 'p-7 md:p-8 border-border-light/80 shadow-[0_25px_60px_-15px_rgba(31,31,28,0.08)] hover:border-champagne/40 hover:-translate-y-2 z-10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * 4. Luxury Badge
 * Champagne tag badge for services & verified indicators
 */
export function LuxuryBadge({ children, icon: Icon = null, className = '' }) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 bg-champagne/10 text-champagne border border-champagne/20 px-3.5 py-1 rounded-full text-[10px] sm:text-xs tracking-[0.24em] uppercase font-semibold select-none',
        className
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

/**
 * 5. Luxury Number
 * Champagne gold tracking index counter (01, 02, 03)
 */
export function LuxuryNumber({ number, className = '' }) {
  return (
    <span
      className={clsx(
        'font-num text-2xl sm:text-3xl font-semibold text-champagne tracking-tight block select-none',
        className
      )}
    >
      {number}
    </span>
  );
}

/**
 * 6. Luxury Quote
 * Italicized quote with floating champagne quote icon mark
 */
export function LuxuryQuote({ quote, author, title, className = '' }) {
  return (
    <div className={clsx('relative space-y-4 select-none', className)}>
      <span className="font-heading text-8xl text-champagne/15 block -mb-8 pointer-events-none">
        &ldquo;
      </span>
      <p className="font-heading text-2xl sm:text-3xl text-charcoal font-normal italic leading-snug">
        &ldquo;{quote}&rdquo;
      </p>
      {(author || title) && (
        <div className="pt-2">
          {author && (
            <span className="font-heading text-lg text-charcoal font-normal block">
              {author}
            </span>
          )}
          {title && (
            <span className="text-lbl text-xs text-warm-gray tracking-wider uppercase block font-medium">
              {title}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 7. Luxury CTA
 * Primary dark button with gold hover, smooth arrow slide, and soft elevation
 */
export function LuxuryCTA({
  children = 'Book Appointment',
  href = '#booking',
  icon: Icon = Calendar,
  className = '',
}) {
  return (
    <a href={href} className="inline-block">
      <button
        className={clsx(
          'group h-[54px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer select-none',
          className
        )}
      >
        {Icon && <Icon className="w-4 h-4 text-champagne group-hover:text-charcoal transition-colors duration-300" />}
        <span>{children}</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
      </button>
    </a>
  );
}

/**
 * 8. Luxury Image Frame
 * High-fashion 34px rounded image container with soft drop shadow & border
 */
export function LuxuryImageFrame({ children, className = '', ...props }) {
  return (
    <div
      className={clsx(
        'group relative w-full rounded-[34px] overflow-hidden shadow-[0_35px_80px_-20px_rgba(31,31,28,0.14)] bg-cream border border-charcoal/10 will-change-transform z-10 transition-all duration-700 ease-luxury cursor-pointer select-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * 9. Luxury Glass Panel
 * Ivory glassmorphism container with backdrop blur
 */
export function LuxuryGlassPanel({ children, className = '', ...props }) {
  return (
    <div
      className={clsx(
        'bg-ivory/85 backdrop-blur-xl border border-white/80 rounded-[28px] p-6 sm:p-8 lg:p-10 shadow-[0_30px_70px_-15px_rgba(31,31,28,0.08)] select-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
