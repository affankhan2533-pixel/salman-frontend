'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const SmoothScrollContext = createContext(null);

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect touch / mobile devices (iPhone, Android, iPads)
    // Mobile browsers have native 120Hz ProMotion touch scrolling. Lenis hijacking causes jank or exceptions on iOS.
    const isTouch =
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
      window.innerWidth < 1024;

    if (isTouch) {
      return;
    }

    let lenis = null;
    let updateTicker = null;

    try {
      // Initialize Lenis Smooth Scroll on desktop only
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        touchMultiplier: 1.5,
        wheelMultiplier: 1.0,
      });

      lenisRef.current = lenis;

      // Synchronize Lenis scroll position with GSAP ScrollTrigger
      lenis.on('scroll', () => {
        ScrollTrigger.update();
      });

      updateTicker = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(500, 33);
    } catch (err) {
      console.warn('Lenis smooth scroll skipped:', err);
    }

    return () => {
      if (updateTicker) {
        gsap.ticker.remove(updateTicker);
      }
      if (lenis) {
        try {
          lenis.destroy();
        } catch (e) {}
      }
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenisRef}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
