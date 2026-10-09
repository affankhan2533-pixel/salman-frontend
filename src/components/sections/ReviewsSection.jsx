'use client';

import React, { useRef, memo, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import { Container } from '@/components/ui';
import {
  Star,
  ExternalLink,
  MapPin,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
  Scissors,
  CheckCircle2,
} from 'lucide-react';
import { SALON_INFO } from '@/constants/salonInfo';

function ReviewsSection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative z-30 py-20 sm:py-28 lg:py-36 bg-[#F7F4EE] border-t border-border-light select-none overflow-hidden"
    >
      {/* Editorial Dot Grid Atmosphere */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-champagne/40 to-transparent" />

      <Container size="editorial">
        <div className="relative z-10 space-y-12 lg:space-y-16">

          {/* Section Header */}
          <div ref={headerRef} className="max-w-3xl space-y-5 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-charcoal/10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-lbl text-[10px] sm:text-[11px] tracking-[0.24em] uppercase font-semibold text-charcoal">
                VERIFIED GOOGLE BUSINESS PROFILE
              </span>
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl lg:text-[72px] leading-[0.94] text-charcoal font-normal uppercase tracking-tight">
              Client Voices <br />
              <span className="text-champagne italic font-serif">On Google Maps</span>
            </h2>

            <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed">
              We believe in complete authenticity. Rather than publishing unverified static testimonials on our website, all client reviews, photos, and feedback are hosted live and unfiltered on our verified Google Maps business listing.
            </p>
          </div>

          {/* Central Google Verification Card */}
          <div
            ref={cardRef}
            className="bg-white border border-charcoal/10 rounded-[32px] p-8 sm:p-12 shadow-[0_20px_50px_-15px_rgba(31,31,28,0.08)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Column: Rating Badge & Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="font-num text-6xl sm:text-7xl font-bold text-charcoal tracking-tight">
                    {SALON_INFO.rating}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-champagne">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-champagne text-champagne" />
                      ))}
                    </div>
                    <span className="font-lbl text-xs text-warm-gray uppercase tracking-widest block">
                      Based on {SALON_INFO.reviewCount}+ public Google reviews
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-border-light">
                  <div className="flex items-center gap-2 text-sm text-charcoal">
                    <MapPin className="w-4 h-4 text-champagne shrink-0" />
                    <span>{SALON_INFO.address.shop}, Opposite Kurla Court, LBS Marg, Mumbai</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-warm-gray">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Public reviews written by real patrons with Google accounts</span>
                  </div>
                </div>

                <p className="font-body text-xs sm:text-sm text-warm-gray leading-relaxed font-light">
                  Explore before-and-after customer photos, recent haircuts, balayage transformations, and honest client experiences directly on Google Maps.
                </p>
              </div>

              {/* Right Column: Direct Verification Actions */}
              <div className="lg:col-span-5 flex flex-col gap-3.5 bg-cream/50 p-6 sm:p-8 rounded-2xl border border-charcoal/5">
                <span className="text-lbl text-[10px] tracking-[0.24em] text-champagne uppercase font-semibold block">
                  TRANSPARENT REVIEWS
                </span>
                
                <a
                  href={SALON_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-13 px-6 bg-charcoal text-white hover:bg-champagne hover:text-charcoal active:scale-95 transition-all text-xs tracking-widest uppercase font-medium rounded-xl shadow-md flex items-center justify-between cursor-pointer"
                >
                  <span>Read 360+ Google Reviews</span>
                  <ArrowUpRight className="w-4 h-4 text-champagne" />
                </a>

                <Link
                  href="/booking"
                  className="w-full h-13 px-6 bg-white text-charcoal border border-charcoal/15 hover:border-champagne hover:text-champagne active:scale-95 transition-all text-xs tracking-widest uppercase font-medium rounded-xl shadow-sm flex items-center justify-between cursor-pointer"
                >
                  <span>Book Atelier Session</span>
                  <Calendar className="w-4 h-4 text-champagne" />
                </Link>

                <a
                  href={SALON_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 px-6 bg-transparent text-warm-gray hover:text-charcoal active:scale-95 transition-all text-[11px] tracking-wider uppercase font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-champagne" />
                  <span>Ask Questions on WhatsApp</span>
                </a>
              </div>

            </div>
          </div>

          {/* Core Service Commitments */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white border border-charcoal/10 space-y-2">
              <span className="text-lbl text-[10px] text-champagne tracking-widest uppercase font-semibold block">
                01 • PRECISION CUTTING
              </span>
              <h3 className="font-heading text-lg text-charcoal font-medium">
                Diagnostic Architecture
              </h3>
              <p className="text-xs text-warm-gray font-light leading-relaxed">
                Every fade, scissor cut, and beard sculpting session is calculated against facial bone structure with zero rushed appointments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-charcoal/10 space-y-2">
              <span className="text-lbl text-[10px] text-champagne tracking-widest uppercase font-semibold block">
                02 • CHEMICAL INTEGRITY
              </span>
              <h3 className="font-heading text-lg text-charcoal font-medium">
                Couture Color &amp; Restorative Care
              </h3>
              <p className="text-xs text-warm-gray font-light leading-relaxed">
                Organic European balayage foils, gentle toners, and formaldehyde-free smoothing formulas that prioritize follicle health.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-charcoal/10 space-y-2">
              <span className="text-lbl text-[10px] text-champagne tracking-widest uppercase font-semibold block">
                03 • PRIVATE SANCTUARY
              </span>
              <h3 className="font-heading text-lg text-charcoal font-medium">
                1-on-1 Dedicated Attention
              </h3>
              <p className="text-xs text-warm-gray font-light leading-relaxed">
                Unhurried consultations opposite Kurla Court, ensuring your appointment receives undivided master stylist focus.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

export default memo(ReviewsSection);
