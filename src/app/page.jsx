import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import Hero from '@/components/hero/Hero';
import ScissorsSVGPoster from '@/components/common/ScissorsSVGPoster';

// Canonical vector fallback dimensioned to match ScissorSection height to eliminate CLS
function ScissorSectionFallback() {
  return (
    <section
      className="relative w-full h-[110vh] sm:h-[140vh] lg:h-[170vh] bg-transparent flex flex-col items-center justify-center select-none py-16"
      aria-hidden="true"
    >
      <ScissorsSVGPoster className="w-20 sm:w-28 h-32 sm:h-44 opacity-40 animate-pulse" />
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