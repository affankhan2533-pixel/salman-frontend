const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, 'src/**/*.{js,jsx,ts,tsx}'),
    path.join(__dirname, 'src/app/**/*.{js,jsx,ts,tsx}'),
    path.join(__dirname, 'src/components/**/*.{js,jsx,ts,tsx}'),
    path.join(__dirname, 'src/providers/**/*.{js,jsx,ts,tsx}'),
    path.join(__dirname, 'src/hooks/**/*.{js,jsx,ts,tsx}'),
    path.join(__dirname, 'src/lib/**/*.{js,jsx,ts,tsx}'),
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        // Global Luxury Design System Palette
        bg: '#F7F4EF',
        surface: '#F2EEE7',
        card: '#FFFFFF',
        primary: '#1F1F1F',
        secondary: '#66665F',
        accent: '#C8A76E',
        border: '#E4DDD2',

        // Legacy compatibility mappings
        ivory: {
          DEFAULT: '#F7F4EF',
          light: '#FAF8F5',
        },
        cream: {
          DEFAULT: '#F2EEE7',
          soft: '#EAE5DC',
        },
        white: '#FFFFFF',
        charcoal: {
          DEFAULT: '#1F1F1F',
          muted: '#2A2A26',
        },
        'warm-gray': {
          DEFAULT: '#66665F',
          light: '#8C8C83',
        },
        champagne: {
          DEFAULT: '#C8A76E',
          hover: '#B5945B',
        },
        'border-light': '#E4DDD2',
      },
      fontFamily: {
        heading: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        num: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
      },
      fontSize: {
        'hero': ['80px', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'section': ['52px', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
        'subheading': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body-editorial': ['18px', { lineHeight: '1.6' }],
        'caption': ['14px', { lineHeight: '1.5' }],
      },
      spacing: {
        'sp-8': '8px',
        'sp-16': '16px',
        'sp-24': '24px',
        'sp-40': '40px',
        'sp-64': '64px',
        'sp-96': '96px',
        'sp-140': '140px',
      },
      maxWidth: {
        grid: '1440px',
      },
      borderRadius: {
        btn: '14px',
        card: '24px',
        img: '28px',
        '14': '14px',
        '24': '24px',
        '28': '28px',
      },
      height: {
        btn: '56px',
      },
      boxShadow: {
        'luxury-subtle': '0 2px 12px rgba(31, 31, 31, 0.03)',
        'luxury-hover': '0 10px 30px rgba(31, 31, 31, 0.06)',
        'micro': '0 4px 14px rgba(31, 31, 31, 0.04)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        editorial: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      transitionDuration: {
        fast: '400ms',
        medium: '800ms',
        slow: '1200ms',
      },
    },
  },
  plugins: [],
};
