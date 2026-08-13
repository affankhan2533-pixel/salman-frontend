'use client';

import React, { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0 && barRef.current) {
        const progress = window.scrollY / totalHeight;
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-border-light/40 pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-champagne origin-left transform-gpu transition-transform duration-75 ease-out"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
