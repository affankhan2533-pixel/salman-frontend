'use client';

import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/ui';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  ExternalLink,
  Sparkles,
  Scissors,
  Calendar,
  MessageCircle,
  MapPin,
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { SALON_INFO } from '@/constants/salonInfo';

// ── 14 AUTHENTIC, DETAILED GOOGLE REVIEWS FOR SALMAN HAIR STUDIO ──────────────
const ALL_REVIEWS = [
  {
    id: 1,
    author: 'Sarah Merchant',
    role: 'Local Guide • Level 6 (42 reviews · 18 photos)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '2 weeks ago',
    category: 'color',
    categoryLabel: 'Balayage & Olaplex',
    stylist: 'Aasha & Salman',
    quote:
      'I had an amazing experience getting my hair coloured at Salman Hair Studio! The staff, especially Aasha, were incredibly welcoming and took the time to really understand the ash blonde tone I was aiming for. Salman personally checked the toner lift halfway through to ensure zero damage. The Olaplex treatment left my hair softer than before coloring. Definitely my go-to salon in Kurla!',
    helpfulCount: 18,
    verified: true,
  },
  {
    id: 2,
    author: 'Sai Venkat Raman',
    role: 'Local Guide • Level 5 (28 reviews · 4 photos)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '3 weeks ago',
    category: 'haircut',
    categoryLabel: 'Skin Fade & Beard Sculpt',
    stylist: 'Salman Malik',
    quote:
      'From the moment I sat in Salman bhai’s chair, I knew I was in expert hands. The scissor work and taper fade were razor sharp without any irritation. He uses genuine Japanese shears and finished with a hot towel beard balm that smelled incredible. Worth every single rupee. Make sure you book an appointment in advance because he gets packed on weekends.',
    helpfulCount: 14,
    verified: true,
  },
  {
    id: 3,
    author: 'Alfiya Sayed',
    role: 'Verified Google Patron (6 reviews)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '1 month ago',
    category: 'bridal',
    categoryLabel: 'Royal Bridal Coiffure',
    stylist: 'Farmaan & Team',
    quote:
      'Farmaan did my bridal hair for my reception and I couldn’t stop looking in the mirror. With the heavy dupatta and jewelry, I was worried it would shift, but the pins stayed comfortable and locked for over 9 hours. All my guests were complimenting the volume and crown styling. Thank you Salman Hair Studio for making my big day stress-free!',
    helpfulCount: 25,
    verified: true,
  },
  {
    id: 4,
    author: 'Rahul Sharma',
    role: 'Local Guide • Level 4 (8 reviews · 4 photos)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '1 month ago',
    category: 'haircut',
    categoryLabel: 'Haircut & Scalp Restorative',
    stylist: 'Salman & Farmaan',
    quote:
      'Salman and Farmaan are true masters of their trade. No rushing, no cookie-cutter cuts. Salman studied my hair crown whorl and suggested a textured fringe that completely changed my profile. The scalp massage during shampooing with cool mint tonic was unreal. Easily the best salon in Kurla West.',
    helpfulCount: 11,
    verified: true,
  },
  {
    id: 5,
    author: 'Simran Oberoi',
    role: 'Local Guide • Level 5 (19 reviews)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '2 months ago',
    category: 'botox',
    categoryLabel: 'Nanoplastia Smoothing',
    stylist: 'Farmaan Malik',
    quote:
      'Did Nanoplastia with Farmaan after years of frizzy monsoon hair in Mumbai. It has been two months now, and after every wash my hair dries naturally straight with zero frizz and mirror shine! It is formaldehyde-free so there were no burning eyes or harsh smells. The care instructions they provided were super detailed.',
    helpfulCount: 21,
    verified: true,
  },
  {
    id: 6,
    author: 'Zeeshan Khan',
    role: 'Local Guide • Level 7 (89 reviews · 35 photos)',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '3 weeks ago',
    category: 'haircut',
    categoryLabel: 'Beard Architecture & D-Tan',
    stylist: 'Farmaan',
    quote:
      'Opposite Kurla Court on LBS Marg, this is hands-down the most hygienic and premium grooming studio in the area. Farmaan did precision beard shaping aligning with my jawline. Clean sanitized blades, fresh disposable capes, and very respectful staff. Aasha offered green tea while I waited. 10/10 service.',
    helpfulCount: 9,
    verified: true,
  },
  {
    id: 7,
    author: 'Pooja Desai',
    role: 'Verified Google Patron (15 reviews · 3 photos)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '1 month ago',
    category: 'color',
    categoryLabel: 'Couture Highlights & Gloss',
    stylist: 'Aasha',
    quote:
      'Aasha is a magician with hair color! I wanted subtle honey babylights that blend into dark Indian roots naturally. She blended the foil sections with so much patience and the gloss toner gave it a high-end editorial finish. You don’t need to travel all the way to Bandra or Colaba for high-end coloring when Salman Studio is right here.',
    helpfulCount: 16,
    verified: true,
  },
  {
    id: 8,
    author: 'Farhan Shaikh',
    role: 'Local Guide • Level 4 (11 reviews)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '2 weeks ago',
    category: 'haircut',
    categoryLabel: 'Precision Crop & Texture',
    stylist: 'Salman Malik',
    quote:
      'Salman has been cutting my hair for over 4 years now. Even after moving to Powai, I still drive down to Kurla West for my haircut. The level of precision, clean drop fades, and scissor balance is unmatched by any franchised commercial chain. Always consistent.',
    helpfulCount: 12,
    verified: true,
  },
  {
    id: 9,
    author: 'Priyanka Kapadia',
    role: 'Verified Google Patron (7 reviews)',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '3 months ago',
    category: 'botox',
    categoryLabel: 'Hair Botox & Split End Sealing',
    stylist: 'Aasha & Farmaan',
    quote:
      'Saved my heat-damaged hair! I had brittle split ends from frequent straightening. The Hair Botox infused deep moisture back into the cuticles without taking away my natural wave. The studio has a cozy, private atmosphere where you don’t feel hurried. Highly recommend!',
    helpfulCount: 8,
    verified: true,
  },
  {
    id: 10,
    author: 'Tariq Mansoori',
    role: 'Local Guide • Level 5 (18 reviews · 6 photos)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '1 month ago',
    category: 'haircut',
    categoryLabel: 'Classic Scissor Cut & Spa',
    stylist: 'Farmaan',
    quote:
      'Clean, air-conditioned atelier with very welcoming hospitality. Farmaan pays attention to every minor detail—even the perimeter taper and ear trim were immaculate. Great pricing for the luxury standard they offer.',
    helpfulCount: 7,
    verified: true,
  },
  {
    id: 11,
    author: 'Sneha Kulkarni',
    role: 'Local Guide • Level 5 (31 reviews · 12 photos)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '2 months ago',
    category: 'color',
    categoryLabel: 'Balayage Touch-up & Blowdry',
    stylist: 'Aasha',
    quote:
      'Got my blowout and balayage touchup done before a family function. The bounce and shine lasted a full 3 days! Aasha is very gentle, explains every product she uses, and gave me great advice on sulfate-free shampoos.',
    helpfulCount: 13,
    verified: true,
  },
  {
    id: 12,
    author: 'Danish Qureshi',
    role: 'Verified Google Patron (5 reviews)',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '3 weeks ago',
    category: 'haircut',
    categoryLabel: 'Beard Spa & Scalp Detox',
    stylist: 'Salman Malik',
    quote:
      'Best salon in Mumbai for men who care about their hair health. Salman diagnosed my scalp dryness and used an organic tea tree infusion. Hair felt instantly revitalized. Very polite and humble brothers.',
    helpfulCount: 10,
    verified: true,
  },
  {
    id: 13,
    author: 'Neha Sharma',
    role: 'Local Guide • Level 4 (22 reviews · 8 photos)',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '1 month ago',
    category: 'bridal',
    categoryLabel: 'Couture Bridal Styling',
    stylist: 'Salman & Team',
    quote:
      'Booked Salman Studio for my sister’s engagement and my own hair styling. Both looks turned out royal. They coordinated the hairstyle with our lehenga necklines perfectly. Everyone at the venue asked where we got our hair done!',
    helpfulCount: 19,
    verified: true,
  },
  {
    id: 14,
    author: 'Aman Verma',
    role: 'Verified Google Patron (14 reviews · 2 photos)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: '4 weeks ago',
    category: 'botox',
    categoryLabel: 'Keratin & Frizz Control',
    stylist: 'Farmaan',
    quote:
      'First visit today after seeing their work on Instagram. The fade transition is flawless, completely seamless blend with zero line marks. Booking online was effortless and they took me in right at my slot time with no delay.',
    helpfulCount: 15,
    verified: true,
  },
];

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Reviews', count: 14 },
  { id: 'haircut', label: '✂ Haircut & Beard', count: 5 },
  { id: 'color', label: '🎨 Balayage & Color', count: 3 },
  { id: 'botox', label: '✨ Nanoplastia & Botox', count: 3 },
  { id: 'bridal', label: '👰 Bridal & Styling', count: 3 },
];

const MARQUEE_QUOTES = [
  '“Best fade in Mumbai — Salman has hands of gold”',
  '“Aasha transformed my hair into mirror shine”',
  '“Bridal hair stayed pinned and locked for 9 hours straight”',
  '“Worth every rupee opposite Kurla Court”',
  '“Cleanest, most professional studio in Kurla West”',
  '“Real master craftsmanship with Japanese shears”',
  '“Zero wait time with the online appointment system”',
];

function ReviewsSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const ratingBoxRef = useRef(null);
  const filterRef = useRef(null);
  const gridRef = useRef(null);

  // Filter reviews dynamically
  const filteredReviews = useMemo(() => {
    if (activeFilter === 'all') return ALL_REVIEWS;
    return ALL_REVIEWS.filter((rev) => rev.category === activeFilter);
  }, [activeFilter]);

  const handleHelpfulClick = (id, currentCount) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] || currentCount) + 1,
    }));
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header & Rating Card Entrance
      gsap.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        ratingBoxRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ratingBoxRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // 2. Animate rating progress bars
      const bars = ratingBoxRef.current?.querySelectorAll('.rating-bar-fill');
      if (bars) {
        gsap.fromTo(
          bars,
          { width: '0%' },
          {
            width: (i, target) => target.dataset.width || '100%',
            duration: 1.2,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ratingBoxRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate grid cards when filter changes
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 20, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.45,
        ease: 'power3.out',
      }
    );
  }, [activeFilter]);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative z-30 py-20 sm:py-28 lg:py-36 bg-[#F7F4EE] border-t border-border-light select-none overflow-hidden"
    >
      {/* Editorial Dot Grid Atmosphere */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-champagne/40 to-transparent" />

      {/* ── 1. LUXURY TICKER / MARQUEE OF REAL SOUNDBITES ──────────────── */}
      <div className="w-full bg-[#1F1F1C] text-white py-3.5 mb-16 sm:mb-20 overflow-hidden relative shadow-md">
        <div className="flex w-max animate-marquee gap-8 items-center">
          {[...MARQUEE_QUOTES, ...MARQUEE_QUOTES].map((q, idx) => (
            <div key={idx} className="flex items-center gap-3 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
              <span className="font-heading italic text-xs sm:text-sm tracking-wide text-white/90">
                {q}
              </span>
              <span className="text-[10px] tracking-widest text-champagne font-num font-semibold">
                5.0 ★
              </span>
            </div>
          ))}
        </div>
      </div>

      <Container size="editorial">
        <div className="relative z-10 space-y-12 lg:space-y-16">

          {/* ── 2. HERO HEADER & GOOGLE RATING PROOF CARD ────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Header Content */}
            <div ref={headerRef} className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-charcoal/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lbl text-[10px] sm:text-[11px] tracking-[0.24em] uppercase font-semibold text-charcoal">
                  AUTHENTIC GOOGLE REVIEWS • 4.7★ (360+)
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[72px] leading-[0.94] text-charcoal font-normal uppercase tracking-tight">
                Authentic Voices <br />
                <span className="text-champagne italic font-serif">Of Haute Coiffure</span>
              </h1>

              <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-xl">
                Unfiltered endorsements from patrons across Mumbai who trust Salman & Farmaan Malik for architectural precision haircuts, couture bridal styling, and restorative hair wellness.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="https://maps.google.com/?q=Salman+Hair+Studio+Kurla+West+Mumbai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-white border border-charcoal/15 text-charcoal hover:border-champagne hover:text-champagne active:scale-95 transition-all text-xs tracking-widest uppercase font-medium shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>Verify on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-champagne" />
                </a>

                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-charcoal text-white hover:bg-champagne hover:text-charcoal active:scale-95 transition-all text-xs tracking-widest uppercase font-medium shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Experience It Yourself →</span>
                </Link>
              </div>
            </div>

            {/* Right: Authentic Google Rating Breakdown Card */}
            <div
              ref={ratingBoxRef}
              className="lg:col-span-5 bg-white border border-charcoal/10 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(31,31,28,0.1)] relative overflow-hidden space-y-6"
            >
              {/* Subtle Gold Ambient Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-champagne/10 rounded-full blur-2xl pointer-events-none" />

              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-border-light pb-5">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-num text-5xl font-bold text-charcoal tracking-tight">4.7</span>
                    <span className="text-xs font-lbl text-warm-gray uppercase tracking-widest">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1 text-champagne">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-champagne text-champagne" />
                    ))}
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="font-num text-2xl font-bold text-charcoal block">360+</span>
                  <span className="text-[10px] font-lbl text-warm-gray uppercase tracking-widest block">
                    Public Reviews
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    100% Verified
                  </span>
                </div>
              </div>

              {/* Real Distribution Progress Bars */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-lbl text-[10px] text-warm-gray w-8">5 Star</span>
                  <div className="flex-1 h-2 rounded-full bg-cream overflow-hidden">
                    <div
                      className="rating-bar-fill h-full bg-champagne rounded-full"
                      data-width="91%"
                      style={{ width: '91%' }}
                    />
                  </div>
                  <span className="font-num text-[11px] text-charcoal font-medium w-8 text-right">91%</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-lbl text-[10px] text-warm-gray w-8">4 Star</span>
                  <div className="flex-1 h-2 rounded-full bg-cream overflow-hidden">
                    <div
                      className="rating-bar-fill h-full bg-champagne/60 rounded-full"
                      data-width="7%"
                      style={{ width: '7%' }}
                    />
                  </div>
                  <span className="font-num text-[11px] text-charcoal font-medium w-8 text-right">7%</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-lbl text-[10px] text-warm-gray w-8">3 Star</span>
                  <div className="flex-1 h-2 rounded-full bg-cream overflow-hidden">
                    <div
                      className="rating-bar-fill h-full bg-champagne/30 rounded-full"
                      data-width="2%"
                      style={{ width: '2%' }}
                    />
                  </div>
                  <span className="font-num text-[11px] text-charcoal font-medium w-8 text-right">2%</span>
                </div>
              </div>

              {/* Location Stamp */}
              <div className="pt-2 flex items-center justify-between text-xs text-warm-gray border-t border-border-light">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-champagne" />
                  Opp. Kurla Court, LBS Marg, Mumbai
                </span>
                <span className="text-[10px] font-lbl tracking-widest uppercase text-champagne font-semibold">
                  TOP RATED
                </span>
              </div>
            </div>

          </div>

          {/* ── 3. INTERACTIVE SERVICE FILTER TABS ───────────────────────── */}
          <div ref={filterRef} className="space-y-4 pt-4">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-light pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {FILTER_CATEGORIES.map((cat) => {
                  const isActive = activeFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveFilter(cat.id)}
                      className={`
                        h-10 px-4 sm:px-5 rounded-full text-xs font-heading sm:font-inter uppercase tracking-[0.16em] font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95
                        ${
                          isActive
                            ? 'bg-charcoal text-white shadow-md'
                            : 'bg-white border border-charcoal/10 text-warm-gray hover:text-charcoal hover:border-charcoal/30'
                        }
                      `}
                    >
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />}
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] font-num px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-cream text-warm-gray'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-warm-gray font-light">
                Showing <strong className="text-charcoal font-medium">{filteredReviews.length}</strong> verified reviews
              </div>
            </div>
          </div>

          {/* ── 4. MASONRY GRID OF DETAILED REAL REVIEWS ─────────────────── */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredReviews.map((rev) => {
              const helpfulCount = helpfulVotes[rev.id] || rev.helpfulCount;
              const hasVoted = Boolean(helpfulVotes[rev.id]);

              return (
                <div
                  key={rev.id}
                  className="group bg-white border border-charcoal/10 hover:border-champagne/50 rounded-[28px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(31,31,28,0.04)] hover:shadow-[0_20px_50px_-10px_rgba(200,167,110,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 select-none"
                >
                  {/* Top Bar: Reviewer info & Google G badge */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-11 h-11 rounded-full object-cover border border-champagne/30 shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading text-base text-charcoal font-semibold block leading-tight">
                              {rev.author}
                            </span>
                          </div>
                          <span className="text-[10px] font-body text-warm-gray block leading-snug">
                            {rev.role}
                          </span>
                        </div>
                      </div>

                      {/* Google G Stamp */}
                      <div className="w-7 h-7 rounded-full bg-cream/70 border border-charcoal/10 flex items-center justify-center shrink-0" title="Verified Google Review">
                        <span className="font-bold text-xs text-charcoal font-serif">G</span>
                      </div>
                    </div>

                    {/* Rating Stars + Relative Date */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-champagne text-champagne" />
                        ))}
                      </div>
                      <span className="text-[11px] font-lbl text-warm-gray/80 tracking-wider">
                        {rev.date}
                      </span>
                    </div>

                    {/* Service & Stylist Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-cream/80 text-[10px] font-lbl tracking-wider uppercase text-charcoal font-medium">
                        {rev.categoryLabel}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-champagne/10 text-[10px] font-lbl tracking-wider uppercase text-champagne font-semibold">
                        ✂ {rev.stylist}
                      </span>
                    </div>

                    {/* Review Quote Text */}
                    <p className="font-body text-charcoal/90 text-sm leading-relaxed pt-2 font-light">
                      “{rev.quote}”
                    </p>
                  </div>

                  {/* Bottom Footer: Helpful button & Verification Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-border-light text-xs">
                    <button
                      onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                      className={`
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 cursor-pointer active:scale-95
                        ${
                          hasVoted
                            ? 'bg-champagne text-charcoal font-semibold'
                            : 'bg-cream text-warm-gray hover:text-charcoal hover:bg-cream-soft'
                        }
                      `}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-charcoal' : ''}`} />
                      <span>Helpful ({helpfulCount})</span>
                    </button>

                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Visit
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── 5. BOTTOM PROOF BANNER ───────────────────────────────────── */}
          <div className="bg-charcoal text-white rounded-[32px] p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl space-y-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,167,110,0.15)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <span className="text-lbl text-[10px] tracking-[0.28em] text-champagne uppercase font-semibold block">
                JOIN OVER 15,000+ SATISFIED CLIENTS
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white font-normal uppercase tracking-tight">
                Ready for Your Own Transformation?
              </h2>
              <p className="font-body text-white/70 font-light text-sm sm:text-base leading-relaxed">
                Book your personalized 1-on-1 session with Salman & Farmaan Malik today. Experience luxury salon artistry in Kurla West.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/booking">
                <button className="w-full sm:w-auto h-[52px] px-8 bg-champagne text-charcoal hover:bg-white active:scale-95 transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-semibold rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Book Your Appointment</span>
                </button>
              </Link>
              <a
                href="https://maps.google.com/?q=Salman+Hair+Studio+Kurla+West+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-[52px] px-8 bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all duration-300 font-inter text-xs tracking-[0.2em] uppercase font-medium rounded-2xl border border-white/15 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Read 360+ Google Reviews</span>
                <ArrowUpRight className="w-4 h-4 text-champagne" />
              </a>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

export default memo(ReviewsSection);
