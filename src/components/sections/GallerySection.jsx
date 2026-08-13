'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/ui';
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'haircuts', label: 'Haircuts' },
  { id: 'color', label: 'Color' },
  { id: 'styling', label: 'Styling' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'treatments', label: 'Treatments' },
];

const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'haircuts',
    title: 'Architectural Sculpted Waves',
    collection: 'HAUTE COIFFURE',
    aspect: 'aspect-[4/5]',
    spanClass: 'col-span-12 sm:col-span-6 lg:col-span-4',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 2,
    category: 'color',
    title: 'Champagne Gloss Balayage',
    collection: 'COUTURE COLOR',
    aspect: 'aspect-[16/10]',
    spanClass: 'col-span-12 sm:col-span-6 lg:col-span-8',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 3,
    category: 'haircuts',
    title: 'Minimalist Precision Perimeter',
    collection: 'SCULPTURAL CUT',
    aspect: 'aspect-[16/10]',
    spanClass: 'col-span-12 sm:col-span-6 lg:col-span-8',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 4,
    category: 'bridal',
    title: 'Heritage Bridal Coiffure',
    collection: 'HAUTE BRIDE',
    aspect: 'aspect-[4/5]',
    spanClass: 'col-span-12 sm:col-span-6 lg:col-span-4',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 5,
    category: 'treatments',
    title: 'Botanical Scalp & Hair Ritual',
    collection: 'RESTORATIVE CARE',
    aspect: 'aspect-[4/5]',
    spanClass: 'col-span-12 sm:col-span-6 lg:col-span-4',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600',
  },
  {
    id: 6,
    category: 'styling',
    title: 'Editorial Runway Movement',
    collection: 'COUTURE STYLING',
    aspect: 'aspect-[16/10]',
    spanClass: 'col-span-12 sm:col-span-6 lg:col-span-8',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1600',
  },
];

const GalleryCard = memo(function GalleryCard({ item, idx, onOpenLightbox }) {
  const cardRef = useRef(null);
  const imageInnerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Independent clip-path reveal
      gsap.fromTo(
        cardRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Subtle desktop hover zoom
      if (typeof window !== 'undefined' && window.innerWidth >= 1024 && imageInnerRef.current) {
        const card = cardRef.current;
        const inner = imageInnerRef.current;
        if (card && inner) {
          const onEnter = () => gsap.to(inner, { scale: 1.05, duration: 0.6, ease: 'power2.out' });
          const onLeave = () => gsap.to(inner, { scale: 1.0, duration: 0.6, ease: 'power2.out' });
          card.addEventListener('mouseenter', onEnter);
          card.addEventListener('mouseleave', onLeave);
          return () => {
            card.removeEventListener('mouseenter', onEnter);
            card.removeEventListener('mouseleave', onLeave);
          };
        }
      }
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => onOpenLightbox(idx)}
      className={`group relative w-full ${item.aspect} ${item.spanClass} rounded-[28px] overflow-hidden bg-cream border border-charcoal/10 cursor-pointer shadow-[0_20px_50px_-15px_rgba(31,31,28,0.1)] hover:shadow-[0_30px_70px_-15px_rgba(31,31,28,0.18)] transition-shadow duration-500 select-none`}
    >
      {/* Image Container */}
      <div ref={imageInnerRef} className="w-full h-full relative transition-transform duration-700 ease-out">
        <Image
          src={item.imageUrl}
          alt={`Salman Hair Studio ${item.title}`}
          fill
          loading="lazy"
          unoptimized
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover grayscale contrast-[1.05]"
        />
      </div>

      {/* Subtle Champagne Overlay on Hover */}
      <div className="absolute inset-0 bg-champagne/15 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* Bottom Editorial Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent z-20 flex items-end justify-between gap-4 pointer-events-none">
        <div className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <span className="text-lbl text-[10px] text-champagne tracking-[0.28em] uppercase font-semibold block">
            {item.collection}
          </span>
          <h3 className="font-heading text-xl sm:text-2xl text-white font-normal uppercase leading-tight">
            {item.title}
          </h3>
        </div>

        {/* Tiny Luxury Arrow */}
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 group-hover:bg-champagne group-hover:text-charcoal transition-all duration-400">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
});

function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbGalleryItems, setDbGalleryItems] = useState(GALLERY_ITEMS);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const touchStartX = useRef(0);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  // Fetch visible gallery images dynamically from MongoDB API
  useEffect(() => {
    async function fetchPublicGallery() {
      try {
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const API_URL = rawUrl.replace(/\/api\/?$/, '');
        const res = await fetch(`${API_URL}/api/gallery?visible=true`);
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map((item, idx) => ({
            id: item._id,
            category: item.category ? item.category.toLowerCase() : 'haircuts',
            rawCategory: item.category || 'Haircuts',
            title: item.title || 'Atelier Coiffure Showcase',
            collection: item.category ? item.category.toUpperCase() : 'ATELIER SHOWCASE',
            aspect: idx % 3 === 1 ? 'aspect-[16/10]' : 'aspect-[4/5]',
            spanClass: idx % 3 === 1 ? 'col-span-12 sm:col-span-6 lg:col-span-8' : 'col-span-12 sm:col-span-6 lg:col-span-4',
            imageUrl: item.imageUrl || item.afterImage || item.thumbnail || '',
            order: item.order !== undefined ? item.order : idx,
          }));
          setDbGalleryItems(mapped);
        }
      } catch (err) {
        console.error('[GallerySection] Failed to fetch public gallery items:', err);
      }
    }
    fetchPublicGallery();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return dbGalleryItems;
    const catLower = activeCategory.toLowerCase();
    return dbGalleryItems.filter(
      (item) => item.category === catLower || item.rawCategory.toLowerCase() === catLower || item.category.includes(catLower)
    );
  }, [activeCategory, dbGalleryItems]);

  // Section Header GSAP Entrance
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keyboard Navigation for Lightbox
  const handleKeyDown = useCallback(
    (e) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') {
        setLightboxIdx(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    },
    [lightboxIdx, filteredItems.length]
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

  // Touch Swipe for Mobile Lightbox
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setLightboxIdx((prev) => (prev + 1) % filteredItems.length);
      } else {
        setLightboxIdx((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
    }
  };

  const activeItem = lightboxIdx !== null ? filteredItems[lightboxIdx] : null;

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative z-30 py-24 sm:py-32 bg-[#F7F4EE] border-t border-border-light select-none overflow-hidden"
    >
      {/* Atmosphere Background */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      <Container size="editorial">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.32em] text-warm-gray uppercase font-medium">
            <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
            <span>EDITORIAL FASHION CAMPAIGN</span>
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal font-normal uppercase tracking-tight">
            The Haute Coiffure Gallery
          </h2>

          <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-xl">
            A curated archive of transformations, sculptural hair designs, and styling work from our Kurla West studio.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-3 scrollbar-none border-b border-border-light">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 py-2.5 text-xs tracking-[0.22em] uppercase transition-colors duration-300 font-medium cursor-pointer shrink-0 ${
                  isActive ? 'text-charcoal font-semibold' : 'text-warm-gray hover:text-charcoal'
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Editorial Masonry Layout */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {filteredItems.map((item, idx) => (
            <GalleryCard
              key={item.id}
              item={item}
              idx={idx}
              onOpenLightbox={(index) => setLightboxIdx(index)}
            />
          ))}
        </div>
      </Container>

      {/* FULLSCREEN LUXURY LIGHTBOX */}
      {activeItem && (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[100] bg-charcoal/90 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 select-none animate-fadeIn"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between z-20 max-w-6xl mx-auto w-full">
            <div className="space-y-0.5">
              <span className="text-lbl text-[10px] sm:text-xs text-champagne tracking-[0.3em] uppercase block font-semibold">
                {activeItem.collection}
              </span>
              <h4 className="font-heading text-xl sm:text-3xl text-white font-normal uppercase">
                {activeItem.title}
              </h4>
            </div>

            <button
              onClick={() => setLightboxIdx(null)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Main Image Frame */}
          <div className="relative w-full max-w-5xl mx-auto h-[60vh] sm:h-[68vh] rounded-[28px] overflow-hidden border border-white/20 shadow-2xl my-auto">
            <Image
              src={activeItem.imageUrl}
              alt={activeItem.title}
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 z-20 max-w-5xl mx-auto w-full">
            <span className="text-lbl text-xs text-white/60 tracking-[0.24em] uppercase">
              CAMPAIGN 0{lightboxIdx + 1} OF 0{filteredItems.length}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLightboxIdx((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)}
                className="p-3 rounded-full bg-white/10 hover:bg-champagne hover:text-charcoal text-white transition-all cursor-pointer border border-white/20"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxIdx((prev) => (prev + 1) % filteredItems.length)}
                className="p-3 rounded-full bg-white/10 hover:bg-champagne hover:text-charcoal text-white transition-all cursor-pointer border border-white/20"
                aria-label="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default memo(GallerySection);
