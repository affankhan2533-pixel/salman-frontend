'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import dynamic from 'next/dynamic';
import { gsap, ScrollTrigger } from '@/lib/gsap';

// Dynamically import 3D R3F Scissor Scene (SSR Disabled for Three.js Canvas)
const ScissorScene = dynamic(() => import('./ScissorScene'), { ssr: false });

function ScissorSection() {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  
  // Left & Right split references for ALL sentences in the frame
  const labelLeftRef = useRef(null);
  const labelRightRef = useRef(null);
  
  const topLeftRef = useRef(null);
  const topRightRef = useRef(null);
  
  const bottomLeftRef = useRef(null);
  const bottomRightRef = useRef(null);
  
  const taglineLeftRef = useRef(null);
  const taglineRightRef = useRef(null);
  
  const cutLineRef = useRef(null);
  const ambientGlowRef = useRef(null);

  const progressRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // 1. Single ScrollTrigger Instance: Tracks early top 85% so canvas is active immediately
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 85%',
        end: 'bottom top',
        onToggle: (self) => setIsVisible(self.isActive),
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });

      const leftElements = [labelLeftRef.current, topLeftRef.current, bottomLeftRef.current, taglineLeftRef.current];
      const rightElements = [labelRightRef.current, topRightRef.current, bottomRightRef.current, taglineRightRef.current];

      // 2. Extended Dynamic Overlay Timeline Sequence (0% - 100%) - 360vh Extended Scroll Runway
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=360%',
          pin: true,
          scrub: 1.2,
        },
      });

      // 0% - 18%: Hero Fades / Scissor Descends
      // 38% - 58%: ALL Sentences Appear Unhurriedly
      tl.fromTo(
        [...leftElements, ...rightElements],
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, stagger: 0.04, ease: 'power3.out' },
        0.35
      )

      // 70%: THIN METALLIC CUTTING LINE FLASH AT MOMENT OF CUT ACROSS FULL FRAME
      .fromTo(
        cutLineRef.current,
        { opacity: 0, scaleY: 0 },
        { opacity: 1, scaleY: 1, duration: 0.04, ease: 'power4.out' },
        0.69
      )
      .to(
        cutLineRef.current,
        { opacity: 0, scaleY: 1.2, duration: 0.04, ease: 'power2.in' },
        0.73
      )
      .fromTo(
        ambientGlowRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.65, scale: 1.2, duration: 0.10, ease: 'power2.out' },
        0.69
      )
      .to(
        ambientGlowRef.current,
        { opacity: 0, scale: 1.6, duration: 0.12, ease: 'power2.in' },
        0.78
      )

      // 70% - 76%: PRECISION FULL-SENTENCE CUT — ALL left halves move left, ALL right halves move right!
      .to(
        leftElements,
        { x: -26, rotate: -2, opacity: 0.95, duration: 0.08, ease: 'power2.out' },
        0.70
      )
      .to(
        rightElements,
        { x: 26, rotate: 2, opacity: 0.95, duration: 0.08, ease: 'power2.out' },
        0.70
      )
      .to(
        [bottomLeftRef.current, bottomRightRef.current],
        { color: '#C8A76E', letterSpacing: '0.12em', duration: 0.08, ease: 'power2.inOut' },
        0.70
      )

      // 78% - 90%: UNHURRIED ELEGANT TEXT EXIT — Left halves drift upward-left, Right halves drift upward-right
      .to(
        leftElements,
        { x: -45, y: -32, rotate: -4, opacity: 0, stagger: 0.02, ease: 'power2.inOut' },
        0.78
      )
      .to(
        rightElements,
        { x: 45, y: -32, rotate: 4, opacity: 0, stagger: 0.02, ease: 'power2.inOut' },
        0.78
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[360vh] bg-transparent pointer-events-none select-none z-30"
    >
      {/* Sticky Viewport Overlay: 100vh, top: 0, transparent background */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-12 overflow-hidden px-4 sm:px-6 pointer-events-none bg-transparent">

        {/* LUXURY AMBIENT GOLD GLOW BACKDROP */}
        <div
          ref={ambientGlowRef}
          className="absolute w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-champagne/15 blur-[120px] pointer-events-none opacity-0 z-10"
        />

        {/* 3D CANVAS OVERLAY LAYER (z-30): Passes behind About Section (z-40) */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-transparent">
          <ScissorScene progressRef={progressRef} isVisible={isVisible} />
        </div>

        {/* EDITORIAL TYPOGRAPHY OVERLAY LAYER (ALL SENTENCES SPLIT INTO LEFT & RIGHT HALVES) */}
        <div ref={textContainerRef} className="relative z-20 flex flex-col items-center text-center max-w-4xl px-4 my-auto pointer-events-none">

          {/* VERTICAL FULL-FRAME CUTTING LINE FLASH OVERLAY */}
          <div
            ref={cutLineRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.8px] h-[90%] bg-champagne shadow-[0_0_16px_#C8A76E] pointer-events-none opacity-0 z-30 origin-center"
          />

          {/* Metadata Sub-Label Split */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-lbl text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-warm-gray uppercase font-medium mb-3 sm:mb-4">
            <span ref={labelLeftRef} className="inline-flex items-center gap-2 transition-transform duration-300 origin-right">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-champagne animate-pulse" />
              <span>PRECISION CUT</span>
            </span>
            <span ref={labelRightRef} className="inline-block transition-transform duration-300 origin-left">
              TING PHILOSOPHY
            </span>
          </div>

          {/* Main Editorial Heading Line 1 Split: CRAFT / PRECISION */}
          <h2 className="font-heading text-4xl sm:text-6xl lg:text-[76px] xl:text-[88px] leading-[0.92] tracking-[-0.03em] uppercase font-medium">
            <div className="inline-flex items-center justify-center gap-3">
              <span ref={topLeftRef} className="inline-block text-charcoal origin-right transition-transform duration-300">
                CRAFT
              </span>
              <span ref={topRightRef} className="inline-block text-charcoal origin-left transition-transform duration-300">
                PRECISION
              </span>
            </div>

            {/* Main Editorial Heading Line 2 Split: IDEN / TITY */}
            <div className="block mt-1 sm:mt-2">
              <span className="inline-flex items-center justify-center italic text-champagne font-normal transition-all duration-300">
                <span ref={bottomLeftRef} className="inline-block origin-right transition-transform duration-300">IDEN</span>
                <span ref={bottomRightRef} className="inline-block origin-left transition-transform duration-300">TITY</span>
              </span>
            </div>
          </h2>

          {/* Tagline Paragraph Split */}
          <div className="mt-4 sm:mt-6 max-w-xl">
            <p className="text-body-editorial text-xs sm:text-sm text-warm-gray tracking-wide leading-relaxed inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span ref={taglineLeftRef} className="inline-block origin-right transition-transform duration-300">
                Every shear movement is calculated with diagnostic accuracy,
              </span>
              <span ref={taglineRightRef} className="inline-block origin-left transition-transform duration-300">
                sculpting silhouettes tailored to your personal aesthetic.
              </span>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default memo(ScissorSection);
