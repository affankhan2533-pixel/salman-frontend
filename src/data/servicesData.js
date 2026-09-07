/**
 * Salman Hair Studio — Services Data
 * Single source of truth for all 20 services.
 *
 * Dedicated, service-specific photography mapping:
 * - 100% Gender Accurate: MEN services show ONLY male clients/models.
 *                         WOMEN services show ONLY female clients/models.
 * - Shows the actual service being performed (hair cutting, beard grooming, colouring,
 *   scalp spa, hair botox/smoothing, facials, de-tan).
 * - High resolution local WebP photographs in /images/services/
 * - Single source of truth shared between Homepage and /services page.
 *
 * Price rules:
 *  - hasFixedPrice: false → show pricingNote only (no ₹ amount)
 *  - hasFixedPrice: true  → show "Starting from ₹{price}"
 *  - pricingNote: non-null → show as supplementary italic note below price
 */

export const SERVICES = [
  // ─── MALE · HAIR (5 Services) ──────────────────────────────────────────────

  {
    id: 'male-haircut',
    gender: 'male',
    category: 'hair',
    name: 'Hair Cut',
    hasFixedPrice: true,
    price: '₹500',
    pricingNote: null,
    icon: 'scissors',
    image: '/images/services/male-haircut.webp',
  },
  {
    id: 'male-beard',
    gender: 'male',
    category: 'hair',
    name: 'Beard Set Up',
    hasFixedPrice: true,
    price: '₹200',
    pricingNote: null,
    icon: 'razor',
    image: '/images/services/male-beard.webp',
  },
  {
    id: 'male-colour',
    gender: 'male',
    category: 'hair',
    name: 'Hair Colour for Men',
    hasFixedPrice: true,
    price: '₹1,500',
    pricingNote: null,
    icon: 'brush',
    image: '/images/services/male-colour.webp',
  },
  {
    id: 'male-nanoplastia',
    gender: 'male',
    category: 'hair',
    name: 'Nano Plastia Hair Botox',
    hasFixedPrice: false,
    price: null,
    pricingNote: 'Price depends on hair length',
    icon: 'drop',
    image: '/images/services/male-nanoplastia.webp',
  },
  {
    id: 'male-spa',
    gender: 'male',
    category: 'hair',
    name: 'Hair Spa',
    hasFixedPrice: true,
    price: '₹1,000',
    pricingNote: null,
    icon: 'leaf',
    image: '/images/services/male-spa.webp',
  },

  // ─── MALE · FACE (4 Services) ──────────────────────────────────────────────

  {
    id: 'male-oxy-facial',
    gender: 'male',
    category: 'face',
    name: 'Oxy Facial',
    hasFixedPrice: true,
    price: '₹2,000',
    pricingNote: null,
    icon: 'sparkle',
    image: '/images/services/male-oxy-facial.webp',
  },
  {
    id: 'male-lotus-facial',
    gender: 'male',
    category: 'face',
    name: 'Lotus Facial',
    hasFixedPrice: true,
    price: '₹2,000',
    pricingNote: null,
    icon: 'flower',
    image: '/images/services/male-lotus-facial.webp',
  },
  {
    id: 'male-o3-facial',
    gender: 'male',
    category: 'face',
    name: 'O3+ Facial',
    hasFixedPrice: true,
    price: '₹3,000',
    pricingNote: null,
    icon: 'circle',
    image: '/images/services/male-o3-facial.webp',
  },
  {
    id: 'male-detan',
    gender: 'male',
    category: 'face',
    name: 'Face De-Tan',
    hasFixedPrice: true,
    price: '₹1,000',
    pricingNote: null,
    icon: 'sun',
    image: '/images/services/male-detan.webp',
  },

  // ─── FEMALE · HAIR (7 Services) ────────────────────────────────────────────

  {
    id: 'female-haircut',
    gender: 'female',
    category: 'hair',
    name: 'Female Hair Cut',
    hasFixedPrice: true,
    price: '₹1,000',
    pricingNote: null,
    icon: 'scissors',
    image: '/images/services/female-haircut.webp',
  },
  {
    id: 'female-global-colour',
    gender: 'female',
    category: 'hair',
    name: 'Global Hair Colour',
    hasFixedPrice: true,
    price: '₹5,000',
    pricingNote: 'Based on medium hair length',
    icon: 'brush',
    image: '/images/services/female-global-colour.webp',
  },
  {
    id: 'female-balayage',
    gender: 'female',
    category: 'hair',
    name: 'Balayage Hair Colour',
    hasFixedPrice: true,
    price: '₹10,000',
    pricingNote: null,
    icon: 'brush',
    image: '/images/services/female-balayage.webp',
  },
  {
    id: 'female-highlight',
    gender: 'female',
    category: 'hair',
    name: 'Hair Colour Highlight',
    hasFixedPrice: true,
    price: '₹5,000',
    pricingNote: null,
    icon: 'brush',
    image: '/images/services/female-highlight.webp',
  },
  {
    id: 'female-spa',
    gender: 'female',
    category: 'hair',
    name: 'Hair Spa',
    hasFixedPrice: true,
    price: '₹1,500',
    pricingNote: null,
    icon: 'leaf',
    image: '/images/services/female-spa.webp',
  },
  {
    id: 'female-nanoplastia',
    gender: 'female',
    category: 'hair',
    name: 'Nano Plastia Hair Treatment',
    hasFixedPrice: true,
    price: '₹5,000',
    pricingNote: null,
    icon: 'drop',
    image: '/images/services/female-nanoplastia.webp',
  },
  {
    id: 'female-botox',
    gender: 'female',
    category: 'hair',
    name: 'Hair Botox Treatment',
    hasFixedPrice: true,
    price: '₹5,000',
    pricingNote: null,
    icon: 'drop',
    image: '/images/services/female-botox.webp',
  },

  // ─── FEMALE · FACE (4 Services) ────────────────────────────────────────────

  {
    id: 'female-oxy-facial',
    gender: 'female',
    category: 'face',
    name: 'Oxy Facial',
    hasFixedPrice: true,
    price: '₹2,000',
    pricingNote: null,
    icon: 'sparkle',
    image: '/images/services/female-oxy-facial.webp',
  },
  {
    id: 'female-lotus-facial',
    gender: 'female',
    category: 'face',
    name: 'Lotus Facial',
    hasFixedPrice: true,
    price: '₹2,000',
    pricingNote: null,
    icon: 'flower',
    image: '/images/services/female-lotus-facial.webp',
  },
  {
    id: 'female-o3-facial',
    gender: 'female',
    category: 'face',
    name: 'O3+ Facial',
    hasFixedPrice: true,
    price: '₹3,000',
    pricingNote: null,
    icon: 'circle',
    image: '/images/services/female-o3-facial.webp',
  },
  {
    id: 'female-detan',
    gender: 'female',
    category: 'face',
    name: 'Face De-Tan',
    hasFixedPrice: true,
    price: '₹1,000',
    pricingNote: null,
    icon: 'sun',
    image: '/images/services/female-detan.webp',
  },
];

/**
 * Helper: filter services by gender and category
 * Keeps Male Hair (5), Male Face (4), Female Hair (7), Female Face (4)
 * cleanly separated into their exact respective sub-categories.
 */
export function getServices({ gender, category }) {
  return SERVICES.filter(
    (s) => s.gender === gender && s.category === category
  );
}
