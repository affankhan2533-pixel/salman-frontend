'use client';

import React, { useRef } from 'react';

/**
 * ServiceCategoryTabs — HAIR | FACE sub-navigation
 * Sits below GenderTabs. Lighter style, same accessibility pattern.
 */
export default function ServiceCategoryTabs({ activeCategory, onChange }) {
  const tabs = [
    { id: 'hair', label: 'HAIR' },
    { id: 'face', label: 'FACE' },
  ];

  const containerRef = useRef(null);

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

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Select service category"
      className="flex items-center gap-2 select-none"
    >
      {tabs.map((tab, idx) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeCategory === tab.id}
          onClick={() => onChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          tabIndex={activeCategory === tab.id ? 0 : -1}
          className={`
            h-11 px-6 text-[11px] font-heading sm:font-inter font-semibold tracking-[0.24em] uppercase
            border rounded-full transition-all duration-200 ease-out cursor-pointer active:scale-[0.96]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60 focus-visible:ring-offset-1
            ${activeCategory === tab.id
              ? 'bg-charcoal text-white border-charcoal shadow-[0_2px_8px_rgba(31,31,28,0.18)]'
              : 'bg-white/80 border-charcoal/15 text-[#6B6861] hover:text-charcoal hover:border-charcoal/30 hover:bg-white'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>

  );
}
