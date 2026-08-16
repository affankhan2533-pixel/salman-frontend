import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVICES_DATA } from '@/lib/servicesData';
import { Container } from '@/components/ui';
import { CheckCircle2, Clock, Calendar, Sparkles, ChevronRight, HelpCircle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Generate Static Params for all 6 Luxury Services
export async function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((slug) => ({
    slug,
  }));
}

// Generate Dynamic SEO Metadata & OpenGraph Tags
export async function generateMetadata({ params }) {
  const service = SERVICES_DATA[params.slug];
  if (!service) return { title: 'Service Not Found | Salman Hair Studio' };

  return {
    title: `${service.title} | Salman Hair Studio Mumbai`,
    description: `${service.tagline} Book a private consultation at Salman Hair Studio Bandra West.`,
    openGraph: {
      title: `${service.title} | Salman Hair Studio`,
      description: service.tagline,
      images: [{ url: service.heroImage, width: 1200, height: 830, alt: service.title }],
      url: `https://salmanhairstudio.com/services/${service.slug}`,
      type: 'website',
    },
  };
}

export default function ServiceDetailPage({ params }) {
  const service = SERVICES_DATA[params.slug];

  if (!service) {
    notFound();
  }

  // JSON-LD Structured Data Schema for LocalBusiness & Service
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.title,
    'provider': {
      '@type': 'HairSalon',
      'name': 'Salman Hair Studio',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Waterfield Road',
        'addressLocality': 'Bandra West',
        'addressRegion': 'Mumbai',
        'postalCode': '400050',
        'addressCountry': 'IN',
      },
    },
    'description': service.tagline,
    'offers': {
      '@type': 'Offer',
      'price': service.price.replace(/[^0-9]/g, ''),
      'priceCurrency': 'INR',
    },
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-charcoal select-none">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="pt-28 sm:pt-36 pb-24 space-y-20 sm:space-y-28">
        
        {/* 1. LUXURY HERO */}
        <Container size="editorial">
          <div className="space-y-6 max-w-4xl">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-lbl text-xs text-warm-gray hover:text-charcoal uppercase tracking-[0.24em] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-champagne" />
              <span>Back to Atelier Services</span>
            </Link>

            <div className="space-y-3">
              <span className="text-lbl text-[11px] text-champagne tracking-[0.32em] uppercase font-semibold block">
                {service.category}
              </span>
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal font-normal uppercase tracking-tight">
                {service.title}
              </h1>
            </div>

            <p className="font-body text-warm-gray font-light text-lg sm:text-xl leading-relaxed max-w-2xl">
              {service.tagline}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href={`/booking?service=${service.slug}`}>
                <button className="h-[54px] px-8 bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-[14px] shadow-md hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer">
                  <Calendar className="w-4 h-4 text-champagne group-hover:text-charcoal" />
                  <span>Reserve Private Consultation</span>
                </button>
              </Link>

              <div className="flex items-center gap-4 px-6 py-3 rounded-[14px] bg-white/70 border border-charcoal/10 text-xs font-num font-semibold">
                <span>Duration: {service.duration}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
                <span className="text-champagne">{service.price}</span>
              </div>
            </div>
          </div>

          {/* Large Hero Portrait Image */}
          <div className="mt-12 relative w-full aspect-[16/9] max-h-[640px] rounded-[32px] overflow-hidden border border-charcoal/10 shadow-[0_30px_70px_-15px_rgba(31,31,28,0.14)] bg-cream">
            <Image
              src={service.heroImage}
              alt={service.title}
              fill
              priority
              sizes="100vw"
              className="object-cover grayscale contrast-[1.05]"
            />
          </div>
        </Container>

        {/* 2. OVERVIEW (WHAT IT INCLUDES, WHO IT IS FOR, EXPECTED RESULTS) */}
        <Container size="editorial">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[24px] border border-charcoal/10 space-y-3">
              <span className="text-lbl text-[10px] text-champagne tracking-[0.25em] uppercase font-semibold block">
                01 • WHAT IT INCLUDES
              </span>
              <p className="font-body text-warm-gray font-light text-sm sm:text-base leading-relaxed">
                {service.overview.includes}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[24px] border border-charcoal/10 space-y-3">
              <span className="text-lbl text-[10px] text-champagne tracking-[0.25em] uppercase font-semibold block">
                02 • WHO IT IS FOR
              </span>
              <p className="font-body text-warm-gray font-light text-sm sm:text-base leading-relaxed">
                {service.overview.forWho}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[24px] border border-charcoal/10 space-y-3">
              <span className="text-lbl text-[10px] text-champagne tracking-[0.25em] uppercase font-semibold block">
                03 • EXPECTED RESULTS
              </span>
              <p className="font-body text-warm-gray font-light text-sm sm:text-base leading-relaxed">
                {service.overview.expectedResults}
              </p>
            </div>
          </div>
        </Container>

        {/* 3. STEP BY STEP PROCESS TIMELINE */}
        <Container size="editorial">
          <div className="space-y-10">
            <div className="space-y-2">
              <span className="text-lbl text-[11px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
                HAUTE METHODOLOGY
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-charcoal uppercase font-normal">
                Step by Step Atelier Process
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
              {service.process.map((step) => (
                <div
                  key={step.step}
                  className="bg-white/60 p-6 rounded-2xl border border-charcoal/10 space-y-4 hover:border-champagne/50 transition-colors"
                >
                  <span className="font-heading text-3xl text-champagne italic font-normal block">
                    {step.step}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-base text-charcoal font-semibold uppercase">
                      {step.title}
                    </h3>
                    <p className="text-body text-xs text-warm-gray font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* 4. BENEFITS & KEY SPECIFICATIONS */}
        <Container size="editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="text-lbl text-[11px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
                  DISTINCT ADVANTAGES
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl text-charcoal uppercase font-normal">
                  Key Benefits &amp; Distinction
                </h2>
              </div>

              <div className="space-y-4">
                {service.benefits.map((b) => (
                  <div key={b.title} className="p-6 bg-white/70 rounded-2xl border border-charcoal/10 flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-champagne mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-heading text-lg text-charcoal font-medium">{b.title}</h3>
                      <p className="text-body text-xs sm:text-sm text-warm-gray font-light leading-relaxed mt-1">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Card */}
            <div className="lg:col-span-5 bg-white p-8 rounded-[28px] border border-champagne/40 shadow-[0_20px_50px_-15px_rgba(197,160,89,0.15)] space-y-6">
              <span className="text-lbl text-[10px] text-champagne tracking-[0.28em] font-semibold uppercase block pb-3 border-b border-border-light">
                ATELIER SPECIFICATIONS
              </span>

              <div className="space-y-4 text-sm font-body">
                <div>
                  <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block">DURATION</span>
                  <span className="font-num text-base font-bold text-charcoal">{service.duration}</span>
                </div>
                <div>
                  <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block">INVESTMENT</span>
                  <span className="font-num text-base font-bold text-champagne">{service.price}</span>
                </div>
                <div>
                  <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block">MAINTENANCE CYCLE</span>
                  <span className="font-body text-sm font-medium text-charcoal">{service.maintenance}</span>
                </div>
                <div>
                  <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block">SUITABLE HAIR TYPES</span>
                  <span className="font-body text-sm font-medium text-charcoal">{service.suitableFor}</span>
                </div>
              </div>
            </div>

          </div>
        </Container>

        {/* 5. SERVICE SPECIFIC GALLERY */}
        <Container size="editorial">
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-lbl text-[11px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
                PORTFOLIO ARCHIVE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-charcoal uppercase font-normal">
                {service.title} Gallery
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {service.gallery.map((imgUrl, i) => (
                <div key={i} className="relative aspect-[4/5] rounded-[24px] overflow-hidden border border-charcoal/10 shadow-md">
                  <Image src={imgUrl} alt={`${service.title} ${i}`} fill sizes="33vw" className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* 6. FAQ ACCORDION */}
        <Container size="editorial">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-2">
              <span className="text-lbl text-[11px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
                CLIENT INQUIRIES
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-charcoal uppercase font-normal">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq) => (
                <div key={faq.q} className="bg-white/80 p-6 rounded-2xl border border-charcoal/10 space-y-2">
                  <h3 className="font-heading text-lg text-charcoal font-medium flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-champagne shrink-0" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-body text-xs sm:text-sm text-warm-gray font-light leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* 7. BOOK THIS SERVICE CTA */}
        <Container size="editorial">
          <div className="bg-charcoal text-white p-10 sm:p-16 rounded-[32px] text-center space-y-6 shadow-2xl relative overflow-hidden">
            <span className="text-lbl text-xs text-champagne tracking-[0.3em] uppercase block font-semibold">
              RESERVE YOUR APPOINTMENT
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-normal uppercase max-w-2xl mx-auto">
              Ready for {service.title}?
            </h2>
            <p className="text-body text-warm-gray-light font-light text-sm sm:text-base max-w-md mx-auto">
              Book your private consultation at our Bandra West atelier.
            </p>
            <div className="pt-4">
              <Link href={`/booking?service=${service.slug}`}>
                <button className="h-[54px] px-10 bg-champagne text-charcoal hover:bg-white transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-lg cursor-pointer">
                  Book This Service
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
