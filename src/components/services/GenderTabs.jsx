'use client';

import React, { useRef } from 'react';

/**
 * GenderTabs — MEN | WOMEN luxury segmented toggle
 * Equal-width 50/50 distribution ensures pixel-perfect sliding indicator.
 * Smooth cubic-bezier spring-like animation with zero displacement bugs.
 */
export default function GenderTabs({ activeGender, onChange }) {
  const tabs = [
    { id: 'male', label: 'MEN' },
    { id: 'female', label: 'WOMEN' },
  ];

  const containerRef = useRef(null);
  const activeIdx = tabs.findIndex((t) => t.id === activeGender);

  // Keyboard navigation
  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextIdx = idx === 0 ? 1 : 0;
      onChange(tabs[nextIdx].id);
      const buttons = containerRef.current?.querySelectorAll('[role="tab"]');
      buttons?.[nextIdx]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Select gender category"
      className="relative w-[280px] sm:w-[320px] max-w-full grid grid-cols-2 p-1 bg-[#ECE7DE] border border-charcoal/10 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] select-none"
    >
      {/* Sliding active indicator pill */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 rounded-full bg-charcoal shadow-[0_4px_14px_rgba(31,31,28,0.22)] pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: 'calc(50% - 8px)',
          transform: activeIdx === 0 ? 'translateX(0)' : 'translateX(calc(100% + 8px))',
        }}
      />

      {tabs.map((tab, idx) => {
        const isActive = activeGender === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            tabIndex={isActive ? 0 : -1}
            className={`
              relative z-10 h-11 w-full flex items-center justify-center gap-2 rounded-full cursor-pointer
              text-xs font-heading sm:font-inter font-semibold tracking-[0.24em] uppercase
              transition-all duration-200 ease-out active:scale-[0.96]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60 focus-visible:ring-offset-1
              ${isActive ? 'text-white' : 'text-[#6B6861] hover:text-charcoal'}
            `}
          >
            {/* Subtle active gold accent dot */}
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse shrink-0" />
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

