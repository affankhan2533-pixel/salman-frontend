'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import ServiceIcon from './ServiceIcon';

/**
 * ServiceDetailsModal — Premium minimal service details overlay.
 *
 * Shows:
 *  - Service name
 *  - Price label / pricing note
 *  - Booking CTA → links to /booking (reuses existing booking flow)
 *
 * No invented descriptions, durations, or benefits.
 * Closes on: × button, Escape key, backdrop click.
 * Focus trap: keeps keyboard focus inside modal while open.
 */
export default function ServiceDetailsModal({ service, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    if (!modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', trap);
    // Auto-focus close button on open
    closeButtonRef.current?.focus();
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', trap);
      document.body.style.overflow = '';
    };
  }, []);

  // Backdrop click
  const onBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!service) return null;

  const bookingHref = `/booking?service=${encodeURIComponent(service.name)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
      onClick={onBackdropClick}
      className="fixed inset-0 z-[200] bg-charcoal/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 motion-reduce:backdrop-blur-none"
    >
      {/* Panel */}
      <div
        ref={modalRef}
        className="relative w-full sm:max-w-md bg-[#F7F4EE] border border-border-light rounded-t-[28px] sm:rounded-[28px] p-8 sm:p-10 shadow-2xl
          animate-[modalSlideUp_300ms_cubic-bezier(0.215,0.61,0.355,1)_both]
          motion-reduce:animate-[modalFadeIn_200ms_ease-out_both]"
        style={{
          '--tw-shadow': '0 25px 60px -15px rgba(31,31,28,0.25)',
        }}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close service details"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream border border-border-light flex items-center justify-center text-warm-gray hover:text-charcoal hover:border-charcoal/30 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-4 h-4" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-6">
          {/* Icon + category label */}
          <div className="flex items-center gap-3">
            <ServiceIcon name={service.icon} />
            <span className="text-lbl text-[10px] tracking-[0.28em] text-warm-gray uppercase font-medium">
              {service.category === 'hair' ? 'Hair Service' : 'Face Service'}
            </span>
          </div>

          {/* Service name */}
          <h2
            id="service-modal-title"
            className="font-heading text-3xl sm:text-4xl text-charcoal font-normal uppercase tracking-tight leading-tight"
          >
            {service.name}
          </h2>

          {/* Price block */}
          <div className="py-5 border-t border-b border-border-light">
            {service.hasFixedPrice ? (
              <div className="space-y-1">
                <span className="text-lbl text-[10px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
                  Starting from
                </span>
                <span className="font-num text-4xl font-bold text-champagne tracking-tight block">
                  {service.price}
                </span>
                {service.pricingNote && (
                  <span className="text-xs font-body text-warm-gray font-light italic block mt-1">
                    {service.pricingNote}
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-lbl text-[10px] tracking-[0.3em] text-warm-gray uppercase font-medium block">
                  Pricing
                </span>
                <span className="text-base font-body text-charcoal font-light italic block">
                  {service.pricingNote}
                </span>
                <span className="text-xs font-body text-warm-gray block mt-1">
                  Final price is determined after consultation based on hair length.
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link href={bookingHref} className="flex-1" onClick={onClose}>
              <button className="w-full h-[50px] bg-charcoal text-white hover:bg-champagne hover:text-charcoal transition-all duration-300 font-inter text-xs tracking-[0.22em] uppercase font-medium rounded-[12px] shadow-sm hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60">
                Book Appointment →
              </button>
            </Link>
            <button
              onClick={onClose}
              className="flex-1 h-[50px] bg-transparent text-warm-gray border border-charcoal/20 hover:border-charcoal/40 hover:text-charcoal transition-all duration-200 font-inter text-xs tracking-[0.2em] uppercase font-medium rounded-[12px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne/60"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Animation keyframes injected once via style tag */}
      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
