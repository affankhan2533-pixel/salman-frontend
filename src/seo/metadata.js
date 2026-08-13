import { SALON_INFO } from '@/constants/salonInfo';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://salmanhairstudio.com';

export const defaultMetadata = {
  title: `${SALON_INFO.name} | Best Haircuts, Hair Styling & Treatment in Kurla West Mumbai`,
  description: `Book your appointment at ${SALON_INFO.name} in Kurla West, Mumbai. Rated ${SALON_INFO.rating}★ (${SALON_INFO.reviewCount}+ Google reviews). Professional hair styling, coloring, and face treatments by Salman and Farmaan Malik.`,
  keywords: [
    'Salman Hair Studio',
    'Salman Hair Studio Kurla',
    'Best Hair Salon Kurla West',
    'Salman Malik Hair Stylist',
    'Farmaan Malik Hair Studio',
    'Hair Cut Kurla West Mumbai',
    'Keratin Treatment Kurla',
    'Hair Color Kurla',
    'LBS Marg Salon',
  ],
  authors: [{ name: 'Salman Hair Studio' }],
  creator: 'Salman Hair Studio',
  publisher: 'Salman Hair Studio',
  metadataBase: new URL(baseUrl),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SALON_INFO.name} | Kurla West Mumbai`,
    description: `Premier Hair Salon in Kurla West. ${SALON_INFO.rating}★ Google Rated. Call ${SALON_INFO.phone}.`,
    url: baseUrl,
    siteName: 'Salman Hair Studio',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Salman Hair Studio Mumbai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salman Hair Studio Kurla West Mumbai',
    description: `Premier Hair Salon in Kurla West, Mumbai. ${SALON_INFO.rating}★ Google Rated.`,
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
