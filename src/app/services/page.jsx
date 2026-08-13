import ServicesClient from '@/components/services/ServicesClient';

export const metadata = {
  title: 'Haute Coiffure Services | Salman Hair Studio Kurla West Mumbai',
  description: 'Explore our curated menu of bespoke hair sculpting, couture balayage, silk keratin smoothing, and botanical scalp treatments at Salman Hair Studio Kurla West, Mumbai.',
  openGraph: {
    title: 'Haute Coiffure Services | Salman Hair Studio',
    description: 'Precision, Tailored To You. Discover bespoke hair sculpting, balayage, and silk keratin infusions.',
    images: [{ url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200', width: 1200, height: 800, alt: 'Salman Hair Studio Services' }],
    url: 'https://salmanhairstudio.com/services',
    type: 'website',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
