'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container, LuxurySectionHeading, LuxuryDivider } from '@/components/ui';
import { Calendar, MessageCircle, CheckCircle2, X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';


const TIMELINE_DATA = [
  { year: '2016', title: 'Studio Started', description: 'Founded with a single chair and a commitment to unhurried, diagnostic hair sculpting in Bandra.' },
  { year: '2018', title: '500 Clients', description: 'Established a loyal following among Mumbai’s fashion editors, artists, and discerning clientele.' },
  { year: '2020', title: 'Premium Expansion', description: 'Expanded into our flagship Bandra West sanctuary featuring private 1-on-1 consultation suites.' },
  { year: '2023', title: '1000+ Transformations', description: 'Pioneered bespoke organic balayage & formaldehyde-free silk keratin restructuring in India.' },
  { year: '2026', title: 'Luxury Studio', description: 'Celebrated a decade as Mumbai’s benchmark haute coiffure atelier and bespoke hair sanctuary.' },
];

const PHILOSOPHY_DATA = [
  {
    num: '01',
    title: 'Precision',
    description: 'Architectural bone structure analysis and perimeter mapping tailored to your individual facial features.',
  },
  {
    num: '02',
    title: 'Craft',
    description: 'Haute coiffure executed with European organic formulations, custom glaze pigments, and botanical oils.',
  },
  {
    num: '03',
    title: 'Luxury',
    description: 'A private, unhurried 1-on-1 atelier sanctuary where your appointment receives undivided master stylist focus.',
  },
  {
    num: '04',
    title: 'Confidence',
    description: 'Revealing personal identity and enduring style that elevates your everyday posture and self-expression.',
  },
];

const PROCESS_DATA = [
  { step: '01', title: 'Discovery', description: 'Scalp diagnostic, follicle health analysis, and natural movement mapping.' },
  { step: '02', title: 'Consultation', description: 'Facial architecture review, skin tone contrast mapping, and lifestyle alignment.' },
  { step: '03', title: 'Design', description: 'Customized haircut blueprint and bespoke color pigment recipe design.' },
  { step: '04', title: 'Transformation', description: 'Unhurried precision execution using organic European botanical products.' },
  { step: '05', title: 'Finish', description: 'Bespoke styling education, blow-dry finish, and home care ritual recommendations.' },
];

const GALLERY_IMAGES = [
  { id: 1, title: 'Atelier Private Suite', collection: 'INTERIOR SANCTUARY', year: '2026', aspect: 'aspect-[4/5]', url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1200' },
  { id: 2, title: 'Botanical Oil Apothecary', collection: 'INGREDIENTS', year: '2026', aspect: 'aspect-[3/4]', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200' },
  { id: 3, title: 'Master Stylist Precision', collection: 'CRAFT IN MOTION', year: '2026', aspect: 'aspect-[16/10]', url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1200' },
  { id: 4, title: 'Couture Balayage Finish', collection: 'HAUTE COIFFURE', year: '2026', aspect: 'aspect-[4/5]', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200' },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const timelineRef = useRef(null);
  const founderRef = useRef(null);
  const philosophyRef = useRef(null);
  const processRef = useRef(null);
  const galleryRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const [lightboxIdx, setLightboxIdx] = useState(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .fromTo(
          heroImageRef.current,
          { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
          { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.1, ease: 'power3.inOut' }
        )
        .fromTo(
          heroRef.current?.children || [],
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.8 },
          '-=0.6'
        );

      // 2. Timeline Reveal
      if (timelineRef.current) {
        gsap.fromTo(
          timelineRef.current.querySelectorAll('.timeline-item'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 3. Founder Story Reveal
      if (founderRef.current) {
        gsap.fromTo(
          founderRef.current.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.14,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: founderRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 4. Philosophy Cards Reveal
      if (philosophyRef.current) {
        gsap.fromTo(
          philosophyRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: philosophyRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 5. Process Reveal
      if (processRef.current) {
        gsap.fromTo(
          processRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: processRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 6. Gallery Reveal
      if (galleryRef.current) {
        gsap.fromTo(
          galleryRef.current.children,
          { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      // 7. Stats Counter Reveal
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // 8. CTA Reveal
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Lightbox Keyboard Controls
  const handleKeyDown = useCallback(
    (e) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') {
        setLightboxIdx(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) => (prev + 1) % GALLERY_IMAGES.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
      }
    },
    [lightboxIdx]
  );

  useEffect(() => {
    if (lightboxIdx !== null) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxIdx, handleKeyDown]);

  const activeImage = lightboxIdx !== null ? GALLERY_IMAGES[lightboxIdx] : null;

  return (
    <main className="w-full bg-ivory text-charcoal overflow-x-hidden relative min-h-screen">
      <Navbar />

      {/* SECTION 1: LUXURY HERO (100vh) */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden select-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

        <Container size="editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
            {/* Left Content (45%) */}
            <div ref={heroRef} className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
                <span className="text-lbl text-xs tracking-[0.32em] text-warm-gray uppercase font-medium">
                  OUR STORY
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[68px] text-charcoal font-normal leading-[0.94] uppercase tracking-tight">
                Crafted With <br />
                <span className="italic text-champagne">Precision.</span> <br />
                Powered By <br />
                <span className="italic text-champagne">Passion.</span>
              </h1>

              <p className="font-body text-warm-gray font-light text-base lg:text-lg leading-relaxed max-w-md">
                Since 2016, Salman Hair Studio has operated as a private atelier in Mumbai dedicated to unhurried coiffure diagnostics, architectural cuts, and bespoke organic color.
              </p>

              <div className="pt-2">
                <a href="/#booking">
                  <button className="h-[54px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer">
                    <Calendar className="w-4 h-4 text-champagne group-hover:text-charcoal" />
                    <span>Book Consultation</span>
                    <span className="font-num">→</span>
                  </button>
                </a>
              </div>
            </div>

            {/* Right Large Portrait Frame (55%) */}
            <div className="lg:col-span-7">
              <div
                ref={heroImageRef}
                className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] max-h-[680px] rounded-[34px] overflow-hidden shadow-[0_35px_80px_-20px_rgba(31,31,28,0.14)] bg-cream border border-charcoal/10 z-10"
              >
                <Image
                  src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=1600"
                  alt="Salman Hair Studio Master Atelier Story"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover grayscale contrast-[1.05]"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <LuxuryDivider />

      {/* SECTION 2: VERTICAL TIMELINE */}
      <section className="relative z-30 py-16 lg:py-24 bg-cream/30 select-none">
        <Container size="editorial">
          <LuxurySectionHeading
            label="ATELIER MILESTONES"
            title="A Decade Of"
            titleItalic="Haute Craft."
            description="Trace our evolution from a private vision of bespoke coiffure to Mumbai's premier luxury hair sanctuary."
            className="mb-16"
          />

          <div ref={timelineRef} className="relative max-w-4xl mx-auto space-y-12">
            {/* Center Vertical Hairline Track */}
            <div className="absolute top-0 bottom-0 left-4 sm:left-1/2 -translate-x-1/2 w-[1.5px] bg-champagne/30" />

            {TIMELINE_DATA.map((item, idx) => (
              <div
                key={item.year}
                className={`timeline-item relative flex flex-col sm:flex-row items-start ${
                  idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
                } gap-8 group`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-1.5 w-4 h-4 rounded-full bg-ivory border-2 border-champagne z-10 group-hover:bg-champagne transition-colors duration-400" />

                {/* Content Box */}
                <div className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-8 space-y-2">
                  <span className="font-num text-2xl font-bold text-champagne block">
                    {item.year}
                  </span>
                  <h3 className="font-heading text-2xl text-charcoal font-normal uppercase">
                    {item.title}
                  </h3>
                  <p className="font-body text-warm-gray font-light text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <LuxuryDivider />

      {/* SECTION 3: FOUNDER STORY */}
      <section className="relative z-30 py-16 lg:py-24 bg-ivory select-none">
        <Container size="editorial">
          <div ref={founderRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-[1440px] mx-auto">
            {/* Left Portrait Image (45%) */}
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/5] rounded-[34px] overflow-hidden shadow-[0_35px_80px_-20px_rgba(31,31,28,0.14)] bg-cream border border-charcoal/10">
                <Image
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200"
                  alt="Founder Salman Master Stylist"
                  fill
                  loading="lazy"
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover grayscale contrast-[1.05]"
                />
              </div>
            </div>

            {/* Right Narrative (55%) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
                <span className="text-lbl text-xs tracking-[0.32em] text-warm-gray uppercase font-medium">
                  FOUNDER PHILOSOPHY
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl lg:text-[56px] text-charcoal font-normal leading-[0.94] uppercase">
                &ldquo;Precision is remembered long after the haircut.&rdquo;
              </h2>

              <p className="font-body text-warm-gray font-light text-base lg:text-lg leading-relaxed">
                Hair is not merely a service; it is an extension of identity, posture, and self-confidence. Every haircut we execute is measured against facial geometry, natural texture movement, and lifestyle demands. We believe in unhurried mastery, European organic formulations, and dedicated 1-on-1 atelier privacy.
              </p>

              {/* Founder Handwritten Vector Signature */}
              <div className="pt-4 flex items-center gap-4">
                <div className="space-y-1">
                  <span className="font-heading text-xl text-charcoal font-semibold block">
                    Salman
                  </span>
                  <span className="text-lbl text-xs text-champagne tracking-wider uppercase font-medium">
                    Founder &amp; Creative Director
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <LuxuryDivider />

      {/* SECTION 4: OUR PHILOSOPHY (4 PREMIUM CARDS) */}
      <section className="relative z-30 py-16 lg:py-24 bg-cream/30 select-none">
        <Container size="editorial">
          <LuxurySectionHeading
            label="OUR PILLARS"
            title="The Atelier"
            titleItalic="Philosophy."
            description="Four fundamental tenets governing every consultation, precision cut, and color transformation."
            className="mb-16"
          />

          <div ref={philosophyRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {PHILOSOPHY_DATA.map((pillar) => (
              <div
                key={pillar.num}
                className="bg-ivory/80 backdrop-blur-md border border-border-light hover:border-champagne/50 p-8 rounded-[28px] shadow-sm hover:shadow-luxury-md hover:-translate-y-2 transition-all duration-500 ease-luxury space-y-4 group"
              >
                <span className="font-num text-3xl font-bold text-champagne block">
                  {pillar.num}
                </span>
                <h3 className="font-heading text-2xl text-charcoal font-normal uppercase group-hover:text-champagne transition-colors duration-300">
                  {pillar.title}
                </h3>
                <p className="font-body text-warm-gray font-light text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <LuxuryDivider />

      {/* SECTION 5: OUR PROCESS (5-STEP TIMELINE) */}
      <section className="relative z-30 py-16 lg:py-24 bg-ivory select-none">
        <Container size="editorial">
          <LuxurySectionHeading
            label="ATELIER METHODOLOGY"
            title="The 5-Step Coiffure"
            titleItalic="Process."
            description="How we transform every client visit into an unhurried, diagnostic luxury experience."
            className="mb-16"
          />

          <div ref={processRef} className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {PROCESS_DATA.map((step) => (
              <div
                key={step.step}
                className="p-6 bg-cream/50 rounded-2xl border border-border-light/80 hover:border-champagne/40 transition-all duration-400 space-y-3 group"
              >
                <span className="font-num text-xs font-semibold text-champagne bg-champagne/10 px-3 py-1 rounded-full inline-block">
                  STEP {step.step}
                </span>
                <h4 className="font-heading text-xl text-charcoal font-normal uppercase group-hover:text-champagne transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="font-body text-warm-gray font-light text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <LuxuryDivider />

      {/* SECTION 6: STUDIO GALLERY */}
      <section className="relative z-30 py-16 lg:py-24 bg-cream/30 select-none">
        <Container size="editorial">
          <LuxurySectionHeading
            label="ATELIER SANCTUARY"
            title="Inside Our"
            titleItalic="Studio."
            description="Explore our minimal warm ivory interior, private consultation suites, and botanical oil bar."
            className="mb-12"
          />

          <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_IMAGES.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setLightboxIdx(idx)}
                className={`group relative w-full ${img.aspect} rounded-[28px] overflow-hidden shadow-md hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-500 bg-cream border border-charcoal/10 cursor-pointer`}
              >
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  loading="lazy"
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 300px"
                  className="object-cover grayscale contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 p-6 flex flex-col justify-end">
                  <span className="text-lbl text-[10px] text-champagne uppercase font-medium">{img.collection}</span>
                  <h4 className="font-heading text-lg text-white font-normal uppercase">{img.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <LuxuryDivider />

      {/* SECTION 7: ACHIEVEMENTS (ANIMATED COUNTERS) */}
      <section className="relative z-30 py-16 lg:py-24 bg-ivory select-none">
        <Container size="editorial">
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-8 bg-cream/40 border border-border-light rounded-[24px] space-y-2">
              <span className="font-num text-4xl sm:text-5xl font-bold text-champagne block">10+</span>
              <span className="text-lbl text-xs text-warm-gray tracking-widest uppercase block font-medium">Years of Excellence</span>
            </div>
            <div className="p-8 bg-cream/40 border border-border-light rounded-[24px] space-y-2">
              <span className="font-num text-4xl sm:text-5xl font-bold text-champagne block">1000+</span>
              <span className="text-lbl text-xs text-warm-gray tracking-widest uppercase block font-medium">Happy Clients</span>
            </div>
            <div className="p-8 bg-cream/40 border border-border-light rounded-[24px] space-y-2">
              <span className="font-num text-4xl sm:text-5xl font-bold text-champagne block">4.9★</span>
              <span className="text-lbl text-xs text-warm-gray tracking-widest uppercase block font-medium">Google Rating</span>
            </div>
            <div className="p-8 bg-cream/40 border border-border-light rounded-[24px] space-y-2">
              <span className="font-num text-4xl sm:text-5xl font-bold text-champagne block">100%</span>
              <span className="text-lbl text-xs text-warm-gray tracking-widest uppercase block font-medium">Organic Formulations</span>
            </div>
          </div>
        </Container>
      </section>

      <LuxuryDivider />

      {/* SECTION 8: PAGE CTA */}
      <section ref={ctaRef} className="relative z-30 py-16 lg:py-24 bg-cream/40 select-none text-center">
        <Container size="editorial">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="text-lbl text-xs tracking-[0.32em] text-champagne uppercase font-medium block">
              RESERVE YOUR PRIVATE SESSION
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl text-charcoal font-normal uppercase leading-tight">
              Ready for Your <br />
              <span className="italic text-champagne">Transformation?</span>
            </h2>
            <p className="text-warm-gray font-light text-base lg:text-lg max-w-lg mx-auto">
              Experience Mumbai’s benchmark haute coiffure diagnostic. Book your private 1-on-1 atelier consultation today.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/#booking">
                <button className="h-[54px] px-10 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer">
                  <Calendar className="w-4 h-4 text-champagne group-hover:text-charcoal" />
                  <span>Book Appointment</span>
                  <span className="font-num">→</span>
                </button>
              </a>

              <a
                href="https://wa.me/919870810734?text=Hello%20Salman%20Hair%20Studio%2C%20I%20would%20like%20to%20book%20an%20appointment."
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="h-[54px] px-10 bg-transparent text-charcoal border border-charcoal/40 hover:border-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer">
                  <MessageCircle className="w-4 h-4 text-champagne" />
                  <span>WhatsApp Concierge</span>
                </button>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-12 select-none">
          <div className="flex items-center justify-between z-20">
            <span className="text-lbl text-xs text-champagne uppercase font-medium">{activeImage.collection} · {activeImage.year}</span>
            <button onClick={() => setLightboxIdx(null)} className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative w-full max-w-4xl mx-auto h-[65vh] rounded-[28px] overflow-hidden border border-white/20 my-auto">
            <Image src={activeImage.url} alt={activeImage.title} fill unoptimized className="object-cover" />
          </div>

          <div className="flex items-center justify-between max-w-4xl mx-auto w-full z-20">
            <span className="text-lbl text-xs text-white/70 uppercase">{activeImage.title}</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setLightboxIdx((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)} className="p-3 rounded-full bg-white/10 text-white hover:bg-champagne hover:text-charcoal transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setLightboxIdx((prev) => (prev + 1) % GALLERY_IMAGES.length)} className="p-3 rounded-full bg-white/10 text-white hover:bg-champagne hover:text-charcoal transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
