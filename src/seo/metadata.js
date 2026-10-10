import { SALON_INFO } from '@/constants/salonInfo';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://salmanhairstudio.com';
const baseUrl = rawSiteUrl.startsWith('http://') || rawSiteUrl.startsWith('https://')
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

let metadataBaseUrl;
try {
  metadataBaseUrl = new URL(baseUrl);
} catch {
  metadataBaseUrl = new URL('https://salmanhairstudio.com');
}

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
  metadataBase: metadataBaseUrl,
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
        url: '/images/branding/image.png',
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
    images: ['/images/branding/image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
