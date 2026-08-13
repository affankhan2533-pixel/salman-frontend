import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WORK_DATA } from '@/lib/workData';
import { Container } from '@/components/ui';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import { ArrowLeft, Clock, Sparkles, CheckCircle2, Quote, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Generate Static Params for all case studies
export async function generateStaticParams() {
  return Object.keys(WORK_DATA).map((slug) => ({
    slug,
  }));
}

// Generate Dynamic SEO Metadata & OpenGraph Tags
export async function generateMetadata({ params }) {
  const caseStudy = WORK_DATA[params.slug];
  if (!caseStudy) return { title: 'Case Study Not Found | Salman Hair Studio' };

  return {
    title: `${caseStudy.title} | Case Study | Salman Hair Studio`,
    description: `Read the transformation story of ${caseStudy.clientName} at Salman Hair Studio Mumbai.`,
    openGraph: {
      title: `${caseStudy.title} | Salman Hair Studio`,
      description: caseStudy.clientStory,
      images: [{ url: caseStudy.heroImage, width: 1200, height: 830, alt: caseStudy.title }],
      url: `https://salmanhairstudio.com/work/${caseStudy.slug}`,
      type: 'article',
    },
  };
}

export default function CaseStudyPage({ params }) {
  const caseStudy = WORK_DATA[params.slug];

  if (!caseStudy) {
    notFound();
  }

  // JSON-LD Structured Data Schema for Article & Case Study
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': caseStudy.title,
    'description': caseStudy.clientStory,
    'author': {
      '@type': 'Organization',
      'name': 'Salman Hair Studio',
    },
    'image': caseStudy.heroImage,
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
              href="/#gallery"
              className="inline-flex items-center gap-2 text-lbl text-xs text-warm-gray hover:text-charcoal uppercase tracking-[0.24em] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-champagne" />
              <span>Back to Editorial Gallery</span>
            </Link>

            <div className="space-y-3">
              <span className="text-lbl text-[11px] text-champagne tracking-[0.32em] uppercase font-semibold block">
                EDITORIAL CASE STUDY • {caseStudy.category}
              </span>
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-[76px] leading-[0.92] text-charcoal font-normal uppercase tracking-tight">
                {caseStudy.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 font-num text-xs sm:text-sm text-warm-gray font-medium border-t border-border-light">
              <div>
                <span className="text-lbl text-[10px] uppercase tracking-widest block text-warm-gray/60">CLIENT</span>
                <span className="text-charcoal font-semibold">{caseStudy.clientName}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-champagne hidden sm:block" />
              <div>
                <span className="text-lbl text-[10px] uppercase tracking-widest block text-warm-gray/60">TOTAL DURATION</span>
                <span className="text-champagne font-semibold">{caseStudy.timeTaken}</span>
              </div>
            </div>
          </div>

          {/* Full Width Hero Image */}
          <div className="mt-10 relative w-full aspect-[16/9] max-h-[640px] rounded-[32px] overflow-hidden border border-charcoal/10 shadow-[0_30px_70px_-15px_rgba(31,31,28,0.14)] bg-cream">
            <Image
              src={caseStudy.heroImage}
              alt={caseStudy.title}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover grayscale contrast-[1.05]"
            />
          </div>
        </Container>

        {/* 2. CLIENT STORY & HAIR DIAGNOSTIC ANALYSIS */}
        <Container size="editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Story Left */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-lbl text-[11px] tracking-[0.3em] text-champagne uppercase font-semibold block">
                01 • THE CLIENT VISION
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-charcoal uppercase font-normal">
                Client Story &amp; Goals
              </h2>
              <p className="font-body text-warm-gray font-light text-base sm:text-lg leading-relaxed">
                {caseStudy.clientStory}
              </p>
            </div>

            {/* Hair Analysis Right */}
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-md p-8 rounded-[28px] border border-charcoal/10 space-y-4">
              <span className="text-lbl text-[10px] text-champagne tracking-[0.28em] font-semibold uppercase block pb-3 border-b border-border-light">
                02 • HAIR DIAGNOSTIC ANALYSIS
              </span>

              <div className="space-y-3 text-xs sm:text-sm font-body">
                <div>
                  <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">POROSITY</span>
                  <span className="font-medium text-charcoal">{caseStudy.hairAnalysis.porosity}</span>
                </div>
                <div>
                  <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">DENSITY &amp; TEXTURE</span>
                  <span className="font-medium text-charcoal">{caseStudy.hairAnalysis.density}</span>
                </div>
                <div>
                  <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block mb-0.5">PROBLEMS IDENTIFIED</span>
                  <p className="font-light text-warm-gray leading-relaxed">{caseStudy.hairAnalysis.problems}</p>
                </div>
              </div>
            </div>

          </div>
        </Container>

        {/* 3. BEFORE / AFTER COMPARISON SLIDER */}
        <Container size="editorial">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-lbl text-[11px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
                INTERACTIVE COMPARISON
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl text-charcoal uppercase font-normal">
                Before &amp; After Transformation Reveal
              </h2>
            </div>

            <BeforeAfterSlider
              beforeImage={caseStudy.beforeImage}
              afterImage={caseStudy.afterImage}
              title={caseStudy.title}
            />
          </div>
        </Container>

        {/* 4. STEP BY STEP TRANSFORMATION PROCESS TIMELINE */}
        <Container size="editorial">
          <div className="space-y-10">
            <div className="space-y-2">
              <span className="text-lbl text-[11px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
                CHRONOLOGICAL EXECUTION
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-charcoal uppercase font-normal">
                Transformation Process
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {caseStudy.process.map((p) => (
                <div key={p.step} className="bg-white/70 p-6 rounded-2xl border border-charcoal/10 space-y-3">
                  <span className="font-heading text-3xl text-champagne italic font-normal block">
                    {p.step}
                  </span>
                  <h3 className="font-heading text-sm text-charcoal font-semibold uppercase">{p.title}</h3>
                  <p className="text-body text-xs text-warm-gray font-light leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* 5. PRODUCTS USED & CLIENT TESTIMONIAL */}
        <Container size="editorial">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Products Used */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-lbl text-[11px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
                COUTURE FORMULATIONS
              </span>
              <h2 className="font-heading text-3xl text-charcoal uppercase font-normal">
                Products &amp; Formulations Used
              </h2>
              <div className="flex flex-wrap gap-3">
                {caseStudy.productsUsed.map((prod) => (
                  <div key={prod} className="px-5 py-3 rounded-xl bg-white border border-champagne/40 text-xs font-inter font-medium text-charcoal shadow-sm flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-champagne" />
                    <span>{prod}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Quote Card */}
            <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-[28px] border border-champagne/40 shadow-[0_20px_50px_-15px_rgba(197,160,89,0.15)] space-y-4">
              <Quote className="w-8 h-8 text-champagne opacity-60" />
              <p className="font-heading text-xl sm:text-2xl text-charcoal italic leading-relaxed">
                "{caseStudy.testimonial}"
              </p>
              <div className="pt-2">
                <strong className="font-body text-sm font-semibold text-charcoal block">{caseStudy.clientName}</strong>
                <span className="text-lbl text-[10px] text-warm-gray uppercase tracking-widest block">Verified Atelier Client</span>
              </div>
            </div>

          </div>
        </Container>

        {/* 6. BOOK SIMILAR TRANSFORMATION CTA */}
        <Container size="editorial">
          <div className="bg-charcoal text-white p-10 sm:p-16 rounded-[32px] text-center space-y-6 shadow-2xl relative overflow-hidden">
            <span className="text-lbl text-xs text-champagne tracking-[0.3em] uppercase block font-semibold">
              BESPOKE APPOINTMENT
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-normal uppercase max-w-2xl mx-auto">
              Ready for a Similar Transformation?
            </h2>
            <p className="text-body text-warm-gray-light font-light text-sm sm:text-base max-w-md mx-auto">
              Book your private consultation at our Bandra West atelier.
            </p>
            <div className="pt-4">
              <Link href="/#booking">
                <button className="h-[54px] px-10 bg-champagne text-charcoal hover:bg-white transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-xl shadow-lg cursor-pointer">
                  Book Similar Transformation
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
