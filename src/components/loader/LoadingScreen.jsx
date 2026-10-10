'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import { gsap } from '@/lib/gsap';

import { safeSessionStorage } from '@/utils/storage';

function LoadingScreen() {
  const containerRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const word3Ref = useRef(null);
  const lineRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Play ONLY ONCE per browser session using safe storage
    if (safeSessionStorage.getItem('salman_loaded') === 'true') {
      setIsLoaded(true);
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set(containerRef.current, { opacity: 1, display: 'flex' });
      gsap.set([word1Ref.current, word2Ref.current, word3Ref.current], {
        opacity: 0,
        y: 24,
      });
      gsap.set(lineRef.current, { scaleX: 0 });

      // 2. Apple Keynote Opening GSAP Timeline (snappier transition)
      const tl = gsap.timeline({
        onComplete: () => {
          safeSessionStorage.setItem('salman_loaded', 'true');
          setIsLoaded(true);
        },
      });

      // Step 2: Center typography - SALMAN -> HAIR -> STUDIO fade in smoothly
      tl.to(word1Ref.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, 0.1)
        .to(word2Ref.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, 0.25)
        .to(word3Ref.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, 0.4)

        // Step 3: Thin champagne gold line grows horizontally beneath logo
        .to(
          lineRef.current,
          { scaleX: 1, duration: 0.35, ease: 'power2.inOut' },
          0.6
        )

        // Step 4: Background dissolves smoothly
        .to(
          containerRef.current,
          {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onStart: () => {
              const headerEl = document.querySelector('header');
              if (headerEl) {
                gsap.fromTo(
                  headerEl,
                  { y: -100, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
                );
              }
            },
          },
          1.0
        )
        .set(containerRef.current, { display: 'none' });
    });

    const handleQuickDismiss = () => {
      safeSessionStorage.setItem('salman_loaded', 'true');
      setIsLoaded(true);
    };

    window.addEventListener('keydown', handleQuickDismiss, { once: true });
    return () => {
      window.removeEventListener('keydown', handleQuickDismiss);
      ctx.revert();
    };
  }, []);

  if (isLoaded) {
    return null;
  }

  const handleDismiss = () => {
    safeSessionStorage.setItem('salman_loaded', 'true');
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleDismiss}
      className="fixed inset-0 z-[9999] bg-[#F7F4EE] flex flex-col items-center justify-center pointer-events-auto select-none overflow-hidden px-4 cursor-pointer"
      title="Click or press any key to skip"
    >
      {/* Center Screen Typography: SALMAN -> HAIR -> STUDIO */}
      <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
        <h1 className="font-heading font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.3em] uppercase text-charcoal flex flex-col items-center gap-1 sm:gap-2">
          <span ref={word1Ref} className="block font-bold text-charcoal">
            SALMAN
          </span>
          <span ref={word2Ref} className="block italic text-champagne font-normal">
            HAIR
          </span>
          <span ref={word3Ref} className="block font-bold text-charcoal">
            STUDIO
          </span>
        </h1>

        {/* Thin Champagne Gold Line Grows Horizontally Beneath Logo */}
        <div
          ref={lineRef}
          className="w-44 sm:w-60 md:w-72 h-[1.5px] bg-[#C8A76E] shadow-[0_0_12px_#C8A76E] mt-5 sm:mt-7 origin-center"
        />

        {/* Subtitle Accent */}
        <p className="text-lbl text-[9px] sm:text-[11px] tracking-[0.35em] text-warm-gray uppercase mt-3 font-medium">
          HAUTE COIFFURE ATELIER • MUMBAI
        </p>
      </div>
    </div>
  );
}

export default memo(LoadingScreen);
