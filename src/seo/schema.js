import { SALON_INFO } from '@/constants/salonInfo';

export const hairStudioSchema = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: SALON_INFO.name,
  alternateName: SALON_INFO.hindiName,
  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
  '@id': 'https://salmanhairstudio.com',
  url: 'https://salmanhairstudio.com',
  telephone: SALON_INFO.rawPhone,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${SALON_INFO.address.shop}, ${SALON_INFO.address.landmark}`,
    addressLocality: 'Kurla West, Mumbai',
    addressRegion: SALON_INFO.address.state,
    postalCode: SALON_INFO.address.pincode,
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 19.0728,
    longitude: 72.8797,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    reviewCount: '360',
    bestRating: '5',
    worstRating: '1',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '23:00',
    },
  ],
  sameAs: [
    SALON_INFO.instagramUrl,
    SALON_INFO.googleMapsUrl,
  ],
};
