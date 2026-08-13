// GSAP & Motion System Constants - Global Luxury Design System

export const GSAP_TIMINGS = {
  fast: 0.4,
  medium: 0.8,
  slow: 1.2,
};

export const GSAP_EASING = 'power3.out';

export const MOTION_DURATIONS = {
  fast: 0.4,
  medium: 0.8,
  slow: 1.2,
  hover: 0.4,
  default: 0.8,
  luxury: 0.8,
  slowest: 1.2,
};

export const MOTION_EASINGS = {
  // Cubic-bezier equivalent of GSAP power3.out (no bounce, premium smooth deceleration)
  luxury: [0.215, 0.61, 0.355, 1],
  editorial: [0.215, 0.61, 0.355, 1],
  smooth: [0.215, 0.61, 0.355, 1],
  easeOutQuad: [0.25, 0.46, 0.45, 0.94],
};

export const GSAP_EASINGS = {
  luxury: 'power3.out',
  editorial: 'power3.out',
  smooth: 'power3.out',
};

// Subtle non-bounce hover motion variants for Framer Motion
export const HOVER_LIFT_VARIANT = {
  rest: { y: 0, shadow: '0 2px 12px rgba(31, 31, 31, 0.03)' },
  hover: { y: -2, shadow: '0 10px 30px rgba(31, 31, 31, 0.06)', transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } },
};
