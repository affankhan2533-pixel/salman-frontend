import { Cormorant_Garamond, Inter, Manrope } from 'next/font/google';

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-manrope',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

