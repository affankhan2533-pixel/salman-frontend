import dynamic from 'next/dynamic';
import PageTransition from '@/components/animations/PageTransition';
import Hero from '@/components/hero/Hero';
import ScissorSection from '@/components/sections/ScissorSection';

// Dynamically import below-the-fold sections for code splitting & memory optimization
const AboutSection = dynamic(() => import('@/components/sections/AboutSection'));
const StudioVideoSection = dynamic(() => import('@/components/sections/StudioVideoSection'));
const HomeCTA = dynamic(() => import('@/components/sections/HomeCTA'));
const Footer = dynamic(() => import('@/components/layout/Footer'));

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden bg-ivory text-charcoal flex flex-col relative">
        {/* 1. Hero Section (Clean: Headline, Tagline, CTAs, Editorial Portrait) */}
        <Hero />

        {/* 2. 3D R3F Cinematic Scissor Section */}
        <ScissorSection />

        {/* 3. Our Story & Studio Atelier Heritage Section */}
        <AboutSection />

        {/* 4. Atelier Video Reel Showcase (Looped & Side-Cropped) */}
        <StudioVideoSection />

        {/* 5. Final Home CTA */}
        <HomeCTA />

        {/* 6. Atelier Footer */}
        <Footer />
      </main>
    </PageTransition>
  );
}

