'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import LuxuryImage from '@/components/ui/LuxuryImage';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui';
import { SERVICES_DATA } from '@/lib/servicesData';
import { Calendar, Clock, ArrowRight, CheckCircle2, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'cut', label: 'Cut & Style' },
  { id: 'color', label: 'Color & Treatments' },
  { id: 'grooming', label: 'Grooming & Spa' },
  { id: 'signature', label: 'Signature Experiences' },
];

const SERVICE_CATEGORY_MAP = {
  haircut: 'cut',
  color: 'color',
  keratin: 'color',
  botox: 'color',
  spa: 'grooming',
  bridal: 'signature',
};

export default function ServicesClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(0);
  const heroRef = useRef(null);
  const gridRef = useRef(null);

  const servicesList = Object.values(SERVICES_DATA);

  const filteredServices = servicesList.filter((service) => {
    if (activeCategory === 'all') return true;
    return SERVICE_CATEGORY_MAP[service.slug] === activeCategory;
  });

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-charcoal select-none">
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-24 space-y-20 sm:space-y-28">
        
        {/* 1. SERVICES HERO */}
        <Container size="editorial">
          <div ref={heroRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-charcoal/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
                <span className="text-lbl text-[11px] text-champagne tracking-[0.28em] font-semibold uppercase">
                  THE ATELIER SERVICES
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal font-normal uppercase tracking-tight">
                Precision, Tailored <br className="hidden sm:block" />
                To You.
              </h1>

              <p className="font-body text-warm-gray font-light text-base sm:text-xl leading-relaxed max-w-xl">
                Discover our curated menu of haute coiffure treatments executed with European organic formulations, architectural hair sculpting, and dedicated 1-on-1 master stylist precision.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href="/booking">
                  <button className="h-[54px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-[14px] shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer">
                    <Calendar className="w-4 h-4 text-champagne group-hover:text-charcoal" />
                    <span>Book Private Consultation</span>
                  </button>
                </Link>

                <a href="#services-catalog" className="inline-flex items-center gap-2 text-lbl text-xs text-warm-gray hover:text-charcoal uppercase tracking-[0.2em] transition-colors py-3 px-4">
                  <span>Explore Menu</span>
                  <ArrowRight className="w-3.5 h-3.5 text-champagne" />
                </a>
              </div>
            </div>

            {/* Editorial Hero Portrait */}
            <div className="lg:col-span-5 relative w-full aspect-[4/5] rounded-[32px] overflow-hidden border border-charcoal/10 shadow-[0_25px_60px_-15px_rgba(31,31,28,0.12)] bg-cream">
              <LuxuryImage
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200"
                alt="Salman Hair Studio Atelier Services"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                imageClassName="object-cover grayscale contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 text-charcoal">
                <span className="text-lbl text-[10px] text-champagne tracking-[0.25em] font-semibold uppercase block">
                  HAUTE COIFFURE ATELIER
                </span>
                <span className="font-heading text-base font-normal uppercase block mt-0.5">
                  1-on-1 Master Director Focus
                </span>
              </div>
            </div>

          </div>
        </Container>

        {/* 2. CATEGORY TABS & SERVICES CATALOG */}
        <Container size="editorial" id="services-catalog">
          <div className="space-y-12">
            
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none border-b border-charcoal/10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-3 rounded-full text-xs font-inter uppercase tracking-[0.18em] font-medium transition-all duration-300 shrink-0 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-charcoal text-white shadow-md'
                      : 'bg-white/60 text-warm-gray hover:text-charcoal hover:bg-white border border-charcoal/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Service Item Cards Grid */}
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div
                  key={service.slug}
                  className="group bg-white/80 backdrop-blur-md rounded-[28px] border border-charcoal/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-champagne/60 transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    {/* Editorial Image Header */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-cream border-b border-charcoal/5">
                      <LuxuryImage
                        src={service.heroImage}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        imageClassName="object-cover grayscale contrast-[1.05] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-xs">
                        <span className="text-lbl text-[10px] text-champagne tracking-[0.24em] font-semibold uppercase">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-7 space-y-4">
                      <h2 className="font-heading text-2xl text-charcoal font-normal uppercase tracking-tight group-hover:text-champagne transition-colors duration-300 leading-snug">
                        {service.title}
                      </h2>

                      <p className="font-body text-warm-gray font-light text-sm leading-relaxed line-clamp-3">
                        {service.tagline}
                      </p>

                      {/* Meta Info (Duration & Price) */}
                      <div className="pt-2 flex items-center justify-between text-xs font-num font-semibold border-t border-charcoal/10">
                        {service.duration ? (
                          <div className="flex items-center gap-1.5 text-warm-gray">
                            <Clock className="w-3.5 h-3.5 text-champagne" />
                            <span>{service.duration}</span>
                          </div>
                        ) : (
                          <span className="text-warm-gray">Time Variable</span>
                        )}

                        <span className="text-champagne font-bold">
                          {service.price ? service.price : 'Consultation Required'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-7 pb-7 pt-2 flex items-center gap-3">
                    <Link
                      href={`/services/${service.slug}`}
                      className="flex-1 py-3.5 px-4 rounded-xl border border-charcoal/15 text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 text-center font-inter text-[11px] uppercase tracking-[0.18em] font-medium flex items-center justify-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/booking?service=${service.slug}`}
                      className="flex-1 py-3.5 px-4 rounded-xl bg-champagne text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 text-center font-inter text-[11px] uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Book Service</span>
                    </Link>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </Container>

        {/* 3. STEP BY STEP HAUTE METHODOLOGY */}
        <Container size="editorial">
          <div className="bg-white/60 p-8 sm:p-14 rounded-[32px] border border-charcoal/10 space-y-10">
            <div className="space-y-2 max-w-xl">
              <span className="text-lbl text-[11px] tracking-[0.3em] text-champagne font-semibold uppercase block">
                HAUTE METHODOLOGY
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-charcoal uppercase font-normal">
                Our 5-Step Atelier Standard
              </h2>
              <p className="font-body text-warm-gray text-sm font-light leading-relaxed">
                Every client experience is crafted to maintain strict European safety standards and structural hair integrity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
              {[
                { num: '01', title: 'Consultation', desc: '1-on-1 facial anatomy & scalp elasticity diagnostic.' },
                { num: '02', title: 'Formulation', desc: 'Custom European organic pigments & botox amino acids.' },
                { num: '03', title: 'Sculpting', desc: 'Bespoke precision sectioning matched to organic growth.' },
                { num: '04', title: 'Infusion', desc: 'Botanical steam micro-infusion preserving cuticle moisture.' },
                { num: '05', title: 'Haute Finish', desc: 'Dry texturizing, mirror polish, and home maintenance guide.' },
              ].map((step) => (
                <div key={step.num} className="space-y-3 p-5 rounded-2xl bg-white/80 border border-charcoal/10">
                  <span className="font-heading text-2xl text-champagne italic font-normal block">{step.num}</span>
                  <h3 className="font-heading text-base text-charcoal font-semibold uppercase">{step.title}</h3>
                  <p className="text-body text-xs text-warm-gray font-light leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* 4. CLIENT FREQUENTLY ASKED QUESTIONS */}
        <Container size="editorial">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-lbl text-[11px] tracking-[0.3em] text-champagne font-semibold uppercase block">
                CLIENT INQUIRIES
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-charcoal uppercase font-normal">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How do I choose the right service for my hair texture?',
                  a: 'Every session begins with an unhurried 15-minute diagnostic consultation where we analyze your scalp density, porosity, and natural growth pattern before starting.',
                },
                {
                  q: 'Are your treatments safe and formaldehyde-free?',
                  a: 'Yes, absolutely. We use 100% European organic formulations and formaldehyde-free silk amino complexes that preserve hair integrity.',
                },
                {
                  q: 'How long do Keratin and Hair Botox results last?',
                  a: 'Silk Keratin smoothing maintains glass shine for 3 to 5 months, while Hair Botox collagen restructuring lasts 2 to 4 months.',
                },
                {
                  q: 'Do I need to book in advance?',
                  a: 'Yes. We operate strictly by prior reservation to guarantee dedicated 1-on-1 master stylist attention.',
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="bg-white/80 p-6 rounded-2xl border border-charcoal/10 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-heading text-lg text-charcoal font-medium flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-champagne shrink-0" />
                      <span>{faq.q}</span>
                    </h3>
                    <ChevronDown className={`w-4 h-4 text-warm-gray transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-champagne' : ''}`} />
                  </div>
                  {openFaq === idx && (
                    <p className="text-body text-xs sm:text-sm text-warm-gray font-light leading-relaxed pt-3 pl-6 border-t border-charcoal/5 mt-3">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* 5. FINAL BOOKING CTA */}
        <Container size="editorial">
          <div className="bg-charcoal text-white p-10 sm:p-16 rounded-[32px] text-center space-y-6 shadow-2xl relative overflow-hidden">
            <span className="text-lbl text-xs text-champagne tracking-[0.3em] uppercase block font-semibold">
              RESERVE YOUR PRIVATE SESSION
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-normal uppercase max-w-2xl mx-auto">
              Ready to Experience Haute Coiffure?
            </h2>
            <p className="text-body text-warm-gray-light font-light text-sm sm:text-base max-w-md mx-auto">
              Book your private 1-on-1 consultation at our Kurla West atelier.
            </p>
            <div className="pt-4">
              <Link href="/booking">
                <button className="h-[54px] px-10 bg-champagne text-charcoal hover:bg-white transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-lg cursor-pointer">
                  Reserve Appointment
                </button>
              </Link>
            </div>
          </div>
        </Container>

      </main>

      <Footer />
    </div>
  );
}
