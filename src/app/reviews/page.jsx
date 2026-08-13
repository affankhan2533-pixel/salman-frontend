import PageTransition from '@/components/animations/PageTransition';
import Navbar from '@/components/layout/Navbar';
import ReviewsSection from '@/components/sections/ReviewsSection';
import HomeCTA from '@/components/sections/HomeCTA';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Client Reviews & Endorsements | Salman Hair Studio Kurla West',
  description: 'Read authentic 5-star Google reviews and endorsements from patrons of Salman Hair Studio in Kurla West, Mumbai.',
};

export default function ReviewsPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden bg-ivory text-charcoal flex flex-col relative pt-20 sm:pt-24">
        <Navbar />
        <ReviewsSection />
        <HomeCTA />
        <Footer />
      </main>
    </PageTransition>
  );
}
