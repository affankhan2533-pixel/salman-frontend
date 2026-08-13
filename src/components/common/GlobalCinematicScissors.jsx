'use client';

import React, { useEffect, useRef, memo } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

function GlobalCinematicScissors() {
  const containerRef = useRef(null);
  const scissorsWrapperRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      if (!scissorsWrapperRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      tl.to(scissorsWrapperRef.current, {
        left: '20vw',
        top: '45vh',
        scale: 0.85,
        rotate: -25,
        opacity: 0,
        ease: 'power2.inOut',
      })
        .to(scissorsWrapperRef.current, {
          left: '75vw',
          top: '52vh',
          scale: 1.1,
          rotate: 45,
          opacity: 0,
          ease: 'sine.inOut',
        })
        .to(scissorsWrapperRef.current, {
          left: '48vw',
          top: '38vh',
          scale: 1.25,
          rotate: 90,
          opacity: 0,
          ease: 'power2.inOut',
        })
        .to(scissorsWrapperRef.current, {
          left: '82vw',
          top: '32vh',
          scale: 0.9,
          rotate: 180,
          opacity: 0,
          ease: 'sine.inOut',
        })
        .to(scissorsWrapperRef.current, {
          left: '25vw',
          top: '65vh',
          scale: 0.7,
          rotate: 210,
          opacity: 0,
          ease: 'power2.inOut',
        })
        .to(scissorsWrapperRef.current, {
          opacity: 0,
          scale: 0.5,
          ease: 'power2.out',
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden hidden select-none opacity-0"
    >
      <div
        ref={scissorsWrapperRef}
        style={{ left: '62vw', top: '35vh' }}
        className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 opacity-0 hidden"
      />
    </div>
  );
}

export default memo(GlobalCinematicScissors);
