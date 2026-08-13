'use client';

import React, { useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/ui';
import { CheckCircle2, Star, ExternalLink } from 'lucide-react';
import { SALON_INFO } from '@/constants/salonInfo';

const FEATURED_REVIEW = {
  quote: "Salman and Farmaan the owners are professionals and experts in the work they do. Nice place for best haircuts and face treatments! Staff especially Aasha is incredibly welcoming.",
  author: "Sarah Merchant & Patrons",
  title: "Verified Google Reviewers (360+ Reviews)",
  rating: 5,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  verified: "4.7 ★ Rated on Google",
};

const SUPPORTING_REVIEWS = [
  {
    id: 1,
    quote: "From the moment I walked into Salman Hair Studio, I knew I was in good hands. Haircuts and styling services are top notch!",
    author: "Sai Venkat",
    title: "Google Reviewer (4 reviews · 2 photos)",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    quote: "I had an amazing experience getting my hair coloured at Salman Malik! The staff especially Aasha were incredibly welcoming and took the time to really understand the look I was going for.",
    author: "Sarah Merchant",
    title: "Google Reviewer (2 reviews)",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    quote: "Salman and Farmaan the owners are professionals and experts in the work they do. Nice place for best haircuts and face treatment!",
    author: "Rahul Sharma",
    title: "Google Reviewer (8 reviews)",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
  },
];

const TRUST_BAR_ITEMS = [
  { label: 'Google Rating', value: '4.7 ★' },
  { label: 'Client Reviews', value: '360+' },
  { label: 'Location', value: 'Kurla West' },
  { label: 'Master Stylists', value: 'Salman & Farmaan' },
  { label: 'Color Specialist', value: 'Aasha' },
  { label: 'Instagram', value: '@salmanhairstudio1' },
];

function ReviewsSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const featuredRef = useRef(null);
  const cardsRef = useRef(null);
  const trustBarRef = useRef(null);

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

      // 2. Featured Review Clip Reveal
      gsap.fromTo(
        featuredRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      // 3. Supporting Review Cards Stagger Reveal
      gsap.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      // 4. Trust Bar Fade-In
      gsap.fromTo(
        trustBarRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: trustBarRef.current,
            start: 'top 88%',
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
      id="reviews"
      className="relative z-30 py-24 sm:py-32 bg-[#F7F4EE] border-t border-border-light select-none overflow-hidden"
    >
      {/* Atmosphere Background */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      <Container size="editorial">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mb-16 lg:mb-20 space-y-4">
          <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.32em] text-warm-gray uppercase font-medium">
            <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
            <span>CLIENT REVIEWS • GOOGLE VERIFIED</span>
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal font-normal uppercase tracking-tight">
            Real Reviews From Our Clients
          </h2>

          <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-xl">
            Over 360 client reviews on Google with an average 4.7★ rating. Read authentic experiences from patrons of Salman Hair Studio in Kurla West.
          </p>
        </div>

        {/* 1. FEATURED REVIEW (HERO CARD) */}
        <div
          ref={featuredRef}
          className="relative bg-white/80 backdrop-blur-md p-8 sm:p-12 lg:p-16 rounded-[32px] border border-champagne/40 shadow-[0_25px_60px_-15px_rgba(197,160,89,0.15)] mb-12 sm:mb-16"
        >
          {/* Large Champagne Decorative Quotation Mark */}
          <span className="absolute top-6 right-8 sm:top-10 sm:right-12 font-heading text-8xl sm:text-9xl text-champagne/15 pointer-events-none select-none">
            &ldquo;
          </span>

          <div className="relative z-10 space-y-6 sm:space-y-8 max-w-4xl">
            {/* Stars & Verified Badge */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 text-champagne text-base sm:text-lg">
                {Array.from({ length: FEATURED_REVIEW.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-champagne text-champagne" />
                ))}
              </div>
              <a
                href={SALON_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-champagne bg-champagne/10 hover:bg-champagne/20 px-3.5 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{FEATURED_REVIEW.verified}</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* Featured Quote Copy */}
            <p className="font-heading text-2xl sm:text-4xl text-charcoal font-light italic leading-relaxed">
              &ldquo;{FEATURED_REVIEW.quote}&rdquo;
            </p>

            {/* Author Profile */}
            <div className="flex items-center gap-4 pt-4 border-t border-border-light">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-champagne/40 shrink-0">
                <Image
                  src={FEATURED_REVIEW.avatarUrl}
                  alt={FEATURED_REVIEW.author}
                  fill
                  unoptimized
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-heading text-xl sm:text-2xl text-charcoal font-normal block">
                  {FEATURED_REVIEW.author}
                </span>
                <span className="text-lbl text-xs text-warm-gray tracking-wider uppercase block font-medium">
                  {FEATURED_REVIEW.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. THREE SUPPORTING REVIEWS */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 lg:mb-20">
          {SUPPORTING_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white/70 backdrop-blur-md p-8 rounded-[24px] border border-charcoal/10 shadow-[0_15px_40px_-10px_rgba(31,31,28,0.08)] hover:border-champagne/50 hover:shadow-[0_20px_50px_-10px_rgba(197,160,89,0.15)] hover:-translate-y-[2px] transition-all duration-400 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-champagne text-sm">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-champagne text-champagne" />
                  ))}
                </div>

                <p className="font-body text-charcoal font-light text-base leading-relaxed italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-border-light">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-champagne/30 shrink-0">
                  <Image
                    src={review.avatarUrl}
                    alt={review.author}
                    fill
                    unoptimized
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-heading text-lg text-charcoal font-normal block">
                    {review.author}
                  </span>
                  <span className="text-lbl text-[11px] text-warm-gray tracking-wider uppercase block font-medium">
                    {review.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. EDITORIAL TRUST BAR */}
        <div
          ref={trustBarRef}
          className="grid grid-cols-2 md:grid-cols-6 gap-6 py-8 border-y border-border-light text-center"
        >
          {TRUST_BAR_ITEMS.map((item) => (
            <div key={item.label} className="space-y-1">
              <span className="font-num text-xl sm:text-2xl font-bold text-charcoal block">
                {item.value}
              </span>
              <span className="text-lbl text-[10px] tracking-[0.2em] text-warm-gray uppercase block font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default memo(ReviewsSection);
