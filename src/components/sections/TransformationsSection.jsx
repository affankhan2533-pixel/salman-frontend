'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/ui';
import { Calendar } from 'lucide-react';

const TRANSFORMATIONS_DATA = [
  {
    id: 1,
    slug: 'color-correction',
    name: 'Couture Balayage & Gloss',
    category: 'COUTURE COLOR',
    duration: '150 MINS',
    recommendedFor: 'Dimensional Color & Tone Repair',
    avgSession: '4.0 HOURS',
    description: 'A side-by-side comparison of bespoke haute coiffure sculpting, hand-painted balayage, and organic silk gloss.',
    beforeImg: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=1600',
    afterImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 2,
    slug: 'bridal-makeover',
    name: 'Royal Heritage Bridal Coiffure',
    category: 'HAUTE BRIDE',
    duration: '180 MINS',
    recommendedFor: 'Crown Architecture & Veil Support',
    avgSession: '4.5 HOURS',
    description: 'Bespoke royal bridal coiffure integrating 22-inch remy extensions and humidity-proof veil anchoring.',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1600',
    afterImg: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 3,
    slug: 'keratin-treatment',
    name: 'Silk Keratin & Glass Smoothing',
    category: 'TEXTURE REFINEMENT',
    duration: '180 MINS',
    recommendedFor: 'Frizz Elimination & Silk Gloss',
    avgSession: '3.0 HOURS',
    description: 'Formaldehyde-free amino acid complex restoring structural mass and glass weightless shine.',
    beforeImg: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=1600',
    afterImg: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1600',
  },
];

function TransformationsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const sectionRef = useRef(null);
  const showcaseFrameRef = useRef(null);
  const dividerLineRef = useRef(null);
  const afterImageRef = useRef(null);
  const sidebarContentRef = useRef(null);

  const current = TRANSFORMATIONS_DATA[activeIdx];

  // Auto-hide drag hint after 3.5s
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  // GSAP Entrance Reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(showcaseFrameRef.current, { opacity: 0, scale: 0.96 });
      if (dividerLineRef.current) {
        gsap.set(dividerLineRef.current, { scaleY: 0, transformOrigin: 'top center' });
      }
      if (afterImageRef.current) {
        gsap.set(afterImageRef.current, { opacity: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      tl.to(showcaseFrameRef.current, { opacity: 1, scale: 1.0, duration: 0.9 })
        .to(dividerLineRef.current, { scaleY: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5')
        .to(afterImageRef.current, { opacity: 1, duration: 0.7 }, '+=0.3')
        .fromTo(
          sidebarContentRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.09, duration: 0.6 },
          '-=0.6'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Drag calculation helper (Throttled with RAF for 60 FPS)
  const dragRafId = useRef(null);
  const updateSliderPos = useCallback((clientX) => {
    if (!showcaseFrameRef.current) return;
    if (dragRafId.current) return;

    dragRafId.current = requestAnimationFrame(() => {
      if (showcaseFrameRef.current) {
        const rect = showcaseFrameRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPos(pos);
        setShowHint(false);
      }
      dragRafId.current = null;
    });
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateSliderPos(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      updateSliderPos(e.clientX);
    },
    [isDragging, updateSliderPos]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches && e.touches[0]) {
        updateSliderPos(e.touches[0].clientX);
      }
    },
    [updateSliderPos]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp, { passive: true });
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (dragRafId.current) cancelAnimationFrame(dragRafId.current);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <section
      ref={sectionRef}
      id="transformations"
      className="relative z-30 py-16 lg:py-24 bg-ivory text-charcoal border-b border-border-light overflow-hidden select-none"
    >
      {/* Atmosphere Paper Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      <Container size="editorial">
        {/* Look Selector Tabs */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none relative z-10">
          {TRANSFORMATIONS_DATA.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveIdx(idx);
                setSliderPos(50);
              }}
              className={`px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 rounded-xl font-medium cursor-pointer shrink-0 ${
                activeIdx === idx
                  ? 'bg-charcoal text-white shadow-sm border border-charcoal'
                  : 'bg-cream/60 border border-border-light text-warm-gray hover:text-charcoal hover:border-charcoal/40'
              }`}
            >
              Look 0{idx + 1} — {item.name}
            </button>
          ))}
        </div>

        {/* DESKTOP 65% / 35% SPLIT SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10 max-w-[1440px] mx-auto">
          
          {/* LEFT 65% - BEFORE/AFTER COMPARISON FRAME */}
          <div className="lg:col-span-8">
            <div
              ref={showcaseFrameRef}
              onMouseDown={handleMouseDown}
              onTouchMove={handleTouchMove}
              className={`group relative w-full h-[420px] md:h-[560px] lg:h-[680px] rounded-[36px] overflow-hidden shadow-[0_35px_80px_-20px_rgba(31,31,28,0.14)] bg-cream border border-charcoal/10 cursor-ew-resize focus:outline-none transition-transform duration-500 ${
                isDragging ? 'scale-[1.02]' : ''
              }`}
            >
              {/* RIGHT IMAGE (AFTER COIFFURE) */}
              <div ref={afterImageRef} className="absolute inset-0 w-full h-full">
                <Image
                  src={current.afterImg}
                  alt={`${current.name} After Transformation`}
                  fill
                  loading="lazy"
                  unoptimized
                  sizes="(max-width: 1440px) 100vw, 900px"
                  className="object-cover"
                />
                <div className="absolute top-6 right-6 z-10 bg-charcoal/90 backdrop-blur-md text-white text-[10px] sm:text-xs tracking-[0.24em] uppercase px-4 py-2 rounded-full font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  AFTER COIFFURE
                </div>
              </div>

              {/* LEFT IMAGE (BEFORE) */}
              <div
                className="absolute inset-0 h-full overflow-hidden will-change-[width]"
                style={{ width: `${sliderPos}%` }}
              >
                <div className="relative w-full h-full min-w-[100vw] lg:min-w-[900px]">
                  <Image
                    src={current.beforeImg}
                    alt={`${current.name} Before Transformation`}
                    fill
                    loading="lazy"
                    unoptimized
                    sizes="(max-width: 1440px) 100vw, 900px"
                    className="object-cover grayscale contrast-[1.05]"
                  />
                </div>
                <div className="absolute top-6 left-6 z-10 bg-ivory/90 backdrop-blur-md text-charcoal text-[10px] sm:text-xs tracking-[0.24em] uppercase px-4 py-2 rounded-full font-medium border border-border-light shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  BEFORE
                </div>
              </div>

              {/* DRAGGABLE DIVIDER LINE & HANDLE */}
              <div
                ref={dividerLineRef}
                className="absolute top-0 bottom-0 z-20 pointer-events-none -translate-x-1/2 will-change-[left]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-[2px] h-full bg-champagne shadow-[0_0_18px_rgba(197,160,89,0.85)]" />

                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-champagne text-charcoal rounded-full flex items-center justify-between px-3 border-2 border-white shadow-2xl pointer-events-auto cursor-ew-resize transition-all duration-300 ${
                    isDragging ? 'scale-110 shadow-[0_0_30px_rgba(197,160,89,0.85)]' : 'shadow-[0_0_15px_rgba(197,160,89,0.4)]'
                  }`}
                >
                  <span className="text-xs font-bold font-num">‹</span>
                  <div className="w-[1.5px] h-5 bg-charcoal/40" />
                  <span className="text-xs font-bold font-num">›</span>
                </div>
              </div>

              {showHint && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-charcoal/85 text-white text-xs tracking-[0.25em] uppercase px-6 py-2.5 rounded-full backdrop-blur-md shadow-lg pointer-events-none transition-opacity duration-500 animate-pulse">
                  ← Drag to Compare →
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 35% - SIDEBAR */}
          <div ref={sidebarContentRef} className="lg:col-span-4 space-y-8 py-2">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
                <span className="text-lbl text-xs tracking-[0.32em] text-warm-gray uppercase font-medium">
                  THE ART OF TRANSFORMATION
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] text-charcoal font-normal leading-[0.96] uppercase">
                Beauty is not changed. <br />
                <span className="italic text-champagne">It is revealed.</span>
              </h2>
            </div>

            <p className="font-body text-warm-gray font-light text-base leading-relaxed">
              {current.description}
            </p>

            <div className="space-y-4 pt-4 border-t border-border-light/60">
              <div className="flex items-center justify-between">
                <span className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-medium">
                  DURATION
                </span>
                <span className="font-num text-sm font-semibold text-charcoal">
                  {current.duration}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-medium">
                  RECOMMENDED FOR
                </span>
                <span className="font-body text-xs font-medium text-charcoal">
                  {current.recommendedFor}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase font-medium">
                  AVG SESSION TIME
                </span>
                <span className="font-num text-sm font-bold text-champagne">
                  {current.avgSession}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link href={`/work/${current.slug}`} className="w-full">
                <button className="w-full h-[54px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer">
                  <span>Read Full Case Study</span>
                  <span className="font-num">→</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default memo(TransformationsSection);
