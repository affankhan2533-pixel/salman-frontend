'use client';

import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import { Container } from '@/components/ui';
import { getServices } from '@/data/servicesData';
import GenderTabs from '@/components/services/GenderTabs';
import ServiceCategoryTabs from '@/components/services/ServiceCategoryTabs';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceDetailsModal from '@/components/services/ServiceDetailsModal';

/**
 * ServicesSection — Homepage services preview.
 *
 * Hierarchy: MEN/WOMEN → HAIR/FACE → Service cards
 * Clicking any card opens the ServiceDetailsModal.
 * "View All Services →" links to the full /services page.
 *
 * Animation rules:
 *  - Section header reveals once on scroll (GSAP ScrollTrigger)
 *  - Tab switch: existing cards fade/slide out → new cards stagger in
 *  - No full section re-entrance on tab change
 *  - Section height is stabilized via min-height on grid wrapper
 *  - prefers-reduced-motion: opacity only, no transforms
 */
function ServicesSection() {
  const [activeGender, setActiveGender] = useState('male');
  const [activeCategory, setActiveCategory] = useState('hair');
  const [selectedService, setSelectedService] = useState(null);

  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const isAnimating = useRef(false);

  // Derived services list
  const services = getServices({ gender: activeGender, category: activeCategory });

  // Section header entrance (once on scroll)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current?.children ?? [],
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  /**
   * Animate card grid on tab change.
   * Cards fade+slide out, content swaps, new cards stagger in.
   * Uses opacity + translateY only — GPU-friendly, no layout reflow.
   */
  const animateGridTransition = useCallback((callback) => {
    if (!gridRef.current) { callback(); return; }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.to(gridRef.current, { opacity: 0, duration: 0.15, onComplete: () => {
        callback();
        gsap.to(gridRef.current, { opacity: 1, duration: 0.2 });
      }});
      return;
    }

    if (isAnimating.current) {
      // If already animating, snap immediately and swap
      gsap.killTweensOf(gridRef.current);
      gsap.killTweensOf(gridRef.current.children);
      callback();
      gsap.fromTo(
        Array.from(gridRef.current.children),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.35, ease: 'power3.out' }
      );
      return;
    }

    isAnimating.current = true;

    // Step 1: fade out existing cards
    gsap.to(Array.from(gridRef.current.children), {
      opacity: 0,
      y: -8,
      duration: 0.15,
      stagger: 0.03,
      ease: 'power2.in',
      onComplete: () => {
        // Step 2: swap content
        callback();

        // Step 3: stagger new cards in (after DOM update)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!gridRef.current) { isAnimating.current = false; return; }
            gsap.fromTo(
              Array.from(gridRef.current.children),
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.055,
                duration: 0.4,
                ease: 'power3.out',
                onComplete: () => { isAnimating.current = false; },
              }
            );
          });
        });
      },
    });
  }, []);

  const handleGenderChange = useCallback((gender) => {
    if (gender === activeGender) return;
    animateGridTransition(() => {
      setActiveGender(gender);
      setActiveCategory('hair'); // reset sub-tab on gender change
    });
  }, [activeGender, animateGridTransition]);

  const handleCategoryChange = useCallback((category) => {
    if (category === activeCategory) return;
    animateGridTransition(() => setActiveCategory(category));
  }, [activeCategory, animateGridTransition]);

  return (
    <>
      <section
        id="services"
        className="relative z-30 py-24 sm:py-32 bg-[#F7F4EE] border-t border-border-light overflow-hidden select-none"
      >
        {/* Subtle dot grid atmosphere — matches AboutSection pattern */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

        {/* Thin champagne top accent line — brand signature */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-champagne/30 to-transparent" />

        <Container size="editorial">
          <div className="relative z-10 space-y-12 lg:space-y-16">

            {/* ── SECTION HEADER ────────────────────────────────────────── */}
            <div ref={headerRef} className="space-y-3">
              <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.32em] text-warm-gray uppercase font-medium">
                <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
                <span>Services</span>
              </div>
              <h2 className="font-heading text-4xl sm:text-6xl lg:text-[72px] leading-[0.93] text-charcoal font-normal uppercase tracking-tight">
                What We Do
              </h2>
            </div>

            {/* ── NAVIGATION ────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <GenderTabs activeGender={activeGender} onChange={handleGenderChange} />
              <ServiceCategoryTabs activeCategory={activeCategory} onChange={handleCategoryChange} />
            </div>

            {/* ── SERVICE GRID ──────────────────────────────────────────── */}
            {/*
              min-height stabilizes layout so switching tabs doesn't shift
              the page. Set to comfortably hold the largest grid (7 cards).
            */}
            <div style={{ minHeight: '440px' }}>
              <div
                ref={gridRef}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5"
              >
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={setSelectedService}
                  />
                ))}
              </div>
            </div>

            {/* ── CTA ROW ───────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-border-light">
              <div className="space-y-1">
                <p className="font-heading text-2xl sm:text-3xl text-charcoal font-normal uppercase tracking-tight">
                  Ready for your next look?
                </p>
                <p className="font-body text-warm-gray font-light text-sm">
                  Book your appointment with Salman Hair Studio.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link href="/booking">
                  <button className="h-[50px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-[11px] tracking-[0.22em] uppercase font-medium rounded-[12px] shadow-sm hover:shadow-md hover:-translate-y-[2px] cursor-pointer border border-transparent hover:border-champagne/40">
                    Book Appointment →
                  </button>
                </Link>
                <Link href="/services">
                  <button className="h-[50px] px-6 bg-transparent text-charcoal border border-charcoal/25 hover:border-charcoal/60 transition-all duration-200 font-inter text-[11px] tracking-[0.2em] uppercase font-medium rounded-[12px] hover:-translate-y-[2px] cursor-pointer">
                    View All Services
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Service Details Modal — rendered outside section for proper z-index stacking */}
      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}

export default memo(ServicesSection);
