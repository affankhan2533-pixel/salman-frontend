'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import { SALON_INFO } from '@/constants/salonInfo';

function HomeCTA() {
  return (
    <section className="relative z-30 py-20 lg:py-28 bg-[#F7F4EE] border-t border-border-light text-center select-none overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1F1F1C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      <Container size="editorial">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-champagne rounded-full animate-pulse" />
            <span className="text-lbl text-xs tracking-[0.32em] text-champagne uppercase font-medium">
              RESERVE YOUR BESPOKE EXPERIENCE
            </span>
          </div>

          <h2 className="font-heading text-4xl sm:text-6xl lg:text-[68px] text-charcoal font-normal uppercase leading-[0.94] tracking-tight">
            Ready to Experience <br />
            <span className="italic text-champagne">Haute Coiffure?</span>
          </h2>

          <p className="text-warm-gray font-light text-base lg:text-lg max-w-lg mx-auto leading-relaxed">
            Book your private 1-on-1 consultation today and discover Kurla West’s premier hair atelier with Salman and Farmaan Malik.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <button className="h-[54px] px-10 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer">
                <Calendar className="w-4 h-4 text-champagne group-hover:text-charcoal" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <a
              href={SALON_INFO.whatsappUrl}
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
  );
}

export default memo(HomeCTA);
