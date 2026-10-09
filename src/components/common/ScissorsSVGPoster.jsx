import React from 'react';

/**
 * Canonical SVG Shears Poster
 * Used during initial page loading, WebGL initialization,
 * canvas error recovery, and reduced-motion mode.
 */
export function ScissorsSVGPoster({ className = 'w-24 sm:w-28 h-40 sm:h-44 opacity-40 animate-pulse' }) {
  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blade Left */}
      <path d="M58 100 L52 28 Q60 4 60 4 Q68 4 68 28 L62 100" fill="#f8fafc" stroke="#C8A76E" strokeWidth="0.5" />
      {/* Blade Right */}
      <path d="M62 100 L68 28 Q60 4 60 4 Q52 4 52 28 L58 100" fill="#f0f4f8" stroke="#C8A76E" strokeWidth="0.3" />
      {/* Handle Left */}
      <path d="M40 120 Q42 108 58 100" stroke="#d4af37" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="134" r="12" stroke="#d4af37" strokeWidth="3" fill="none" />
      {/* Handle Right */}
      <path d="M80 120 Q78 108 62 100" stroke="#d4af37" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="88" cy="134" r="11" stroke="#d4af37" strokeWidth="3" fill="none" />
      {/* Pivot */}
      <circle cx="60" cy="100" r="5" fill="#d4af37" />
    </svg>
  );
}

export default ScissorsSVGPoster;
