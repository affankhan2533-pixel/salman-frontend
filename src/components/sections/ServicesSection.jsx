'use client';

import React, { useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/ui';

const SERVICES = [
  {
    num: '01',
    id: 'haircut',
    label: 'HAUTE COIFFURE • 01',
    title: 'Bespoke Precision Haircut & Sculpting',
    price: 'Starting at ₹3,500',
    duration: '60 MIN',
    description: 'Architectural precision hair sculpting tailored to your facial bone structure, head shape, and natural organic hair movement.',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1200',
  },
  {
    num: '02',
    id: 'color',
    label: 'COLOR ATELIER • 02',
    title: 'Couture Balayage & Tone Formulation',
    price: 'Starting at ₹8,500',
    duration: '150 MIN',
    description: 'Hand-painted dimensional balayage, bespoke root melt, and high-shine organic gloss enhancement customized to skin undertones.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
  },
  {
    num: '03',
    id: 'spa',
    label: 'RESTORATIVE RITUAL • 03',
    title: 'European Botanical Scalp & Follicle Therapy',
    price: 'Starting at ₹4,000',
    duration: '75 MIN',
    description: 'Deep restorative scalp therapy utilizing essential botanical elixirs, micro-steam infusion, and pressure-point circulation massage.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
  },
  {
    num: '04',
    id: 'keratin',
    label: 'TEXTURE ARCHITECTURE • 04',
    title: 'Silk Keratin Glass-Smoothing Infusion',
    price: 'Starting at ₹9,000',
    duration: '180 MIN',
    description: 'Formaldehyde-free silk keratin smoothing formula sealing cuticles for long-lasting weightless shine and humidity defense.',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1200',
  },
  {
    num: '05',
    id: 'bridal',
    label: 'BRIDAL HAUTE COIFFURE • 05',
    title: 'Private Atelier Bridal & Crown Architecture',
    price: 'Starting at ₹15,000',
    duration: '120 MIN',
    description: 'Bespoke bridal hair trial session, veil placement architecture, and customized couture styling inside our private suite.',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=1200',
  },
  {
    num: '06',
    id: 'botox',
    label: 'DEEP RECONSTRUCTION • 06',
    title: 'Collagen & Amino Acid Hair Restructuring',
    price: 'Starting at ₹10,500',
    duration: '120 MIN',
    description: 'Intensive molecular hair botox treatment restoring structural mass, elasticity, and brilliant mirror reflection to compromised hair.',
    imageUrl: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=1200',
  },
];

const ServicePanel = memo(function ServicePanel({ service, index }) {
  const panelRef = useRef(null);
  const imageFrameRef = useRef(null);
  const imageInnerRef = useRef(null);
  const textGroupRef = useRef(null);

  const imageIsLeft = index % 2 === 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set(imageFrameRef.current, {
        clipPath: 'inset(100% 0% 0% 0%)',
        opacity: 0,
      });

      // 2. Panel Scroll Reveal Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panelRef.current,
          start: 'top 82%',
          once: true,
        },
        defaults: { ease: 'power4.out' },
      });

      tl.fromTo(
        imageFrameRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.2 }
      ).fromTo(
        textGroupRef.current?.children || [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7 },
        '-=0.8'
      );

      // Subtle desktop hover zoom
      if (typeof window !== 'undefined' && window.innerWidth >= 1024 && imageInnerRef.current) {
        const frame = imageFrameRef.current;
        const inner = imageInnerRef.current;
        if (frame && inner) {
          const onEnter = () => gsap.to(inner, { scale: 1.05, duration: 0.6, ease: 'power2.out' });
          const onLeave = () => gsap.to(inner, { scale: 1.0, duration: 0.6, ease: 'power2.out' });
          frame.addEventListener('mouseenter', onEnter);
          frame.addEventListener('mouseleave', onLeave);
          return () => {
            frame.removeEventListener('mouseenter', onEnter);
            frame.removeEventListener('mouseleave', onLeave);
          };
        }
      }
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={panelRef} className="py-20 lg:py-28 select-none">
      {/* Editorial Alternate Service Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Slot */}
        <div className={`lg:col-span-6 ${imageIsLeft ? 'order-1' : 'order-1 lg:order-2'}`}>
          {imageIsLeft ? (
            /* Service Image (Left) */
            <Link href={`/services/${service.id}`}>
              <div
                ref={imageFrameRef}
                className="relative w-full aspect-[4/3] rounded-[28px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(31,31,28,0.12)] bg-cream border border-charcoal/10 cursor-pointer"
              >
                <div ref={imageInnerRef} className="w-full h-full relative transition-transform duration-700 ease-out">
                  <Image
                    src={service.imageUrl}
                    alt={`Salman Hair Studio ${service.title}`}
                    fill
                    loading="lazy"
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover grayscale contrast-[1.05]"
                  />
                </div>
              </div>
            </Link>
          ) : (
            /* Service Content (Left) */
            <div ref={textGroupRef} className="space-y-6">
              <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.28em] text-warm-gray uppercase font-medium">
                <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
                <span>{service.label}</span>
              </div>

              <Link href={`/services/${service.id}`}>
                <h3 className="font-heading text-3xl sm:text-5xl lg:text-[54px] leading-[0.94] text-charcoal font-normal uppercase tracking-tight hover:text-champagne transition-colors cursor-pointer">
                  {service.title}
                </h3>
              </Link>

              <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-lg">
                {service.description}
              </p>

              <div className="pt-4 border-t border-border-light flex items-center justify-between max-w-lg">
                <div>
                  <span className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase block mb-0.5 font-medium">
                    DURATION
                  </span>
                  <span className="font-num text-sm font-semibold text-charcoal">{service.duration}</span>
                </div>
                <div className="text-right">
                  <span className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase block mb-0.5 font-medium">
                    INVESTMENT
                  </span>
                  <span className="font-num text-lg font-bold text-champagne">{service.price}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a href="#booking" className="inline-block">
                  <button className="h-[54px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-[14px] shadow-[0_8px_20px_-4px_rgba(31,31,28,0.18)] hover:shadow-[0_12px_28px_-4px_rgba(197,160,89,0.3)] hover:-translate-y-[2px] cursor-pointer border border-transparent hover:border-champagne/40">
                    Book Consultation
                  </button>
                </a>

                <Link href={`/services/${service.id}`} className="inline-block">
                  <button className="h-[54px] px-6 bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal transition-all duration-300 font-inter text-xs tracking-[0.2em] uppercase font-medium rounded-[14px] hover:-translate-y-[2px] cursor-pointer">
                    View Details →
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Slot */}
        <div className={`lg:col-span-6 ${imageIsLeft ? 'order-2' : 'order-2 lg:order-1'}`}>
          {imageIsLeft ? (
            /* Service Content (Right) */
            <div ref={textGroupRef} className="space-y-6">
              <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.28em] text-warm-gray uppercase font-medium">
                <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
                <span>{service.label}</span>
              </div>

              <Link href={`/services/${service.id}`}>
                <h3 className="font-heading text-3xl sm:text-5xl lg:text-[54px] leading-[0.94] text-charcoal font-normal uppercase tracking-tight hover:text-champagne transition-colors cursor-pointer">
                  {service.title}
                </h3>
              </Link>

              <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-lg">
                {service.description}
              </p>

              <div className="pt-4 border-t border-border-light flex items-center justify-between max-w-lg">
                <div>
                  <span className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase block mb-0.5 font-medium">
                    DURATION
                  </span>
                  <span className="font-num text-sm font-semibold text-charcoal">{service.duration}</span>
                </div>
                <div className="text-right">
                  <span className="text-lbl text-[10px] text-warm-gray tracking-widest uppercase block mb-0.5 font-medium">
                    INVESTMENT
                  </span>
                  <span className="font-num text-lg font-bold text-champagne">{service.price}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a href="#booking" className="inline-block">
                  <button className="h-[54px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-[14px] shadow-[0_8px_20px_-4px_rgba(31,31,28,0.18)] hover:shadow-[0_12px_28px_-4px_rgba(197,160,89,0.3)] hover:-translate-y-[2px] cursor-pointer border border-transparent hover:border-champagne/40">
                    Book Consultation
                  </button>
                </a>

                <Link href={`/services/${service.id}`} className="inline-block">
                  <button className="h-[54px] px-6 bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal transition-all duration-300 font-inter text-xs tracking-[0.2em] uppercase font-medium rounded-[14px] hover:-translate-y-[2px] cursor-pointer">
                    View Details →
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* Service Image (Right) */
            <Link href={`/services/${service.id}`}>
              <div
                ref={imageFrameRef}
                className="relative w-full aspect-[4/3] rounded-[28px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(31,31,28,0.12)] bg-cream border border-charcoal/10 cursor-pointer"
              >
                <div ref={imageInnerRef} className="w-full h-full relative transition-transform duration-700 ease-out">
                  <Image
                    src={service.imageUrl}
                    alt={`Salman Hair Studio ${service.title}`}
                    fill
                    loading="lazy"
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover grayscale contrast-[1.05]"
                  />
                </div>
              </div>
            </Link>
          )}
        </div>

      </div>

      {/* Thin Champagne Line Divider between Service Panels */}
      {index < SERVICES.length - 1 && (
        <div className="w-full h-[1px] bg-champagne/30 mt-20 lg:mt-28" />
      )}
    </div>
  );
});

function ServicesSection() {
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power4.out',
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

  return (
    <section id="services" className="relative z-30 py-24 sm:py-32 bg-[#F7F4EE] border-t border-border-light select-none overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      <Container size="editorial">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mb-16 lg:mb-24 space-y-4">
          <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.32em] text-warm-gray uppercase font-medium">
            <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
            <span>COUTURE SERVICES MENU</span>
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal font-normal uppercase tracking-tight">
            Haute Coiffure Atelier
          </h2>

          <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-xl">
            Each treatment is executed as an exclusive luxury offering, engineered with organic formulations, 1-on-1 artistic dedication, and architectural precision.
          </p>
        </div>

        {/* Alternating Service Panels */}
        <div>
          {SERVICES.map((service, index) => (
            <ServicePanel key={service.id} service={service} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default memo(ServicesSection);
