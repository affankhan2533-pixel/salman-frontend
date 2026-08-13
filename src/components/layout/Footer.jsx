'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { Instagram, MapPin, Star, ArrowUp, MessageCircle, Phone } from 'lucide-react';
import { SALON_INFO } from '@/constants/salonInfo';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-30 bg-[#F7F4EE] border-t border-border-light text-charcoal pt-16 sm:pt-24 pb-12 overflow-hidden select-none">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      <Container size="editorial">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-border-light relative z-10">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="font-heading text-3xl sm:text-4xl lg:text-5xl uppercase tracking-widest text-charcoal font-normal hover:text-champagne transition-colors duration-300 block"
            >
              {SALON_INFO.name}
            </Link>
            <p className="font-body text-xs sm:text-sm text-warm-gray font-light max-w-sm leading-relaxed">
              Kurla West’s premier hair salon. Expert haircuts, balayage, keratin smoothing, and facial treatments by Salman and Farmaan Malik.
            </p>
            <div className="pt-2">
              <span className="text-lbl text-[10px] tracking-[0.28em] text-warm-gray uppercase font-medium block">
                KURLA WEST • MUMBAI 400070
              </span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-lbl text-xs text-champagne tracking-[0.28em] uppercase block font-semibold">
              QUICK NAVIGATION
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm text-warm-gray font-light">
              {['Home', 'About', 'Services', 'Gallery', 'Reviews', 'Booking', 'Contact'].map((nav) => {
                const href = nav === 'Home' ? '/' : nav === 'About' ? '/#about' : `/${nav.toLowerCase()}`;
                return (
                  <li key={nav}>
                    <Link
                      href={href}
                      className="hover:text-charcoal transition-colors duration-300 relative inline-block py-0.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-champagne hover:after:w-full after:transition-all after:duration-300"
                    >
                      {nav} {nav !== 'Home' ? 'Experience' : ''}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Social Links & Location Info */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-lbl text-xs text-champagne tracking-[0.28em] uppercase block font-semibold">
              SOCIAL CONNECT &amp; REVIEWS
            </span>

            <div className="flex flex-wrap gap-3">
              <a
                href={SALON_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 border border-charcoal/15 hover:border-champagne hover:text-champagne hover:-translate-y-0.5 transition-all duration-300 rounded-xl bg-white/60 flex items-center gap-2 text-xs"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a
                href={SALON_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 border border-charcoal/15 hover:border-champagne hover:text-champagne hover:-translate-y-0.5 transition-all duration-300 rounded-xl bg-white/60 flex items-center gap-1.5 text-xs font-num font-semibold"
                aria-label="Google Maps Reviews"
              >
                <Star className="w-4 h-4 fill-champagne text-champagne" />
                <span>{SALON_INFO.rating}★ ({SALON_INFO.reviewCount})</span>
              </a>
            </div>

            <div className="text-xs text-warm-gray font-light pt-2 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-champagne shrink-0" />
                <span>{SALON_INFO.address.shop}, LBS Marg, Kurla West</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-champagne shrink-0" />
                <span>{SALON_INFO.phone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Thin Champagne Line */}
        <div className="w-full h-[1px] bg-champagne/30 my-8" />

        {/* Bottom Copyright & Developer Attribution Line */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Copyright & Developer Credit */}
          <div className="space-y-1.5 text-center md:text-left">
            <p className="text-xs text-warm-gray font-light">
              © {new Date().getFullYear()} SALMAN HAIR STUDIO. ALL RIGHTS RESERVED.
            </p>
            
            {/* DEVELOPER CREDIT DIRECTIVE */}
            <p className="text-sm text-warm-gray font-light flex items-center justify-center md:justify-start gap-2 pt-1">
              <span>Developed by</span>
              <a
                href="https://affan.nexcoreinstitute.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading italic font-medium text-base sm:text-lg text-champagne hover:text-charcoal underline underline-offset-4 decoration-champagne hover:decoration-charcoal transition-all duration-300 tracking-wider"
              >
                Affan Khan
              </a>
            </p>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 text-lbl text-xs text-warm-gray hover:text-charcoal transition-colors uppercase tracking-[0.24em] cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4 text-champagne group-hover:-translate-y-1 transition-transform duration-300" />
          </button>

        </div>
      </Container>

      {/* STICKY MOBILE WHATSAPP FLOATING ACTION BUTTON */}
      <a
        href={SALON_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300 flex items-center justify-center cursor-pointer"
        aria-label="WhatsApp Concierge"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
}

export default memo(Footer);
