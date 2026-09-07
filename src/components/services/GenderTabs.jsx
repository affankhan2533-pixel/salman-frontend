'use client';

import React, { useRef, useEffect } from 'react';

/**
 * GenderTabs — MEN | WOMEN segmented switcher
 * Accessible: role="tablist", aria-selected, keyboard left/right navigation
 * Sliding indicator via transform (no layout reflow)
 */
export default function GenderTabs({ activeGender, onChange }) {
  const tabs = [
    { id: 'male', label: 'MEN' },
    { id: 'female', label: 'WOMEN' },
  ];

  const containerRef = useRef(null);

  // Keyboard navigation
  const handleKeyDown = (e, idx) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (idx + 1) % tabs.length;
      onChange(tabs[next].id);
      containerRef.current?.querySelectorAll('[role="tab"]')[next]?.focus();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (idx - 1 + tabs.length) % tabs.length;
      onChange(tabs[prev].id);
      containerRef.current?.querySelectorAll('[role="tab"]')[prev]?.focus();
    }
  };

  const activeIdx = tabs.findIndex((t) => t.id === activeGender);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Select gender category"
      className="relative inline-flex items-center bg-cream border border-border-light rounded-[14px] p-1"
    >
      {/* Sliding active indicator */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-[10px] bg-charcoal transition-transform duration-[250ms] ease-[cubic-bezier(0.215,0.61,0.355,1)] pointer-events-none"
        style={{
          width: `calc(50% - 4px)`,
          transform: `translateX(${activeIdx === 0 ? '0px' : 'calc(100% + 2px)'})`,
          left: '4px',
        }}
      />

      {tabs.map((tab, idx) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeGender === tab.id}
          onClick={() => onChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          tabIndex={activeGender === tab.id ? 0 : -1}
          className={`
            relative z-10 px-8 py-2.5 text-[11px] font-inter font-semibold tracking-[0.28em] uppercase
            transition-colors duration-[250ms] ease-out rounded-[10px] cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60 focus-visible:ring-offset-1
            ${activeGender === tab.id
              ? 'text-white'
              : 'text-warm-gray hover:text-charcoal'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
