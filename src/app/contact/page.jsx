import PageTransition from '@/components/animations/PageTransition';
import Navbar from '@/components/layout/Navbar';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Contact & Studio Location | Salman Hair Studio Kurla West',
  description: 'Visit Salman Hair Studio opposite Kurla Court on LBS Marg, Kurla West. Call or WhatsApp Salman and Farmaan Malik for appointments.',
};

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden bg-ivory text-charcoal flex flex-col relative pt-20 sm:pt-24">
        <Navbar />
        <ContactSection />
        <Footer />
      </main>
    </PageTransition>
  );
}
