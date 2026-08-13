'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { gsap } from '@/lib/gsap';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Booking', href: '/booking' },
  { label: 'Contact', href: '/contact' },
];

function Navbar() {
  const pathname = usePathname();

  // Do not render website Navbar on Admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navRef = useRef(null);
  const scrolledRef = useRef(false);

  // Body Scroll Lock & Restoration for Mobile Menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Smooth scroll to #about on Home page route load/change
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash === '#about') {
      const timer = setTimeout(() => {
        const el = document.getElementById('about');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.2 }
      );
    }

    const handleScroll = () => {
      const pastThreshold = window.scrollY > 20;
      if (pastThreshold !== scrolledRef.current) {
        scrolledRef.current = pastThreshold;
        setIsScrolled(pastThreshold);
      }
    };

    // IntersectionObserver for Home page About section
    const aboutEl = document.getElementById('about');
    let observer = null;
    if (aboutEl && pathname === '/') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection('about');
            } else {
              setActiveSection('');
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(aboutEl);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';

    if (href === '/#about' && pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-3 left-3 right-3 md:top-5 md:left-6 md:right-6 z-[100] transition-all duration-500 ease-luxury will-change-transform"
      >
        <div
          className={clsx(
            'w-full max-w-[1720px] mx-auto rounded-2xl transition-all duration-500 ease-luxury px-6 md:px-10 flex items-center justify-between',
            'backdrop-blur-xl border transition-shadow',
            isScrolled
              ? 'bg-ivory/85 border-white/90 shadow-[0_12px_40px_rgba(31,31,28,0.08)] py-3.5'
              : 'bg-ivory/60 border-white/50 shadow-[0_4px_20px_rgba(31,31,28,0.03)] py-4 md:py-5'
          )}
        >
          {/* Brand Name */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="font-heading text-lg md:text-xl tracking-widest text-charcoal font-medium uppercase transition-colors duration-300 hover:text-champagne flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
            <span>Salman Hair Studio</span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-8">
            {NAV_ITEMS.map((item) => {
              let isActive = false;
              if (item.href === '/') {
                isActive = pathname === '/' && activeSection !== 'about';
              } else if (item.href === '/#about') {
                isActive = pathname === '/' && activeSection === 'about';
              } else {
                isActive = pathname === item.href;
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={clsx(
                    'text-lbl text-xs tracking-[0.18em] transition-colors duration-300 relative py-1 uppercase font-medium',
                    isActive ? 'text-champagne font-semibold' : 'text-charcoal/80 hover:text-champagne',
                    'after:content-[""] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-champagne after:transition-all after:duration-300',
                    isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-charcoal hover:text-champagne transition-colors focus:outline-none cursor-pointer rounded-lg bg-white/40 border border-white/60"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Glassmorphism Drawer Overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-[110] bg-ivory/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 transition-all duration-500 ease-luxury md:hidden',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Mobile Header Bar with Close Button */}
        <div className="flex items-center justify-between w-full pb-6 border-b border-border-light">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="font-heading text-lg tracking-widest text-charcoal font-medium uppercase flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
            <span>Salman Hair Studio</span>
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              document.body.style.overflow = '';
            }}
            className="p-2 text-charcoal hover:text-champagne transition-colors focus:outline-none cursor-pointer rounded-lg bg-white/50 border border-charcoal/10"
            aria-label="Close Navigation Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="flex flex-col space-y-6 text-center my-auto py-8">
          {NAV_ITEMS.map((item) => {
            let isActive = false;
            if (item.href === '/') {
              isActive = pathname === '/' && activeSection !== 'about';
            } else if (item.href === '/#about') {
              isActive = pathname === '/' && activeSection === 'about';
            } else {
              isActive = pathname === item.href;
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={clsx(
                  'font-heading text-2xl sm:text-3xl transition-colors uppercase tracking-widest py-1',
                  isActive ? 'text-champagne font-semibold' : 'text-charcoal hover:text-champagne'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Sub-Footer Indicator */}
        <div className="pt-6 border-t border-border-light text-center">
          <span className="text-lbl text-[10px] tracking-[0.25em] text-warm-gray uppercase block">
            KURLA WEST • MUMBAI
          </span>
        </div>
      </div>
    </>
  );
}

export default memo(Navbar);


