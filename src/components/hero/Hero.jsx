'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const HERO_IMAGES = [
  { src: '/images/hero/image.png', title: 'Bespoke Artistry & Tailored Aesthetics' },
  { src: '/images/hero/image copy.png', title: 'Precision Haircuts & Sculpting' },
  { src: '/images/hero/image copy 2.png', title: 'Couture Hair Coloring & Balayage' },
  { src: '/images/hero/image copy 10.png', title: 'Master Grooming & Texture Care' },
];

function Hero() {
  const heroRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const badgeRef = useRef(null);
  const labelRef = useRef(null);
  const titleLine1Ref = useRef(null);
  const titleLine2Ref = useRef(null);
  const titleLine3Ref = useRef(null);
  const taglineRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageFrameRef = useRef(null);
  const imageInnerRef = useRef(null);
  const sheenRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);
  const mouseRafId = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State Setup
      gsap.set(imageFrameRef.current, {
        clipPath: 'inset(100% 0% 0% 0%)',
        opacity: 0,
      });

      // 2. Sequential Luxury Typography & Curtain Image Entrance Timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        delay: 0.1,
      });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          titleLine1Ref.current,
          { opacity: 0, y: 35, rotateX: 12 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          titleLine2Ref.current,
          { opacity: 0, y: 35, rotateX: 12 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          titleLine3Ref.current,
          { opacity: 0, y: 35, rotateX: 12 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.55 },
          '-=0.35'
        )
        .fromTo(
          buttonsRef.current?.children || [],
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
          '-=0.35'
        )
        // Luxury Curtain Image Reveal: clip-path 1.2s power4.out
        .fromTo(
          imageFrameRef.current,
          { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.2, ease: 'power4.out' },
          '-=0.85'
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.3'
        );

      // 3. Imperceptible Cinematic Portrait Breathing Motion (scale 1.04 -> 1.00 over 14s)
      gsap.to(imageInnerRef.current, {
        scale: 1.04,
        x: 8,
        y: -4,
        duration: 14,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Sheen Sweep Across Editorial Photo
      gsap.to(sheenRef.current, {
        xPercent: 280,
        duration: 2.2,
        ease: 'power2.inOut',
        repeat: -1,
        repeatDelay: 5.5,
      });

      // 4. Subtle Scroll Behavior (Image scales slightly 1.0 -> 1.03, text fades gently to 0.45)
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.0,
        onUpdate: (self) => {
          const p = self.progress;
          if (imageFrameRef.current) {
            gsap.set(imageFrameRef.current, { scale: 1.0 + p * 0.03 });
          }
          if (heroRef.current) {
            const opacityVal = 1 - p * 0.55;
            gsap.set(heroRef.current.querySelector('.lg\\:col-span-5'), { opacity: Math.max(0.4, opacityVal) });
          }
        },
      });
    }, heroRef);

    return () => {
      ctx.revert();
      if (mouseRafId.current) cancelAnimationFrame(mouseRafId.current);
    };
  }, []);

  // Parallax & Interactive Mouse Response (Throttled with RAF - Desktop Only)
  const handleMouseMove = (e) => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPct = clientX / innerWidth - 0.5;
    const yPct = clientY / innerHeight - 0.5;

    if (!mouseRafId.current) {
      mouseRafId.current = requestAnimationFrame(() => {
        if (imageFrameRef.current) {
          gsap.to(imageFrameRef.current, {
            rotateY: xPct * 2,
            rotateX: -yPct * 2,
            x: xPct * 6,
            y: yPct * 6,
            duration: 1.2,
            ease: 'power1.out',
            overwrite: 'auto',
          });
        }
        mouseRafId.current = null;
      });
    }
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative z-10 w-full h-screen min-h-[760px] max-h-[1100px] bg-ivory text-charcoal pt-24 pb-6 flex flex-col justify-between overflow-hidden border-b border-border-light select-none"
    >
      {/* 1. Editorial Background Atmosphere: Subtle Paper Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      {/* 2. Editorial Background Atmosphere: Soft Radial Light Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_65%_45%,rgba(247,245,240,0)_20%,rgba(235,231,222,0.6)_85%)]" />

      {/* 3. Editorial Background Atmosphere: Delicate Architectural Grid Lines */}
      <div className="absolute top-0 bottom-0 left-12 lg:left-24 w-[1.5px] bg-charcoal/[0.04] pointer-events-none hidden lg:block z-0" />
      <div className="absolute top-0 bottom-0 right-12 lg:right-24 w-[1.5px] bg-charcoal/[0.04] pointer-events-none hidden lg:block z-0" />
      <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-charcoal/[0.03] pointer-events-none hidden lg:block z-0" />

      {/* 4. Desktop Custom Luxury Circular Ring Cursor */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 hidden lg:block rounded-full border transition-all duration-300 ${
          isHoveredInteractive
            ? 'w-16 h-16 border-champagne bg-champagne/10 backdrop-blur-[1px]'
            : 'w-10 h-10 border-charcoal/30'
        }`}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-champagne rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 hidden lg:block"
      />

      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 xl:space-y-7 z-20">
          
          {/* Editorial Metadata Badges */}
          <div
            ref={badgeRef}
            className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.25em] text-warm-gray uppercase font-medium"
          >
            <span>EST. 2016</span>
            <span className="w-1 h-1 bg-champagne rounded-full" />
            <span>MUMBAI</span>
            <span className="w-1 h-1 bg-champagne rounded-full" />
            <span className="text-charcoal font-semibold">LUXURY ATELIER</span>
          </div>

          {/* Small Top Sub-Label */}
          <div ref={labelRef} className="inline-flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 bg-champagne rounded-full animate-pulse" />
            <span className="text-lbl text-xs tracking-[0.28em] text-warm-gray uppercase font-medium">
              MUMBAI&apos;S PREMIER HAIR ATELIER
            </span>
          </div>

          {/* Large Staggered Editorial Heading */}
          <div className="font-heading text-5xl sm:text-7xl lg:text-[76px] xl:text-[88px] leading-[0.88] tracking-[-2px] uppercase select-none space-y-0.5">
            <div className="overflow-hidden">
              <span ref={titleLine1Ref} className="block font-bold text-charcoal">
                SALMAN
              </span>
            </div>
            <div className="overflow-hidden">
              <span ref={titleLine2Ref} className="block font-medium italic text-champagne">
                HAIR
              </span>
            </div>
            <div className="overflow-hidden">
              <span ref={titleLine3Ref} className="block font-bold text-charcoal">
                STUDIO
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div ref={taglineRef} className="pt-1">
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-charcoal font-normal leading-snug">
              Hair is Personal. <br />
              <span className="italic text-warm-gray">Style is Identity.</span>
            </h2>
          </div>

          {/* CTA Buttons (Hover: 2px lift, subtle shadow, border transition) */}
          <div
            ref={buttonsRef}
            className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href="/booking"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
              className="inline-block"
            >
              <button className="w-full sm:w-auto h-[54px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-[14px] shadow-[0_8px_20px_-4px_rgba(31,31,28,0.18)] hover:shadow-[0_12px_28px_-4px_rgba(197,160,89,0.3)] hover:-translate-y-[2px] cursor-pointer border border-transparent hover:border-champagne/40">
                Book Appointment
              </button>
            </Link>
            <Link
              href="/gallery"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
              className="inline-block"
            >
              <button className="w-full sm:w-auto h-[54px] px-8 bg-transparent text-charcoal border border-charcoal/40 hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-[14px] hover:-translate-y-[2px] cursor-pointer">
                View Portfolio
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-7 relative flex flex-col justify-center lg:justify-end items-center h-full gap-3">
          
          {/* Main Editorial Image Frame — no padding, no clipping, full image shown */}
          <div
            ref={imageFrameRef}
            className="relative w-full h-[46vh] sm:h-[58vh] lg:h-[65vh] max-h-[680px] rounded-[28px] overflow-hidden shadow-[0_35px_80px_-20px_rgba(31,31,28,0.14)] border border-charcoal/10 will-change-transform z-10 [perspective:1000px] bg-[#F7F4EF]"
          >
            {/* Inner Image Container — fills entire frame, no crop */}
            <div ref={imageInnerRef} className="w-full h-full relative">
              {HERO_IMAGES.map((img, idx) => (
                <div
                  key={img.src}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === activeHeroIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`Salman Hair Studio Editorial Campaign ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-contain object-center"
                  />
                </div>
              ))}

              {/* Periodic Light Sheen Sweep Overlay */}
              <div
                ref={sheenRef}
                className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] pointer-events-none -translate-x-full z-20"
              />
            </div>
          </div>

          {/* Editorial Badge & Slider Controls — BELOW the image, never covering it */}
          <div className="w-full px-1">
            <div className="p-3.5 bg-ivory/90 backdrop-blur-md border border-charcoal/10 rounded-xl flex items-center justify-between z-30">
              <div className="flex-1 pr-4">
                <span className="text-lbl text-[10px] text-champagne tracking-[0.25em] block uppercase mb-0.5 font-semibold">
                  HAUTE COIFFURE CAMPAIGN
                </span>
                <span className="font-heading text-xs text-charcoal font-normal line-clamp-1">
                  {HERO_IMAGES[activeHeroIdx].title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveHeroIdx((prev) => (prev === 0 ? HERO_IMAGES.length - 1 : prev - 1))}
                    aria-label="Previous image"
                    className="w-7 h-7 rounded-lg bg-charcoal/5 hover:bg-charcoal/10 flex items-center justify-center text-charcoal transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length)}
                    aria-label="Next image"
                    className="w-7 h-7 rounded-lg bg-charcoal/5 hover:bg-charcoal/10 flex items-center justify-center text-charcoal transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-lbl text-[11px] text-warm-gray font-num min-w-[42px] text-right font-medium">
                  0{activeHeroIdx + 1} / 0{HERO_IMAGES.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Center Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="relative z-20 flex flex-col items-center justify-center space-y-2 cursor-pointer pb-2 group"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        onMouseEnter={() => setIsHoveredInteractive(true)}
        onMouseLeave={() => setIsHoveredInteractive(false)}
      >
        <span className="text-lbl text-[10px] tracking-[0.32em] font-medium text-warm-gray group-hover:text-champagne transition-colors duration-300 uppercase">
          SCROLL TO DISCOVER
        </span>
        <div className="w-[1.5px] h-8 bg-charcoal/15 relative overflow-hidden rounded-full">
          <div className="w-full h-2.5 bg-champagne rounded-full animate-[bounce_2.2s_infinite]" />
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
