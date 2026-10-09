import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import Hero from '@/components/hero/Hero';

// Visible static vector fallback so shears silhouette is immediately visible on first load
function ScissorSectionFallback() {
  return (
    <section className="relative w-full h-[60vh] sm:h-[80vh] bg-transparent flex flex-col items-center justify-center select-none py-16" aria-hidden="true">
      <svg
        viewBox="0 0 120 200"
        className="w-20 sm:w-28 h-32 sm:h-44 opacity-40 text-champagne animate-pulse"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M58 100 L52 28 Q60 4 60 4 Q68 4 68 28 L62 100" fill="#f8fafc" stroke="#C8A76E" strokeWidth="0.5" />
        <path d="M62 100 L68 28 Q60 4 60 4 Q52 4 52 28 L58 100" fill="#f0f4f8" stroke="#C8A76E" strokeWidth="0.3" />
        <path d="M40 120 Q42 108 58 100" stroke="#d4af37" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="134" r="12" stroke="#d4af37" strokeWidth="3" fill="none" />
        <path d="M80 120 Q78 108 62 100" stroke="#d4af37" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="88" cy="134" r="11" stroke="#d4af37" strokeWidth="3" fill="none" />
        <circle cx="60" cy="100" r="5" fill="#d4af37" />
      </svg>
      <span className="mt-4 text-[10px] tracking-[0.26em] text-warm-gray uppercase font-medium">
        PRECISION CRAFT • ATELIER SHEARS
      </span>
    </section>
  );
}

// ScissorSection is heavy (GSAP + Three.js setup) — load dynamically with visible fallback
const ScissorSection = dynamic(() => import('@/components/sections/ScissorSection'), {
  ssr: false,
  loading: () => <ScissorSectionFallback />,
});

// Below-the-fold sections — code-split for performance
const AboutSection = dynamic(() => import('@/components/sections/AboutSection'));
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'));
const StudioVideoSection = dynamic(() => import('@/components/sections/StudioVideoSection'));
const HomeCTA = dynamic(() => import('@/components/sections/HomeCTA'));
const Footer = dynamic(() => import('@/components/layout/Footer'));

// Minimal skeleton so stale-chunk 404s never leave blank white space
function SectionSkeleton() {
  return <div className="w-full py-24 bg-ivory" aria-hidden="true" />;
}

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden bg-ivory text-charcoal flex flex-col relative">
        {/* 1. Hero Section — statically imported, renders immediately */}
        <Hero />

        {/* 2. 3D Cinematic Scissor Section — dynamically loaded with visible vector fallback */}
        <Suspense fallback={<ScissorSectionFallback />}>
          <ScissorSection />
        </Suspense>

        {/* 3. About Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection />
        </Suspense>

        {/* 4. Services Preview */}
        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection />
        </Suspense>

        {/* 5. Atelier Video Reel Showcase */}
        <Suspense fallback={<SectionSkeleton />}>
          <StudioVideoSection />
        </Suspense>

        {/* 6. Final Home CTA */}
        <Suspense fallback={null}>
          <HomeCTA />
        </Suspense>

        {/* 7. Atelier Footer */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>
    </PageTransition>
  );
}


