'use client';

import React, { useEffect, useRef, memo } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/ui';
import { Phone, MessageCircle, Mail, MapPin, Clock, ExternalLink, Instagram } from 'lucide-react';
import { SALON_INFO } from '@/constants/salonInfo';

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: 'TELEPHONE & DESK',
    value: SALON_INFO.phone,
    href: `tel:${SALON_INFO.rawPhone}`,
    subtext: 'Call Directly for Bookings',
  },
  {
    icon: MessageCircle,
    label: 'WHATSAPP CONCIERGE',
    value: SALON_INFO.whatsapp,
    href: SALON_INFO.whatsappUrl,
    subtext: 'Instant Appointment Desk',
  },
  {
    icon: Instagram,
    label: 'INSTAGRAM ATELIER',
    value: '@salmanhairstudio1',
    href: SALON_INFO.instagramUrl,
    subtext: 'Latest Transformations & Haircuts',
  },
  {
    icon: MapPin,
    label: 'SALON LOCATION',
    value: `${SALON_INFO.address.shop}, Kurla West`,
    href: SALON_INFO.googleMapsUrl,
    subtext: SALON_INFO.address.landmark,
  },
];

function ContactSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const mapGridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal
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

      // 2. Cards Stagger Reveal
      gsap.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      // 3. Map & Hours Grid Reveal
      gsap.fromTo(
        mapGridRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: mapGridRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-30 py-24 sm:py-32 bg-[#F7F4EE] border-t border-border-light select-none overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      <Container size="editorial">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mb-16 lg:mb-20 space-y-4">
          <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.32em] text-warm-gray uppercase font-medium">
            <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
            <span>SALMAN HAIR STUDIO • CONTACT & LOCATION</span>
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal font-normal uppercase tracking-tight">
            Visit Our Salon in Kurla West.
          </h2>

          <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-xl">
            Located opposite Kurla Court on LBS Marg. Connect directly with Salman and Farmaan Malik for expert haircutting and hair care consultations.
          </p>
        </div>

        {/* 1. LUXURY CONTACT CARDS (2x2 GRID) */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-20">
          {CONTACT_CARDS.map((card) => {
            const IconComp = card.icon;
            return (
              <a
                key={card.label}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="group p-8 rounded-[24px] bg-white/70 backdrop-blur-md border border-charcoal/10 shadow-[0_15px_40px_-10px_rgba(31,31,28,0.08)] hover:border-champagne/50 hover:shadow-[0_20px_50px_-10px_rgba(197,160,89,0.15)] hover:-translate-y-[2px] transition-all duration-400 flex flex-col justify-between space-y-6 cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cream border border-champagne/30 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-charcoal transition-all duration-400">
                    <IconComp className="w-5 h-5" />
                  </div>

                  <span className="text-lbl text-[10px] text-warm-gray tracking-[0.24em] uppercase block font-semibold">
                    {card.label}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-heading text-lg sm:text-xl text-charcoal font-medium group-hover:text-champagne transition-colors duration-300 break-words">
                    {card.value}
                  </h4>
                  <span className="text-body text-xs text-warm-gray font-light block">
                    {card.subtext}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* 2. ELEGANT GOOGLE MAP & BUSINESS HOURS GRID */}
        <div ref={mapGridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Google Map Frame */}
          <div className="lg:col-span-7 relative aspect-[16/10] rounded-[28px] overflow-hidden border border-charcoal/10 shadow-[0_20px_50px_-15px_rgba(31,31,28,0.1)] group">
            <iframe
              title="Salman Hair Studio Kurla West Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.835467439543!2d72.8775!3d19.0728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c894564c7847%3A0x6b7bb7b5b0bfbf0!2sKurla%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(105%)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full transition-all duration-700 ease-out"
            />
            <a
              href={SALON_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-charcoal/10 flex items-center justify-between hover:bg-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <MapPin className="w-4 h-4 text-champagne shrink-0" />
                <span className="text-xs text-charcoal font-medium truncate">
                  {SALON_INFO.address.shop}, LBS Marg, Kurla West
                </span>
              </div>
              <span className="text-lbl text-[10px] text-champagne tracking-widest font-semibold flex items-center gap-1 shrink-0">
                OPEN MAPS <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>

          {/* Business Hours & Address Details Card */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-[28px] border border-charcoal/10 shadow-[0_20px_50px_-15px_rgba(31,31,28,0.08)] space-y-6">
            <div className="space-y-2 pb-4 border-b border-border-light">
              <span className="text-lbl text-[10px] text-champagne tracking-[0.28em] uppercase font-semibold block">
                OPERATING SCHEDULE &amp; ADDRESS
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl text-charcoal font-normal uppercase">
                {SALON_INFO.name}
              </h3>
              <p className="text-xs text-warm-gray">{SALON_INFO.hindiName}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-champagne mt-0.5 shrink-0" />
                <div>
                  <strong className="font-heading text-base text-charcoal font-medium block">
                    {SALON_INFO.workingHours.days}
                  </strong>
                  <span className="font-num text-sm text-warm-gray font-light">
                    {SALON_INFO.workingHours.hours} ({SALON_INFO.workingHours.status})
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-champagne mt-0.5 shrink-0" />
                <div>
                  <strong className="font-heading text-base text-charcoal font-medium block">Complete Address</strong>
                  <span className="font-body text-xs text-warm-gray font-light leading-relaxed block">
                    {SALON_INFO.address.full}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border-light">
                <span className="text-lbl text-[10px] text-champagne tracking-[0.22em] uppercase font-semibold block mb-1">
                  APPOINTMENT CONCIERGE
                </span>
                <p className="text-body text-xs text-warm-gray leading-relaxed font-light mb-3">
                  Walk-ins welcome, or call <strong className="text-charcoal">{SALON_INFO.phone}</strong> to reserve a specific slot with Salman, Farmaan, or Aasha.
                </p>
                <a
                  href={SALON_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-champagne hover:underline"
                >
                  <span>Google Maps Plus Code: {SALON_INFO.address.plusCode}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

export default memo(ContactSection);
