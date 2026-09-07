'use client';

import React from 'react';

/**
 * Thin-stroke SVG line icons for service categories.
 * Consistent with the existing website's minimal aesthetic.
 * All icons are 24×24, stroke-based, no fills.
 */
const icons = {
  scissors: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  ),
  razor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3h10l2 4H5L7 3z" />
      <rect x="4" y="7" width="16" height="10" rx="1" />
      <line x1="4" y1="11" x2="20" y2="11" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  brush: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l8 8" />
      <path d="M11 11l6-6 3 3-6 6-3-3z" />
      <path d="M11 11c-1.5 2-3 4-4 7 3-1 5-2.5 7-4" />
    </svg>
  ),
  drop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" />
      <path d="M9 17c0-1.5 1-3 3-3" strokeOpacity="0.5" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 8C8 10 5.9 16.17 3.82 19.34l1.65 1C7 18 8 17 12 16c4-1 5.09-4.06 5.09-4.06" />
      <path d="M17 8c0 0 1.5 6-5 9" />
      <path d="M3 21s5-3 8-8" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a3 3 0 0 0 0 6M12 16a3 3 0 0 0 0 6M2 12a3 3 0 0 0 6 0M16 12a3 3 0 0 0 6 0" />
      <path d="M4.93 4.93a3 3 0 0 0 4.24 4.24M14.83 14.83a3 3 0 0 0 4.24 4.24M4.93 19.07a3 3 0 0 0 4.24-4.24M14.83 9.17a3 3 0 0 0 4.24-4.24" />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
};

export default function ServiceIcon({ name, className = '' }) {
  return (
    <span className={`block w-6 h-6 text-champagne transition-transform duration-300 ease-out ${className}`}>
      {icons[name] ?? icons.scissors}
    </span>
  );
}
