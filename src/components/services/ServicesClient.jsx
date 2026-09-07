'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui';
import { getServices } from '@/data/servicesData';
import GenderTabs from '@/components/services/GenderTabs';
import ServiceCategoryTabs from '@/components/services/ServiceCategoryTabs';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceDetailsModal from '@/components/services/ServiceDetailsModal';

/**
 * ServicesClient — Full /services page.
 *
 * Complete 20-service catalogue with gender + category filtering.
 * Uses the exact same shared components as the homepage ServicesSection.
 * No duplicated card or tab logic.
 */
export default function ServicesClient() {
  const [activeGender, setActiveGender] = useState('male');
  const [activeCategory, setActiveCategory] = useState('hair');
  const [selectedService, setSelectedService] = useState(null);

  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const isAnimating = useRef(false);

  const services = getServices({ gender: activeGender, category: activeCategory });

  // Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.children ?? [],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Same tab transition logic as ServicesSection
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

    gsap.to(Array.from(gridRef.current.children), {
      opacity: 0,
      y: -8,
      duration: 0.15,
      stagger: 0.03,
      ease: 'power2.in',
      onComplete: () => {
        callback();
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
      setActiveCategory('hair');
    });
  }, [activeGender, animateGridTransition]);

  const handleCategoryChange = useCallback((category) => {
    if (category === activeCategory) return;
    animateGridTransition(() => setActiveCategory(category));
  }, [activeCategory, animateGridTransition]);

  return (
    <>
      <div className="min-h-screen bg-[#F7F4EE] text-charcoal select-none">
        <Navbar />

        <main className="pt-28 sm:pt-36 pb-24 space-y-20 sm:space-y-28">

          {/* ── PAGE HERO ──────────────────────────────────────────────── */}
          <Container size="editorial">
            <div ref={heroRef} className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.32em] text-warm-gray uppercase font-medium">
                <span className="w-1.5 h-1.5 bg-champagne rounded-full animate-pulse" />
                <span>Salman Hair Studio · Kurla West, Mumbai</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal font-normal uppercase tracking-tight">
                Our Services
              </h1>

              <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-xl">
                Explore our complete menu of hair and facial services for men and women.
              </p>
            </div>
          </Container>

          {/* ── CATALOGUE ──────────────────────────────────────────────── */}
          <Container size="editorial" id="services-catalogue">
            <div className="space-y-10">

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <GenderTabs activeGender={activeGender} onChange={handleGenderChange} />
                <ServiceCategoryTabs activeCategory={activeCategory} onChange={handleCategoryChange} />
              </div>

              {/* Count label */}
              <div className="flex items-center gap-3 text-lbl text-[10px] tracking-[0.24em] text-warm-gray uppercase font-medium">
                <span className="w-px h-4 bg-border-light" />
                <span>
                  {activeGender === 'male' ? 'MEN' : 'WOMEN'} · {activeCategory === 'hair' ? 'HAIR' : 'FACE'} · {services.length} SERVICES
                </span>
              </div>

              {/* Grid — stable min-height covers largest sub-list (7 female hair services) */}
              <div style={{ minHeight: '520px' }}>
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

            </div>
          </Container>

          {/* ── FINAL CTA ──────────────────────────────────────────────── */}
          <Container size="editorial">
            <div className="bg-charcoal text-white p-10 sm:p-16 rounded-[32px] text-center space-y-6 shadow-2xl relative overflow-hidden">
              {/* Subtle dot texture */}
              <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <span className="text-lbl text-xs text-champagne tracking-[0.3em] uppercase block font-semibold">
                  Ready for your next look?
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-normal uppercase max-w-xl mx-auto leading-tight">
                  Book your appointment with Salman Hair Studio.
                </h2>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/booking">
                    <button className="h-[52px] px-10 bg-champagne text-charcoal hover:bg-white transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-lg cursor-pointer hover:-translate-y-[2px]">
                      Book Appointment →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>

        </main>

        <Footer />
      </div>

      {/* Modal */}
      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}
