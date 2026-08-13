'use client';

import { gsap, ScrollTrigger } from '@/lib/gsap';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || 'ontouchstart' in window);

export function revealHero(element, options = {}) {
  if (!element || prefersReducedMotion()) return;
  const duration = isMobile() ? 0.6 : 1.1;
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.97, y: 15 },
    {
      opacity: 1,
      scale: 1.0,
      y: 0,
      duration,
      ease: 'power3.out',
      delay: options.delay || 0.1,
    }
  );
}

export function revealAbout(imageRef, textRef, options = {}) {
  if (prefersReducedMotion()) return;
  const duration = isMobile() ? 0.6 : 1.0;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: imageRef.current || imageRef,
      start: 'top 85%',
      once: true,
    },
    defaults: { ease: 'power3.out' },
  });

  if (imageRef.current) {
    tl.fromTo(
      imageRef.current,
      { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: duration * 1.1, ease: 'power3.inOut' }
    );
  }

  if (textRef && textRef.current) {
    tl.fromTo(
      textRef.current.children || textRef.current,
      { opacity: 0, y: isMobile() ? 12 : 24 },
      { opacity: 1, y: 0, stagger: 0.12, duration },
      '-=0.5'
    );
  }

  return tl;
}

export function revealServices(containerRef, itemSelector = '.service-card', options = {}) {
  if (!containerRef || !containerRef.current || prefersReducedMotion()) return;
  const items = containerRef.current.querySelectorAll(itemSelector);
  if (!items.length) return;

  const duration = isMobile() ? 0.5 : 0.9;
  return gsap.fromTo(
    items,
    { opacity: 0, y: isMobile() ? 14 : 26 },
    {
      opacity: 1,
      y: 0,
      duration,
      ease: 'power3.out',
      stagger: isMobile() ? 0.08 : 0.12,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
      },
    }
  );
}

export function revealTransformations(frameRef, options = {}) {
  if (!frameRef || !frameRef.current || prefersReducedMotion()) return;
  const duration = isMobile() ? 0.6 : 1.1;
  return gsap.fromTo(
    frameRef.current,
    { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      duration,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: frameRef.current,
        start: 'top 85%',
        once: true,
      },
    }
  );
}

export function revealGallery(containerRef, itemSelector = '.gallery-card', options = {}) {
  if (!containerRef || !containerRef.current || prefersReducedMotion()) return;
  const items = containerRef.current.querySelectorAll(itemSelector);
  if (!items.length) return;

  const duration = isMobile() ? 0.5 : 0.95;
  return gsap.fromTo(
    items,
    { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      duration,
      ease: 'power3.inOut',
      stagger: isMobile() ? 0.08 : 0.12,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
      },
    }
  );
}

export function revealReviews(containerRef, itemSelector = '.testimonial-card', options = {}) {
  if (!containerRef || !containerRef.current || prefersReducedMotion()) return;
  const items = containerRef.current.querySelectorAll(itemSelector);
  if (!items.length) return;

  const duration = isMobile() ? 0.5 : 0.85;
  return gsap.fromTo(
    items,
    { opacity: 0, y: isMobile() ? 15 : 28 },
    {
      opacity: 1,
      y: 0,
      duration,
      ease: 'power3.out',
      stagger: isMobile() ? 0.08 : 0.12,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
      },
    }
  );
}

export function revealBooking(elementRef, options = {}) {
  if (!elementRef || !elementRef.current || prefersReducedMotion()) return;
  const duration = isMobile() ? 0.5 : 0.9;
  return gsap.fromTo(
    elementRef.current,
    { opacity: 0, scale: isMobile() ? 1.0 : 0.98, y: isMobile() ? 12 : 20 },
    {
      opacity: 1,
      scale: 1.0,
      y: 0,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elementRef.current,
        start: 'top 85%',
        once: true,
      },
    }
  );
}

export function revealFooter(footerRef, options = {}) {
  if (!footerRef || !footerRef.current || prefersReducedMotion()) return;
  return gsap.fromTo(
    footerRef.current,
    { opacity: 0 },
    {
      opacity: 1,
      duration: isMobile() ? 0.5 : 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 92%',
        once: true,
      },
    }
  );
}

export function animateSectionHeader(headerRef, options = {}) {
  if (!headerRef || !headerRef.current || prefersReducedMotion()) return;
  return gsap.fromTo(
    headerRef.current.children,
    { opacity: 0, y: isMobile() ? 12 : 22 },
    {
      opacity: 1,
      y: 0,
      duration: isMobile() ? 0.5 : 0.9,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top 88%',
        once: true,
      },
    }
  );
}
