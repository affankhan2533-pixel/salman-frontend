import PageTransition from '@/components/animations/PageTransition';
import Navbar from '@/components/layout/Navbar';
import BookingSection from '@/components/sections/BookingSection';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Book Appointment & Consultation | Salman Hair Studio Kurla West',
  description: 'Reserve your private 1-on-1 haircut, hair coloring, keratin smoothing, or facial treatment consultation at Salman Hair Studio in Kurla West, Mumbai.',
};

export default function BookingPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden bg-ivory text-charcoal flex flex-col relative pt-20 sm:pt-24">
        <Navbar />
        <BookingSection />
        <Footer />
      </main>
    </PageTransition>
  );
}
