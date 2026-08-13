import dynamic from 'next/dynamic';
import PageTransition from '@/components/animations/PageTransition';
import Navbar from '@/components/layout/Navbar';
import GallerySection from '@/components/sections/GallerySection';
import HomeCTA from '@/components/sections/HomeCTA';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Gallery & Portfolio | Salman Hair Studio Kurla West',
  description: 'Explore curated hair transformations, precision haircuts, couture balayage, and styling portfolio from Salman Hair Studio in Kurla West, Mumbai.',
};

export default function GalleryPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden bg-ivory text-charcoal flex flex-col relative pt-20 sm:pt-24">
        <Navbar />
        <GallerySection />
        <HomeCTA />
        <Footer />
      </main>
    </PageTransition>
  );
}
