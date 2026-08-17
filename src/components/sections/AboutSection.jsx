'use client';

import React, { useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { SALON_INFO } from '@/constants/salonInfo';
import { ArrowRight } from 'lucide-react';

const STATS_DATA = [
  { target: 10, suffix: '+', label: 'Years of Craft' },
  { target: 15, suffix: 'K+', label: 'Happy Clients' },
  { target: 4.7, suffix: '★', isDecimal: true, label: 'Google Rating (360+)' },
  { target: 100, suffix: '%', label: 'Personal Consultation' },
];

function AboutSection() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const storyTextRef = useRef(null);
  const statsContainerRef = useRef(null);
  const desktopStatRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animations
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: labelRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        storyTextRef.current?.children || [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: storyTextRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      // 2. Statistics Count-Up
      if (statsContainerRef.current) {
        ScrollTrigger.create({
          trigger: statsContainerRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            STATS_DATA.forEach((stat, idx) => {
              const obj = { val: 0 };
              gsap.to(obj, {
                val: stat.target,
                duration: 2.0,
                ease: 'power2.out',
                onUpdate: () => {
                  const formatted = stat.isDecimal
                    ? obj.val.toFixed(1)
                    : Math.floor(obj.val).toString();

                  const el = desktopStatRefs.current[idx];
                  if (el) {
                    el.innerHTML = `${formatted}<span class="text-champagne font-medium">${stat.suffix}</span>`;
                  }
                },
              });
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-40 w-full bg-[#F7F4EE] text-charcoal py-20 sm:py-28 flex flex-col justify-center border-t border-border-light overflow-hidden select-none"
    >
      {/* Editorial Atmosphere Background */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      {/* Main Container */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 space-y-12 sm:space-y-16">
        
        {/* 1. CONCISE ABOUT TEASER CONTENT (TEXT-ONLY ELEGANT EDITORIAL LAYOUT) */}
        <div className="max-w-4xl space-y-6">
          <div ref={labelRef} className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.28em] text-warm-gray uppercase font-medium">
            <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
            <span>OUR STORY</span>
            <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
            <span>KURLA WEST, MUMBAI</span>
          </div>

          <div ref={headingRef} className="font-heading text-4xl sm:text-6xl lg:text-[72px] xl:text-[80px] leading-[0.94] tracking-[-1.5px] uppercase font-normal">
            <span className="block text-charcoal">
              Crafted Over A Decade.
            </span>
            <span className="block text-champagne italic font-normal mt-1">
              Perfected Every Day.
            </span>
          </div>

          <div ref={storyTextRef} className="space-y-5 pt-2 max-w-3xl">
            <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed">
              At {SALON_INFO.name}, hair coiffure is elevated into an exacting diagnostic art. Situated opposite Kurla Court on LBS Marg, our sanctuary delivers architectural haircuts, bespoke beard shaping, organic color glazes, and deep scalp restoration.
            </p>
            
            <p className="font-body text-warm-gray font-light text-sm sm:text-base leading-relaxed">
              Led by master stylists Salman and Farmaan Malik, every client receives unhurried 1-on-1 consultation and master craftsmanship tailored to your individual facial features and personal aesthetic.
            </p>

            {/* DISCOVER OUR STORY CTA BUTTON */}
            <div className="pt-4">
              <Link href="/about" className="inline-block">
                <button className="h-[52px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-[14px] shadow-[0_8px_20px_-4px_rgba(31,31,28,0.18)] hover:shadow-[0_12px_28px_-4px_rgba(197,160,89,0.3)] hover:-translate-y-[2px] cursor-pointer flex items-center gap-3 border border-transparent hover:border-champagne/40">
                  <span>DISCOVER OUR STORY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. COMPACT 4-STAT PROOF BAR */}
        <div
          ref={statsContainerRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-border-light"
        >
          {STATS_DATA.map((stat, idx) => (
            <div key={stat.label} className="space-y-1 text-center sm:text-left">
              <span
                ref={(el) => (desktopStatRefs.current[idx] = el)}
                className="font-num text-3xl sm:text-4xl font-bold text-charcoal block tracking-tight"
              >
                0<span className="text-champagne font-medium">{stat.suffix}</span>
              </span>
              <span className="text-lbl text-[10px] sm:text-xs tracking-[0.2em] text-warm-gray uppercase block font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default memo(AboutSection);
