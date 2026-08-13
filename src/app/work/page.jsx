'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageTransition from '@/components/animations/PageTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui';
import { WORK_ITEMS } from '@/lib/workData';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SALON_INFO } from '@/constants/salonInfo';

export default function WorkPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full bg-[#F7F4EE] text-charcoal flex flex-col relative select-none">
        <Navbar />

        {/* Hero Banner */}
        <section className="pt-36 pb-16 sm:pt-44 sm:pb-24 border-b border-border-light relative overflow-hidden">
          <Container size="editorial">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3 text-lbl text-[11px] tracking-[0.32em] text-warm-gray uppercase font-medium">
                <span className="w-1.5 h-1.5 bg-champagne rounded-full" />
                <span>GALLERY &amp; WORK ARCHIVE</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal uppercase tracking-tight">
                Our Work &amp; Hair Transformations
              </h1>
              <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed max-w-xl">
                Explore real transformations, haircut styles, balayage color craft, and grooming work from {SALON_INFO.name} in Kurla West.
              </p>
            </div>
          </Container>
        </section>

        {/* Work Grid */}
        <section className="py-20 sm:py-28">
          <Container size="editorial">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {WORK_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={`/work/${item.slug}`}
                  className="group bg-white rounded-3xl border border-charcoal/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-champagne/40 transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
                    <Image
                      src={item.heroImage}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-champagne tracking-widest uppercase font-semibold border border-charcoal/10">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-heading text-xl text-charcoal group-hover:text-champagne transition-colors font-medium">
                      {item.title}
                    </h3>
                    <p className="text-body text-xs text-warm-gray line-clamp-2 leading-relaxed">
                      {item.excerpt || item.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs text-champagne font-medium">
                      <span>View Transformation</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <Footer />
      </main>
    </PageTransition>
  );
}
