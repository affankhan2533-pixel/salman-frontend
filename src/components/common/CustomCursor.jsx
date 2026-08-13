'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import clsx from 'clsx';
import { gsap } from '@/lib/gsap';

function CustomCursor() {
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [cursorState, setCursorState] = useState('default');
  const [mounted, setMounted] = useState(false);
  const rafId = useRef(null);

  useEffect(() => {
    setMounted(true);
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024);
    if (isTouchDevice) return;

    let latestX = 0;
    let latestY = 0;

    const handleMouseMove = (e) => {
      latestX = e.clientX;
      latestY = e.clientY;

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          if (cursorRingRef.current) {
            gsap.to(cursorRingRef.current, {
              x: latestX,
              y: latestY,
              duration: 0.15,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
          if (cursorDotRef.current) {
            gsap.to(cursorDotRef.current, {
              x: latestX,
              y: latestY,
              duration: 0.03,
              overwrite: 'auto',
            });
          }
          rafId.current = null;
        });
      }
    };

    let lastState = 'default';
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isButton =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        (target.closest && (target.closest('button') || target.closest('a') || target.closest('[role="button"]')));

      const isText =
        target.tagName === 'P' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3';

      let newState = 'default';
      if (isButton) {
        newState = 'button';
      } else if (isText) {
        newState = 'text';
      }

      if (newState !== lastState) {
        lastState = newState;
        setCursorState(newState);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Outer Luxury Ring */}
      <div
        ref={cursorRingRef}
        className={clsx(
          'hidden lg:block fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100] rounded-full transition-all duration-300 ease-luxury will-change-transform',
          cursorState === 'button' && 'w-14 h-14 border border-champagne bg-champagne/15 backdrop-blur-[1px]',
          cursorState === 'text' && 'w-4 h-4 border border-charcoal/40 bg-transparent',
          cursorState === 'default' && 'w-8 h-8 border border-charcoal/25 bg-transparent'
        )}
      />

      {/* Inner Precision Dot */}
      <div
        ref={cursorDotRef}
        className={clsx(
          'hidden lg:block fixed top-0 left-0 w-1.5 h-1.5 bg-champagne rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100] transition-opacity duration-300',
          cursorState === 'button' ? 'opacity-80 scale-125' : 'opacity-100'
        )}
      />
    </>
  );
}

export default memo(CustomCursor);
